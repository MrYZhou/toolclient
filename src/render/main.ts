import { ComponentInternalInstance, createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from './router'
import Panel from './components/json-parse/index.vue'

import JsonViewer from 'vue-json-viewer'
import 'virtual:windi.css'

import * as config from './config'

import {
  // create naive ui
  create,
  // component
  NButton,
} from "naive-ui";

const naive = create({
  components: [NButton],
});

let app = createApp(App);

// 注册存储
const store = createPinia();
app.use(store);

// Import JsonViewer as a Vue.js plugin
app.use(JsonViewer)
// ui组件
app.use(naive)
// 注册路由
app.use(router)
// 挂载全局组件
app.component('Panel',Panel)

// 提供全局对象
app.provide('app',config)

// 渲染页面
app.mount("#app");
