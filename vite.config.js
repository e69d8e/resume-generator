import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'pdf-vendor': ['html2canvas', 'jspdf'],
          'react-vendor': ['react', 'react-dom', 'lucide-react']
        }
      }
    }
  },
  test: {
    environment: 'happy-dom',
    globals: true
  }
});
