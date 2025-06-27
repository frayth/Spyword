<template>
  <div class="w-full flex justify-center! place-items-center">
    <!-- Bouton quitter -->
    <button
      :class="{
        'w-full h-10  bg-red-500 text-white text-center! rounded-md hover:bg-red-600 transition ': true,
        'bg-blue-500! hover:bg-blue-600!': action === 'reset',
        'bg-yellow-500! hover:bg-yellow-600!': action === 'help',
      }"
      @click="verif = true"
    >
      {{
        title
      }}
    </button>

    <!-- Fenêtre de confirmation -->
    <Teleport to="#mainPanel" v-if="verif">
      <div
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div
          class="w-80 max-w-md bg-white p-6 rounded-lg shadow-lg grid gap-3 animate-fade-in animate-scale-up"
        >
          <p class="text-center text-lg font-bold">
            {{
              message
            }}
          </p>
          <p class="text-center text-sm" v-if="showLeaveMessage" >
            Cela mettra
            <span class="font-bold text-red-500">fin à la partie</span> pour
            tous les joueurs. 😢
          </p>

          <div class="flex justify-evenly mt-4">
            <button
              @click="verif = false"
              class="w-32 h-10 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              Annuler
            </button>
            <button
              @click="handleAction"
              class="w-32 h-10 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              {{ props.action === 'leave' ? 'Quitter' : 'Réinitialiser' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useFetch } from '@/composable/useFetch'
import type { GameResponse } from '@/models/game.model'
import router from '@/router'
import { useGameStore } from '@/stores/game'
import { subscription } from '@/Services/useWs'
import { computed, ref } from 'vue'
import { useTutoStore } from '@/stores/tuto'
const tutoStore = useTutoStore()
const game = useGameStore()
const verif = ref(false)
const props = defineProps<{
  action: 'leave' | 'reset' | 'help'
}>()
const { fetchData, isComplete } = useFetch<GameResponse>(
  `api/games/${props.action}`,
  {
    method: 'PUT',
  },
)
async function leaveGame() {
  if (game.currentGame.inGame && !verif.value) {
    verif.value = true
    return
  }
  await fetchData()
  if (isComplete.value && props.action === 'leave') {
    game.resetGame()
    await subscription?.delete()
    router.replace('/')
  }
}
const title=computed(()=>{
  switch (props.action) {
    case 'leave':
      return 'Quitter la partie'
    case 'reset':
      return 'Réinitialiser la partie'
    case 'help':
      return 'Reset Aide'
    default:
      return ''
  }
})

const message= computed(() => {
  switch (props.action) {
    case 'leave':
      return 'Veux-tu vraiment quitter la partie ?'
    case 'reset':
      return 'Veux-tu vraiment réinitialiser la partie ?'
    case 'help':
      return 'Veux-tu vraiment réinitialiser l\'aide ?'
    default:
      return ''
  }
})

const showLeaveMessage = computed(() => {
  return props.action ==='leave' || props.action === 'reset'
})
const resetHelp = () =>{
  tutoStore.clearTutoStep()
}

const handleAction = () => {
  if (props.action === 'help') {
    resetHelp()
  } else {
    leaveGame()
  }
  verif.value = false
}
</script>

<style scoped></style>
