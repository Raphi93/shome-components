import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Vite config — used exclusively by Storybook.
 * The library build itself uses Rollup (rollup.config.js).
 */
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      // Mock Next.js modules so components that import from next/* work in Storybook
      'next/link':       path.resolve(__dirname, '.storybook/mocks/next-link.tsx'),
      'next/navigation': path.resolve(__dirname, '.storybook/mocks/next-navigation.ts'),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
});
