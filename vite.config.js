import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/front_5th_chapter2-1/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/setupTests.js'
  },
  build: {
    rollupOptions: {
      input: {
        basic: './index.basic.html',
        advanced: './index.advanced.html',
      },
    },
  },
})
