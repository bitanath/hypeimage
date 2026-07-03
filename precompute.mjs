import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Letter path data (copied from src/letters.ts) ──
const zero = "M 410 662 L 315 630 L 252 567 L 189 472 L 158 378 L 126 252 L 126 158 L 158 63 L 189 31.5 L 252 0 L 315 0 L 410 31.5 L 472 94.5 L 536 189 L 567 284 L 598 410 L 598 504 L 567 598 L 536 630 L 472 662 L 410 662";
const one = "M 472 662 L 284 0 M 472 662 L 378 567 L 284 504 L 220 472";
const two = "M 252 536 L 284 504 L 252 472 L 220 504 L 220 536 L 252 598 L 284 630 L 378 662 L 472 662 L 567 630 L 598 567 L 598 504 L 567 441 L 504 378 L 410 315 L 284 252 L 189 189 L 126 126 L 63 0 M 94.5 63 L 126 94.5 L 189 94.5 L 346 0 L 441 0 L 504 31.5 L 536 126";
const three = "M 252 536 L 284 504 L 252 472 L 220 504 L 220 536 L 252 598 L 284 630 L 378 662 L 472 662 L 567 630 L 598 567 L 598 504 L 567 441 L 472 378 L 378 346 L 441 315 L 472 284 L 504 220 L 504 126 L 472 63 L 441 31.5 L 378 0 L 252 0 L 158 31.5 L 126 63 L 94.5 126 L 94.5 158 L 126 189 L 158 158 L 126 126";
const four = "M 536 630 L 346 0 M 567 662 L 94.5 189 L 598 189";
const five = "M 315 662 L 158 346 M 315 662 L 630 662 M 158 346 L 189 378 L 284 410 L 378 410 L 441 378 L 472 346 L 504 284 L 504 189 L 472 94.5 L 410 31.5 L 346 0 L 252 0 L 158 31.5 L 126 63 L 94.5 126 L 94.5 158 L 126 189 L 158 158 L 126 126";
const six = "M 567 567 L 536 536 L 567 504 L 598 536 L 598 567 L 567 630 L 504 662 L 410 662 L 346 630 L 284 567 L 220 472 L 189 378 L 158 252 L 158 94.5 L 189 31.5 L 252 0 L 346 0 L 410 31.5 L 472 94.5 L 504 158 L 504 284 L 472 346 L 410 378 L 315 378 L 252 346 L 189 284 L 158 220";
const seven = "M 220 662 L 158 472 M 630 662 L 598 567 L 536 472 L 346 284 L 284 189 L 252 126 L 220 0 M 220 598 L 284 630 L 346 630 L 504 567 L 567 567 L 598 598 L 630 662";
const eight = "M 378 662 L 315 630 L 284 598 L 252 536 L 252 441 L 284 378 L 315 346 L 220 315 L 158 252 L 126 189 L 126 94.5 L 158 31.5 L 220 0 L 346 0 L 441 31.5 L 472 63 L 504 126 L 504 252 L 472 315 L 410 346 L 504 378 L 536 410 L 567 472 L 567 567 L 536 630 L 472 662 L 378 662";
const nine = "M 567 441 L 536 378 L 472 315 L 410 284 L 315 284 L 252 315 L 220 378 L 220 504 L 252 567 L 315 630 L 378 662 L 472 662 L 536 630 L 567 567 L 567 410 L 536 284 L 504 189 L 441 94.5 L 378 31.5 L 315 0 L 220 0 L 158 31.5 L 126 94.5 L 126 126 L 158 158 L 189 126 L 158 94.5";
const a = "M 31.5 158 L 63 220 L 94.5 252 L 158 284 L 220 284 L 284 252 L 315 189 L 284 94.5 L 252 31.5 L 189 0 L 126 0 L 63 31.5 L 31.5 94.5 L 31.5 158 L 63 220 L 94.5 252 L 158 284 L 220 284 L 284 252 L 318 189 L 346 284 L 315 126 L 315 31.5 L 346 0 L 378 0 L 441 31.5 L 472 63 L 536 158";
const b = "M 31.5 158 L 94.5 252 L 189 410 L 220 472 L 252 567 L 252 630 L 220 662 L 158 630 L 126 567 L 94.5 441 L 63 220 L 63 31.5 L 94.5 0 L 126 0 L 189 31.5 L 252 94.5 L 284 189 L 284 284 L 315 158 L 346 126 L 410 126 L 472 158";
const c = "M 31.5 158 L 63 220 L 94.5 252 L 158 284 L 220 284 L 252 252 L 252 220 L 252 252 L 220 284 L 158 284 L 94.5 252 L 63 220 L 31.5 158 L 31.5 94.5 L 63 31.5 L 126 0 L 220 0 L 315 63 L 378 158";
const d = "M 31.5 158 L 63 220 L 94.5 252 L 158 284 L 220 284 L 284 252 L 315 189 L 284 252 L 220 284 L 158 284 L 94.5 252 L 63 220 L 31.5 158 L 31.5 94.5 L 63 31.5 L 126 0 L 189 0 L 252 31.5 L 284 94.5 L 472 662 M 346 284 L 315 126 L 315 31.5 L 346 0 L 378 0 L 441 31.5 L 472 63 L 536 158";
const e = "M 32 154 L 45 212 L 77 251 L 126 284 L 158 284 L 189 252 L 189 189 L 158 126 L 126 94.5 L 48 60 L 32 153 L 48 60 L 113 18 L 171 8 L 242 27 L 284 63 L 346 158";
const f = "M 31.5 158 L 158 315 L 220 410 L 252 472 L 284 567 L 284 630 L 252 662 L 189 630 L 158 567 L 94.5 315 L 0 31.5 L -94.5 -189 L -126 -284 L -126 -346 L -94.5 -378 L -31.5 -346 L 0 -252 L 31.5 31.5 L 63 0 L 126 0 L 189 31.5 L 220 63 L 284 158";
const g = "M 31.5 158 L 31.5 94.5 L 63 31.5 L 126 0 L 189 0 L 252 31.5 L 284 63 L 327 182 L 283 251 L 220 284 L 158 284 L 94.5 252 L 63 220 L 31.5 158 L 31.5 94.5 L 63 31.5 L 126 0 L 189 0 L 252 31.5 L 284 63 L 346 284 L 278 71 L 158 -284 L 126 -346 L 63 -378 L 31.5 -346 L 31.5 -284 L 63 -189 L 158 -94.5 L 252 -31.5 L 315 0 L 410 63 L 504 158";
const h = "M 31.5 158 L 94.5 252 L 189 410 L 220 472 L 252 567 L 252 630 L 220 662 L 158 630 L 126 567 L 94.5 441 L 63 252 L 31.5 0 M 31.5 0 L 63 94.5 L 94.5 158 L 158 252 L 220 284 L 284 284 L 315 252 L 315 189 L 284 94.5 L 284 31.5 L 315 0 L 346 0 L 410 31.5 L 441 63 L 504 158";
const i = "M 126 441 L 126 410 L 158 410 L 158 441 L 126 441 M 31.5 158 L 94.5 284 L 31.5 94.5 L 31.5 31.5 L 63 0 L 94.5 0 L 158 31.5 L 189 63 L 252 158";
const j = "M 126 441 L 126 410 L 158 410 L 158 441 L 126 441 M 31.5 158 L 94.5 284 L -94.5 -284 L -126 -346 L -189 -378 L -220 -346 L -220 -284 L -189 -189 L -94.5 -94.5 L 0 -31.5 L 63 0 L 158 63 L 252 158";
const k = "M 31.5 158 L 94.5 252 L 189 410 L 220 472 L 252 567 L 252 630 L 220 662 L 158 630 L 126 567 L 94.5 441 L 63 252 L 31.5 0 M 31.5 0 L 63 94.5 L 94.5 158 L 158 252 L 220 284 L 284 284 L 315 252 L 315 189 L 252 158 L 158 158 M 158 158 L 220 126 L 252 31.5 L 284 0 L 315 0 L 378 31.5 L 410 63 L 472 158";
const l = "M 31.5 158 L 94.5 252 L 189 410 L 220 472 L 252 567 L 252 630 L 220 662 L 158 630 L 126 567 L 94.5 441 L 63 220 L 63 31.5 L 94.5 0 L 126 0 L 189 31.5 L 220 63 L 284 158";
const m = "M 31.5 158 L 94.5 252 L 158 284 L 189 252 L 189 220 L 158 94.5 L 126 0 M 158 94.5 L 189 158 L 252 252 L 315 284 L 378 284 L 410 252 L 410 220 L 378 94.5 L 346 0 M 378 94.5 L 410 158 L 472 252 L 536 284 L 598 284 L 630 252 L 630 189 L 598 94.5 L 598 31.5 L 630 0 L 662 0 L 724 31.5 L 756 63 L 819 158";
const n = "M 31.5 158 L 94.5 252 L 158 284 L 189 252 L 189 220 L 158 94.5 L 126 0 M 158 94.5 L 189 158 L 252 252 L 315 284 L 378 284 L 410 252 L 410 189 L 378 94.5 L 378 31.5 L 410 0 L 441 0 L 504 31.5 L 536 63 L 598 158";
const o = "M 31.5 158 L 63 220 L 94.5 252 L 158 284 L 220 284 L 284 252 L 315 189 L 315 126 L 284 63 L 252 31.5 L 189 0 L 126 0 L 63 31.5 L 31.5 94.5 L 31.5 158 L 63 220 L 94.5 252 L 158 284 L 220 284 L 189 252 L 189 189 L 220 126 L 284 94.5 L 378 94.5 L 441 126 L 472 158";
const p = "M 31.5 158 L 94.5 252 L 126 315 L 94.5 189 L -94.5 -378 L 94.5 189 L 126 252 L 189 284 L 252 284 L 315 252 L 346 189 L 346 126 L 315 63 L 284 31.5 L 247 15 L 183 14 L 94.5 31.5 L 163 5 L 239 5 L 346 31.5 L 410 63 L 504 158";
const q = "M 31.5 158 L 63 220 L 94.5 252 L 158 284 L 220 284 L 284 252 L 315 189 L 284 94.5 L 252 31.5 L 189 0 L 126 0 L 63 31.5 L 31.5 94.5 L 31.5 158 L 63 220 L 94.5 252 L 158 284 L 220 284 L 284 252 L 346 284 L 284 94.5 L 252 31.5 L 158 -189 L 126 -284 L 126 -346 L 158 -378 L 220 -346 L 252 -252 L 252 -31.5 L 315 0 L 410 63 L 504 158";
const r = "M 31.5 158 L 94.5 252 L 126 315 L 126 252 L 220 252 L 252 220 L 252 158 L 220 63 L 220 31.5 L 252 0 L 284 0 L 346 31.5 L 378 63 L 441 158";
const s = "M 31.5 158 L 94.5 252 L 126 315 L 126 252 L 189 158 L 220 94.5 L 220 31.5 L 158 0 M 31.5 31.5 L 94.5 0 L 220 0 L 284 31.5 L 315 63 L 378 158";
const t = "M 31.5 158 L 94.5 252 L 158 378 L 252 662 L 63 94.5 L 63 31.5 L 94.5 0 L 158 0 L 220 31.5 L 252 63 L 315 158 M 63 410 L 284 410";
const u = "M 31.5 158 L 94.5 284 L 31.5 94.5 L 31.5 31.5 L 63 0 L 126 0 L 189 31.5 L 252 94.5 L 315 189 M 346 284 L 284 94.5 L 284 31.5 L 315 0 L 346 0 L 410 31.5 L 441 63 L 504 158";
const v = "M 31.5 158 L 94.5 284 L 63 126 L 63 31.5 L 94.5 0 L 126 0 L 220 31.5 L 284 94.5 L 315 189 L 315 284 M 315 284 L 346 158 L 378 126 L 441 126 L 504 158";
const w = "M 31.5 158 L 63 220 L 125 283 L 63 220 L 31.5 126 L 31.5 63 L 63 0 L 126 0 L 189 31.5 L 252 94.5 L 315 284 L 252 94.5 L 252 31.5 L 284 0 L 346 0 L 410 31.5 L 472 94.5 L 504 189 L 504 284 L 504 284 L 536 158 L 567 126 L 630 126 L 693 158";
const x = "M 31.5 158 L 94.5 252 L 158 284 L 220 284 L 252 252 L 252 140 L 158 0 L 94.5 0 L 63 31.5 L 94.5 0 L 158 0 L 252 140 L 315 252 L 346 284 L 410 284 L 441 252 L 410 284 L 346 284 L 315 252 L 252 140 L 284 0 L 284 0 L 378 0 L 472 63 L 536 158";
const y = "M 31.5 158 L 94.5 284 L 31.5 94.5 L 31.5 31.5 L 63 0 L 126 0 L 189 31.5 L 252 94.5 L 315 189 M 346 284 L 158 -284 L 126 -346 L 63 -378 L 31.5 -346 L 31.5 -284 L 63 -189 L 158 -94.5 L 252 -31.5 L 315 0 L 410 63 L 504 158";
const z = "M 31.5 158 L 94.5 252 L 158 284 L 220 284 L 284 220 L 284 158 L 252 94.5 L 189 31.5 L 94.5 0 L 158 -31.5 L 189 -94.5 L 189 -189 L 158 -284 L 126 -346 L 63 -378 L 31.5 -346 L 31.5 -284 L 63 -189 L 158 -94.5 L 252 -31.5 L 378 63 L 472 158";
const space = null;

