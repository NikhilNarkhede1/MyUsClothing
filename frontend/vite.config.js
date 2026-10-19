import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Any request starting with /api is forwarded to the Spring Boot backend.
// This way the browser thinks everything comes from one place (no CORS problems).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
});
