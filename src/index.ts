import { buildSVG } from './svg-builder';
import { getGradient, generateColorWheel, getAllGradients } from './gradients';
import { PrecomputedData } from './types';
import { setEmojiSet } from './emoji';

// @ts-ignore - imported as static asset
import letterDataJson from '../data/letter-segments.json';
const letterData = letterDataJson as unknown as PrecomputedData;

interface Env {
  DO_FN_URL: string;
  DO_AUTH_KEY: string;
}

async function renderPNG(svg: string, env: Env): Promise<Uint8Array> {
  const resp = await fetch(env.DO_FN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Require-Whisk-Auth': env.DO_AUTH_KEY,
    },
    body: JSON.stringify({ svg, width: 400, height: 300 }),
  });
  if (!resp.ok) {
    throw new Error(`DO svg2png error: ${resp.status}`);
  }
  return new Uint8Array(await resp.arrayBuffer());
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/favicon.ico') {
      return new Response(null, { status: 204 });
    }

    if (path === '/gradients') {
      return new Response(JSON.stringify(getAllGradients()), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (path === '/help') {
      const help = `# hypeimage — AI Worker Image Generator

Generate stylized typography SVGs with gradient colors and emoji patterns.

---

## Kitchen Sink

URL encodes: copy the URL below and paste into browser

\`/?text=AWESOME&gradient=purpledream&bg=%23000000&emoji=%F0%9F%94%A5,%E2%9C%A8,%F0%9F%8E%A8,%F0%9F%92%8E&emoji-angle=30&emoji-opacity=0.4&shadow=true&shadow-opacity=0.5\` (returns SVG directly)

---

## Parameters

| Param | Default | Description |
|-------|---------|-------------|
| \`text\` | _(required)_ | Text to render (max 10 chars, alpha-numeric) |
| \`gradient\` | \`valkyrie\` | Color scheme: \`valkyrie\`, \`sunset\`, \`purpledream\`, \`beach\` |
| \`bg\` | \`#FFF9C4\` | Background hex color |
| \`shadow\` | \`false\` | Enable text drop shadow (set to \`true\`) |
| \`shadow-opacity\` | \`0.3\` | Shadow opacity 0–1 |
| \`outlined\` | \`true\` | Outer outline only (default). Set to \`false\` for fill-only |
| \`emoji\` | _(none)_ | Background emoji pattern (comma-sep, max 4) |
| \`emoji-angle\` | \`45\` | Emoji rotation in degrees |
| \`emoji-opacity\` | \`0.5\` | Emoji opacity 0–1 |
| \`openmoji\` | \`true\` | Use OpenMoji set (set to \`false\` for Twemoji) |
| \`crochet\` | \`false\` | Outline every segment + thin fill (crochet-style, supersedes \`outlined\`) |
| \`yarn\` | \`false\` | Alternating thread effect (supersedes \`outlined\` and \`crochet\`) |
| \`png\` | \`false\` | Output PNG instead of SVG (set to \`true\`). Renders at 800×600. |


---

## Examples

| Effect | URL |
|--------|-----|
| **Basic** | \`/?text=Hello\` |
| **Gradient** | \`/?text=World&gradient=sunset\` |
| **Emoji** | \`/?text=Hi&emoji=%F0%9F%94%A5,%E2%9C%A8\` |
| **Shadow** | \`/?text=Wow&shadow=true\` |
| **Dark bg** | \`/?text=Hey&bg=%23333&emoji=%E2%9C%A8&emoji-opacity=0.5\` |
| **Flat angle** | \`/?text=Flat&emoji=%F0%9F%92%8E&emoji-angle=0\` |
| **Bold shadow** | \`/?text=POP&shadow=true&shadow-opacity=0.8\` |
| **Light pattern** | \`/?text=Soft&emoji=%E2%9C%A8&emoji-opacity=0.15\` |`;

      return new Response(help, {
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    const text = url.searchParams.get('text') || '';
    const gradientName = url.searchParams.get('gradient') || 'valkyrie';
    const bgColor = url.searchParams.get('bg') || '#FFF9C4';
    const shadow = url.searchParams.get('shadow') === 'true';
    const rawOpacity = url.searchParams.get('shadow-opacity') || '0.3';
    let shadowOpacity = parseFloat(rawOpacity);
    if (isNaN(shadowOpacity)) shadowOpacity = 0.3;
    const crochet = url.searchParams.get('crochet') === 'true';
    const yarn = url.searchParams.get('yarn') === 'true';
    const outlined = url.searchParams.get('outlined') !== 'false';
    const wantPNG = url.searchParams.get('png') === 'true';
    const emojiParam = url.searchParams.get('emoji') || '';
    const emojis = emojiParam ? emojiParam.split(',').slice(0, 4) : [];
    const rawAngle = url.searchParams.get('emoji-angle') || '45';
    let emojiAngle = parseFloat(rawAngle);
    if (isNaN(emojiAngle)) emojiAngle = 45;
    const rawEmojiOpacity = url.searchParams.get('emoji-opacity') || '0.5';
    let emojiOpacity = parseFloat(rawEmojiOpacity);
    if (isNaN(emojiOpacity)) emojiOpacity = 0.5;
    const rawPadL = url.searchParams.get('padding-left') || '0';
    let paddingLeft = parseFloat(rawPadL);
    if (isNaN(paddingLeft)) paddingLeft = 0;
    const rawPadT = url.searchParams.get('padding-top') || '0';
    let paddingTop = parseFloat(rawPadT);
    if (isNaN(paddingTop)) paddingTop = 0;
    const useOpenmoji = url.searchParams.get('openmoji') !== 'false';
    setEmojiSet(useOpenmoji);

    if (!text) {
      return Response.redirect(new URL('/help', request.url).toString(), 302);
    }

    const lower = text.toLowerCase();
    let totalSegments = 0;
    for (const c of lower) {
      const data = letterData[c];
      if (data) totalSegments += data.s.length;
    }

    if (totalSegments === 0) {
      return new Response(
        JSON.stringify({ error: 'No renderable characters in text' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const gradient = getGradient(gradientName);
    const colors = generateColorWheel(gradient, totalSegments);
    const svg = buildSVG(text, colors, letterData, bgColor, shadow, shadowOpacity, emojis, emojiAngle, emojiOpacity, paddingLeft, paddingTop, crochet, yarn, outlined);

    if (wantPNG) {
      const pngData = await renderPNG(svg, env);
      return new Response(pngData, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400, s-maxage=604800',
        },
      });
    }

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800',
      },
    });
  },
};
