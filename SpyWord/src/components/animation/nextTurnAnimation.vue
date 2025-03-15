<template>
  <div class="flex items-center justify-center font-bold text-2xl lg:text-4xl text-gray-900">
    <div class="flex items-center gap-3 bg-gray-100  p-x-10 p-y-5 rounded-lg shadow-xl">
      <!-- Libellé -->
      <span class="text-lg lg:text-xl text-gray-600 dark:text-gray-400">
        Tour numéro
      </span>

      <!-- Conteneur du chiffre avec effet stylisé -->
      <div
        class="relative w-16 h-14 lg:w-20 lg:h-16 overflow-hidden flex items-center justify-center 
               bg-gradient-to-b from-yellow-300 to-yellow-500 dark:from-yellow-600 dark:to-yellow-800
               rounded-lg shadow-xl border-2 border-amber-600 dark:border-amber-400"
      >
        <Transition name="roll-number" mode="out-in">
          <span
            v-if="visible"
            :key="turn - 1"
            class="absolute w-full text-center font-extrabold text-4xl lg:text-6xl text-white 
                   drop-shadow-[0_2px_10px_rgba(255,215,0,0.8)]"
          >
            {{ turn - 1 }}
          </span>
          <span
            v-else
            :key="turn"
            class="absolute w-full text-center font-extrabold text-4xl lg:text-6xl text-white 
                   drop-shadow-[0_2px_10px_rgba(255,215,0,0.8)]"
          >
            {{ turn }}
          </span>
        </Transition>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { computed, onMounted, ref } from 'vue'
const gameStore = useGameStore()
const visible = ref(true)
onMounted(() => {
  setTimeout(() => {
    visible.value = false
  }, 1000)
})
const turn = computed(() =>
  gameStore.currentGame.properties.round===undefined
    ? 0
    : gameStore.currentGame.properties.round,
)
</script>

<style scoped>
.roll-number-enter-active, .roll-number-leave-active {
  transition: transform 0.4s ease-in-out, opacity 0.3s ease-in-out;
}

.roll-number-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.roll-number-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.roll-number-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.roll-number-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}</style>
