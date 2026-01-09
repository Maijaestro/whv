import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [
    vue(),
    Components({ dirs: ["src/components"], deep: true, dts: true }),
  ],
  server: { host: true },
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  css: {
    preprocessorOptions: {
      scss: { additionalData: `@use "src/styles/variables" as *;` },
    },
  },
});
