#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

function getArg(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  if (index === -1) return fallback;
  return process.argv[index + 1] ?? fallback;
}

function normalizeUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.hash = '';
    if (parsed.pathname.endsWith('/') && parsed.pathname !== '/') {
      parsed.pathname = parsed.pathname.slice(0, -1);
    }
    return parsed.toString();
  } catch {
    return url.trim();
  }
}

async function main() {
  const inputPath = getArg('input', resolve(process.cwd(), 'migration-work/verify-seed.json'));
  const outDir = getArg('out', resolve(process.cwd(), 'migration-work'));

  const data = JSON.parse(await readFile(inputPath, 'utf8'));
  const legacySet = new Set((data.legacyUrls ?? []).map(normalizeUrl));
  const migratedSet = new Set((data.migratedUrls ?? []).map(normalizeUrl));

  const missingUrls = [...legacySet].filter((url) => !migratedSet.has(url)).sort();
  const migratedOnly = [...migratedSet].filter((url) => !legacySet.has(url)).sort();
  const matched = [...legacySet].filter((url) => migratedSet.has(url)).sort();

  const report = {
    generatedAt: new Date().toISOString(),
    source: inputPath,
    summary: {
      legacyUrls: legacySet.size,
      migratedUrls: migratedSet.size,
      matched: matched.length,
      missing: missingUrls.length,
      migratedOnly: migratedOnly.length,
      coverage: legacySet.size === 0 ? '0.00%' : `${((matched.length / legacySet.size) * 100).toFixed(2)}%`,
    },
    missingUrls,
    migratedOnly,
    matched,
    missingAssets: data.missingAssets ?? [],
    brokenImages: data.brokenImages ?? [],
  };

  await mkdir(outDir, { recursive: true });
  const reportPath = join(outDir, 'coverage-report.json');
  await writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');

  console.log(`Coverage report generated: ${reportPath}`);
  console.log(`Coverage: ${report.summary.coverage} (${report.summary.matched}/${report.summary.legacyUrls})`);
}

await main();
