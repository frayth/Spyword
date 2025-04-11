<template>
  <div
    class="grid place-items-center text-white p-1 w-full h-full lg:p-6 bg-gray-950"
  >
    <div
      class="backdrop-blur-md rounded-2xl border border-yellow-400 shadow-[0_0_20px_rgba(255,255,255,0.3)] bg-gradient-to-br from-[#0f172a] to-[#1e293b] w-full md:w-3/4 lg:w-4/5  grid grid-cols-20 grid-rows-11 lg:g items-center justify-center  shadow-2xl backdrop-blur-lg p-3 lg:p-6"
    >
      <!-- Image du joueur -->
      <div
        class="flex justify-center items-center w-full h-full p-2 overflow-hidden rounded-full grid-row-start-1 grid-row-end-5 grid-col-start-5 grid-col-end-17"
      >
        <img
          class="object-cover w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full shadow-2xl ring-4 ring-white/40"
          :src="urlPortrait"
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
          class="bg-white/10 text-white/90 backdrop-blur-md rounded-xl px-6 py-4 h-60px w-full text-center text-2xl lg:text-3xl font-bold shadow-inner"
          :timer="1500"
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
import { useGameStore } from '@/stores/game'
import { ref, unref } from 'vue'

const { currentGame } = storeToRefs(useGameStore())
const idCurrentPlayer =
  unref(currentGame).properties.orderGame![
    unref(currentGame).properties.indexCurrentPlayer!
  ]
const currentPlayer = currentGame.value.users.find(
  user => user.id === idCurrentPlayer,
)
const url = import.meta.env.VITE_URL_API
const urlPortrait = ref(`${url}${currentPlayer?.gameStat?.urlAvatar}`)
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
