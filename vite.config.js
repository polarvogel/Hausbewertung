import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/* Die Eigenschaft 'base' ist für GitHub Pages zwingend erforderlich, damit relative Pfade korrekt aufgelöst werden. */
/* WICHTIG: Ersetze 'DEIN-REPO-NAME' durch den exakten Namen deines GitHub Repositories. */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/DEIN-REPO-NAME/'
});
