<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme="theme">
  <n-layout>
      <n-layout-header>
          <n-switch v-model:value="collapsed" size="large" @update:value="change">
            <template #checked-icon>
              <n-icon :component="Sunny" color="rgba(227, 192, 36, 1)"/>
            </template>
            <template #unchecked-icon>
              <n-icon :component="CloudyNight" />
            </template>
          </n-switch>
      </n-layout-header>
      </n-layout>
   <n-message-provider>
      <router-view></router-view>
    </n-message-provider>
  </n-config-provider>
</template>

<script lang="ts">
  import { defineComponent, Ref } from 'vue'
  import { NConfigProvider } from 'naive-ui'
  import { zhCN, dateZhCN } from 'naive-ui'
import { darkTheme } from 'naive-ui'
import { BuiltInGlobalTheme } from 'naive-ui/lib/themes/interface'

import { Sunny,CloudyNight } from '@vicons/ionicons5'


  export default defineComponent({
    components: {
      NConfigProvider,
      Sunny,
      CloudyNight
    },  
    setup() {
      let theme:Ref<null|BuiltInGlobalTheme> = ref(null)
      const change = (val:boolean) =>{
        theme.value = val ? null:darkTheme
      }
      return {
        zhCN,
        dateZhCN,
        darkTheme,
        collapsed:ref(true),
        change:change,
        theme,
        Sunny,
        CloudyNight,
      }
    }
  })
</script>