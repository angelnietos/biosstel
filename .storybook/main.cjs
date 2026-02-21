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
        alias: {
          '@biosstel/ui': path.resolve(__dirname, '../libs/frontend/ui/src/index.ts'),
          '@biosstel/ui-layout': path.resolve(__dirname, '../libs/frontend/ui-layout/src/index.ts'),
          '@biosstel/shared': path.resolve(__dirname, '../libs/frontend/shared/src/index.ts'),
          '@biosstel/platform': path.resolve(__dirname, './mocks/platform.tsx'),
          '@biosstel/shared-types': path.resolve(__dirname, '../libs/shared-types/src/index.ts'),
          '@biosstel/shell': path.resolve(__dirname, '../libs/frontend/shell/src/index.ts'),
          '@biosstel/auth': path.resolve(__dirname, '../libs/frontend/features/auth/src/index.ts'),
          '@biosstel/usuarios': path.resolve(__dirname, '../libs/frontend/features/usuarios/src/index.ts'),
          '@biosstel/objetivos': path.resolve(__dirname, '../libs/frontend/features/objetivos/src/index.ts'),
          '@biosstel/fichajes': path.resolve(__dirname, '../libs/frontend/features/fichajes/src/index.ts'),
          '@biosstel/alertas': path.resolve(__dirname, '../libs/frontend/features/alertas/src/index.ts'),
          '@biosstel/operaciones': path.resolve(__dirname, '../libs/frontend/features/operaciones/src/index.ts'),
          '@biosstel/empresa': path.resolve(__dirname, '../libs/frontend/features/empresa/src/index.ts'),
          '@biosstel/productos': path.resolve(__dirname, '../libs/frontend/features/productos/src/index.ts'),
          '@biosstel/inventory': path.resolve(__dirname, '../libs/frontend/features/inventory/src/index.ts'),
          '@biosstel/reports': path.resolve(__dirname, '../libs/frontend/features/reports/src/index.ts'),
          'next-intl': path.resolve(__dirname, './mocks/next-intl.ts'),
        },
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