const charMap = {
  '0': zero, '1': one, '2': two, '3': three, '4': four, '5': five, '6': six, '7': seven, '8': eight, '9': nine,
  'a': a, 'b': b, 'c': c, 'd': d, 'e': e, 'f': f, 'g': g, 'h': h, 'i': i, 'j': j, 'k': k, 'l': l, 'm': m, 'n': n, 'o': o, 'p': p, 'q': q, 'r': r, 's': s, 't': t, 'u': u, 'v': v, 'w': w, 'x': x, 'y': y, 'z': z,
  ' ': space,
};

const widthMap = {
  "0": 662, "1": 662, "2": 662, "3": 662, "4": 662, "5": 662, "6": 662, "7": 662, "8": 662, "9": 662,
  "a": 504, "b": 441, "c": 346, "d": 504, "e": 315, "f": 252, "g": 472, "h": 472, "i": 220, "j": 220,
  "k": 441, "l": 252, "m": 788, "n": 567, "o": 441, "p": 472, "q": 472, "r": 410, "s": 346, "t": 284,
  "u": 472, "v": 472, "w": 662, "x": 504, "y": 472, "z": 441, " ": 378,
};

function parsePath(d) {
  const points = [];
  const tokens = d.match(/[MmLlHhVvCcSsQqTtAaZz]|[\d.-]+/g) || [];
  let i = 0;
  let current = { x: 0, y: 0 };

  while (i < tokens.length) {
    const cmd = tokens[i++];
    const upper = cmd.toUpperCase();
    const relative = cmd !== upper;

    const readNum = () => parseFloat(tokens[i++]);
    const readCoord = () => {
      const x = readNum();
      const y = readNum();
      return { x, y };
    };

    switch (upper) {
      case 'M': {
        const { x, y } = readCoord();
        const px = relative ? current.x + x : x;
        const py = relative ? current.y + y : y;
        points.push({ x: px, y: py, moveTo: true });
        current = { x: px, y: py };
        break;
      }
      case 'L': {
        const { x, y } = readCoord();
        const px = relative ? current.x + x : x;
        const py = relative ? current.y + y : y;
        points.push({ x: px, y: py });
        current = { x: px, y: py };
        break;
      }
      case 'Z': {
        const moveTo = points.find(p => p.moveTo);
        if (moveTo) {
          points.push({ x: moveTo.x, y: moveTo.y });
          current = { x: moveTo.x, y: moveTo.y };
        }
        break;
      }
    }
  }
  return points;
}

