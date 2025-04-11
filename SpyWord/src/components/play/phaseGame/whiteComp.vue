<template>
  <div class="flex justify-center items-center text-white p-4">
    <div class="w-full max-w-md">
      <Transition name="fade">
        <whiteElement v-if="isWhite"></whiteElement>
        <civilElement v-else></civilElement>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import whiteElement from '../whitePhase/whiteElement.vue'
import civilElement from '../whitePhase/civilElement.vue'
const { currentGame } = storeToRefs(useGameStore())
const { infoUser } = storeToRefs(useAuthStore())
const isWhite = computed(() => {
  return infoUser.value.id === currentGame.value.properties.whitePhase?.whiteId
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


</style>
