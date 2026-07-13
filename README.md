# hypeimage

Generate stylized typography SVGs and PNGs with gradient colors and emoji patterns.

## Install

```bash
npm install hypeimage
```

## Usage

```typescript
import { generateImage, generateImagePNG } from 'hypeimage';

// Generate SVG string
const svg = generateImage({ text: 'hello' });

// Generate PNG buffer (requires @resvg/resvg-js)
const png = await generateImagePNG({ text: 'hello', gradient: 'sunset' });
```

✨ Originally built for the Slack Agent Builder Challenge c.2026

## API

### `generateImage(options): string`

Returns an SVG string.

### `generateImagePNG(options): Promise<Buffer>`

Returns a PNG buffer. Requires `@resvg/resvg-js` as a peer dependency.

```bash
npm install @resvg/resvg-js
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `text` | `string` | _(required)_ | Text to render (max 10 chars, alphanumeric) |
| `gradient` | `string` | `"valkyrie"` | Color scheme: `valkyrie`, `sunset`, `purpledream`, `beach` |
| `bg` | `string` | `"#FFF9C4"` | Background hex color |
| `style` | `string` | `"outlined"` | Render style: `outlined`, `soft`, `crochet`, `yarn` |
| `emoji` | `string[]` | `[]` | Background emoji pattern (max 4) |
| `emojiAngle` | `number` | `45` | Emoji rotation in degrees |
| `emojiOpacity` | `number` | `0.5` | Emoji opacity 0-1 |
| `paddingLeft` | `number` | `0` | Horizontal padding in px |
| `paddingTop` | `number` | `0` | Vertical padding in px |

### `getAllGradients(): string[]`

Returns the list of available gradient names.

## Examples

### Basic

```typescript
const svg = generateImage({ text: 'Hello' });
```

### Gradient

```typescript
const svg = generateImage({ text: 'World', gradient: 'sunset' });
```

### Crochet style with emoji

```typescript
const svg = generateImage({
  text: 'sushi',
  gradient: 'sunset',
  bg: '#FFF9C4',
  style: 'crochet',
  emoji: ['🔥', '🎨', '😻', '🐻'],
  emojiAngle: 45,
  emojiOpacity: 0.25,
});
```

### Soft style

```typescript
const svg = generateImage({ text: 'Soft', style: 'soft' });
```

### Yarn style

```typescript
const svg = generateImage({ text: 'Knit', style: 'yarn' });
```

### Dark background with emoji

```typescript
const svg = generateImage({
  text: 'Hey',
  bg: '#333',
  emoji: ['✨'],
  emojiOpacity: 0.5,
});
```

### Flat emoji angle

```typescript
const svg = generateImage({
  text: 'Flat',
  emoji: ['💎'],
  emojiAngle: 0,
});
```

### PNG output

```typescript
const png = await generateImagePNG({
  text: 'party',
  gradient: 'purpledream',
  style: 'crochet',
  emoji: ['🔥', '✨', '🎉'],
});
```

## License

[GNU GPL v3](LICENSE)
