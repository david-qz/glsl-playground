import { defineConfig } from 'vite';
import compress from 'vite-plugin-compression';

export default defineConfig({
  root: './client',
  server: {
    port: 7891,
    strictPort: true,
    proxy: {
      '/api/v1': {
        target: 'http://localhost:7890',
        changeOrigin: true,
        rewrite: (path) =>  path.replace(/^\/api\/v1/, ''),
      },
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  build: {
    outDir: '../public',
    emptyOutDir: true,
  },
  plugins: [
    compress({
      filter: /\.(js|css|html|obj)$/i,
      algorithm: 'gzip',
    }),
    compress({
      filter: /\.(js|css|html|obj)$/i,
      algorithm: 'brotliCompress',
    }),
  ],
});
