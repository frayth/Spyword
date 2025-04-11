<template>
  <div class="grid place-items-center text-white p-6 w-full h-full bg-gray-950">
      <EliminatedComp v-if="gameStore.currentGame.properties.resultRound?.egalite===false" />
      <egaliteComp v-else />
  </div>
</template>

<script setup lang="ts">
import egaliteComp from './assets/resultVoteAnimation/egaliteComp.vue';
import EliminatedComp from './assets/resultVoteAnimation/eliminatedComp.vue';
import { useGameStore } from '@/stores/game';
const gameStore=useGameStore();
</script>

<style scoped>

</style>