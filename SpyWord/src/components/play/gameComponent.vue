<template>
  <div class=" p-1 w-full h-full grid justify-items-center items-center overflow-hidden">
    <choosseComp v-if="game.currentGame.properties.gamePhase === 'choose'" />
    <playComp v-else-if="game.currentGame.properties.gamePhase === 'play'" />
    <voteComp v-else-if="game.currentGame.properties.gamePhase === 'vote'" />
    <EndComp
      v-else-if="game.currentGame.properties.gamePhase === 'end'"
    ></EndComp>
    <whiteComp v-else-if="game.currentGame.properties.gamePhase === 'white'" />
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import choosseComp from './phaseGame/chooseComp.vue'
import playComp from './phaseGame/playComp.vue'
import voteComp from './phaseGame/voteComp.vue'
import EndComp from './phaseGame/EndComp.vue'
import whiteComp from './phaseGame/whiteComp.vue'
const game = useGameStore()
</script>

<style scoped></style>
