/// <reference types="vitest" />
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@biosstel/platform': path.resolve(__dirname, '../platform/src/index.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    passWithNoTests: true,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
