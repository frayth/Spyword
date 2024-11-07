<template>
  <div class="py-2 bg-transparent w-full position-relative h-80px">
    <input :type class="w-full h-40px px-10px b-rounded-md outline-none color-black" :placeholder v-model="model" :disabled="lock"/>
    <div v-if="error.length" class="position-absolute left-2 font-size-3 animate-bounce-in color-red-500 sm:()">
      <p>{{error}}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  placeholder: { type: String, required: true },
  type: { type: String, default: 'text' },
  error: { type: String, default: '' },
  lock: { type: Boolean, default: true },
})
const model=defineModel()
</script>

<style scoped>

</style>