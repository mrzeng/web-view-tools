import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import cleaner from 'rollup-plugin-cleaner';
import { terser } from 'rollup-plugin-terser';

const extensions = ['.ts', '.js'];

const target = 'lib';

const commonPlugins = [
  nodeResolve({
    extensions,
  }),
  commonjs(),
  typescript({ useTsconfigDeclarationDir: true }),
];

export default [
  {
    input: 'src/index.ts',
    output: {
      file: `${target}/web-view-tools.js`,
      format: 'es',
    },
    plugins: [
      ...commonPlugins,
      cleaner({
        targets: [`${target}/`],
      }),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: `${target}/web-view-tools.min.js`,
      format: 'umd',
      indent: false,
      name: 'webViewTools',
    },
    plugins: [...commonPlugins, terser()],
  },
];
