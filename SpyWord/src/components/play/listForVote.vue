<template>
  <div class="flex flex-col gap-4 p-x-4 w-full">
    <!--Liste des portrait-->
    <div class="flex gap-4 justify-center w-full">
      <div
        v-for="player in currentGame.users.filter(
          user => user.id != infoUser.id && user.gameStat?.isAlive,
        )"
        :key="player.id"
        class="w-70px h-70px rounded-full overflow-hidden"
        @click="selectPlayer(player)"
      >
        <portraitComp
          :selected="playerSelected?.id == player.id"
          :url="player.gameStat?.urlAvatar!"
        ></portraitComp>
      </div>
    </div>
    <div
      id="selectZone"
      class="w-full max-w-md mx-auto bg-blue-500 text-white shadow-lg rounded-lg p-6 flex flex-col items-center gap-4 lg:min-w-[400px] md:min-w-[400px]"
      v-if="playerSelected"
    >
      <!-- Avatar -->
      <div
        class="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md"
      >
        <portraitComp :url="playerSelected.gameStat?.urlAvatar!"></portraitComp>
      </div>

      <!-- Texte -->
      <div class="text-center">
        <h1 class="text-xl font-bold">{{ playerSelected.fullName }}</h1>
        <p class="mt-2 text-sm">Veux-tu voter contre ce joueur ?</p>
      </div>

      <!-- Boutons -->
      <div class="flex gap-4">
        <button
          @click="validate"
          class="px-6 py-2 bg-red-500 text-white rounded-lg shadow-md hover:brightness-90"
        >
          Oui
        </button>
        <button
          @click="cancel"
          class="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:brightness-90"
        >
          Non
        </button>
      </div>
      <!-- Mots proposés -->
      <Transition v-if="true" name="fade" appear>
        <div
          class="w-full mt-4 p-4 bg-white bg-opacity-10 rounded-lg shadow-md"
        >
          <h2 class="text-lg font-semibold text-white text-center mb-2">
            Mots proposés par {{ playerSelected.fullName }}
          </h2>
          <div class="flex flex-wrap justify-center gap-2">
            <span
              v-for="(word, i) in playerSelected.gameStat?.words"
              :key="`word${i}`"
              class="px-3 py-1 bg-white bg-opacity-20 text-white rounded-full shadow"
            >
              {{ word }}
            </span>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import portraitComp from '../animation/assets/portraitComp.vue'
import { ref } from 'vue'
import type { User } from '@/models/user.model'
import { useFetch } from '@/composable/useFetch'
import { useAuthStore } from '@/stores/auth'

const { currentGame } = storeToRefs(useGameStore())
const { infoUser } = storeToRefs(useAuthStore())
const playerSelected = ref<null | User>()
function selectPlayer(player: User) {
  playerSelected.value = player
}

async function validate() {
  const { fetchData, inError } = useFetch(
    `api/games/vote?user_id=${playerSelected.value?.id}`,
    { method: 'POST' },
  )
  await fetchData()
  if (inError.value) {
    console.log('error')
  } else {
    playerSelected.value = null
  }
}
function cancel() {
  playerSelected.value = null
}
</script>

<style scoped></style>
