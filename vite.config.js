import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// IMPORTANT: change 'job-recruiter' below to your actual GitHub repo name.
// GitHub Pages serves project sites at https://<username>.github.io/<repo-name>/,
// so Vite needs that same path as its base for built asset URLs to resolve.
const REPO_NAME = 'job-recruiter'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? `/${REPO_NAME}/` : '/',
  server: {
    open: true,
  },
  preview: {
    open: true,
  },
}))
