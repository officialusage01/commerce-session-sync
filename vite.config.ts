import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      clientPort: 8080,
      path: 'ws',
      timeout: 120000,
      overlay: true,
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "crypto": "crypto-browserify"
    },
  },
  build: {
    sourcemap: mode === 'development',
  },
  optimizeDeps: {
    exclude: ['lovable-tagger'],
    include: ['react', 'react-dom', 'lucide-react'],
  },
}));