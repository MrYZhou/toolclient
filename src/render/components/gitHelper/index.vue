<template>
  <n-form ref="formRef" :model="model" :rules="rules" label-placement="left">
    <n-row :gutter="12">
      <n-col :span="12">
        <n-form-item path="age" label="项目路径">
          <n-input v-model:value="model.age" @keydown.enter.prevent />
        </n-form-item>
      </n-col>

      <n-col :span="12">
        <n-form-item path="age" label="输入路径">
          <n-input v-model:value="model.age" @keydown.enter.prevent />
        </n-form-item>
      </n-col>

      <n-col :span="12">
        <n-form-item path="age" label="用户名">
          <n-input v-model:value="model.age" @keydown.enter.prevent />
        </n-form-item>
      </n-col>

      <n-col :span="12">
        <n-form-item path="age" label="日期">
          <n-date-picker v-model:value="range" type="datetimerange" clearable />
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
  age: string | null;
  password: string | null;
  reenteredPassword: string | null;
}

export default defineComponent({
  setup() {
    const formRef = ref<FormInst | null>(null);
    const message = useMessage();
    const modelRef = ref<ModelType>({
      age: null,
      password: null,
      reenteredPassword: null,
    });
    
    const rules: FormRules = {
      age: [
        {
          required: true,
          validator(rule: FormItemRule, value: string) {
            if (!value) {
              return new Error("需要年龄");
            } else if (!/^\d*$/.test(value)) {
              return new Error("年龄应该为整数");
            } else if (Number(value) < 18) {
              return new Error("年龄应该超过十八岁");
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
