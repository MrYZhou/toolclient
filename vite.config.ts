import { defineConfig } from 'vite'

import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'

import vue from '@vitejs/plugin-vue'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

import { resolve } from 'path'



// https://vitejs.dev/config/
export default defineConfig({
  // 插件注册
  plugins: [
    vue(),
    Components({
      resolvers: [NaiveUiResolver()], // naive ui 导入
      dts: './src/render/components.d.ts',
      // imports 指定组件所在位置，默认为 src/components
      dirs: ['src/render/components/'],
    }),
    AutoImport({
      dts: './src/render/auto-imports.d.ts',
      imports: ['vue', 'pinia', 'vue-router'],
      // Generate corresponding .eslintrc-auto-import.json file.
      // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
      // eslintrc: {
      //   enabled: true, // Default `false`
      //   filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
      //   globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      // },
    }),
  ],
  // 基础访问路径
  base:'./',
  // 路径别名
  resolve:{
		alias:{
			'@':resolve(__dirname,'src')
		}
	}
})
