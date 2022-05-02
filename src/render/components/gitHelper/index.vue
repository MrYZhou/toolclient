<script lang="ts">


export default defineComponent({
  setup() {
    let  value = ref("")
    let parseValue = ref({})
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
  12
</template>

<style scoped></style>
