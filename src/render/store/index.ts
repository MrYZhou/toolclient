import { defineStore } from "pinia";
import { Names } from "./namaspace";

export const useTestStore = defineStore(Names.APP, {
  // 属性定义
  state: () => {
    return {
      current: 1,
    };
  },
  // 获取值
  getters: {},
  // 请求操作
  actions: {},
});
