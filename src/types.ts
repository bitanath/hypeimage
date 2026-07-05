export type SegmentData = [[number, number][], number];

export interface LetterData {
  w: number;
  s: SegmentData[];
}

export interface PrecomputedData {
  [char: string]: LetterData;
}

export interface GradientStop {
  color: string;
  pos: number;
}
