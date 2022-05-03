<template>
  <n-form ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="auto">
    <n-row :gutter="12">
      <n-col :span="12">
        <n-form-item path="basePath" label="项目路径">
          <n-input v-model:value="model.basePath" @keydown.enter.prevent/>
          <!-- <n-button>
          选择
          <input
            id="file"
            @change="fileChange"
            @input="fileInput"
            type="file"
            class="directory-input"
            webkitdirectory
            title="可以选择文件夹"
          />
          </n-button> -->
          
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
import { ComponentInternalInstance, defineComponent, ref } from "vue";
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
    let instance: any = null
    onMounted(() => {
       instance = inject('proxy')
    })
    const { proxy } = (getCurrentInstance() as ComponentInternalInstance)
    const rules: FormRules = {
      basePath: [
        {
          required: true,
          validator(rule: FormItemRule, value: string) {
            if (!value) {
              return new Error("需要输入根路径");
            } 
            return true;
          },
          trigger: ["input", "blur"],
        },
      ],
    };
    const fileChange = (payload: Event)=>{
      const fu = document.getElementById('file')
        if (fu == null) return
    }
    const fileInput = (payload: Event)=>{
      console.log(payload,'fileInput');
      // const fu = document.getElementById('file')
      //   if (fu == null) return
      //   console.log(payload)
      //   window.aa = fu
        // instance?.model?.imgSavePath = fu.files[0].path
    }
    return {
      formRef,
      model: modelRef,
      rules,
      range: ref<[number, number]>([Date.now(), Date.now()]),
      fileChange,
      fileInput,
      handleValidateButtonClick(e: MouseEvent) {
        e.preventDefault()
          var data = window.ipcRenderer.sendTest(123)  //同步消息 
            console.log(data) 
        formRef.value?.validate((errors) => {
          if (!errors) {
            // 调用api
           
            var data = window.ipcRenderer.sendTest(123)  //同步消息 
            console.log(data) 
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
<style lang="css">
  .directory-input{
    width: 100%;
    position: absolute;
    left: -1px;
    opacity: 0
  }
</style>
