import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repoBasePath = "/emogenius/";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === "production" ? repoBasePath : "/"
}));
