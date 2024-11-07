import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Unocss from 'unocss/vite'
// import { presetAttributify, presetUno } from 'unocss'
// https://vite.dev/config/
export default defineConfig({
  server:{
    host:true,
    hmr:{
      overlay:false
    }
  },
  plugins: [
    vue(),
    vueDevTools(),
    Unocss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})