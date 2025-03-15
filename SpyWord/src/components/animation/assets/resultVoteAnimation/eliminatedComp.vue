<template>
  <div
    class="grid grid-rows-[repeat(4,auto)_60px] p-6 gap-5 bg-gray-900 text-white rounded-2xl shadow-lg w-full max-w-md mx-auto text-center animate-fade-in"
  >
    <Transition name="smoothReveal" appear>
      <div v-if="revelation.title" class="text-2xl font-bold text-red-500">
        Un Joueur est éliminé !
      </div>
    </Transition>
    <Transition name="smoothReveal" appear>
      <div
        v-if="revelation.title"
        class="flex flex-col items-center gap-3 overflow-hidden"
      >
        <portraitComp
          :url="eliminatedPlayer?.gameStat?.urlAvatar!"
          class="w-24 h-24 rounded-full border-4 border-red-500 shadow-lg animate-pulse overflow-hidden"
        ></portraitComp>
        <div class="text-xl font-semibold text-gray-200">
          {{ eliminatedPlayer?.fullName }}
        </div>
      </div>
    </Transition>
    <Transition name="smoothReveal" appear>
      <div
        v-if="revelation.title"
        class="text-lg text-gray-300 bg-red-700 p-2 rounded-lg shadow-md animate-slide-in"
      >
        Le joueur {{ eliminatedPlayer?.fullName }} est éliminé !
      </div>
    </Transition>
    <Transition name="smoothReveal" appear>
      <div v-if="revelation.title" class="text-gray-400 mt-4">
        Son rôle était...
      </div>
    </Transition>
    <Transition name="smoothReveal" appear>
      <div
        v-if="revelation.role"
        class="text-2xl font-bold text-yellow-400 animate-fade-in-slow flex items-center justify-center"
      >
        {{ tradRole }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import portraitComp from '../portraitComp.vue'
import { ref, onMounted, computed } from 'vue'
const gameStore = useGameStore()
const eliminatedPlayer =
  gameStore.currentGame.properties.resultRound?.eliminated
const tradRole = computed(() => {
  switch (gameStore.currentGame.properties.resultRound?.role) {
    case 'spy':
      return 'Espion'
    case 'civil':
      return 'Civil'
    case 'white':
      return 'Mr. White'
    default:
      return 'Inconnu'
  }
})
const revelation = ref({
  title: true,
  portrait: false,
  roleTitle: false,
  role: false,
})
onMounted(() => {
  setTimeout(() => {
    revelation.value.role = true
  }, 2500)
})
</script>

<style scoped>
.smoothReveal-enter-active,
.smoothReveal-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}
.smoothReveal-enter-from,
.smoothReveal-leave-to {
  opacity: 0;
  transform: translateY(10px);
  grid-row: repeat(4, auto);
}
</style>