function transformPoints(points, scale, offsetLeft) {
  const fontHorizAdvX = 378;
  const unitsPerEm = 1000;
  const xHeight = 300;
  const shiftX = 0.5 * fontHorizAdvX * scale;
  const shiftY = 0.5 * xHeight * scale;
  return points.map(p => ({
    x: p.x * scale + offsetLeft + shiftX,
    y: (-p.y + unitsPerEm) * scale - shiftY,
    moveTo: p.moveTo || false,
  }));
}

function groupByMoveTo(points) {
  const subPaths = [];
  let current = [];
  for (const p of points) {
    if (p.moveTo && current.length > 0) {
      subPaths.push(current);
      current = [];
    }
    current.push(p);
  }
  if (current.length > 0) subPaths.push(current);
  return subPaths;
}

function polylineLength(points) {
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    len += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  }
  return len;
}

function pointAtLength(points, targetLen) {
  let accumulated = 0;
  for (let i = 1; i < points.length; i++) {
    const segLen = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    if (accumulated + segLen >= targetLen || i === points.length - 1) {
      const t = segLen > 0 ? (targetLen - accumulated) / segLen : 0;
      return {
        x: points[i - 1].x + t * (points[i].x - points[i - 1].x),
        y: points[i - 1].y + t * (points[i].y - points[i - 1].y),
      };
    }
    accumulated += segLen;
  }
  return { x: points[points.length - 1].x, y: points[points.length - 1].y };
}

