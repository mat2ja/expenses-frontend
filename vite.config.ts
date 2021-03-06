import Vue from '@vitejs/plugin-vue'
import path from 'path'
import { presetAttributify, presetUno } from 'unocss'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import ViteFonts from 'vite-plugin-fonts'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  envDir: '.',
  optimizeDeps: {
    exclude: ['vue-demi'],
  },
  plugins: [
    Vue(),
    tsconfigPaths({
      root: '.',
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue'],
    }),
    Pages({
      extendRoute(route) {
        if (route.path === '/login' || route.path === '/register') {
          return route
        }

        const meta = { auth: true, admin: false }

        if (route.path.includes('/admin')) {
          meta.admin = true
        }

        return {
          ...route,
          meta,
        }
      },
    }),
    Layouts(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        'pinia',
        {
          '@vueuse/core': ['get', 'set'],
        },
      ],
      resolvers: [ElementPlusResolver()],
      dts: true,
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: true,
    }),
    Unocss({
      shortcuts: [],
      presets: [presetUno(), presetAttributify()],
      theme: {
        fontFamily: {
          mono: ['Space Mono', 'monospace'],
        },
      },
    }),
    ViteFonts({
      google: {
        families: ['Space Mono'],
      },
    }),
  ],
})
