import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'build',
    format: 'cjs',
    preserveModules: true,
    preserveModulesRoot: 'src',
  },
  plugins: [
    typescript(),
    resolve(),
    commonjs(),
    terser(),
  ],
  external: [
    'fs',
    'http2',
    'typeorm',
    'bignumber.js',
    'reflect-metadata',
  ],
};
