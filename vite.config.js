/*
 * @Date: 2024-05-08 15:06:42
 * @Author: guojiecheng
 * @LastEditTime: 2025-11-26 10:39:43
 * @LastEditors: guojiecheng
 */
import { defineConfig } from 'vite'
import { resolve } from 'path'
import uni from '@dcloudio/vite-plugin-uni'
import tailwindcss from "tailwindcss";
import uniTailwind from '@uni-helper/vite-plugin-uni-tailwind';
import vueJsx from '@vitejs/plugin-vue-jsx'
// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     uni(),
//     uniTailwind(),
//     vueJsx()
//   ],
//   resolve: {
//     alias: {
//       '@': resolve(__dirname, 'src') // 设置 `@` 指向 `src` 目录
//     }
//   },
//   css: {
//     postcss: {
//       plugins: [tailwindcss()],
//     }
//   }
// })

export default defineConfig(async () => {
  // 动态导入 vueJsx
  const { default: vueJsx } = await import('@vitejs/plugin-vue-jsx');
  return {
    optimizeDeps: {
      include: ['@vitejs/plugin-vue-jsx']
    },
    plugins: [
      uni(),
      uniTailwind(),
      vueJsx(),
      // commonjs(),
      requireTransform({
        fileRegex: /.js$|.vue$/,
      }),
    ],
    define: {
      // 如果你需要确保 Cordova 对象全局可用
      // 'window.cordova': 'cordova',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src') // 设置 `@` 指向 `src` 目录
      }
    },
    css: {
      postcss: {
        plugins: [
          require("tailwindcss")({
            // 注意此处，手动传入你 `tailwind.config.js` 的绝对路径
            config: path.resolve(__dirname, "./tailwind.config.js"),
          }),
          require("autoprefixer"),
        ],
      },
    },
  }
})