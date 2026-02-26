import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';
import nxPlugin from '@nx/eslint-plugin';

const eslintConfig = defineConfig([
  globalIgnores([
    '**/.next/**',
    '**/out/**',
    '**/build/**',
    '**/next-env.d.ts',
    '**/node_modules/**',
  ]),

  ...nextVitals,
  ...nextTs,
  eslintConfigPrettier,

  // Override react version detection (incompatible with ESLint 10),
  // relax strict rules, and add Nx module boundary rules
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.mjs'],
    settings: {
      react: {
        version: '19',
      },
    },
    plugins: {
      '@nx': nxPlugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@nx/enforce-module-boundaries': [
        'error',
        {
          allow: [],
          depConstraints: [
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: [
                'type:feature',
                'type:ui',
                'type:layout',
                'type:platform',
                'type:shell',
                'scope:shared',
                'type:shared-types',
              ],
            },
            {
              sourceTag: 'type:shell',
              onlyDependOnLibsWithTags: [
                'type:ui',
                'type:layout',
                'type:feature',
                'scope:shared',
                'type:platform',
                'type:shared-types',
              ],
            },
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: [
                'type:ui',
                'type:layout',
                'type:platform',
                'scope:shared',
                'type:feature',
                'type:shared-types',
              ],
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:ui', 'type:layout'],
            },
            {
              sourceTag: 'type:layout',
              onlyDependOnLibsWithTags: ['type:ui', 'type:layout'],
            },
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['type:ui', 'type:layout', 'scope:shared'],
            },
            {
              sourceTag: 'type:platform',
              onlyDependOnLibsWithTags: ['type:platform'],
            },
            {
              sourceTag: 'scope:api',
              onlyDependOnLibsWithTags: ['scope:api', 'type:shared-types'],
            },
            {
              sourceTag: 'type:shared-types',
              onlyDependOnLibsWithTags: ['type:shared-types'],
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
