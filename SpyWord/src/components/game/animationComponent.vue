<template>
  <Transition name="fade">
    <component
      :is="currentAnimation"
      v-if="animationStore.isVisible"
      :style="{ width: `${width}px`, height: `${height}px` }"
      class="absolute top-0 left-0 z-20 bg-yellow-200 flex items-center justify-center"
    />
  </Transition>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import startAnimation from '../animation/startAnimation.vue'
import voteAnimation from '../animation/voteAnimation.vue'
import nextPlayerAnimation from '@/components/animation/nextPlayerAnimation.vue'
import endAnimation from '../animation/endAnimation.vue'
import resultVoteAnimation from '../animation/resultVoteAnimation.vue'
import { useAnimationStore } from '@/stores/animation'
import nextMancheAnimation from '../animation/nextMancheAnimation.vue'
import targetAnimation from '../animation/targetAnimation.vue'
import nextTurnAnimation from '../animation/nextTurnAnimation.vue'
const animationStore = useAnimationStore()
const animations = {
  start: startAnimation,
  vote: voteAnimation,
  nextPlayer: nextPlayerAnimation,
  end: endAnimation,
  resultVote: resultVoteAnimation,
  nextManche: nextMancheAnimation,
  target: targetAnimation,
  nextTurn:nextTurnAnimation
}
const currentAnimation = computed(() => {
  switch (animationStore.currentAnimation?.name) {
    case 'start':
      return animations.start
    case 'vote':
      return animations.vote
    case 'nextPlayer':
      return animations.nextPlayer
    case 'end':
      return animations.end
    case 'resultVote':
      return animations.resultVote
    case 'nextManche':
      return animations.nextManche
    case 'target':
      return animations.target
    case 'nextTurn':
      return animations.nextTurn
    default:
      return null
  }
})
watchEffect(() => {
  if (animationStore.isVisible) {
    setTimeout(() => {
      animationStore.currentAnimation = null
    }, animationStore.currentAnimation?.duration)
  }
})
defineProps<{
  width: number
  height: number
  isVisible: boolean
}>()
defineEmits(['close'])
</script>

<style scoped></style>
