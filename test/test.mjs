import { generateImage, getAllGradients } from '../dist/hypeimage.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'output');
fs.mkdirSync(outDir, { recursive: true });

function test(name, fn) {
  try {
    fn();
    console.log(`  PASS  ${name}`);
  } catch (e) {
    console.error(`  FAIL  ${name}: ${e.message}`);
    process.exitCode = 1;
  }
}

console.log('ESM Smoke Tests\n');

test('generateImage returns SVG string', () => {
  const svg = generateImage({ text: 'hi' });
  if (typeof svg !== 'string') throw new Error(`Expected string, got ${typeof svg}`);
  if (!svg.includes('<svg')) throw new Error('Missing <svg tag');
});

test('generateImage with all options', () => {
  const svg = generateImage({
    text: 'hello',
    gradient: 'purpledream',
    bg: '#000000',
    style: 'crochet',
    emoji: ['\u{1F355}', '\u{1F354}', '\u{1F36B}'],
    emojiAngle: 60,
    emojiOpacity: 0.3,
    paddingLeft: 20,
    paddingTop: 10,
  });
  if (!svg.includes('<svg')) throw new Error('Missing <svg tag');
});

test('generateImage with each style', () => {
  for (const style of ['outlined', 'soft', 'crochet', 'yarn']) {
    const svg = generateImage({ text: 'abc', style });
    if (!svg.includes('<svg')) throw new Error(`Style ${style} failed`);
  }
});

test('getAllGradients returns array', () => {
  const grads = getAllGradients();
  if (!Array.isArray(grads)) throw new Error(`Expected array, got ${typeof grads}`);
  if (grads.length < 4) throw new Error(`Expected at least 4 gradients, got ${grads.length}`);
});

test('generateImage throws on empty text', () => {
  try {
    generateImage({ text: '' });
    throw new Error('Should have thrown');
  } catch (e) {
    if (e.message === 'Should have thrown') throw e;
  }
});

test('writes SVG file', () => {
  const svg = generateImage({ text: 'esm' });
  const outPath = path.join(outDir, 'esm-test.svg');
  fs.writeFileSync(outPath, svg);
  if (!fs.existsSync(outPath)) throw new Error('File not written');
});

console.log('\nDone.');
