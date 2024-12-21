<template>
<button class="w-150px h-40px bg-red rounded-md" @click="leaveGame">
  <p>Leave game</p>
</button>
</template>

<script setup lang="ts">
import { useFetch } from '@/composable/useFetch';
import type { GameResponse } from '@/models/game.model';
import router from '@/router';
import { useGameStore } from '@/stores/game';
const game=useGameStore()

const {  fetchData,isComplete } = useFetch<GameResponse>(
    'api/games/leave',
    {
      method: 'PUT',
    },
  )
async function leaveGame() {
  await fetchData()
  if(isComplete.value){
    game.resetGame()
    router.replace('/')
  }
}
</script>

<style scoped>

</style>