import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 关键：把 base 改成你的仓库名，前后都要有斜杠
  base: '/couple-love-station/',
  server: {
    port: 3000
  }
})
