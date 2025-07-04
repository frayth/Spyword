<template>
  <div class="flex justify-center items-center p-4">
    <div
      class="flex justify-center items-center bg-gradient-to-br from-gray-100 to-gray-200 w-11/12 md:w-3/4 rounded-3xl shadow-custom-yellow p-6 lg:p-10 text-gray-800 text-center"
    >
      <textTimer
        class="bg-white/30 backdrop-blur-sm rounded-xl p-5 text-lg lg:text-2xl font-semibold shadow-inner animate-pulse text-gray-900"
        :timer="1000"
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
.shadow-custom-yellow {
  box-shadow: 0 10px 25px rgba(255, 255, 0, 0.05); /* touche très légère de jaune */
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
