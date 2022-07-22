<template>
  <n-form
    ref="formRef"
    :model="model"
    :rules="rules"
    label-placement="left"
    label-width="auto"
  >
    <n-row :gutter="12">
      <n-col :span="12">
        <n-form-item path="basePath" label="项目路径">
          <n-input v-model:value="model.basePath" @keydown.enter.prevent />
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
        <n-form-item path="outputPath" label="输出路径">
          <n-input v-model:value="model.outputPath" @keydown.enter.prevent />
        </n-form-item>
      </n-col>

      <n-col :span="12">
        <n-form-item path="author" label="用户名">
          <n-input v-model:value="model.author" @keydown.enter.prevent />
        </n-form-item>
      </n-col>

      <n-col :span="12">
        <n-form-item path="commitTime" label="日期">
          <n-date-picker
            v-model:value="model.commitTime"
            type="datetimerange"
            clearable
          />
        </n-form-item>
      </n-col>
      <!-- <n-col :span="12">
        <n-form-item path="gitlog" label="记录值">
          <n-input v-model:value="model.gitlog" @keydown.enter.prevent   type="textarea"/>
        </n-form-item>
      </n-col> -->
    </n-row>

    <n-row :gutter="[0, 24]">
      <n-col :span="24">
        <div style="display: flex; justify-content: flex-end">
          <n-button round type="primary" @click="handleValidateButtonClick">
            生成
          </n-button>
        </div>
      </n-col>
    </n-row>
  </n-form>

  <n-list>
    <n-list-item>
      <n-thing title="文件列表">
        <p v-for="item in data">{{ item.path }}</p>
      </n-thing>
    </n-list-item>
  </n-list>
</template>

<script lang="ts">
import { ComponentInternalInstance, defineComponent, ref } from "vue";
import { FormInst, FormItemRule, useMessage, FormRules } from "naive-ui";
import { ServerOutline } from "@vicons/ionicons5";

interface ModelType {
  basePath: string | null;
  outputPath: string | null;
  author: string | null;
  commitTime: [number, number] | null;
  gitlog: string | null;
}

export default defineComponent({
  setup() {
    const formRef = ref<FormInst | null>(null);
    const message = useMessage();
    let model = reactive<ModelType>({
      // basePath: "E:\\jnpf-web",
      basePath: "C:\\Users\\JNPF\\Desktop\\toolbox",
      outputPath: "C:\\Users\\JNPF\\Desktop\\temp",
      author: null,
      commitTime: null,
      gitlog: "",
    });
    onMounted(() => {
      // 绑定监听
      window.ipcRenderer.handleGitFileComplete("生成");
    });
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
    const fileChange = (payload: Event) => {
      const fu = document.getElementById("file");
      if (fu == null) return;
    };
    const fileInput = (payload: Event) => {
      console.log(payload, "fileInput");
      // const fu = document.getElementById('file')
      //   if (fu == null) return
      //   console.log(payload)
      //   window.aa = fu
      // instance?.model?.imgSavePath = fu.files[0].path
    };
    interface GitLog {
      path: string;
    }
    let data = ref<[GitLog]>();
    // let data = ref([]);
    return {
      data,

      formRef,
      model: model,
      rules,
      range: ref<[number, number]>([Date.now(), Date.now()]),
      fileChange,
      fileInput,
      handleValidateButtonClick(e: MouseEvent) {
        e.preventDefault();
        formRef.value?.validate((errors) => {
          if (!errors) {
            // 调用api
            console.log({
              basePath: model.basePath,
              author: model.author,
              startDate: model.commitTime?.[0],
              endDate: model.commitTime?.[1],
            });
            let time1 = model.commitTime?.[0] as number;
            let time2 = model.commitTime?.[1] as number;
            let startDate = "";
            let endDate = "";
            if (time1) {
              startDate = new Date(time1).toLocaleString().replaceAll("/", "-");
            }
            if (time2) {
              endDate = new Date(time2).toLocaleString().replaceAll("/", "-");
            }

            let res = window.ipcRenderer.sendGitLogSolve({
              basePath: model.basePath,
              author: model.author,
              startDate: startDate,
              endDate: endDate,
              outputPath: model.outputPath,
            }); //同步消息

            data.value = [] as any;
            let filterArr = new Set<string>();
            res.list?.forEach((item: string) => {
              filterArr.add(item);
            });
            filterArr.forEach((item) => {
              data.value?.push({ path: item } as never);
            });
            console.log(data.value);
          } else {
            message.error("验证失败");
          }
        });
      },
    };
  },
});
</script>
<style lang="css">
.directory-input {
  width: 100%;
  position: absolute;
  left: -1px;
  opacity: 0;
}
</style>
