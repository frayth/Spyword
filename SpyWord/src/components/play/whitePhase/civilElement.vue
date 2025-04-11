<template>
  <div class="bg-gray-900 p-6 rounded-2xl shadow-xl space-y-4 text-center text-white">
    <p>Votre mot secret est <span class="text-xl font-bold text-yellow-400">{{infoUser.currentWord}}</span></p>
    <p class="text-xl font-bold">Mr. White a été éliminé !</p>
    <p class="text-sm text-gray-400">
      Il va maintenant tenter de deviner le mot des civils.
    </p>
    <p class="text-sm text-gray-400">
      S'il trouve le mot, il gagne la partie. Sinon, la manche continue normalement.
    </p>
  
    <div v-if="currentGame.properties.whitePhase?.validation" class="space-y-4">
      <portraitComp :url="urlWhite!" class="mx-auto w-32 h-32 rounded-full border-2 border-white shadow-lg overflow-hidden" />
      
      <div class="text-lg font-semibold">Mr. White propose le mot :</div>
      <div class="text-xl font-bold text-yellow-400">
        {{ currentGame.properties.whitePhase.word }}
      </div>
  
      <div class="bg-gray-800 p-4 rounded-lg shadow-md space-y-2">
        <p v-if="!userAlreadyVote" class="text-sm">Ce mot correspond-il à votre mot secret ?</p>
        <div class="flex justify-center space-x-4" v-if="!userAlreadyVote">
          <button class="px-10 py-2 bg-green-600 hover:bg-green-500 rounded-lg shadow-md transition" @click="handleResponse(true)">Oui</button>
          <button class="px-10 py-2 bg-red-600 hover:bg-red-500 rounded-lg shadow-md transition" @click="handleResponse(false)">Non</button>
        </div>
        <div v-else>
          <p class="text-sm">Vous avez voté en attente des autres joueurs ...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import portraitComp from '@/components/animation/assets/portraitComp.vue'
import { computed, ref, watch } from 'vue'
import { useFetch } from '@/composable/useFetch'

const { infoUser } = storeToRefs(useAuthStore())
const responseLoading=ref(false)
const urlWhite = computed(() => {
  return currentGame.value.users.find((user) => user.id === currentGame.value.properties.whitePhase?.whiteId)?.gameStat?.urlAvatar
})
const { currentGame } = storeToRefs(useGameStore())
const userAlreadyVote = computed(() => {
  return currentGame.value.properties.whitePhase?.playersValidation.some((el) => el.id === infoUser.value.id)
})
const handleResponse = async (response: boolean) => {
  const { inError, fetchData ,loading} = useFetch(`api/games/white/validate?response=${response}`, {
    method: 'POST',
  })
  await fetchData()
  watch(loading, (value) => {
    responseLoading.value = value
  })
  
  if (inError.value) {
    alert('Erreur lors de la validation du mot')
  }
}
</script>

<style scoped></style>
