
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";  // Using standard react plugin
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "../attached_assets"),
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
  build: {
    sourcemap: mode === 'development',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react', 'framer-motion'],
  },
}));
