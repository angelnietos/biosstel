const path = require('path');
const { mergeConfig } = require('vite');
const tailwindcssModule = require('@tailwindcss/vite');
const tailwindcss = tailwindcssModule.default || tailwindcssModule;

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
    '../libs/frontend/ui/src/**/*.stories.@(ts|tsx)',
    '../libs/frontend/ui-layout/src/**/*.stories.@(ts|tsx)',
    '../libs/frontend/shared/src/**/*.stories.@(ts|tsx)',
    '../libs/frontend/features/auth/src/**/*.stories.@(ts|tsx)',
    '../libs/frontend/features/usuarios/src/**/*.stories.@(ts|tsx)',
    '../libs/frontend/features/objetivos/src/**/*.stories.@(ts|tsx)',
    '../libs/frontend/features/fichajes/src/**/*.stories.@(ts|tsx)',
    '../libs/frontend/features/alertas/src/**/*.stories.@(ts|tsx)',
    '../libs/frontend/features/operaciones/src/**/*.stories.@(ts|tsx)',
    '../libs/frontend/features/empresa/src/**/*.stories.@(ts|tsx)',
    '../libs/frontend/features/productos/src/**/*.stories.@(ts|tsx)',
    '../libs/frontend/features/inventory/src/**/*.stories.@(ts|tsx)',
    '../libs/frontend/features/reports/src/**/*.stories.@(ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    disableProjectJson: true,
  },
  managerHead: (head) =>
    `${head}<style>html,body,#root{min-height:100vh;margin:0;}</style>`,
  viteFinal: async (viteConfig) => {
    return mergeConfig(viteConfig, {
      base: './',
      plugins: [tailwindcss()],
      resolve: {
        alias: [
          // next-intl subpaths must be listed before the package root so 'next-intl/routing' resolves to the mock
          { find: 'next-intl/routing', replacement: path.resolve(__dirname, './mocks/next-intl-routing.ts') },
          { find: 'next-intl', replacement: path.resolve(__dirname, './mocks/next-intl.ts') },
          { find: '@biosstel/ui', replacement: path.resolve(__dirname, '../libs/frontend/ui/src/index.ts') },
          { find: '@biosstel/ui-layout', replacement: path.resolve(__dirname, '../libs/frontend/ui-layout/src/index.ts') },
          { find: '@biosstel/shared', replacement: path.resolve(__dirname, '../libs/frontend/shared/src/index.ts') },
          { find: '@biosstel/platform', replacement: path.resolve(__dirname, './mocks/platform.tsx') },
          { find: '@biosstel/shared-types', replacement: path.resolve(__dirname, '../libs/shared-types/src/index.ts') },
          { find: '@biosstel/shell', replacement: path.resolve(__dirname, '../libs/frontend/shell/src/index.ts') },
          { find: '@biosstel/auth', replacement: path.resolve(__dirname, '../libs/frontend/features/auth/src/index.ts') },
          { find: '@biosstel/usuarios', replacement: path.resolve(__dirname, '../libs/frontend/features/usuarios/src/index.ts') },
          { find: '@biosstel/objetivos', replacement: path.resolve(__dirname, '../libs/frontend/features/objetivos/src/index.ts') },
          { find: '@biosstel/fichajes', replacement: path.resolve(__dirname, '../libs/frontend/features/fichajes/src/index.ts') },
          { find: '@biosstel/alertas', replacement: path.resolve(__dirname, '../libs/frontend/features/alertas/src/index.ts') },
          { find: '@biosstel/operaciones', replacement: path.resolve(__dirname, '../libs/frontend/features/operaciones/src/index.ts') },
          { find: '@biosstel/empresa', replacement: path.resolve(__dirname, '../libs/frontend/features/empresa/src/index.ts') },
          { find: '@biosstel/productos', replacement: path.resolve(__dirname, '../libs/frontend/features/productos/src/index.ts') },
          { find: '@biosstel/inventory', replacement: path.resolve(__dirname, '../libs/frontend/features/inventory/src/index.ts') },
          { find: '@biosstel/reports', replacement: path.resolve(__dirname, '../libs/frontend/features/reports/src/index.ts') },
        ],
      },
      optimizeDeps: {
        include: ['react', 'react-dom', 'motion'],
      },
      server: {
        hmr: { clientPort: 6006 },
        watch: { usePolling: false },
      },
      build: {
        rollupOptions: {
          onwarn(warning, warn) {
            // "use client" and similar module-level directives are ignored when bundled; safe to suppress.
            if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
            warn(warning);
          },
          output: {
            manualChunks: undefined,
            chunkFileNames: 'assets/[name]-[hash].js',
            entryFileNames: 'assets/[name]-[hash].js',
          },
        },
      },
    });
  },
};

module.exports = config;
