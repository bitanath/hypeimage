import { LetterData } from './types';
import { getEmojiSVG, EMOJI_VIEWBOX, EMOJI_SCALE } from './emoji';

const WIDTH = 400;
const HEIGHT = 300;
const PADDING = 20;
const FONT_ADVANCE = 378;
const SCALE = 0.2;
// EMOJI_VIEWBOX and EMOJI_SCALE imported from emoji.ts

function buildEmojiGrid(emojis: string[], opacity: number, angle: number): string {
  const spacing = 50;
  const cols = Math.ceil(WIDTH / spacing) + 1;
  const rows = Math.ceil(HEIGHT / spacing) + 1;

  const valid = emojis.map(e => getEmojiSVG(e)).filter(Boolean) as string[];
  if (valid.length === 0) return '';

  const center = EMOJI_VIEWBOX / 2;

  const parts: string[] = [];
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const svg = valid[idx % valid.length];
      const x = c * spacing;
      const y = r * spacing;
      const altAngle = idx % 2 === 1 ? -angle : angle;
      parts.push(
        `<g transform="translate(${x},${y}) scale(${EMOJI_SCALE}) rotate(${altAngle}, ${center}, ${center})" opacity="${opacity.toFixed(2)}">${svg}</g>`
      );
      idx++;
    }
  }
  return parts.join('\n  ');
}

export function buildSVG(
  text: string,
  colors: string[],
  letterData: Record<string, LetterData>,
  bgColor: string = '#FFF9C4',
  emojis: string[] = [],
  emojiAngle: number = 45,
  emojiOpacity: number = 0.5,
  paddingLeft: number = 0,
  paddingTop: number = 0,
  style: string = 'outlined'
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
    if (data.yMin < yMin) yMin = data.yMin;
    if (data.yMax > yMax) yMax = data.yMax;
  }
  const offsetY = (HEIGHT - (yMin + yMax) * scale) / 2;

  let colorIdx = 0;
  const charGroups: string[] = [];

  let cursorX = 0;

  for (const { char: c, data } of chars) {
    const tx = offsetX + cursorX * scale + paddingLeft;
    const ty = offsetY + paddingTop;
    const segParts: string[] = [];

    for (const seg of data.s) {
      const [d] = seg as [string, number];
      if (d && colorIdx < colors.length) {
        const color = colors[colorIdx];
        if (style === 'crochet') {
          segParts.push(
            `<path d="${d}" fill="none" stroke="#000" stroke-width="2" stroke-linejoin="round"/>`,
            `<path d="${d}" fill="${color}" stroke="${color}" stroke-width="0.5" stroke-linejoin="round"/>`
          );
        } else if (style === 'yarn') {
          if (colorIdx % 2 === 0) {
            segParts.push(
              `<path d="${d}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round"/>`,
              `<path d="${d}" fill="none" stroke="#000" stroke-width="1" stroke-linejoin="round"/>`
            );
          }
        } else {
          segParts.push(
            `<path d="${d}" fill="${color}" stroke="${color}" stroke-width="3" stroke-linejoin="round"/>`
          );
        }
      }
      colorIdx++;
    }

    if (segParts.length > 0) {
      charGroups.push(
        `<g transform="translate(${tx}, ${ty}) scale(${scale})">${segParts.join('\n  ')}</g>`
      );
    }
    cursorX += data.w * SCALE;
  }

  const pathsHtml = charGroups.join('\n  ');
  const outlineFilter = style === 'outlined';
  let defsHtml = '';
  let contentHtml = pathsHtml;

  if (outlineFilter) {
    defsHtml += `
  <filter id="o" x="-20%" y="-20%" width="140%" height="140%">
    <feOffset in="SourceAlpha" dx="5" dy="4" result="offset"/>
    <feFlood flood-color="#000" result="black"/>
    <feComposite in="black" in2="offset" operator="in" result="shadow"/>
    <feMerge>
      <feMergeNode in="shadow"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>`;
    contentHtml = `<g filter="url(#o)">${contentHtml}</g>`;
  }

  const content = defsHtml
    ? `<defs>${defsHtml}</defs>${contentHtml}`
    : contentHtml;

  const emojiLayer = emojis.length > 0 ? buildEmojiGrid(emojis, emojiOpacity, emojiAngle) : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${bgColor}"/>
  ${emojiLayer}
  ${content}
</svg>`;
}