function outlineStrokes(samples, fillWidth) {
  const radius = fillWidth / 2;
  const segmentSamples = [];
  for (let j = 0; j < samples.length - 1; j++) {
    const p0 = samples[j];
    const p1 = samples[j + 1];
    const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);
    const perpX = Math.sin(angle) * radius;
    const perpY = -Math.cos(angle) * radius;
    if (j === 0) {
      segmentSamples.push({ x: p0.x + perpX, y: p0.y + perpY });
      segmentSamples.push({ x: p0.x - perpX, y: p0.y - perpY });
    }
    segmentSamples.push({ x: p1.x + perpX, y: p1.y + perpY });
    segmentSamples.push({ x: p1.x - perpX, y: p1.y - perpY });
  }
  const even = segmentSamples.filter((s, i) => i % 2 === 0);
  const odd = segmentSamples.filter((s, i) => i % 2 === 1).reverse();
  return [...even, ...odd];
}

function averageSegmentJoins(segments) {
  for (let i = 0; i < segments.length - 1; i++) {
    const cur = segments[i];
    const next = segments[i + 1];
    const mid = Math.floor(cur.samples.length / 2);
    const avgX = (cur.samples[mid - 1].x + next.samples[0].x) / 2;
    const avgY = (cur.samples[mid - 1].y + next.samples[0].y) / 2;
    cur.samples[mid - 1] = { x: avgX, y: avgY };
    next.samples[0] = { x: avgX, y: avgY };
    const avgX2 = (cur.samples[mid].x + next.samples[next.samples.length - 1].x) / 2;
    const avgY2 = (cur.samples[mid].y + next.samples[next.samples.length - 1].y) / 2;
    cur.samples[mid] = { x: avgX2, y: avgY2 };
    next.samples[next.samples.length - 1] = { x: avgX2, y: avgY2 };
  }
  return segments;
}

