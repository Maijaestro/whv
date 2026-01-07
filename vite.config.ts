import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
		vue(), 
		Components({ dirs: ['src/components'], deep: true, dts: true })
	],
  server: { host: true },
  resolve: { alias: { '@': '/src' } },
	css: { preprocessorOptions: { scss: {  additionalData: `@use "src/styles/variables" as *;` } } }
})
