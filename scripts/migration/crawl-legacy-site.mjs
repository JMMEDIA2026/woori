#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { pipeline } from 'node:stream/promises';

const DEFAULT_MAX_PAGES = 3000;
const DEFAULT_CONCURRENCY = 4;
const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), 'migration-output/legacy-snapshot');
const DEFAULT_RETRIES = 2;
const DEFAULT_BATCH_DELAY_MS = 200;
const ASSET_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico',
  '.mp4', '.mov', '.avi', '.webm',
  '.pdf', '.hwp', '.doc', '.docx', '.xls', '.xlsx', '.zip',
  '.css', '.js', '.woff', '.woff2', '.ttf', '.eot',
]);

function getArg(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  if (index === -1) return fallback;
  return process.argv[index + 1] ?? fallback;
}

function parseNumberArg(name, fallback) {
  const raw = getArg(name, String(fallback));
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function toAbsoluteUrl(base, value) {
  if (!value) return null;
  const lower = value.toLowerCase();
  if (
    lower.startsWith('mailto:') ||
    lower.startsWith('tel:') ||
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    value.startsWith('#')
  ) {
    return null;
  }
  try {
    const resolved = new URL(value, base);
    if (resolved.protocol !== 'http:' && resolved.protocol !== 'https:') {
      return null;
    }
    return resolved.toString();
  } catch {
    return null;
  }
}

function parseLinks(html, pageUrl) {
  const urls = new Set();
  const regexes = [
    /href\s*=\s*"([^"]+)"/gi,
    /href\s*=\s*'([^']+)'/gi,
    /src\s*=\s*"([^"]+)"/gi,
    /src\s*=\s*'([^']+)'/gi,
    /content\s*=\s*"([^"]+)"/gi,
  ];

  for (const regex of regexes) {
    let match;
    while ((match = regex.exec(html)) !== null) {
      const absolute = toAbsoluteUrl(pageUrl, match[1]);
      if (absolute) urls.add(absolute);
    }
  }

  return [...urls];
}

function isHtmlResponse(contentType, url) {
  if (contentType.includes('text/html')) return true;
  const parsed = new URL(url);
  const extension = extname(parsed.pathname).toLowerCase();
  return !extension || extension === '.html' || extension === '.htm' || extension === '.php' || extension === '.asp' || extension === '.aspx';
}

function isLikelyAssetUrl(url) {
  const parsed = new URL(url);
  const extension = extname(parsed.pathname).toLowerCase();
  return ASSET_EXTENSIONS.has(extension);
}

function getRootDomain(hostname) {
  const parts = hostname.split('.');
  if (parts.length <= 2) return hostname;
  return parts.slice(-2).join('.');
}

function shouldIncludeHost(candidateHost, baseHost, includeSubdomains) {
  if (candidateHost === baseHost) return true;
  if (!includeSubdomains) return false;
  return getRootDomain(candidateHost) === getRootDomain(baseHost);
}

async function delay(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options, retries) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, options);
      if (response.ok || response.status < 500 || attempt === retries) return response;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    if (attempt < retries) await delay(300 * (attempt + 1));
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