const SCALE = 0.2;
const FILL_WIDTH = 16;
const SAMPLES_PER_CHAR = 120;
const SEGMENT_SAMPLES = 3;

const result = {};

for (const [char, pathStr] of Object.entries(charMap)) {
  if (pathStr === null) {
    result[char] = { w: widthMap[char] || 0, s: [] };
    continue;
  }

  const rawPoints = parsePath(pathStr);
  const subPaths = groupByMoveTo(rawPoints);
  let allSegments = [];

  for (const sub of subPaths) {
    const transformed = transformPoints(sub, SCALE, 0);
    const totalLen = polylineLength(transformed);
    if (totalLen === 0) continue;

    const segCount = Math.max(1, Math.floor((totalLen / 400) * SAMPLES_PER_CHAR));
    const totalSamplePoints = segCount * SEGMENT_SAMPLES;

    const allSamples = [];
    for (let j = 0; j <= totalSamplePoints; j++) {
      allSamples.push(pointAtLength(transformed, (j / totalSamplePoints) * totalLen));
    }

    const subSegments = [];
    for (let seg = 0; seg < segCount; seg++) {
      const start = seg * SEGMENT_SAMPLES;
      const groupSamples = allSamples.slice(start, start + SEGMENT_SAMPLES + 1);
      const outline = outlineStrokes(groupSamples, FILL_WIDTH);
      subSegments.push({
        samples: outline.map(p => ({ x: +p.x.toFixed(2), y: +p.y.toFixed(2) })),
        progress: +((seg + 0.5) / segCount).toFixed(4),
      });
    }

    const smoothed = averageSegmentJoins(subSegments);
    allSegments.push(...smoothed);
  }

  result[char] = {
    w: widthMap[char] || 0,
    s: allSegments.map(seg => [
      seg.samples.map(p => [+p.x.toFixed(2), +p.y.toFixed(2)]),
      +seg.progress.toFixed(4),
    ]),
  };

  process.stdout.write(`  ${char}: ${allSegments.length} segments\n`);
}

