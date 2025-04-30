import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      "0b6a-2405-4802-815f-c6f0-49a2-a4c9-d159-94e5.ngrok-free.app",
    ],
  },
});
