<template>
  <div 
  class="flex flex-col items-center j gap-4 p-4 bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-md mx-auto transition-all duration-300"
  :class="{
    'text-green-400': isVictory,
    'text-red-400 shadow-bloody': !isVictory
  }"
>
  <!-- Titre de la victoire ou défaite -->
  <div class="text-2xl font-bold">
    {{ isVictory ? 'Victoire 🎉' : 'Défaite 😔' }}
  </div>

  <!-- Liste des gagnants -->
  <div class="flex flex-wrap justify-center gap-3">
    <div 
      v-for="user in winners" 
      :key="user?.id" 
      class="w-16 h-16 rounded-full overflow-hidden border-4 shadow-md transition-all duration-300"
      :class="isVictory ? 'border-yellow-400 hover:scale-110' : 'border-gray-400 hover:opacity-80'"
    >
      <portraitComp :url="user?.gameStat?.urlAvatar!" />
    </div>
  </div>

  <!-- Phrase de fin -->
  <div class="text-center text-lg italic text-gray-300">
    {{ victorySentence }}
  </div>

  <div class="flex flex-col items-center w-full mt-6">
    <!-- Si l'utilisateur est le propriétaire -->
    <div v-if="isOwner" class="flex justify-around w-full">
      <!-- Bouton "Fin de partie" -->
      <button 
        class="w-36 py-2 rounded-lg bg-red-600 text-white font-semibold text-lg shadow-md hover:bg-red-700 transition-all duration-300 transform hover:scale-105 focus:outline-none"
        @click="endGame"
      >
        Fin de partie
      </button>
      
      <!-- Bouton "Manche suivante" -->
      <button 
        class="w-36 py-2 rounded-lg bg-blue-600 text-white font-semibold text-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none"
        @click="nextRound"
      >
        Manche suivante
      </button>
    </div>
    
    <!-- Si l'utilisateur n'est pas le propriétaire -->
    <div v-else class="mt-4 text-lg text-gray-400 font-medium">
      <span>En attente du propriétaire...</span>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';
import portraitComp from '@/components/animation/assets/portraitComp.vue';
import { useFetch } from '@/composable/useFetch';
const {currentGame  } = storeToRefs( useGameStore() );
const { infoUser } = storeToRefs( useAuthStore() );
const isVictory=computed(()=>{
  return currentGame.value.properties.endDetails?.winnersId.includes(infoUser.value.id)
})
const isOwner = computed(() => {
  return currentGame.value.ownerId === infoUser.value.id;
});
const winners = computed(() => {
  return currentGame.value.properties.endDetails?.winnersId.map((id) => {
    return currentGame.value.users.find((user) => user.id === id);
  });
});
const victorySentence = computed(() => {
  switch(currentGame.value.properties.endDetails?.winner){
    case 'civil':
      return 'Les Civils remportent la partie'
    case 'spy':
      return 'L\'espion remporte la partie'
    case 'white':
      return 'Mr White remporte la partie'
    default:
      return 'Erreur'
  };
});
async function endGame() {
  const {fetchData } = useFetch('api/games/reset',{
    method: 'POST'
  })
  await fetchData()
}

async function nextRound() {
  const {fetchData } = useFetch('api/games/nextRound',{
    method: 'POST'
  })
  await fetchData()
}
</script>

<style scoped>
.shadow-bloody {
  box-shadow: inset 0 0 15px 1px rgba(255, 0, 0, 0.7), 
              0 0 20px 2px rgba(139, 0, 0, 0.5);
  animation: pulse-blood 1.5s infinite alternate;
}

@keyframes pulse-blood {
  0% {
    box-shadow: inset 0 0 15px 1px rgba(255, 0, 0, 0.7), 
                0 0 20px 2px rgba(139, 0, 0, 0.5);
  }
  100% {
    box-shadow: inset 0 0 25px 3px rgba(255, 0, 0, 0.9), 
                0 0 30px 4px rgba(139, 0, 0, 0.7);
  }
}
</style>