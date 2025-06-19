<template>
  <div v-if="event.type === 'vote'" class="w-full h-full">
    <div  class="flex items-center md:gap-4 w-full border-2 border-black lg:p-5 p-2 rounded-xl shadow-lg bg-white/80 backdrop-blur-sm transition-all duration-300" >
      <div class="overflow-hidden max-w-100px max-h-100px rounded-full md:(max-w-100px max-h-100px)">
        <PortraitComp class="" :url="sourcePlayer!.gameStat!.urlAvatar" ></PortraitComp>
      </div>
      <p class="text-align-center text-xs lg:text-lg">A voté contre</p>
      <div class="overflow-hidden max-w-100px max-h-100px rounded-full lg:(max-w-100px max-h-100px)">
         <PortraitComp class="" :url="targetPlayer!.gameStat!.urlAvatar" ></PortraitComp>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { GameEvent } from '@/models/game.model'
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import PortraitComp from '../animation/assets/portraitComp.vue'
const { currentGame } = storeToRefs(useGameStore())
const props = defineProps<{
  event: GameEvent
}>()

const sourcePlayer = computed(() => {
  return currentGame.value.users.find(
    user => user.id === props.event.event.player,
  )
})
const targetPlayer = computed(() => {
    return props.event.event.hasOwnProperty('target')
      ? currentGame.value.users.find(
          user => user.id === (props.event.event as { target: number }).target,
        )
      : undefined
})
</script>

<style scoped></style>
