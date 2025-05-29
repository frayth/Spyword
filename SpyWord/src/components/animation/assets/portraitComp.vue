<template>
  <div class="w-full h-full relative">
    <div v-if="target" class="absolute top-0 right-0px z-11 w-full h-full flex items-center justify-center px-1 ">
      <div class="bg-red-600/80 text-white w-full font-bold text-3 px-1 py-0 rounded-full shadow-lg border-2 border-red-800 tracking-wide text-center lg:(text-sm py-1)">
          Cible
      </div>
    </div>
    <div v-if="eliminated" class="absolute top-0 right-6px z-10 w-full h-full">
      <img src="/img/crossRed.png" alt="">
    </div>
   <div v-if="selected" class=" border-red border-2 rounded-full absolute w-full h-full bg-red-500/20 "></div>
    <img
      :src="`${urlApi}${url}`"
      :class="{
      'h-full object-cover':true,
      'filter grayscale':eliminated,
    }"
      alt=""
    />
     
  </div>
</template>

<script setup lang="ts">
defineProps({
  url: {
    type: String,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  target: {
    type: Boolean,
    default: false,
  },
  eliminated: {
    type: Boolean,
    default: false,
  },
})

const urlApi = import.meta.env.VITE_URL_API
</script>

<style scoped></style>
