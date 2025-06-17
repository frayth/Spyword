<template>
  <div
    class="grid place-items-center text-white p-3 w-full h-full lg:p-6 bg-gray-950"
  >
    <div
      class="flex flex-col gap-4 backdrop-blur-md rounded-2xl border border-yellow-400 shadow-[0_0_20px_rgba(255,255,255,0.3)] bg-gradient-to-br from-[#0f172a] to-[#1e293b] w-full md:w-3/4 lg:w-4/5     items-center justify-center  shadow-2xl backdrop-blur-lg p-3 lg:p-6"
    >
      <!-- Image du joueur -->
      <div
        class=" w-200px h-200px  overflow-hidden rounded-full ring-4 ring-blue-500"
      >
        <portraitComp
        class="rounded-full"
          :url="currentPlayer?.gameStat?.urlAvatar!"
          alt="Portrait du joueur"
        />
      </div>

      <!-- Bloc du texte et du timer -->
      <div
        class="w-full grid-row-start-6 grid-row-end-12 grid-col-start-2 grid-col-end-20 flex flex-col items-center justify-center gap-5 px-4 py-6 bg-white/5 backdrop-blur-sm text-white rounded-xl shadow-xl"
      >
        <p
          class="text-2xl lg:text-4xl font-bold tracking-wide text-center text-white/90"
        >
          {{ currentPlayer?.fullName }}
        </p>

        <p
          class="text-xl lg:text-3xl font-medium tracking-wide text-center text-white/80"
        >
          propose le mot :
        </p>

        <textTimer
          class="bg-white/100 text-black/90 backdrop-blur-md rounded-xl px-6 py-4 h-60px w-full text-center text-2xl lg:text-3xl font-bold shadow-inner"
          :timer="1000"
          :value="
            currentPlayer?.gameStat?.words[
              currentPlayer?.gameStat?.words.length - 1
            ]!
          "
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import textTimer from './assets/textTimer.vue'
import { useAnimationStore } from '@/stores/animation'
import { computed } from 'vue'
import portraitComp from './assets/portraitComp.vue'

const { currentAnimation } = storeToRefs(useAnimationStore())
const idCurrentPlayer =computed(()=>{
  return currentAnimation.value?.gameSnapshot?.properties.orderGame![
    currentAnimation.value.gameSnapshot.properties.indexCurrentPlayer!
  ]
})

const currentPlayer =computed(()=>{
  return  currentAnimation.value?.gameSnapshot?.users.find(
  user => user.id === idCurrentPlayer.value,
)
})
</script>

<style scoped>
/* Effet d'ombre douce pour l'image */
img {
  transition:
    transform 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;
}
img:hover {
  transform: scale(1.05);
}
</style>
