import { generateImage, generateImagePNG, getAllGradients } from '../dist/hypeimage.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'output');
fs.mkdirSync(outDir, { recursive: true });

async function run() {
  console.log('Visual Test Generator\n');
  console.log(`Output: ${outDir}\n`);

  // Basic SVG
  const svg1 = generateImage({ text: 'hello' });
  fs.writeFileSync(path.join(outDir, 'hello-valkyrie.svg'), svg1);
  console.log('  Generated hello-valkyrie.svg');

  // Different gradients
  for (const gradient of getAllGradients()) {
    const svg = generateImage({ text: 'hype', gradient });
    fs.writeFileSync(path.join(outDir, `hype-${gradient}.svg`), svg);
    console.log(`  Generated hype-${gradient}.svg`);
  }

  // Different styles
  for (const style of ['outlined', 'soft', 'crochet', 'yarn']) {
    const svg = generateImage({ text: 'style', style });
    fs.writeFileSync(path.join(outDir, `style-${style}.svg`), svg);
    console.log(`  Generated style-${style}.svg`);
  }

  // With emojis
  const svgEmoji = generateImage({
    text: 'party',
    gradient: 'sunset',
    emoji: ['\u{1F525}', '\u{2728}', '\u{1F389}', '\u{1F308}'],
    emojiAngle: 45,
    emojiOpacity: 0.4,
  });
  fs.writeFileSync(path.join(outDir, 'party-emoji.svg'), svgEmoji);
  console.log('  Generated party-emoji.svg');

  // Dark background
  const svgDark = generateImage({
    text: 'dark',
    bg: '#1a1a2e',
    gradient: 'purpledream',
    emoji: ['\u{2B50}'],
    emojiOpacity: 0.3,
  });
  fs.writeFileSync(path.join(outDir, 'dark-bg.svg'), svgDark);
  console.log('  Generated dark-bg.svg');

  // Padding
  const svgPad = generateImage({
    text: 'pad',
    paddingLeft: 30,
    paddingTop: 20,
  });
  fs.writeFileSync(path.join(outDir, 'padding.svg'), svgPad);
  console.log('  Generated padding.svg');

  // Kitchen sink: everything enabled, crochet style
  const kitchenSink = generateImage({
    text: 'sushi',
    gradient: 'sunset',
    bg: '#FFF9C4',
    style: 'crochet',
    emoji: ['\u{1F525}', '\u{1F3A8}', '\u{1F63C}', '\u{1F43B}'],
    emojiAngle: 45,
    emojiOpacity: 0.25,
  });
  fs.writeFileSync(path.join(outDir, 'kitchen-sink.svg'), kitchenSink);
  console.log('  Generated kitchen-sink.svg');

  // Kitchen sink PNG
  try {
    const kitchenPng = await generateImagePNG({
      text: 'sushi',
      gradient: 'sunset',
      bg: '#FFF9C4',
      style: 'crochet',
      emoji: ['\u{1F525}', '\u{1F3A8}', '\u{1F63C}', '\u{1F43B}'],
      emojiAngle: 45,
      emojiOpacity: 0.25,
    });
    fs.writeFileSync(path.join(outDir, 'kitchen-sink.png'), kitchenPng);
    console.log('  Generated kitchen-sink.png');
  } catch (e) {
    console.log(`  SKIP  kitchen-sink PNG (${e.message})`);
  }

  // PNG output
  try {
    const png = await generateImagePNG({ text: 'hello', gradient: 'sunset' });
    fs.writeFileSync(path.join(outDir, 'hello-sunset.png'), png);
    console.log('  Generated hello-sunset.png');
  } catch (e) {
    console.log(`  SKIP  PNG generation (${e.message})`);
  }

  console.log(`\nDone. ${fs.readdirSync(outDir).length} files in ${outDir}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
