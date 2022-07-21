<template>
  <n-config-provider
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="theme"
    id="box"
  >
    <n-layout class="drag-part">
      <n-icon :size="19" style="float: left" color="#0e7a0d">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 207.74 252.58">
          <defs></defs>
          <g id="Layer_2" data-name="Layer 2">
            <g id="Layer_1-2" data-name="Layer 1">
              <path
                class="cls-1"
                d="M60.37,205.2c0,2.5,0,5,.05,7.5,0,.54,0,1.07-.05,1.58Z"
              />
              <path
                class="cls-1"
                d="M147.29,37.68v85.2c-.06-27.24-.19-54.49-.22-81.73A29,29,0,0,1,147.29,37.68Z"
              />
              <path
                class="cls-2"
                d="M147.06,125.43a16.9,16.9,0,0,0,.23-2.55v79.66l-41.74-38.17-21-19.15L71.91,133.6l-5.62-5.13-2.07-1.89-.15-.13c-.51-.41-1-.84-1.47-1.23s-.88-.73-1.44-.56a1.25,1.25,0,0,0-.79.9v-75l.43.39,8.57,7.75c4.51,4,9.06,8,13.56,12Q92.53,79.3,102.07,88q7.55,6.86,15.08,13.74c6,5.47,11.92,11,17.92,16.43,2.7,2.44,5.42,4.83,8.15,7.23.58.51,1.15,1,1.74,1.52a1.47,1.47,0,0,0,1.4.18,1.16,1.16,0,0,0,.56-.72C147,126,147,125.74,147.06,125.43Z"
              />
              <path
                class="cls-3"
                d="M60.28,126a15.67,15.67,0,0,0-.1,2.74c0,25.5,0,51,.19,76.49v9.08a14.85,14.85,0,0,1-5.87,11.09c-6.81,5.69-13.16,11.91-19.73,17.89-2.75,2.5-5.48,5-8.31,7.44s-10.11,2.74-14.14-.63a78.48,78.48,0,0,1-8.54-8.66,12.76,12.76,0,0,1-3.73-8.69c0-.72-.06-1.51,0-2.38,0-1.5,0-3,.05-4.51.05-4.3,0-8.61,0-12.91V72.71a12.64,12.64,0,0,1,.38-3.18,18.42,18.42,0,0,1,1-2.64A22.16,22.16,0,0,1,3.5,63.31l16-16L29.69,37.13a7.84,7.84,0,0,1,1.84-1.38,8.05,8.05,0,0,1,3.21-1h0a13.85,13.85,0,0,1,9.71,1.79h0a13.59,13.59,0,0,1,2.09,1.57L60.37,50.53v75A3.38,3.38,0,0,0,60.28,126Z"
              />
              <path
                class="cls-4"
                d="M60.28,126a3.38,3.38,0,0,1,.09-.41V205.2c-.15-25.5-.14-51-.19-76.49A15.67,15.67,0,0,1,60.28,126Z"
              />
              <path
                class="cls-3"
                d="M205.59,187.21l-29.39,27a3.75,3.75,0,0,1-.36.24l-.11.08-.2.12A14,14,0,0,1,158.77,213L157,211.45l-9.75-8.91V37.68c.16-1.39.4-2.78.67-4.14.7-3.55,3.82-5.31,6.2-7.53,5.17-4.8,10.5-9.42,15.77-14.12,3.63-3.24,7.25-6.49,10.91-9.71,3.19-2.81,9.37-2.67,12.37-.93a10.11,10.11,0,0,1,2.08,1.61l3.38,3.26,2.73,2.61,2.49,2.41a11.45,11.45,0,0,1,1.78,2.09,11.73,11.73,0,0,1,1.7,6.46c-.05,14.66.06,29.32.09,44q.09,37.35.16,74.7,0,19.14.07,38.27c0,.59,0,1.17,0,1.75C207.8,182.21,207.72,184.72,205.59,187.21Z"
              />
            </g>
          </g>
        </svg>
      </n-icon>
      <n-icon :size="19" @click="min">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 1024 1024"
        >
          <path
            d="M872 474H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"
            fill="currentColor"
          ></path>
        </svg>
      </n-icon>

      <n-icon :size="19" @click="max">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 16 16"
        >
          <g fill="none">
            <path
              d="M4.5 3A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 11.5 3h-7zm0 1h7a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5z"
              fill="currentColor"
            ></path>
          </g>
        </svg>
      </n-icon>
      <n-icon :size="20" @click="close">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 512 512"
        >
          <path
            d="M289.94 256l95-95A24 24 0 0 0 351 127l-95 95l-95-95a24 24 0 0 0-34 34l95 95l-95 95a24 24 0 1 0 34 34l95-95l95 95a24 24 0 0 0 34-34z"
            fill="currentColor"
          ></path>
        </svg>
      </n-icon>
    </n-layout>

    <n-layout id="body">
      <n-layout-header
        ><n-switch
          v-model:value="collapsed"
          size="large"
          @update:value="change"
        >
          <template #checked-icon>
            <n-icon :component="Sunny" color="rgba(227, 192, 36, 1)" />
          </template>
          <template #unchecked-icon>
            <n-icon :component="CloudyNight" />
          </template>
        </n-switch>
      </n-layout-header>
      <n-layout class="main-content">
        <n-message-provider>
          <router-view></router-view>
        </n-message-provider>
      </n-layout>
    </n-layout>
  </n-config-provider>
</template>

<script lang="ts">
import { defineComponent, Ref } from "vue";
import { NConfigProvider } from "naive-ui";
import { zhCN, dateZhCN } from "naive-ui";
import { darkTheme } from "naive-ui";
import { BuiltInGlobalTheme } from "naive-ui/lib/themes/interface";

import { Sunny, CloudyNight } from "@vicons/ionicons5";

export default defineComponent({
  components: {
    NConfigProvider,
    Sunny,
    CloudyNight,
  },
  setup() {
    let theme: Ref<null | BuiltInGlobalTheme> = ref(null);
    const change = (val: boolean) => {
      theme.value = val ? null : darkTheme;
    };
    const min = () => {
      console.log("min");
      window.ipcRenderer.windowHan("min");
    };
    const max = () => {
      window.ipcRenderer.windowHan("max");
    };
    const close = () => {
      window.ipcRenderer.windowHan("close");
    };
    return {
      zhCN,
      dateZhCN,
      darkTheme,
      collapsed: ref(true),
      change: change,
      close: close,
      min,
      max,
      theme,
      Sunny,
      CloudyNight,
    };
  },
});
</script>
<style scoped>
#box {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  padding-bottom: 20px;
  /* line-height: 30px; */
  /* text-align: center; */
}
#box::-webkit-scrollbar {
  display: none;
}
.drag-part {
  position: absolute;
  /* float: right; */
  text-align: right;
  padding: 10px 10px 0 0;
  /* z-index: 99; */
  top: 0px;
  width: 100%;
  /* 高度自行调整 */
  height: 36px;
  /* line-height: 36px; */
  overflow: hidden;
  /* 拖拽 */
  -webkit-app-region: drag;
}
.drag-part .n-icon {
  margin: 0 5px;
  -webkit-app-region: no-drag;
}
#body {
  position: absolute;
  /* z-index: 9990; */
  width: 100%;
  top: 36px;
  /* border: 1px solid red; */
}
.main-content {
  z-index: 99;
  height: 100%;
}
</style>
