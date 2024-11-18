import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

export default defineConfig({
  plugins: [
    react(),
    monacoEditorPlugin.default({
      languages: ['javascript', 'typescript', 'json'],
      features: ['!gotoSymbol'],
    }),
  ],
});
