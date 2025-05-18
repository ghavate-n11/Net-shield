import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // If you're deploying to a subpath, set the base
  base: '/',
});
