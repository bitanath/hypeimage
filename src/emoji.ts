import emojiData from '../data/emoji-svgs.json';

const data = emojiData as Record<string, string>;

export function getEmojiSVG(emoji: string): string | null {
  return data[emoji] ?? null;
}
