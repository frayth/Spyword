<template>
  <div class="bg-white w-full h-screen ">
    <LeaveGame />
    <playerList />
  </div>
</template>

<script setup lang="ts">

import playerList from '@/components/play/playerList.vue';
import { useGameStore } from '@/stores/game';
import LeaveGame from '@/components/play/LeaveGame.vue';
import { JoinChanel } from '@/Services/useWs';
import { onMounted } from 'vue';
const game=useGameStore()
onMounted(() => {
  console.log('join chanel',game.currentGame.id)
  JoinChanel(game.currentGame.id);
});
</script>

<style scoped>

</style>