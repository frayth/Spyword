<template>
  <div class="place-items-center bg-white">
    <section class="flex-center-col bg-yellow-200 p-y-20px p-x-5px lg:(p-y-50px)">
      <h1 class="title m-b-50px underline">LANCE UNE PARTIE !</h1>
      <p class="text-align-center">
        Pour lancer une partie rien de plus simple appuie sur le bontton
        <span class="font-900 color-amber">"lancer une partie"</span> et partage
        le lien ou le code de ta partie avec d'autre joueur !
      </p>
      <button
        class="bg-amber w-200px h-70px b-rounded-lg m-10 p-x-20px font-900 text-size-lg md:(w-300px text-size-2xl w-250px h-100px) hover:transform hover:scale-102"
        ref="button"
        @click="lauchGame"
      >
        <span class="font-700 ">Lancer une partie</span>
      </button>
    </section>
    <section class=" flex-center-col p-y-20px p-x-5px w-full lg:(p-y-50px)">
      <p>
        si tu veux rejoindre une partie rentre le code qu'on ta fournis ci
        dessous!
      </p>
      <input
        type="text"
        placeholder="Code de la partie"
        @focus="joinError=''"
        v-model="game_id"
        class="border-2 border-amber m-20px w-300px h-10 p-2 outline-amber"
      />
      <div>
        <div class="flex-center-col">
          <joinButton class="font-700 text-size-2xl" :game_id @error="(err)=>joinError=err"/>
          <Transition>
          <p class="c-red" v-if="joinError!==''">{{joinError}}</p>
          </Transition>
        </div>
        

      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game';
import { onMounted, onUnmounted, ref } from 'vue'
import { useFetch } from '@/composable/useFetch'
import type { GameResponse } from '@/models/game.model';
import joinButton from '@/components/game/joinButton.vue';
import { storeToRefs } from 'pinia';
import router from '@/router';
const {currentGame}=storeToRefs(useGameStore())
const { data, fetchData, inError } = useFetch<GameResponse>(
    'api/games/create',
    {
      method: 'POST',
    },
  )
const game_id = ref('')
const interval = ref()
const button = ref<HTMLElement | null>()
const joinError = ref('')
onMounted(() => {
  interval.value = setInterval(() => {
    button.value?.classList.toggle('bounceAnim')
    setTimeout(() => {
      button.value?.classList.toggle('bounceAnim')
    }, 1000)
  }, 5000)
})
onUnmounted(() => {
  clearInterval(interval.value)
})
async function lauchGame() {
  await fetchData()
  if(inError.value){
    //console.log(data.value?.code) // TODO HANDLE ERROR
  }else{
    currentGame.value=data.value!.data
    router.push(`/play/${currentGame.value.slug}`)
  }
}


</script>

<style scoped>
.bounceAnim {
  animation: check 0.5s infinite;
}
@keyframes check {
  0% {
    transform: scale(1);
  }
  25% {
    transform: rotateZ(2deg);
  }
  50% {
    transform: scale(1.1);
  }
  75% {
    transform: rotateZ(-2deg);
  }
  100% {
    transform: scale(1);
  }
}
.v-enter-active{
  transition: all 0.5s ease;
}
.v-enter-from{
  opacity:0;
  transform:translateY(-100%);
}
</style>
