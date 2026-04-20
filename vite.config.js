import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/', // 👈 只留这个，绝对正确！
  server: {
    port: 3000
  }
})
