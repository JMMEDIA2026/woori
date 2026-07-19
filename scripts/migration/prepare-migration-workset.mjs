#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const CATEGORY_RULES = [
  { category: 'board_or_post', pattern: /(board|bbs|notice|community|post|news)/ },
  { category: 'notice_popup', pattern: /(popup|banner)/ },
  {
    category: 'media_or_attachment',
    pattern: /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|mp4|mov|avi|webm|pdf|hwp|doc|docx|xls|xlsx|zip|css|js|woff|woff2|ttf|eot)$/i,
  },
  { category: 'admin_or_auth', pattern: /(admin|manager|login)/ },
];
const RECORD_KEY_PADDING_LENGTH = 5;

function getArg(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  if (index === -1) return fallback;
  return process.argv[index + 1] ?? fallback;
}

function categoryForUrl(url) {
  const lower = url.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.pattern.test(lower)) return rule.category;
  }
  return 'page_content';
}

function initializeMapping(urls) {
  return urls.map((url, index) => ({
    legacyUrl: url,
    category: categoryForUrl(url),
    recordKey: `LEGACY_${String(index + 1).padStart(RECORD_KEY_PADDING_LENGTH, '0')}`,
    targetSlug: '',
    contentType: '',
    title: '',
    bodyHtml: '',
    publishedAt: '',
    author: '',
    tags: [],
    attachments: [],
    notes: '',
  }));
}

async function main() {
  const inputPath = getArg('input', resolve(process.cwd(), 'migration-output/legacy-snapshot/manifest.json'));
  const outDir = getArg('out', resolve(process.cwd(), 'migration-work'));

  const input = JSON.parse(await readFile(inputPath, 'utf8'));
  const pageUrls = (input.pages ?? []).map((page) => page.url).sort();
  const assetUrls = (input.assets ?? []).sort();

  const categorized = pageUrls.reduce((acc, url) => {
    const category = categoryForUrl(url);
    acc[category] ??= [];
    acc[category].push(url);
    return acc;
  }, {});

  const inventory = {
    generatedAt: new Date().toISOString(),
    sourceManifest: inputPath,
    totals: {
      pages: pageUrls.length,
      assets: assetUrls.length,
      errors: (input.errors ?? []).length,
    },
    categories: categorized,
    pages: pageUrls,
    assets: assetUrls,
  };

  const mappingTemplate = {
    generatedAt: new Date().toISOString(),
    sourceManifest: inputPath,
    fields: {
      legacyUrl: 'Legacy source URL',
      category: 'page_content|board_or_post|notice_popup|media_or_attachment|admin_or_auth',
      recordKey: 'Unique migration key',
      targetSlug: 'New site slug',
      contentType: 'page|notice|board|gallery|file',
      title: 'Title',
      bodyHtml: 'Sanitized HTML body',
      publishedAt: 'YYYY-MM-DDTHH:mm:ssZ',
      author: 'Author',
      tags: 'Array of tags',
      attachments: 'Array of attachment URLs',
      notes: 'Additional migration notes',
    },
    records: initializeMapping(pageUrls),
  };

  const verifySeed = {
    generatedAt: new Date().toISOString(),
    legacyUrls: pageUrls,
    migratedUrls: [],
    migratedAssets: [],
  };

  await mkdir(outDir, { recursive: true });

  await writeFile(join(outDir, 'inventory.json'), JSON.stringify(inventory, null, 2), 'utf8');
  await writeFile(join(outDir, 'mapping-template.json'), JSON.stringify(mappingTemplate, null, 2), 'utf8');
  await writeFile(join(outDir, 'verify-seed.json'), JSON.stringify(verifySeed, null, 2), 'utf8');
  await writeFile(
    join(outDir, 'redirects-template.csv'),
    'legacy_url,target_url,status_code\n',
    'utf8',
  );

  console.log(`Prepared migration workset in: ${outDir}`);
  console.log('- inventory.json');
  console.log('- mapping-template.json');
  console.log('- verify-seed.json');
  console.log('- redirects-template.csv');
}

await main();
