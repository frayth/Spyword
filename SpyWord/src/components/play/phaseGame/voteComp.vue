<template>
  <div class="w-full h-full  grid  ">
    <!--affiche liste si joueur n'a pas vote-->
    <listForVote v-if="!playerHasVoted && playerIsAlive" class="w-full  "></listForVote>
    
    <!--affiche ecran d'attente si joueur a vote-->
    <div v-else-if="playerHasVoted && playerIsAlive" class="bg-gray-900 h-full w-full flex flex-col items-center justify-center">
      <div
      class=" flex flex-col items-center justify-center   text-white p-10 animate-fade-in border b-amber rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.3)] lg:min-w-[400px] md:min-w-[400px]"
      
    >
      <!-- Avatar -->
      <div
        class="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-700 shadow-lg"
      >
        <portraitComp :url="`${target?.gameStat?.urlAvatar}`"></portraitComp>
      </div>

      <p class="text-xl font-bold mt-4 text-center text-white text-shadow">
        Vous avez voté pour {{ target?.fullName }}
      </p>
      <!-- waiter -->
      <div
        class="w-12 h-12 border-4 border-transparent border-t-blue-500 rounded-full animate-spin mt-6"
      ></div>
      <p class="text-lg font-semibold mt-3 text-gray-300 text-shadow">
        En attente des votes...
      </p>
    </div>
    </div>
    
    <div v-else class="flex flex-col items-center justify-center h-full w-full bg-gray-900 text-white p-10 animate-fade-in">
      <p class="text-xl font-bold mt-4 text-center text-white text-shadow">
        Vous êtes mort
      </p>
      <!-- waiter -->
      <div
        class="w-12 h-12 border-4 border-transparent border-t-red-500 rounded-full animate-spin mt-6"
      ></div>
      <p class="text-lg font-semibold mt-3 text-gray-300 text-shadow">
        En attente des votes...
      </p>

    </div>
  </div>
</template>

<script setup lang="ts">
import listForVote from '../listForVote.vue'
import { useGameStore } from '@/stores/game'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import portraitComp from '@/components/animation/assets/portraitComp.vue'
import { computed } from 'vue'
const { currentGame } = storeToRefs(useGameStore())
const { infoUser } = storeToRefs(useAuthStore())
const playerHasVoted = computed(
  () =>
    currentGame.value.users.find(user => user.id === infoUser.value.id)!
      .gameStat?.asVoted,
)
const playerIsAlive = computed(
  () =>
    currentGame.value.users.find(user => user.id === infoUser.value.id)!
      .gameStat?.isAlive,
)
const target = computed(() => {
  const current = currentGame.value.users.find(
    user => user.id === infoUser.value.id,
  )
  const target = currentGame.value.users.find(
    user => user.id === current!.gameStat!.vote,
  )
  return target
})
</script>

<style scoped>
.waiting-screen {
  @apply flex flex-col items-center justify-center h-full w-full bg-gray-900 text-white;
}

.loader {
  @apply;
}
</style>
