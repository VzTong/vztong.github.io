import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for the portfolio project
// Supports both Cloudflare Pages (root '/') and GitHub Pages ('/portfolio/')
export default defineConfig({
  plugins: [react()],
  base: process.env.CF_PAGES ? '/' : '/portfolio/',
})

