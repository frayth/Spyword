<template>
  <div class="flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg w-full max-w-md">
    <div v-if="similarWord.length > 0" class="w-full space-y-1">
      <div v-for="word in similarWord" :key="word" class="bg-white dark:bg-gray-700 px-3 py-1 rounded-md transition-transform hover:scale-105">
        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ word }}</p>
      </div>
    </div>
    <div v-else class="text-gray-500 dark:text-gray-400 italic text-sm">Pas de mot similaire</div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import levenshtein from '@/Services/levenshtein'
import { computed } from 'vue'
const props = defineProps<{
  currentPlayer: {
    name: string
    word: string | undefined
  } | null
}>()
const { currentGame } = storeToRefs(useGameStore())
const similarWord = computed(() => {
  const allWord = currentGame.value.users
    .map(user => user.gameStat?.words)
    .flat()
  const filterWord = allWord.filter(
    word =>
      props.currentPlayer?.word?.includes(word!) ||
      levenshtein(word!, props.currentPlayer!.word!) < 3,
  )
  if (filterWord.findIndex(el => el === props.currentPlayer?.word) !== -1) {
    filterWord.splice(
      filterWord.findIndex(el => el === props.currentPlayer?.word),
      1,
    )
  }
  return filterWord
})
</script>

<style scoped></style>
