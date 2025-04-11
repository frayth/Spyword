<template>
  <div
    class="inset-0 flex-center-col items-center justify-center bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6 w-[90%] max-w-md animate-fade-in relative backdrop-blur-lg"
  >
    <h2
      class="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 text-center"
    >
      🎲 Tour de {{ currentPlayer?.name }}
    </h2>
    <div
      class="w-full h-full flex-center-col items-center justify-center"
      ref="verifContainer"
    >
      <Transition name="fade-scale" mode="out-in">
        <verifValidation
          v-if="!showSimilarWord"
          :current-player="currentPlayer"
        />
        <similarWord v-else :currentPlayer="currentPlayer" />
      </Transition>
    </div>

    <!-- Bouton en bas -->
    <button
      class="mt-4 px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition active:scale-95"
      @click="handleSimilarButton"
    >
      {{ showSimilarWord ? 'Retour' : 'Voir Mot Similaire' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import verifValidation from './verifValidation.vue'
import similarWord from './similarWord.vue'
import { computed,  ref, useTemplateRef } from 'vue'
import { useElementBounding } from '@vueuse/core'
const element = useTemplateRef('verifContainer')
const { y, height } = useElementBounding(element)
const { currentGame } = storeToRefs(useGameStore())
const showSimilarWord = ref(false)
const currentPlayer = computed(() => {
  const player = currentGame.value.users.find(
    user =>
      user.id ===
      currentGame.value.properties.orderGame![
        currentGame.value.properties.indexCurrentPlayer!
      ],
  )
  if (player) {
    const lastWord = player.gameStat?.words[player.gameStat?.words.length - 1]
    return {
      name: player.fullName,
      word: lastWord,
    }
  }
  return null
})

function handleSimilarButton() {
  showSimilarWord.value = !showSimilarWord.value
  setTimeout(()=>{
    document
      .querySelector('#app > div')
      ?.scrollTo({ top: y.value + height.value +100, behavior: 'smooth' })
  },500)
  // Wait for the transition to finish before scrolling
}
</script>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease,
    width 0.3s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
