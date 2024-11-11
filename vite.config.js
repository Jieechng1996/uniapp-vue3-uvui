/*
 * @Date: 2024-05-08 15:06:42
 * @Author: guojiecheng
 * @LastEditTime: 2024-11-11 11:07:26
 * @LastEditors: guojiecheng
 */
import { defineConfig } from 'vite'
import { resolve } from 'path'
import uni from '@dcloudio/vite-plugin-uni'
import tailwindcss from "tailwindcss";
import uniTailwind from '@uni-helper/vite-plugin-uni-tailwind';
import vueJsx from '@vitejs/plugin-vue-jsx'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    uniTailwind(),
    vueJsx()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src') // 设置 `@` 指向 `src` 目录
    }
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
    preprocessorOptions: {
      scss: {
        additionalData: '@use "./src/styles/xxx.scss" as *;',
      }
    }
  }
})
