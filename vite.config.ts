import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/auth-api': {
        target: 'http://91.220.155.234:8080/FrontTestingService-auth',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth-api/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxying request:', req.method, req.url)
          })
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Proxying response:', proxyRes.statusCode)
          })
        }
      },
      '/api': {
        target: 'http://91.220.155.234:8080/FrontTestingService-back',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxying API request:', req.method, req.url)
          })
        }
      }
    }
  }
})