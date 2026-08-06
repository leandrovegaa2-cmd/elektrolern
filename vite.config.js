import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'ElektroLern',
        short_name: 'ElektroLern',
        description: 'Lernapp für Elektroniker Energie- und Gebäudetechnik: Karteikarten, Quiz, Nachschlagewerk, Prüfungssimulation.',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#05060c',
        theme_color: '#05060c',
        lang: 'de',
        icons: [
          // SVG skaliert scharf für beliebige Größen; PNG-Fallback für Browser/OS,
          // die kein SVG-Icon akzeptieren (u.a. iOS-Homescreen).
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          // Eigenes maskable-Icon mit Sicherheitsrand (voll ausgefüllt, Blitz
          // kleiner), damit Android es nicht in die runde Maske beschneidet.
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
      },
    }),
  ],
  test: {
    environment: 'node',
    globals: true,
  },
})
