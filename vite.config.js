import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Gamanext Office',
        short_name: 'Gamanext',
        description: 'Manage your work, time, and team effortlessly with Gamanext Employee Solutions.',
        theme_color: '#005ae2',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'gamanext-fav.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'gamanext-fav.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'gamanext-fav.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
})