function sanitizePathPart(value) {
  return value.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function getOutputPath(baseDir, url, isHtml) {
  const parsed = new URL(url);
  const host = sanitizePathPart(parsed.hostname);
  let pathname = decodeURIComponent(parsed.pathname || '/');
  if (!pathname || pathname === '/') pathname = '/index';

  if (isHtml) {
    if (pathname.endsWith('/')) pathname = `${pathname}index`;
    if (!extname(pathname)) pathname = `${pathname}.html`;
  } else if (!extname(pathname)) {
    pathname = `${pathname}.bin`;
  }

  const queryPart = parsed.search ? `__q_${sanitizePathPart(parsed.search.slice(1))}` : '';
  const safePath = pathname
    .split('/')
    .filter(Boolean)
    .map(sanitizePathPart)
    .join('/');
  const filePath = `${safePath || 'index'}${queryPart}`;
  return join(baseDir, host, filePath);
}

async function ensureDir(filePath) {
  await mkdir(dirname(filePath), { recursive: true });
}

async function saveText(filePath, content) {
  await ensureDir(filePath);
  await writeFile(filePath, content, 'utf8');
}

async function saveStream(filePath, stream) {
  await ensureDir(filePath);
  const file = createWriteStream(filePath);
  await pipeline(stream, file);
}

async function crawlSite() {
  const baseUrlRaw = getArg('base');
  const outDir = getArg('out', DEFAULT_OUTPUT_DIR);
  const maxPages = parseNumberArg('max-pages', DEFAULT_MAX_PAGES);
  const concurrency = parseNumberArg('concurrency', DEFAULT_CONCURRENCY);
  const retries = parseNumberArg('retries', DEFAULT_RETRIES);
  const batchDelayMs = parseNumberArg('batch-delay-ms', DEFAULT_BATCH_DELAY_MS);
  const includeSubdomains = getArg('include-subdomains', 'true') !== 'false';

  if (!baseUrlRaw) {
    console.error(
      'Usage: node scripts/migration/crawl-legacy-site.mjs --base https://usao.co.kr [--out /path] [--max-pages 3000] [--concurrency 4] [--retries 2] [--batch-delay-ms 200] [--include-subdomains true]',
    );
    process.exit(1);
  }

  const baseUrl = new URL(baseUrlRaw);
  const queue = [baseUrl.toString()];
  const visited = new Set();
  const assets = new Set();
  const errors = [];
  const pages = [];
  const startedAt = new Date().toISOString();

  async function processUrl(url) {
    if (visited.has(url) || visited.size >= maxPages) return;
    visited.add(url);

    try {
      const response = await fetchWithRetry(url, { redirect: 'follow' }, retries);
      if (!response.ok) {
        errors.push({ url, status: response.status, reason: `HTTP ${response.status}` });
        return;
      }

      const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
      const html = isHtmlResponse(contentType, url);
      const outputPath = getOutputPath(outDir, url, html);

      if (html) {
        const text = await response.text();
        await saveText(outputPath, text);
        const discovered = parseLinks(text, url);

        for (const discoveredUrl of discovered) {
          const parsed = new URL(discoveredUrl);
          if (!shouldIncludeHost(parsed.hostname, baseUrl.hostname, includeSubdomains)) continue;

          if (isLikelyAssetUrl(discoveredUrl)) {
            assets.add(discoveredUrl);
          } else {
            if (!visited.has(discoveredUrl) && !queue.includes(discoveredUrl)) queue.push(discoveredUrl);
          }
        }

        pages.push({
          url,
          status: response.status,
          contentType: contentType || 'text/html',
          savedTo: outputPath,
          discoveredLinks: discovered.length,
        });
      } else {
        if (!response.body) {
          errors.push({ url, status: response.status, reason: 'Response body missing' });
          return;
        }
        await saveStream(outputPath, response.body);
        assets.add(url);
      }
    } catch (error) {
      errors.push({ url, reason: error instanceof Error ? error.message : String(error) });
    }
  }

  while (queue.length > 0 && visited.size < maxPages) {
    const batch = queue.splice(0, concurrency);
    await Promise.all(batch.map((url) => processUrl(url)));
    await delay(batchDelayMs);
  }

  const assetsList = [...assets].sort();
  for (const assetUrl of assetsList) {
    if (visited.has(assetUrl)) continue;
    try {
      const response = await fetchWithRetry(assetUrl, {}, retries);
      if (!response.ok || !response.body) {
        errors.push({ url: assetUrl, status: response.status, reason: `Asset HTTP ${response.status}` });
        continue;
      }
      const outputPath = getOutputPath(outDir, assetUrl, false);
      await saveStream(outputPath, response.body);
    } catch (error) {
      errors.push({ url: assetUrl, reason: error instanceof Error ? error.message : String(error) });
    }
  }

  const manifest = {
    baseUrl: baseUrl.toString(),
    startedAt,
    finishedAt: new Date().toISOString(),
    settings: { maxPages, concurrency, retries, batchDelayMs, includeSubdomains, outDir },
    summary: {
      crawledPages: pages.length,
      discoveredAssets: assetsList.length,
      errors: errors.length,
    },
    pages: pages.sort((a, b) => a.url.localeCompare(b.url)),
    assets: assetsList,
    errors,
  };

  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
  await writeFile(join(outDir, 'url-inventory.json'), JSON.stringify(pages.map((page) => page.url), null, 2), 'utf8');

  console.log(`Crawl complete: ${pages.length} pages, ${assetsList.length} assets, ${errors.length} errors`);
  console.log(`Manifest: ${join(outDir, 'manifest.json')}`);
}

await crawlSite();
