<script lang="ts">
import { ref, Ref, triggerRef, defineComponent, computed ,watch} from "vue";

export default defineComponent({
  setup() {
    let  value = ref("")
    let parseValue:Ref<object|string> = ref({})
    watch(value, (newVal, oldVal) => {
        try{
            parseValue.value =  JSON.parse(newVal)
        }catch(e){
        }
    },{
        immediate:true,
        deep:true
    })
  
    return {
      value: value,
      parseValue:parseValue
    };
  },
});
</script>

<template>
  <n-space vertical>
    <n-grid x-gap="12" :cols="24">
      <n-gi :span="12">
        <n-input
          style="height:50vh"
          :autosize="true"
          clearable   
          v-model:value="value"
          type="textarea"
          placeholder="解析json字符串"
        />
      </n-gi>
      <n-gi :span="12">
        <json-viewer v-model:value="parseValue" copyable sort></json-viewer>
      </n-gi>
    </n-grid>
  </n-space>
</template>

<style scoped></style>
