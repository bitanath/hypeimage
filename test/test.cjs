const { generateImage, getAllGradients } = require('../dist/hypeimage.cjs');
const fs = require('fs');
const path = require('path');

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

console.log('CJS Smoke Tests\n');

test('generateImage returns SVG string', () => {
  const svg = generateImage({ text: 'hi' });
  if (typeof svg !== 'string') throw new Error(`Expected string, got ${typeof svg}`);
  if (!svg.includes('<svg')) throw new Error('Missing <svg tag');
});

test('generateImage with all options', () => {
  const svg = generateImage({
    text: 'hello',
    gradient: 'sunset',
    bg: '#333333',
    style: 'soft',
    emoji: ['\u{1F525}', '\u{2728}'],
    emojiAngle: 30,
    emojiOpacity: 0.75,
    paddingLeft: 10,
    paddingTop: 5,
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
  if (grads.length === 0) throw new Error('Empty gradients array');
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
  const svg = generateImage({ text: 'cjs' });
  const outPath = path.join(outDir, 'cjs-test.svg');
  fs.writeFileSync(outPath, svg);
  if (!fs.existsSync(outPath)) throw new Error('File not written');
});

console.log('\nDone.');
