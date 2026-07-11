export type SegmentData = [string, number];

export interface LetterData {
  w: number;
  yMin: number;
  yMax: number;
  s: SegmentData[];
}

export interface PrecomputedData {
  [char: string]: LetterData;
}

export interface GradientStop {
  color: string;
  pos: number;
}

export interface GenerateImageOptions {
  text: string;
  gradient?: string;
  bg?: string;
  style?: 'outlined' | 'soft' | 'crochet' | 'yarn';
  emoji?: string[];
  emojiAngle?: number;
  emojiOpacity?: number;
  paddingLeft?: number;
  paddingTop?: number;
}
