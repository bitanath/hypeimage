import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: 'index.ts',
    output: [
      { file: 'dist/hypeimage.js', format: 'umd', name: 'HypeImage' },
      { file: 'dist/hypeimage.cjs', format: 'cjs', name: 'HypeImage' },
      { file: 'dist/hypeimage.mjs', format: 'es' },
    ],
    plugins: [
      json(),
      typescript({ tsconfig: './tsconfig.json', declaration: false }),
    ],
    external: ['@resvg/resvg-js'],
  },
  {
    input: 'index.ts',
    output: { file: 'dist/hypeimage.d.ts', format: 'es' },
    plugins: [dts()],
  },
];
