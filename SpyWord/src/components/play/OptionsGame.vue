<template>
  <div class="w-full h-full flex flex-col gap-5">
    <p class="self-center font-900 lg:(text-size-2xl)">
      PARAMETRES DE LA PARTIE
    </p>
    <div
      class="w-full h-full m-t-4 grid grid-rows-[auto_1fr_1fr_auto] grid-cols-[1fr_1fr] grow-1 gap-4 overflow-auto lg:()"
    >
      <select
        :disabled="optionsLoading.players || !userIsOwner"
        name="player"
        id="nbPlayer"
        class="w-full h-30px grid-col-span-2 lg:(h-50px)"
        @change="changeNumberOfPlayer"
        v-model="numberOfPlayer"
      >
        <option :value="3">3 Joueurs</option>
        <option :value="4">4 Joueurs</option>
        <option :value="5">5 Joueurs</option>
        <option :value="6">6 Joueurs</option>
        <option :value="7">7 Joueurs</option>
        <option :value="8">8 Joueurs</option>
        <option :value="9">9 Joueurs</option>
        <option :value="10">10 Joueurs</option>
        <option :value="15">15 Joueurs</option>
        <option :value="20">20 Joueurs</option>
      </select>
      <div
        class="grid-row-start-2 grid-row-span-3 grid-col-span-2 grid-col-start-1 w-full  grid-row-[auto_1fr]"
      >
        <div class="justify-self-center p-5">
          <p class="font-900 text-sm text-center lg:(text-xl)">
            Choissisez les rôles présents dans la partie
          </p>
          <p class="text-center">
            Civil et espion ne peuvent pas être désactivé
          </p>
        </div>
        <div
        id="card-container"
          class="w-full justify-center flex flex-wrap p-1 gap-6 content-start lg:(gap-7 p-5)"
        >
          <cardRole
            :is-present="true"
            :locked="true"
            name="Civil"
            img="civilianHd.jpg"
          ></cardRole>
          <cardRole
            :is-present="true"
            :locked="true"
            name="Espion"
            img="spyHd.jpg"
          ></cardRole>
          <cardRole
            :locked="false"
            :is-present="currentGame.gameOption.whiteIsPresent"
            name="Mr.White"
            img="mrwhiteHd.jpg"
            :action="changeMrWhite"
          ></cardRole>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 grid-rows-1 gap-4">
      <div
        :class="{
          'grid-col-start-1 bg-amber h-50px grid-center rounded-xl cursor-pointer': true,
          'cursor-auto! bg-gray-400': !userIsOwner,
        }"
        @click="lauchGame"
      >
        <p v-if="userIsOwner">Lancer la partie</p>
        <div v-else class="flex items-center justify-center space-x-2">
          <div
            class="w-4 h-4 bg-amber rounded-full animate-bounce animate-delay-0 animate-duration-[1000ms]"
          ></div>
          <div
            class="w-4 h-4 bg-amber rounded-full animate-bounce animate-delay-100 animate-duration-[1000ms]"
          ></div>
          <div
            class="w-4 h-4 bg-amber rounded-full animate-bounce animate-delay-200 animate-duration-[1000ms]"
          ></div>
        </div>
      </div>
      <div
        class="grid-col-start-2 bg-amber h-50px grid-center rounded-xl cursor-pointer"
        @click="copyLink"
      >
        <p>{{ copyTextButton }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFetch } from '@/composable/useFetch'
import { computed, ref, watch } from 'vue'
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import cardRole from '@/components/game/cardRole.vue'
const { infoUser } = storeToRefs(useAuthStore())
const { currentGame } = storeToRefs(useGameStore())
const numberOfPlayer = ref(currentGame.value.gameOption.maxPlayers)
const copyTextButton = ref('Copier le Code')
const optionsLoading = ref({
  players: false,
})
const userIsOwner = computed(
  () => currentGame.value.ownerId === infoUser.value.id,
)

watch(
  () => currentGame.value.gameOption.maxPlayers,
  value => {
    numberOfPlayer.value = value
  },
)
watch(numberOfPlayer, (newValue, old) => {
  if (newValue < currentGame.value.users.length) {
    console.log('inferieur')
    numberOfPlayer.value = old
  }
})
async function changeNumberOfPlayer() {
  if (currentGame.value.ownerId !== infoUser.value.id) return
  if (!checkWhiteCondition()) {
    if (currentGame.value.gameOption.whiteIsPresent)
      currentGame.value.gameOption.whiteIsPresent = false
    await emitMrWhite()
  }
  const { fetchData, loading } = useFetch(
    `api/games/${currentGame.value.id}/options/players?players=${numberOfPlayer.value}`,
    { method: 'PUT' },
  )
  optionsLoading.value.players = true
  await fetchData()
  if (!loading.value) {
    optionsLoading.value.players = false
  }
}
async function copyLink() {
  await navigator.clipboard.writeText(`${currentGame.value.slug}`)
  copyTextButton.value = 'Lien copié'
  setTimeout(() => {
    copyTextButton.value = 'Copier le Code'
  }, 2000)
}
function checkWhiteCondition() {
  if (
    currentGame.value.gameOption.maxPlayers <= 3 ||
    currentGame.value.users.length <= 3
  ) {
    return false
  } else {
    return true
  }
}
async function changeMrWhite() {
  const error = ref(false)
  if (checkWhiteCondition())
    currentGame.value.gameOption.whiteIsPresent =
      !currentGame.value.gameOption.whiteIsPresent
  else {
    currentGame.value.gameOption.whiteIsPresent = false
    error.value = true
  }
  await emitMrWhite()
  return error.value
}
async function emitMrWhite() {
  const { fetchData } = useFetch(
    `api/games/${currentGame.value.id}/options/white?present=${currentGame.value.gameOption.whiteIsPresent}`,
    { method: 'PUT' },
  )
  await fetchData()
}

async function lauchGame() {
  if (currentGame.value.ownerId !== infoUser.value.id) return
  const { fetchData } = useFetch(`api/games/start`, { method: 'PUT' })
  await fetchData()
}
</script>

<style scoped>
.image {
  background-image: url('http:/maison.laurisceresoli.fr/avatars/image.jpg');
}
</style>
