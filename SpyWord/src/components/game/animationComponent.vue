<template>
  <Transition name="fade">
    <component
      :is="animations.start"
      v-if="animationStore.isVisible"
      :style="{ width: `${width}px`, height: `${height}px` }"
      class="absolute top-0 left-0 z-20 bg-yellow-200 flex items-center justify-center"
    />
  </Transition>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue'
import startAnimation from '../animation/startAnimation.vue'
import { useAnimationStore } from '@/stores/animation'
const animationStore = useAnimationStore()
const animations = {
  start: startAnimation,
}
watchEffect(() => {
  if (animationStore.isVisible) {
    console.log('start animation')
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
