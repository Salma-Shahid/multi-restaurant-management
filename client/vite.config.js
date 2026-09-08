import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // <--- Naya plugin import karein

// https://vite.dev
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <--- Naya plugin yahan add karein
  ],
});
