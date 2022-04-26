<template>
  <n-space vertical>
    <!-- <n-switch v-model:value="collapsed" /> -->
    <n-layout has-sider  >
      <n-layout-sider
      embedded 
      content-style="padding: 24px;"
      style="height:100vh"
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <n-menu
          accordion
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
          :render-label="renderMenuLabel"
          :render-icon="renderMenuIcon"
          :expand-icon="expandIcon"
          @update:value="handleUpdateValue"
        />
      </n-layout-sider>
      <n-layout content-style="padding: 24px;">
        <component :is="componentName"></component>
      </n-layout>
    </n-layout>
  </n-space>
</template>

<script lang="ts">
import { h, ref, defineComponent, Component } from "vue";
import type { DefineComponent } from "vue";
import { NIcon, useMessage } from "naive-ui";
import type { MenuOption } from "naive-ui";
import { BookOutline as BookIcon, CaretDownOutline } from "@vicons/ionicons5";
import jsonParser from "@/render/components/json-parse/index.vue";
import { useRouter } from "vue-router";
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types

const menuOptions: MenuOption[] = [
  {
    label: "且听风吟",
    key: "hear-the-wind-sing",
    href: "https://baike.baidu.com/item/%E4%B8%94%E5%90%AC%E9%A3%8E%E5%90%9F/3199",
  },
  {
    label: "json解析器",
    key: "jsonParser",
  },
  {
    label: "舞，舞，舞",
    key: "dance-dance-dance",
    children: [
      {
        type: "group",
        label: "人物",
        key: "people",
        children: [
          {
            label: "叙事者",
            key: "narrator",
          },
          {
            label: "羊男",
            key: "sheep-man",
          },
        ],
      },
      {
        label: "饮品",
        key: "beverage",
        children: [
          {
            label: "威士忌",
            key: "whisky",
            href: "https://baike.baidu.com/item/%E5%A8%81%E5%A3%AB%E5%BF%8C%E9%85%92/2959816?fromtitle=%E5%A8%81%E5%A3%AB%E5%BF%8C&fromid=573&fr=aladdin",
          },
        ],
      },
      {
        label: "食物",
        key: "food",
        children: [
          {
            label: "三明治",
            key: "sandwich",
          },
        ],
      },
      {
        label: "过去增多，未来减少",
        key: "the-past-increases-the-future-recedes",
      },
    ],
  },
];

export default defineComponent({
  components: {
    jsonParser,
  },
  setup() {
    const message = useMessage();
    let componentName = ref("jsonParse");
    const router = useRouter();
    return {
      componentName: componentName,
      collapsed: ref(false),
      menuOptions,
      handleUpdateValue(key: string, item: MenuOption) {
        componentName.value = key
        // message.info("[onUpdate:value]: " + JSON.stringify(key));
        // message.info("[onUpdate:value]: " + JSON.stringify(item));
      },
      renderMenuLabel(option: MenuOption) {
        if ("href" in option) {
          return h(
            "a",
            { href: option.href, target: "_blank" },
            option.label as string
          );
        }
        return option.label as string;
      },
      renderMenuIcon(option: MenuOption) {
        // 渲染图标占位符以保持缩进
        if (option.key === "sheep-man") return true;
        // 返回 falsy 值，不再渲染图标及占位符
        if (option.key === "food") return null;
        return h(NIcon, null, { default: () => h(BookIcon) });
      },
      // 默认展开
      // defaultExpandedKeys: ['fish', 'braise'],
      expandIcon() {
        return h(NIcon, null, { default: () => h(CaretDownOutline) });
      },
    };
  },
});
</script>
