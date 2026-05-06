import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['esm'],
  target: 'node16',
  clean: true,
  sourcemap: true,
  esbuildOptions(options) {
    options.alias = {
      '@': './src',
    };
  },
});