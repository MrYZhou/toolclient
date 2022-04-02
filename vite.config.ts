import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // 插件注册
  plugins: [
    vue(),
    Components({
      resolvers: [NaiveUiResolver()]
    })
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
