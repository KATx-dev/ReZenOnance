import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/player/',
  build: {
    outDir: '../public/player',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      '/search': 'http://127.0.0.1:3000',
      '/stream': 'http://127.0.0.1:3000',
      '/api': 'http://127.0.0.1:3000',
      '/p': 'http://127.0.0.1:3000',
    },
  },
});
