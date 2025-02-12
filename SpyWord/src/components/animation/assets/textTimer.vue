<template>
  <p>{{valueToShow}}</p>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
const event=ref< number >(0)
const index=ref(0)

onMounted(() => {
  event.value = setInterval(() => {
    index.value++
  }, Math.floor(props.timer/props.value.length));
});
onUnmounted(() => {
  clearInterval(event.value)
})

watch(index,()=>{
  if(index.value>=props.value.length){
    clearInterval(event.value)
  }
})
const valueToShow=computed(()=>props.value.slice(0,index.value))
const props=defineProps({
  value:{
    type:String,
    required:true
  },
  timer:{
    type:Number,
    default:1000
  }
})

</script>

<style scoped>

</style>