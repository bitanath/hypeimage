// ── Emoji set selection ──
// To switch emoji sets, uncomment a different import below and update the
// EMOJI_VIEWBOX / EMOJI_SCALE constants. No other files need changes.
//
//   OpenMoji Black (default): viewBox=72, scale=0.501
//   OpenMoji Color:           viewBox=72, scale=0.501  (same)
//   Twemoji:                  viewBox=36, scale=0.835

import emojiData from '../data/openmoji-black-svgs.json';
// import emojiData from '../data/openmoji-svgs.json';
// import emojiData from '../data/emoji-svgs.json';

const currentSet = emojiData as Record<string, string>;

export const EMOJI_VIEWBOX = 72;
export const EMOJI_SCALE = 0.501; // 0.835 * 0.5 * 1.2

export function getEmojiSVG(emoji: string): string | null {
  return currentSet[emoji] ?? null;
}
