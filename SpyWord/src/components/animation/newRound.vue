<template>
  <div class="grid place-items-center text-white p-6 w-full h-full bg-gray-950">
    <div
      class="relative w-[90%] h-[60%]  p-6 rounded-2xl flex justify-center items-center shadow-lg text-center text-white b b-amber"
      :style="{ backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'top' }"
    >
      <div class="absolute inset-0 bg-black/60 rounded-2xl"></div>
      <div class="relative z-10 space-y-3 bg-white/20 p-4 rounded-xl">
        <h2 class="text-xl font-bold">Manche suivante</h2>
        <p class="opacity-80">Les rôles vont être redistribués et les mots changent</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const url=computed(()=>{
  return '/img/manche.jpg'
})
</script>

<style scoped>

</style>
