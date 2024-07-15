import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Enable custom API proxy
    proxy: {
      // Match any request starting with /custom/api
      "/custom/api": {
        // Target API endpoint
        target: "http://localhost:5064",  // Change to your API endpoint 
        // Change origin to avoid CORS issues
        changeOrigin: true,
        // Rewrite path to remove /custom/api
        rewrite: (path) => path.replace(/^\/custom\/api/, ""),
      },
    },
  },
});
