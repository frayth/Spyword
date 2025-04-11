<template>
  <div class="bg-gray-800 p-6 rounded-xl shadow-lg space-y-4 text-center">
    <p class="text-lg font-semibold">Vous avez été éliminé...</p>
    <p class="text-sm text-gray-300">
      Mais il vous reste une dernière chance de gagner ! Tentez de deviner le mot des civils.
    </p>
    <p class="text-sm text-gray-300">
      Si votre proposition est correcte, vous remportez la partie. Sinon, vous serez définitivement éliminé de cette manche.
    </p>
    <div class="flex items-center gap-2">
      <input
        type="text"
        placeholder="Votre proposition..."
        v-model="guess"
        class="w-full px-4 py-2 text-black rounded-md outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button @click="submitGuess" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200" v-if="!currentGame.properties.whitePhase?.validation">
        Proposer
      </button>
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