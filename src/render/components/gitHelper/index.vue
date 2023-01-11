<template>
  <n-form
    ref="formRef"
    :model="model"
    :rules="rules"
    label-placement="left"
    label-width="auto"
  >
    <n-row :gutter="12">
      <!-- <n-col :span="24">
        <n-form-item path="basePath" label="excel1">
          <n-upload
            multiple
            directory-dnd
            action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
            :max="5"
          >
            <n-upload-dragger>
              <div style="margin-bottom: 12px">
                <n-icon size="40">
                  <CloudUploadOutline></CloudUploadOutline>
                </n-icon>
              </div>
              <n-text style="font-size: 16px">
                点击或者拖动文件到该区域来上传
              </n-text>
              <n-p depth="3" style="margin: 8px 0 0 0">
                请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
              </n-p>
            </n-upload-dragger>
          </n-upload>
        </n-form-item>
      </n-col> -->

      <n-col :span="24">
        <n-form-item path="outputPath2" label="excel">
          <n-upload
            multiple
            directory-dnd
            action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
            :max="2"
            :custom-request="customRequest"
          >
            <n-upload-dragger>
              <div style="margin-bottom: 12px">
                <n-icon size="40">
                  <CloudUploadOutline></CloudUploadOutline>
                </n-icon>
              </div>
              <n-text style="font-size: 16px">
                点击或者拖动文件到该区域来上传
              </n-text>
              <n-p depth="3" style="margin: 8px 0 0 0">
                请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
              </n-p>
            </n-upload-dragger>
          </n-upload>
        </n-form-item>
      </n-col>
      <n-col :span="12">
        <n-form-item path="outputPath" label="基于id">
          <n-input
            v-model:value="model.lie1"
            placeholder="选择列号"
          ></n-input>
        </n-form-item>
      </n-col>
      <n-col :span="12">
        <n-form-item path="outputPath" label="计算价格">
          <n-input
            v-model:value="model.lie2"
            placeholder="选择列号"
          ></n-input>
        </n-form-item>
      </n-col>
      <!-- <n-col :span="24">
        <n-form-item path="outputPath" label="输出目录">
            <n-upload
              directory
              :max="1"
              directory-dnd
              abstract
              default-upload
              :custom-request="customRequest2"
            ><n-input
                  v-model:value="model.outputPath"
                  placeholder="默认保存在桌面"
                ></n-input
              >
            </n-upload>
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

  <!-- <n-list>
    <n-list-item>
      <n-thing title="文件列表">
        <p v-for="item in data">{{ item.path }}</p>
      </n-thing>
    </n-list-item>
  </n-list> -->
</template>

<script lang="ts">
import { ComponentInternalInstance, defineComponent, ref } from "vue"
import {
  FormInst,
  FormItemRule,
  useMessage,
  FormRules,
  NButton,
  NCol,
  NForm,
  NFormItem,
  NIcon,
  NList,
  NListItem,
  NP,
  NRow,
  NText,
  NThing,
  NUpload,
  NUploadDragger,
  UploadCustomRequestOptions,
} from "naive-ui"
import { CloudUploadOutline } from "@vicons/ionicons5"
interface ModelType {
  basePath: string | null
  outputPath: string | null
  lie1:number | null,
  lie2:number | null,
}

export default defineComponent({
  components: {
    CloudUploadOutline,
  },
  setup() {
    const formRef = ref<FormInst | null>(null)
    const message = useMessage()

    let model = reactive<ModelType>({
      // basePath: "E:\\jnpf-web",
      basePath: "C:\\Users\\JNPF\\Desktop\\toolbox",
      outputPath: "",
      lie1:0,
      lie2:0,
    })
    onMounted(() => {
      // 绑定监听
      window?.ipcRenderer?.handleGitFileComplete("生成")
    })
    const rules: FormRules = {
      basePath: [
        {
          required: true,
          validator(rule: FormItemRule, value: string) {
            if (!value) {
              return new Error("需要输入根路径")
            }
            return true
          },
          trigger: ["input", "blur"],
        },
      ],
    }
    const fileChange = (payload: Event) => {
      const fu = document.getElementById("file")
      if (fu == null) return
    }
    const fileInput = (payload: Event) => {
      console.log(payload, "fileInput")
      // const fu = document.getElementById('file')
      //   if (fu == null) return
      //   console.log(payload)
      //   window.aa = fu
      // instance?.model?.imgSavePath = fu.files[0].path
    }
    interface GitLog {
      path: string
    }
    let data = ref<[GitLog]>()
    let file1 = new Set()
    const customRequest = ({
      file: { file },
      data,
      headers,
      withCredentials,
      action,
      onFinish,
      onError,
      onProgress,
    }: UploadCustomRequestOptions) => {
      console.log(file)
      // file1 = file?.path as any
      file1.add(file?.path)
    }

    const customRequest2 = ({
      file,
      data,
      headers,
      withCredentials,
      action,
      onFinish,
      onError,
      onProgress,
    }: UploadCustomRequestOptions) => {
      console.log(file, data, headers, 34)
    }
    return {
      data,
      customRequest,
      customRequest2,
      formRef,
      model: model,
      rules,
      range: ref<[number, number]>([Date.now(), Date.now()]),
      fileChange,
      fileInput,
      handleValidateButtonClick(e: MouseEvent) {
        e.preventDefault()
        formRef.value?.validate((errors) => {
          if (!errors) {
            // 调用api
            console.log(file1)
            let fileInfo  ={
              file:file1,
              lie1:model.lie1,
              lie2:model.lie2,
            }
            fileInfo.file = ["D:\\Users\\JNPF\\Desktop\\1.xlsx"] as any
            fileInfo.lie1 =fileInfo.lie1? fileInfo.lie1 -1:0
            fileInfo.lie2 =fileInfo.lie2? fileInfo.lie2-1:0
            let res = window.ipcRenderer.excelHandle(fileInfo)
          } else {
            message.error("验证失败")
          }
        })
      },
    }
  },
})
</script>
<style lang="css">
.directory-input {
  width: 100%;
  position: absolute;
  left: -1px;
  opacity: 0;
}
</style>