const outDir = resolve(__dirname, 'data');
mkdirSync(outDir, { recursive: true });
const outPath = resolve(outDir, 'letter-segments.json');
const json = JSON.stringify(result);
writeFileSync(outPath, json);
const kb = (Buffer.byteLength(json, 'utf-8') / 1024).toFixed(1);
console.log(`\nWrote ${outPath} (${kb} KB)`);

// ── Emoji SVG download ──

const EMOJI_SVGS_PATH = resolve(__dirname, 'data/emoji-svgs.json');
const GEMOJI_URL = 'https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json';
const TWEMOJI_BASE = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg';
const FETCH_CONCURRENCY = 10;

function emojiToTwemojiFilename(emoji) {
  const cps = [];
  for (const ch of emoji) {
    const cp = ch.codePointAt(0);
    if (cp === 0xFE0F) continue;
    cps.push(cp.toString(16).toLowerCase());
  }
  return cps.join('-') + '.svg';
}

function extractSVGInner(svgText) {
  const m = svgText.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
  return m ? m[1].trim() : null;
}

async function downloadEmojiSvgs() {
  let emojiSvgs = {};
  try {
    emojiSvgs = JSON.parse(readFileSync(EMOJI_SVGS_PATH, 'utf-8'));
    process.stdout.write(`\n  emoji-svgs: ${Object.keys(emojiSvgs).length} cached\n`);
  } catch {}

  const resp = await fetch(GEMOJI_URL);
  if (!resp.ok) throw new Error(`Failed to fetch gemoji: ${resp.status}`);
  const gemojiList = await resp.json();

  const toDownload = gemojiList
    .filter(e => e.emoji && !emojiSvgs[e.emoji])
    .map(e => ({ emoji: e.emoji, filename: emojiToTwemojiFilename(e.emoji) }));

  if (toDownload.length === 0) {
    process.stdout.write(`  emoji: all ${Object.keys(emojiSvgs).length} cached\n`);
    return;
  }

  process.stdout.write(`  emoji: downloading ${toDownload.length} SVGs...\n`);

  let completed = 0, saved = 0;
  const queue = [...toDownload];

  async function worker() {
    while (queue.length > 0) {
      const item = queue.shift();
      try {
        const res = await fetch(`${TWEMOJI_BASE}/${item.filename}`);
        if (res.ok) {
          const inner = extractSVGInner(await res.text());
          if (inner) { emojiSvgs[item.emoji] = inner; saved++; }
        }
      } catch {}
      completed++;
      if (completed % 200 === 0 || completed === toDownload.length) {
        process.stdout.write(`    ${completed}/${toDownload.length} (${saved} new)\n`);
      }
    }
  }

  await Promise.all(Array.from({ length: FETCH_CONCURRENCY }, () => worker()));

  writeFileSync(EMOJI_SVGS_PATH, JSON.stringify(emojiSvgs));
  const kb2 = (Buffer.byteLength(JSON.stringify(emojiSvgs), 'utf-8') / 1024).toFixed(1);
  const total = Object.keys(emojiSvgs).length;
  process.stdout.write(`  wrote emoji-svgs.json: ${kb2} KB (${saved} new, ${total} total)\n`);
}

await downloadEmojiSvgs();
