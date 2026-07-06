import { buildSVG } from './svg-builder';
import { getGradient, generateColorWheel, getAllGradients } from './gradients';
import { PrecomputedData } from './types';


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

\`/?text=sushi&gradient=sunset&emoji=🔥,🎨,😻,🐻&emoji-angle=45&bg=%23FFF9C4&emoji-opacity=0.25\`

---

## Parameters

| Param | Default | Description |
|-------|---------|-------------|
| \`text\` | _(required)_ | Text to render (max 10 chars, alpha-numeric) |
| \`gradient\` | \`valkyrie\` | Color scheme: \`valkyrie\`, \`sunset\`, \`purpledream\`, \`beach\` |
| \`bg\` | \`#FFF9C4\` | Background hex color |
| \`style\` | \`outlined\` | Render style: \`outlined\`, \`soft\`, \`crochet\`, \`yarn\` |
| \`emoji\` | _(none)_ | Background emoji pattern (comma-sep, max 4) |
| \`emoji-angle\` | \`45\` | Emoji rotation in degrees |
| \`emoji-opacity\` | \`0.5\` | Emoji opacity 0–1 |
| \`png\` | \`false\` | Output PNG instead of SVG (set to \`true\`). Renders at 800×600. |
| \`padding-left\` | \`0\` | Horizontal padding in px |
| \`padding-top\` | \`0\` | Vertical padding in px |

---

## Examples

| Effect | URL |
|--------|-----|
| **Basic** | \`/?text=Hello\` |
| **Gradient** | \`/?text=World&gradient=sunset\` |
| **Emoji** | \`/?text=Hi&emoji=🔥,✨\` |
| **Soft** | \`/?text=Soft&style=soft\` |
| **Crochet** | \`/?text=Yarn&style=crochet\` |
| **Yarn** | \`/?text=Knit&style=yarn\` |
| **Dark bg** | \`/?text=Hey&bg=%23333&emoji=✨&emoji-opacity=0.5\` |
| **Flat angle** | \`/?text=Flat&emoji=💎&emoji-angle=0\` |`;

      return new Response(help, {
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    const text = url.searchParams.get('text') || '';
    const gradientName = url.searchParams.get('gradient') || 'valkyrie';
    const bgColor = url.searchParams.get('bg') || '#FFF9C4';
    const style = url.searchParams.get('style') || 'outlined';
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
    const svg = buildSVG(text, colors, letterData, bgColor, emojis, emojiAngle, emojiOpacity, paddingLeft, paddingTop, style);

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
