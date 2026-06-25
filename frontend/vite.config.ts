import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
// Tailwind v4 entra como plugin do Vite (sem postcss, sem tailwind.config.js).
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
