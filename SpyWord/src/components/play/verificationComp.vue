<template>
  <div class="inset-0 flex items-center justify-center w-100% ">
    <div class="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6  w-[90%] max-w-md animate-fade-in">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
        🎲 Tour de {{ currentPlayer?.name }}
      </h2>
      <p class="text-lg text-gray-700 dark:text-gray-300 text-center">
        propose le mot :
      </p>
      <p class="text-2xl font-semibold text-primary dark:text-primary-light text-center my-3">
        "{{ currentPlayer?.word }}"
      </p>
      <p class="text-lg font-medium text-gray-900 dark:text-gray-200 text-center mt-4">
        Valides-tu le mot ?
      </p>
      <div class="flex justify-center gap-4 mt-6">
        <button 
          @click="validateWord" 
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition flex gap-3"
        >
          <span>✅</span><span>Oui</span>
        </button>
        <button 
          @click="rejectWord" 
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition flex gap-3"
        >
        <span>❌</span><span>Non</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game';
import { storeToRefs } from 'pinia';
import { useFetch } from '@/composable/useFetch';
import { computed } from 'vue';
const { currentGame } = storeToRefs( useGameStore() );
const currentPlayer = computed(()=>{
  const player = currentGame.value.users.find(
    user =>
      user.id ===
      currentGame.value.properties.orderGame![
        currentGame.value.properties.indexCurrentPlayer!
      ],
  )
  if(player){
    const lastWord=player.gameStat?.words[player.gameStat?.words.length-1]
    return {
      name:player.fullName,
      word:lastWord
    }
  }
  return null
})
async function validateWord(){
  const { fetchData } = useFetch('api/games/validateWord?value=true', {method:'POST'});
  await fetchData();
}
async function rejectWord(){
  const { fetchData } = useFetch('api/games/validateWord?value=false', {method:'POST'});
  await fetchData();
}
</script>

<style scoped>

</style>