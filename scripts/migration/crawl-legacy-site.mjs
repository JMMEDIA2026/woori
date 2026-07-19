#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { pipeline } from 'node:stream/promises';

const DEFAULT_MAX_PAGES = 3000;
const DEFAULT_CONCURRENCY = 4;
const DEFAULT_OUTPUT_DIR = resolve(process.cwd(), 'migration-output/legacy-snapshot');

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
  if (value.startsWith('mailto:') || value.startsWith('tel:') || value.startsWith('javascript:') || value.startsWith('#')) {
    return null;
  }
  try {
    return new URL(value, base).toString();
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

  if (!baseUrlRaw) {
    console.error('Usage: node scripts/migration/crawl-legacy-site.mjs --base https://usao.co.kr [--out /path] [--max-pages 3000]');
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
      const response = await fetch(url, { redirect: 'follow' });
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
          if (parsed.hostname !== baseUrl.hostname) continue;

          if (isHtmlResponse('', discoveredUrl)) {
            if (!visited.has(discoveredUrl) && !queue.includes(discoveredUrl)) queue.push(discoveredUrl);
          } else {
            assets.add(discoveredUrl);
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
  }

  const assetsList = [...assets].sort();
  for (const assetUrl of assetsList) {
    if (visited.has(assetUrl)) continue;
    try {
      const response = await fetch(assetUrl);
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
    settings: { maxPages, concurrency, outDir },
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
