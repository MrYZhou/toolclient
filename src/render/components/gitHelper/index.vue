<template>
  <n-form ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="auto">
    <n-row :gutter="12">
      <n-col :span="12">
        <n-form-item path="basePath" label="项目路径">
          <n-input v-model:value="model.basePath" @keydown.enter.prevent />
        </n-form-item>
      </n-col>

      <n-col :span="12">
        <n-form-item path="outputPath" label="输出路径" >
          <n-input v-model:value="model.outputPath" @keydown.enter.prevent />
        </n-form-item>
      </n-col>

      <n-col :span="12">
        <n-form-item path="author" label="用户名" >
          <n-input v-model:value="model.author" @keydown.enter.prevent />
        </n-form-item>
      </n-col>

      <n-col :span="12">
        <n-form-item path="commitTime" label="日期" >
          <n-date-picker v-model:value="model.commitTime" type="datetimerange" clearable />
        </n-form-item>
      </n-col>
    </n-row>

    <n-row :gutter="[0, 24]">
      <n-col :span="24">
        <div style="display: flex; justify-content: flex-end">
          <n-button
            round
            type="primary"
            @click="handleValidateButtonClick"
          >
            生成
          </n-button>
        </div>
      </n-col>
    </n-row>
  </n-form>

</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {
  FormInst,
  FormItemInst,
  FormItemRule,
  useMessage,
  FormRules,
} from "naive-ui";

interface ModelType {
  basePath: string | null;
  outputPath: string | null;
  author: string | null;
  commitTime: [number, number] | null;
}

export default defineComponent({
  setup() {
    const formRef = ref<FormInst | null>(null);
    const message = useMessage();
    const modelRef = ref<ModelType>({
      basePath: null,
      outputPath: null,
      author:null,
      commitTime: null,
    });
    
    const rules: FormRules = {
      basePath: [
        {
          required: true,
          validator(rule: FormItemRule, value: string) {
            console.log(value)
            if (!value) {
              return new Error("需要输入根路径");
            } 
            return true;
          },
          trigger: ["input", "blur"],
        },
      ],
    };
    return {
      formRef,
      model: modelRef,
      rules,
      range: ref<[number, number]>([Date.now(), Date.now()]),
      handleValidateButtonClick(e: MouseEvent) {
        e.preventDefault();
        formRef.value?.validate((errors) => {
          if (!errors) {
            // 调用api
            

          } else {
            console.log(errors);
            message.error("验证失败");
          }
        });
      },
    };
  },
});
</script>
