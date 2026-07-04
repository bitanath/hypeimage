import { LetterData } from './types';
import { getEmojiSVG, isUsingOpenmoji } from './emoji';

const WIDTH = 400;
const HEIGHT = 300;
const PADDING = 20;
const FONT_ADVANCE = 378;
const SCALE = 0.2;
const STROKE_WIDTH = 0.5;

const EMOJI_SCALE = 0.835;
const OPENMOJI_BOOST = 1.2;
const EMOJI_VIEWBOX = 36;

function buildEmojiGrid(emojis: string[], opacity: number, angle: number): string {
  const spacing = 50;
  const cols = Math.ceil(WIDTH / spacing) + 1;
  const rows = Math.ceil(HEIGHT / spacing) + 1;

  const valid = emojis.map(e => getEmojiSVG(e)).filter(Boolean) as string[];
  if (valid.length === 0) return '';

  const openmoji = isUsingOpenmoji();
  const viewBox = openmoji ? 72 : EMOJI_VIEWBOX;
  const center = viewBox / 2;
  const scale = openmoji ? EMOJI_SCALE * 0.5 * OPENMOJI_BOOST : EMOJI_SCALE;

  const parts: string[] = [];
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const svg = valid[idx % valid.length];
      const x = c * spacing;
      const y = r * spacing;
      parts.push(
        `<g transform="translate(${x},${y}) scale(${scale}) rotate(${angle}, ${center}, ${center})" opacity="${opacity.toFixed(2)}">${svg}</g>`
      );
      idx++;
    }
  }
  return parts.join('\n  ');
}

function segmentToD(samples: [number, number][], fillWidth: number): string {
  if (samples.length < 2) return '';
  const r = fillWidth / 4;
  let d = `M${samples[0][0]},${samples[0][1]}`;
  for (let i = 1; i < samples.length; i++) {
    const mid = Math.floor(samples.length / 2);
    if (i === mid) {
      d += `A${r},${r} 0 1,1 ${samples[i][0]},${samples[i][1]}`;
    } else {
      d += `L${samples[i][0]},${samples[i][1]}`;
    }
  }
  d += `A${r},${r} 0 1,1 ${samples[0][0]},${samples[0][1]}Z`;
  return d;
}

export function buildSVG(
  text: string,
  colors: string[],
  letterData: Record<string, LetterData>,
  bgColor: string = '#FFF9C4',
  shadow: boolean = false,
  shadowOpacity: number = 0.3,
  emojis: string[] = [],
  emojiAngle: number = 45,
  emojiOpacity: number = 0.5,
  paddingLeft: number = 0,
  paddingTop: number = 0,
  crochet: boolean = false,
  yarn: boolean = false
): string {
  const lower = text.toLowerCase();
  let totalWidth = 0;
  const chars: { char: string; data: LetterData }[] = [];

  for (const c of lower) {
    if (chars.length >= 10) break;
    const data = letterData[c];
    if (!data) continue;
    chars.push({ char: c, data });
    totalWidth += data.w;
  }

  if (chars.length === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}"/>`;
  }

  const padding = 0.5 * FONT_ADVANCE * SCALE;
  totalWidth *= SCALE;
  totalWidth += padding;

  const n = Math.max(chars.length, 1);
  const avgCharWidth = (totalWidth - padding) / n;
  const targetN = Math.max(n, 5);
  const effectiveTotalWidth = avgCharWidth * targetN + padding;

  const availableWidth = WIDTH - 2 * PADDING;
  const scale = availableWidth / effectiveTotalWidth;
  const scaledTotalWidth = totalWidth * scale;
  const offsetX = (WIDTH - scaledTotalWidth - padding * scale) / 2;

  let yMin = Infinity, yMax = -Infinity;
  for (const { data } of chars) {
    for (const seg of data.s) {
      const [samples] = seg;
      for (const [, y] of samples) {
        if (y < yMin) yMin = y;
        if (y > yMax) yMax = y;
      }
    }
  }
  const offsetY = (HEIGHT - (yMin + yMax) * scale) / 2;

  let colorIdx = 0;
  let parts: string[] = [];

  let cursorX = 0;

  for (const { char: c, data } of chars) {
    for (const seg of data.s) {
      const [rawSamples, _progress] = seg;
      const samples: [number, number][] = rawSamples.map(([x, y]) => [
        offsetX + (x + cursorX) * scale + paddingLeft,
        offsetY + y * scale + paddingTop,
      ]);
      const d = segmentToD(samples, 16 * scale);

      if (d && colorIdx < colors.length) {
        const color = colors[colorIdx];
        if (yarn) {
          if (colorIdx % 2 === 0) {
            parts.push(
              `<path d="${d}" fill="none" stroke="${color}" stroke-width="${10 * scale}" stroke-linejoin="round"/>`
            );
          } else {
            parts.push(
              `<path d="${d}" fill="${color}" opacity="0.15" stroke="none"/>`
            );
          }
        } else if (crochet) {
          parts.push(
            `<path d="${d}" fill="none" stroke="#000" stroke-width="${2 * scale}" stroke-linejoin="round"/>`
          );
          parts.push(
            `<path d="${d}" fill="${color}" stroke="${color}" stroke-width="${STROKE_WIDTH * scale}"/>`
          );
        } else {
          parts.push(
            `<path d="${d}" fill="${color}" stroke="${color}" stroke-width="${3 * scale}" stroke-linejoin="round"/>`
          );
        }
      }
      colorIdx++;
    }
    cursorX += data.w * SCALE;
  }

  const pathsHtml = parts.join('\n  ');
  const content = shadow
    ? `<defs>
  <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
    <feDropShadow dx="2" dy="3" stdDeviation="3" flood-color="#000" flood-opacity="${shadowOpacity}"/>
  </filter>
</defs>
<g filter="url(#s)">
  ${pathsHtml}
</g>`
    : pathsHtml;

  const emojiLayer = emojis.length > 0 ? buildEmojiGrid(emojis, emojiOpacity, emojiAngle) : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${bgColor}"/>
  ${emojiLayer}
  ${content}
</svg>`;
}
