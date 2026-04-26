#!/usr/bin/env node
/*
 * HEX / rgba() -> OKLCH migration script for Apsara design tokens.
 *
 * Usage:
 *   node scripts/migrate-colors-to-oklch.js            # dry-run, prints diff summary
 *   node scripts/migrate-colors-to-oklch.js --write    # writes converted files in place
 *   node scripts/migrate-colors-to-oklch.js --validate # runs validation only (no write)
 *
 * Scope: primitive + token + effects CSS files only. Does NOT touch component
 * CSS, tests, or inline styles. Conversion is mechanical and verified visually
 * lossless: every value is (1) perceptually below CIEDE2000 0.5 and
 * (2) byte-identical in 8-bit sRGB after re-parsing the rounded OKLCH output.
 */

const fs = require('fs/promises');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TARGETS = [
  'styles/primitives/gray.css',
  'styles/primitives/accent.css',
  'styles/primitives/appearance.css',
  'styles/colors.css',
  'styles/effects.css'
];

// Matches #RGB / #RGBA / #RRGGBB / #RRGGBBAA and rgba?(r, g, b) / rgba?(r, g, b, a)
const HEX_RE =
  /#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)/g;
const DELTA_E_THRESHOLD = 0.5;

const args = new Set(process.argv.slice(2));
const WRITE = args.has('--write');
const VALIDATE_ONLY = args.has('--validate');

const round = (n, p) => Number.parseFloat((n ?? 0).toFixed(p));
const toByte = v => Math.max(0, Math.min(255, Math.round(v * 255)));

function formatOklch({ l, c, h, alpha }) {
  const L = round(l, 4);
  const C = round(c, 4);
  const H = Number.isFinite(h) ? round(h, 2) : 0;
  const body = `${L} ${C} ${H}`;
  if (alpha === undefined || alpha === 1) return `oklch(${body})`;
  return `oklch(${body} / ${round(alpha, 4)})`;
}

async function main() {
  const culori = await import('culori');
  const toOklch = culori.converter('oklch');
  const toRgb = culori.converter('rgb');
  const deltaE = culori.differenceCiede2000();

  const report = { files: [], total: 0, failures: [] };

  for (const rel of TARGETS) {
    const abs = path.join(ROOT, rel);
    const source = await fs.readFile(abs, 'utf8');
    let fileHits = 0;
    const failures = [];

    const converted = source.replace(HEX_RE, match => {
      const parsed = culori.parse(match);
      if (!parsed) {
        failures.push({ match, reason: 'parse failed' });
        return match;
      }
      const oklch = toOklch(parsed);
      const out = formatOklch({ ...oklch, alpha: parsed.alpha });

      // Reparse the ROUNDED output (not the raw object) to simulate browser rendering
      const reparsed = culori.parse(out);
      if (!reparsed) {
        failures.push({ match, out, reason: 'output reparse failed' });
        return match;
      }
      const back = toRgb(reparsed);

      const dE = deltaE(parsed, back);

      const origBytes = [toByte(parsed.r), toByte(parsed.g), toByte(parsed.b)];
      const backBytes = [toByte(back.r), toByte(back.g), toByte(back.b)];
      const bytesMatch = origBytes.every((v, i) => v === backBytes[i]);

      const origA = parsed.alpha ?? 1;
      const backA = reparsed.alpha ?? 1;
      const alphaByteMatch = Math.abs(origA - backA) * 255 < 1;

      if (dE > DELTA_E_THRESHOLD || !bytesMatch || !alphaByteMatch) {
        failures.push({
          match,
          out,
          dE: round(dE, 3),
          origBytes,
          backBytes,
          alphaDelta: round(origA - backA, 4)
        });
      }

      fileHits += 1;
      return out;
    });

    report.files.push({ rel, hits: fileHits, changed: converted !== source });
    report.total += fileHits;
    if (failures.length) report.failures.push({ rel, failures });

    if (WRITE && !VALIDATE_ONLY && converted !== source) {
      await fs.writeFile(abs, converted, 'utf8');
    }
  }

  const mode = VALIDATE_ONLY ? 'VALIDATE' : WRITE ? 'WRITE' : 'DRY-RUN';
  console.log(`\n[migrate-colors-to-oklch] mode=${mode}`);
  for (const f of report.files) {
    console.log(`  ${f.rel}: ${f.hits} hex values converted`);
  }
  console.log(`  total: ${report.total}`);

  if (report.failures.length) {
    console.error(
      `\nValidation failures (${report.failures.reduce((n, f) => n + f.failures.length, 0)} total):`
    );
    for (const { rel, failures } of report.failures) {
      console.error(`  ${rel}:`);
      for (const f of failures) {
        console.error(`    ${f.match} -> ${f.out}`);
        if (f.origBytes)
          console.error(
            `      bytes: ${f.origBytes.join(',')} vs ${f.backBytes.join(',')}`
          );
        if (f.dE !== undefined)
          console.error(`      dE=${f.dE} alphaDelta=${f.alphaDelta}`);
        if (f.reason) console.error(`      reason: ${f.reason}`);
      }
    }
    process.exit(1);
  }

  console.log(
    '\nAll values validated: byte-identical 8-bit sRGB round-trip, \u0394E < ' +
      DELTA_E_THRESHOLD +
      '.'
  );
  if (!WRITE && !VALIDATE_ONLY) {
    console.log('Dry run only. Re-run with --write to apply changes.');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
