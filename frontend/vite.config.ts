import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    // Proper chunking for caching — do NOT use viteSingleFile in production
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        // Split large vendor chunks for better caching
        manualChunks: {
          "vendor-react":   ["react", "react-dom"],
          "vendor-supabase": ["@supabase/supabase-js"],
          "vendor-paypal":  ["@paypal/react-paypal-js"],
        },
      },
    },
    // Warn if any chunk exceeds 1MB
    chunkSizeWarningLimit: 1000,
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    allowedHosts: [
      "localhost",
      ".preview.emergentcf.cloud",
      ".preview.emergentagent.com",
      ".emergent.host",
      "islandfruitguide.com",
      "www.islandfruitguide.com",
    ],
    hmr: { clientPort: 443 },
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
  },
});

