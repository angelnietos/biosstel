import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import nxPlugin from '@nx/eslint-plugin';

export default defineConfig([
  globalIgnores([
    '**/node_modules/**',
    '**/dist/**',
    '**/.next/**',
    '**/build/**',
    '**/coverage/**',
    '**/*.config.js',
    '**/*.config.mjs',
    '**/*.config.ts',
    '**/seed.ts',
  ]),

  // TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      '@nx': nxPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...prettierConfig.rules,
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-redeclare': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
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
              onlyDependOnLibsWithTags: ['type:ui'],
            },
            {
              sourceTag: 'type:layout',
              onlyDependOnLibsWithTags: ['type:ui', 'type:layout'],
            },
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['type:ui', 'type:layout', 'scope:shared', 'type:platform'],
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

  // JavaScript files
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {
      ...js.configs.recommended.rules,
      ...prettierConfig.rules,
    },
  },

  // Node.js scripts (scripts/*.js): globals process, require, __dirname, console
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: {
        process: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        console: 'readonly',
        module: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-empty': ['warn', { allowEmptyCatch: true }],
    },
  },
]);
