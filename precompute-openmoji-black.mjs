import { writeFileSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OPENMOJI_DIR = resolve(__dirname, 'openmoji-svg-black');
const OUT_PATH = resolve(__dirname, 'data/openmoji-black-svgs.json');
const GEMOJI_URL = 'https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json';
const EXCLUDED_CATEGORIES = ['Symbols'];

const SVG_RE = /<svg[^>]*>([\s\S]*)<\/svg>/i;

function extractSVGInner(svgText) {
  const m = svgText.match(SVG_RE);
  return m ? m[1].trim() : null;
}

function hex(cp) {
  return cp.toString(16).toUpperCase().padStart(4, '0');
}

function openmojiFilename(emoji) {
  const cps = Array.from(emoji).map(ch => hex(ch.codePointAt(0)));
  return cps.join('-') + '.svg';
}

function filenameWithoutFe0f(emoji) {
  const cps = [];
  for (const ch of emoji) {
    const cp = ch.codePointAt(0);
    if (cp === 0xFE0F) continue;
    cps.push(hex(cp));
  }
  return cps.join('-') + '.svg';
}

// Load existing OpenMoji color keys so we only include emoji that already exist
const existingPath = resolve(__dirname, 'data/openmoji-svgs.json');
let existingKeys = new Set();
try {
  const existing = JSON.parse(readFileSync(existingPath, 'utf-8'));
  existingKeys = new Set(Object.keys(existing));
  console.log(`Loaded ${existingKeys.size} existing emoji keys from openmoji-svgs.json`);
} catch {
  console.log('No existing openmoji-svgs.json found; will include all matched emoji');
}

const result = {};
let skipped = 0;

const resp = await fetch(GEMOJI_URL);
if (!resp.ok) throw new Error(`Failed to fetch gemoji: ${resp.status}`);
const gemojiList = await resp.json();

for (const entry of gemojiList) {
  if (!entry.emoji) continue;
  if (EXCLUDED_CATEGORIES.includes(entry.category)) { skipped++; continue; }
  const emoji = entry.emoji;

  // Skip if this emoji isn't in the existing OpenMoji color set
  if (existingKeys.size > 0 && !existingKeys.has(emoji)) { skipped++; continue; }

  // try the full-codepoint filename first, then fall back to no-FE0F
  const names = [openmojiFilename(emoji)];
  const alt = filenameWithoutFe0f(emoji);
  if (alt !== names[0]) names.push(alt);

  let inner = null;
  for (const name of names) {
    const svgPath = resolve(OPENMOJI_DIR, name);
    try {
      const content = readFileSync(svgPath, 'utf-8');
      inner = extractSVGInner(content);
      if (inner) break;
    } catch { /* try next */ }
  }

  if (inner) {
    result[emoji] = inner;
  } else {
    skipped++;
  }
}

writeFileSync(OUT_PATH, JSON.stringify(result));

const total = Object.keys(result).length;
const kb = (Buffer.byteLength(JSON.stringify(result), 'utf-8') / 1024).toFixed(1);
console.log(`Wrote ${OUT_PATH} (${kb} KB, ${total} emoji, ${skipped} skipped)`);
