<template>
  <div>
    <button class="w-150px h-40px bg-red rounded-md" @click="leaveGame">
      <p>Leave game</p>
    </button>
    <Teleport to="#mainPanel" v-if="verif">
      <div class="w-full h-full bg-yellow absolute grid-center">
        <div class="w-300px h-auto bg-white p-5 rounded-md grid flex flex-col gap-5px shadow">
          <p class="text-align-center text-size-lg">Veux-tu vraiment quitter la partie?</p>
          <p class="text-align-center">Cela mettra <span class="font-700 text-red">fin à la partie</span> pour tout les joueurs :(</p>
          <div class="flex justify-evenly m-t-4">
            <button @click="verif=false" class="bg-green w-35% h50px rounded-md">Annuler</button>
            <button @click="leaveGame" class="bg-red w-35% h50px rounded-md">Quitter</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>

</template>

<script setup lang="ts">
import { useFetch } from '@/composable/useFetch';
import type { GameResponse } from '@/models/game.model';
import router from '@/router';
import { useGameStore } from '@/stores/game';
import { subscription } from '@/Services/useWs';
import { ref } from 'vue';
const game=useGameStore()
const verif = ref(false)
const {  fetchData,isComplete } = useFetch<GameResponse>(
    'api/games/leave',
    {
      method: 'PUT',
    },
  )
async function leaveGame() {
  if(game.currentGame.inGame && !verif.value){
    verif.value=true
    return
  }
  verif.value=false
  await fetchData()
  if(isComplete.value){
    game.resetGame()
    await subscription?.delete()
    router.replace('/')
  }
}
</script>

<style scoped>

</style>