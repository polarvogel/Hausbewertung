import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/* Setzt relative Pfade. Verhindert 404-Fehler beim Laden von Assets auf GitHub Pages unabhängig vom Repository-Namen. */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './'
});
