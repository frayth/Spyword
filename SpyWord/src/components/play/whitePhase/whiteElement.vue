<template>
<div class="bg-gray-800 p-6 rounded-xl shadow-lg space-y-6 text-center max-w-md mx-auto border border-gray-700">
  <div class="space-y-1">
    <p class="text-xl font-bold text-white">Vous avez été éliminé...</p>
    <p class="text-sm text-gray-300">
      Mais il vous reste une dernière chance de gagner !<br>
      <span class="text-blue-400 font-medium">Tentez de deviner le mot des civils.</span>
    </p>
    <p class="text-sm text-gray-300">
      Si votre proposition est correcte, vous remportez la partie.<br>
      Sinon, vous serez définitivement éliminé de cette manche.
    </p>
  </div>

  <div v-if="!currentGame.properties.whitePhase?.validation" class="space-y-4">
    <input
      type="text"
      placeholder="Votre proposition..."
      v-model="guess"
      class="w-full px-4 py-2 text-black rounded-md outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
    />
    <button
      @click="submitGuess"
      class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 w-full font-semibold"
    >
      Proposer
    </button>
  </div>

  <div v-else class="bg-green-600/20 text-green-400 font-semibold p-4 rounded-lg animate-pulse">
    <p>Les autres joueurs vont donner leur avis sur votre proposition.</p>
    <p class="text-sm text-green-300">Veuillez patienter...</p>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useGameStore } from '@/stores/game';
import { useFetch } from '@/composable/useFetch';
import { storeToRefs } from 'pinia';
const { currentGame } = storeToRefs(useGameStore());
const guess = ref("");
const submitGuess = async () => {
  if (!guess.value.trim()) {
    return;
  }
  const {inError,fetchData} = useFetch(`api/games/white/guess?word=${guess.value}`, {
    method: 'POST',
  });
  await fetchData();
  if(inError.value){
    alert('Erreur lors de la proposition du mot');
  }
};
</script>

<style scoped>

</style>
