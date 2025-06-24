<template>
  <div class="w-full h-full relative">
    <!-- Texte "Cible" -->
    <div v-if="target" class="absolute top-0 right-0px z-11 w-full h-full flex items-center justify-center px-1">
      <div class="bg-red-600/80 text-white w-full font-bold text-3 px-1 py-0 rounded-full shadow-lg border-2 border-red-800 tracking-wide text-center lg:(text-sm py-1)">
        Cible
      </div>
    </div>

    <!-- Croix rouge -->
    <div v-if="eliminated" class="absolute top-0 right-6px z-10 w-full h-full">
      <img src="/img/crossRed.png" alt="" loading="lazy">
    </div>

    <!-- Sélection -->
    <div v-if="selected" class="border-red border-2 rounded-full absolute w-full h-full bg-red-500/20"></div>

    <!-- Main animée (si animation active) -->
    <div
      v-if="animation"
      class="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2  z-100000 animate-clickHand"
    >
      <img src="/icone/handClick.png" alt="main" class="w-10 h-10" />
    </div>

    <!-- Image principale -->
    <img
      :src="srcImage"
      :class="{
        'h-full object-cover': true,
        'filter grayscale': eliminated,
      }"
      alt=""
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const prod = defineProps({
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
  animation: {
    type: Boolean,
    default: false,
  },
})

const prodUrl = computed(() => prod.url.replace('public/images/', ''))
const prodUrlApi = 'https://apispyword.laurisceresoli.fr/'
const urlApi = import.meta.env.VITE_URL_API

const srcImage = computed(() => {
  if (prod.url?.startsWith('/img')) return prod.url
  if (import.meta.env.MODE === 'development') {
    return `${urlApi}${prod.url}`
  } else {
    return `${prodUrlApi}${prodUrl.value}`
  }
})
</script>

<style scoped>
@keyframes clickHand {
  0%, 100% {
    transform: translateY(0) rotateZ(0deg) rotateY(180deg) scale(1);
    transform-origin: bottom center;
  }
  30% {
    transform: translateY(4px) rotateZ(-10deg) scale(0.96) rotateY(180deg);
  }
  60% {
    transform: translateY(2px) rotateZ(-5deg) scale(0.98) rotateY(180deg);
  }
}
.animate-clickHand {
  animation: clickHand 1.2s ease-in-out infinite;
}
</style>
