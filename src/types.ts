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
