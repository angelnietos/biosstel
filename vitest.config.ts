/// <reference types="vitest" />
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)));

export default defineConfig({
  resolve: {
    alias: {
      '@biosstel/platform': path.resolve(rootDir, 'scripts/test-mocks/platform.ts'),
      '@biosstel/shared-types': path.resolve(rootDir, 'libs/shared-types/src/index.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    passWithNoTests: true,
    testTimeout: 10000,
    hookTimeout: 10000,
    include: ['apps/**/*.test.ts', 'apps/**/*.test.tsx', 'libs/**/*.test.ts', 'libs/**/*.test.tsx'],
    exclude: [
      'apps/**/e2e*/**',
      'apps/e2e-*/**',
      'apps/**/node_modules/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      '.next/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'json', 'json-summary', 'html', 'lcov', 'clover'],
      reportsDirectory: 'coverage',
      include: [
        'apps/api-biosstel/src/**',
        'apps/front-biosstel/src/**',
        'libs/backend/*/src/**',
        'libs/frontend/*/src/**',
        'libs/shared-types/src/**',
      ],
      exclude: [
        'node_modules/',
        'dist/',
        'build/',
        '.next/',
        '**/*.config.ts',
        '**/*.config.js',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/*.spec.tsx',
        '**/*.test.tsx',
        '**/test/**',
        '**/tests/**',
        '**/e2e/**',
        '**/index.ts',
      ],
    },
  },
});
