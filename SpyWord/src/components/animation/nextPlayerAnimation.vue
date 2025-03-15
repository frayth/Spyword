<template>
  <div class="flex justify-center items-center  ">
    <div
      class=" bg-white bg-opacity-90 w-11/12 md:w-3/4 lg:w-4/5 h-auto grid grid-cols-20 grid-rows-20 items-center justify-center rounded-3xl shadow-xl backdrop-blur-md p-2 lg:p-5"
    >
      <!-- Image du joueur -->
      <div
        class="flex justify-center w-full h-full p-4 overflow-hidden rounded-full grid-row-start-3 grid-row-end-10 grid-col-start-5 grid-col-end-17 lg:grid-row-start-3 lg:grid-row-end-10 lg:grid-col-start-5 lg:grid-col-end-17"
      >
        <img
          class="object-cover w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full shadow-xl ring-4 ring-white/50"
          :src="urlPortrait"
          alt="Portrait du joueur"
        />
      </div>

      <!-- Bloc du texte et du timer -->
      <div
        class="w-full grid-row-start-12 grid-row-end-19 grid-col-start-2 grid-col-end-20 flex flex-col items-center justify-center gap-4 p-4 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl md:grid-row-start-12 md:grid-row-end-19 md:grid-col-start-2 md:grid-col-end-20 shadow-lg"
      >
        <p class="text-xl lg:text-3xl font-semibold tracking-wide text-center">{{ currentPlayer?.fullName }}</p>
        <p class="text-xl lg:text-3xl font-semibold tracking-wide text-center">
           propose le mot :
        </p>
        <textTimer
          class="bg-white/20 backdrop-blur-lg rounded-lg p-5 w-full text-center text-xl font-bold shadow-md"
          :timer="1500"
          :value="currentPlayer?.gameStat?.words[currentPlayer?.gameStat?.words.length - 1]!"
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
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}
img:hover {
  transform: scale(1.05);
  box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.15);
}
</style>
