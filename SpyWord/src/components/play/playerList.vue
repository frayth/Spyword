<template>
  <div>
    <div class="bg-orange w-full h-full ">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="player in currentGame.users" :key="player.id">
          {{ player.fullName }}  
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game';
import { storeToRefs } from 'pinia';

const {currentGame}=storeToRefs(useGameStore()) 

</script>

<style scoped>

</style>