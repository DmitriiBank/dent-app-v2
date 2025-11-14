import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {visualizer} from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  // base: '/react-redux-quiz-dent/',
  plugins: [react(),
    visualizer({
      filename: './stats.html',
      template: 'treemap', // или 'network'
      gzipSize: true,
      brotliSize: true,
      open: true
    })],
  base: "/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material'],
          'mui-icons': ['@mui/icons-material'],
          'mui-data-grid': ['@mui/x-data-grid'],
          redux: ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
          pdf: ['react-pdf'],
        },
      },
    },
  },
})
