<template>
  <div v-if="event.type === 'vote'" class="w-full h-full">
    <div class="flex items-center" >
      <PortraitComp class="overflow-hidden max-w-200px max-h-200px  rounded-full" :url="sourcePlayer!.gameStat!.urlAvatar" ></PortraitComp>
      <p class="text-align-center">A voté contre</p>
      <PortraitComp class="overflow-hidden max-w-200px max-h-200px  rounded-full" :url="targetPlayer!.gameStat!.urlAvatar" ></PortraitComp>
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
