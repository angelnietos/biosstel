/// <reference types="vitest" />
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname,
  resolve: {
    alias: {
      '@biosstel/platform': path.resolve(__dirname, '../../test-mocks/platform.ts'),
      '@biosstel/shared': path.resolve(__dirname, '../../shared/src/index.ts'),
      '@biosstel/ui-layout': path.resolve(__dirname, '../../ui-layout/src/index.ts'),
      '@biosstel/ui': path.resolve(__dirname, '../../ui/src/index.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    passWithNoTests: true,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
