<template>
  <div class="bg-white w-full h-screen lg:(p-5)">
    <div class="flex-center-col w-full h-full b-amber border">
      <div class="w-full grid grid-cols-[auto_auto_auto] items-center p-2">
        <LeaveGame />
        <h1 class="font-900 text-size-xl justify-self-center">SpyWord</h1>
        <div class=""></div>
      </div>
      <div class="h-100% w-100% bg-amber grid grid-col-[auto] grid-rows-[auto_1fr] lg:(grid grid-cols-3 gap-2 grid-rows-[auto]) relative" id="mainPanel">
        <playerList />
        <div class=" bg-red h-full p-2  lg:(grid-col-start-2 grid-col-span-2 p-5) ">
          <OptionsGame :game="game.currentGame" v-if="!game.currentGame.inGame"></OptionsGame>
          <div v-else> on est en game</div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import OptionsGame from '@/components/play/OptionsGame.vue'
import playerList from '@/components/play/playerList.vue'
import { useGameStore } from '@/stores/game'
import LeaveGame from '@/components/play/LeaveGame.vue'
import { JoinChanel } from '@/Services/useWs'
import { onMounted } from 'vue'
const game = useGameStore()
onMounted(() => {
  JoinChanel(game.currentGame.id)
})
</script>

<style scoped></style>
