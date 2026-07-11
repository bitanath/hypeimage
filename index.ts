import { buildSVG } from './src/svg-builder';
import { getGradient, generateColorWheel, getAllGradients } from './src/gradients';
import { PrecomputedData, GenerateImageOptions } from './src/types';

// @ts-ignore - imported as static asset
import letterDataJson from './data/letter-segments.json';
const letterData = letterDataJson as unknown as PrecomputedData;

export type { GenerateImageOptions };

export function generateImage(options: GenerateImageOptions): string {
  const {
    text,
    gradient: gradientName = 'valkyrie',
    bg: bgColor = '#FFF9C4',
    style = 'outlined',
    emoji = [],
    emojiAngle = 45,
    emojiOpacity = 0.5,
    paddingLeft = 0,
    paddingTop = 0,
  } = options;

  if (!text) throw new Error('text is required');

  const lower = text.toLowerCase();
  let totalSegments = 0;
  for (const c of lower) {
    const data = letterData[c];
    if (data) totalSegments += data.s.length;
  }
  if (totalSegments === 0) throw new Error('No renderable characters in text');

  const gradient = getGradient(gradientName);
  const colors = generateColorWheel(gradient, totalSegments);
  return buildSVG(
    text,
    colors,
    letterData,
    bgColor,
    emoji.slice(0, 4),
    emojiAngle,
    emojiOpacity,
    paddingLeft,
    paddingTop,
    style
  );
}

export async function generateImagePNG(
  options: GenerateImageOptions
): Promise<Buffer> {
  const svg = generateImage(options);
  const { Resvg } = await import('@resvg/resvg-js');
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return Buffer.from(pngData.asPng());
}

export { getAllGradients } from './src/gradients';
