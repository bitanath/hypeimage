import { GradientStop } from './types';

export const ValkyrieGradient: GradientStop[] = [
  { color: "#C6FFDD", pos: 0 },
  { color: "#FBD786", pos: 0.25 },
  { color: "#F7797D", pos: 0.5 },
  { color: "#6DD5ED", pos: 0.75 },
  { color: "#C6FFDD", pos: 1 },
];

export const SunsetGradient: GradientStop[] = [
  { color: "#FF9A8B", pos: 0 },
  { color: "#FF6A88", pos: 0.33 },
  { color: "#FF99AC", pos: 0.66 },
  { color: "#A8E6CF", pos: 1 },
];

export const PurpleDreamGradient: GradientStop[] = [
  { color: "#667eea", pos: 0 },
  { color: "#764ba2", pos: 0.25 },
  { color: "#f093fb", pos: 0.5 },
  { color: "#f5576c", pos: 0.75 },
  { color: "#4facfe", pos: 1 },
];

export const BeachGradient: GradientStop[] = [
  { color: "#87CEEB", pos: 0 },
  { color: "#F4D03F", pos: 0.33 },
  { color: "#2193B0", pos: 0.66 },
  { color: "#E8F6EF", pos: 1 },
];

const gradients: Record<string, GradientStop[]> = {
  valkyrie: ValkyrieGradient,
  sunset: SunsetGradient,
  purpledream: PurpleDreamGradient,
  beach: BeachGradient,
};

export function getGradient(name: string): GradientStop[] {
  const key = name.toLowerCase().replace(/[\s-]/g, '');
  return gradients[key] || ValkyrieGradient;
}

export function getAllGradients(): string[] {
  return Object.keys(gradients);
}

function convertToHex(rgb: number[]): string {
  const hex = (n: number) => {
    const s = "0123456789abcdef";
    const i = Math.round(Math.min(Math.max(0, n), 255));
    return s.charAt((i - (i % 16)) / 16) + s.charAt(i % 16);
  };
  return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
}

function convertToRGB(hex: string): number[] {
  const h = hex.charAt(0) === '#' ? hex.substring(1, 7) : hex;
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function interpolateColors(
  startHex: string,
  endHex: string,
  count: number
): string[] {
  const start = convertToRGB(startHex);
  const end = convertToRGB(endHex);
  const result: string[] = [];

  for (let i = 0; i < count; i++) {
    const alpha = (i + 1) / count;
    const r = Math.round(start[0] * alpha + (1 - alpha) * end[0]);
    const g = Math.round(start[1] * alpha + (1 - alpha) * end[1]);
    const b = Math.round(start[2] * alpha + (1 - alpha) * end[2]);
    result.push(`#${convertToHex([r, g, b])}`);
  }

  return result;
}

export function generateColorWheel(
  gradient: GradientStop[],
  total: number
): string[] {
  if (gradient.length < 2) return [];

  const sorted = [...gradient].sort((a, b) => a.pos - b.pos);
  const countPerColor = Math.max(1, Math.round(total / (sorted.length - 1)));
  const wheel: string[] = [];

  for (let i = 0; i < sorted.length - 1; i++) {
    const colors = interpolateColors(sorted[i + 1].color, sorted[i].color, countPerColor);
    wheel.push(...colors);
  }

  return wheel.slice(0, total);
}
