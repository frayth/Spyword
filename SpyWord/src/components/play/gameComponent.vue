<template>
  <div>
    <choosseComp v-if="game.currentGame.properties.gamePhase==='choose'" />
    <playComp v-else-if="game.currentGame.properties.gamePhase==='play'" />
  </div>
</template>

<script setup lang="ts">
  import { useGameStore } from '@/stores/game';
  import choosseComp from './phaseGame/chooseComp.vue';
  import playComp from './phaseGame/playComp.vue';
  const game=useGameStore()
</script>

<style scoped>

</style>