import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    server: {
      port: parseInt(env?.VITE_PORT || "3000"),
    },
    css: {
      postcss: {
        plugins: [tailwindcss()],
      },
    },
  };
});
