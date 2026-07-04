import twemojiData from '../data/emoji-svgs.json';
import openmojiData from '../data/openmoji-svgs.json';

const twemoji = twemojiData as Record<string, string>;
const openmoji = openmojiData as Record<string, string>;

let currentSet = openmoji;

export function setEmojiSet(useOpenmoji: boolean) {
  currentSet = useOpenmoji ? openmoji : twemoji;
}

export function getEmojiSVG(emoji: string): string | null {
  return currentSet[emoji] ?? null;
}

export function isUsingOpenmoji(): boolean {
  return currentSet === openmoji;
}
