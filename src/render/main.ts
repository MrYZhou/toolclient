import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from './router'

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

// ui组件
app.use(naive)
// 注册路由
app.use(router)
app.mount("#app");
