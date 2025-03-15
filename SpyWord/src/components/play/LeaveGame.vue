<template>
  <div>
    <!-- Bouton quitter -->
    <button 
      class="w-fit h-10 p-5 bg-red-500 text-white rounded-md hover:bg-red-600 transition flex-center"
      @click="verif = true"
    >
      Quitter la partie
    </button>

    <!-- Fenêtre de confirmation -->
    <Teleport to="#mainPanel" v-if="verif">
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="w-80 max-w-md bg-white p-6 rounded-lg shadow-lg grid gap-3 animate-fade-in animate-scale-up">
          
          <p class="text-center text-lg font-bold">Veux-tu vraiment quitter la partie ?</p>
          <p class="text-center text-sm">
            Cela mettra <span class="font-bold text-red-500">fin à la partie</span> pour tous les joueurs. 😢
          </p>
          
          <div class="flex justify-evenly mt-4">
            <button 
              @click="verif = false" 
              class="w-32 h-10 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              Annuler
            </button>
            <button 
              @click="leaveGame" 
              class="w-32 h-10 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Quitter
            </button>
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