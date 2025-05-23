import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';

// Copy FFmpeg files to public directory
const ffmpegDir = path.join(process.cwd(), 'public', 'ffmpeg');
if (!fs.existsSync(ffmpegDir)) {
  fs.mkdirSync(ffmpegDir, { recursive: true });
}

const ffmpegFiles = [
  ['@ffmpeg/core/dist/ffmpeg-core.js', 'ffmpeg-core.js'],
  ['@ffmpeg/core/dist/ffmpeg-core.wasm', 'ffmpeg-core.wasm'],
  ['@ffmpeg/core/dist/ffmpeg-core.worker.js', 'ffmpeg-core.worker.js']
];

for (const [src, dest] of ffmpegFiles) {
  try {
    const srcPath = path.join(process.cwd(), 'node_modules', src);
    const destPath = path.join(ffmpegDir, dest);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${src} to ${dest}`);
    }
  } catch (error) {
    console.error(`Error copying FFmpeg file ${src}:`, error);
  }
}

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 443
    },
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Resource-Policy': 'same-site'
    }
  },
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util']
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    },
    sourcemap: true,
    ssrManifest: true,
    manifest: true
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Resource-Policy': 'same-site'
    }
  }
});