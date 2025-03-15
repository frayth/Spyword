<template>
  <div class="flex justify-center items-center  p-4 ">
    <div class=" bg-gradient-to-br from-green-400 to-emerald-600 w-11/12 md:w-3/4 lg: rounded-3xl shadow-lg p-6 lg:p-10 text-white text-center">
      <textTimer 
        class="bg-white/20 backdrop-blur-sm rounded-xl p-5 text-lg lg:text-2xl font-semibold shadow-md animate-pulse"
        :timer="1500"
        value="C'est l'heure des votes"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import textTimer from './assets/textTimer.vue';
</script>

<style scoped>
.animate-pulse {
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>