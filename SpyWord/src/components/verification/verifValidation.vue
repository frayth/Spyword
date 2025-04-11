<template>
  <div >
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
</template>

<script setup lang="ts">
import { useFetch } from '@/composable/useFetch';
type currentPlayerType = {
  name: string;
  word: string | undefined;
};
defineProps<{
  currentPlayer: currentPlayerType | null;
}>();
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