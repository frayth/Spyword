<template>
  <div class="w-full h-full flex flex-col gap-5 relative">
    <div v-if="helpBox.statut" id="helpBox" class=" z-11 bg-black/20 absolute backdrop-blur-1 top-0 left-0 w-full h-full  overflow-auto grid justify-center   px-4 color-white" @click="closeHelp">
      <helpBoxComp
      class=""
        :name="helpBox.role.name"
        :isPresent="helpBox.role.isPresent"
        :locked="helpBox.role.locked"
        :img="`/img/${helpBox.role.img}`"
      />
    </div>
    <!-- Titre -->
    <p class="self-center font-black text-lg lg:text-2xl">
      PARAMÈTRES DE LA PARTIE
    </p>
  
    <!-- Conteneur principal -->
    <div class="w-full h-full mt-4 grid grid-rows-[auto_1fr_1fr_auto] grid-cols-2 gap-4 grow overflow-auto">
      
      <!-- Sélection du nombre de joueurs -->
      <select
        :disabled="optionsLoading.players || !userIsOwner"
        class="w-full h-10 grid-col-span-2 lg:h-12 border rounded-lg px-2 text-center cursor-pointer"
        id="nbPlayer"
        v-model="numberOfPlayer"
        @change="changeNumberOfPlayer"
      >
        <option v-for="n in [3,4,5,6,7,8,9,10,15,20]" :key="n" :value="n">
          {{ n }} Joueurs
        </option>
      </select>
  
      <!-- Sélection des rôles -->
      <div class="grid-row-start-2 grid-row-span-3 grid-col-span-2 w-full grid grid-rows-[auto_1fr]">
        
        <!-- Titre rôles -->
        <div class="text-center p-5">
          <p class="font-black text-sm lg:text-xl">Choisissez les rôles présents dans la partie</p>
          <p class="text-gray-600">Civil et espion ne peuvent pas être désactivés</p>
        </div>
  
        <!-- Cartes des rôles -->
        <div id="card-container" class="w-full flex flex-wrap justify-center gap-6 p-1 lg:gap-7 lg:p-5">
          <cardRole @help="handleHelp" is-present locked :action="()=>{}" name="Civil" img="civilianHd.jpg" />
          <cardRole @help="handleHelp" is-present locked :action="()=>{}" name="Espion" img="spyHd.jpg" />
          <cardRole @help="handleHelp"
            :is-present="currentGame.gameOption.whiteIsPresent"
            :locked="false"
            name="Mr.White"
            img="mrwhiteHd.jpg"
            :action="changeMrWhite"
          />
        </div>
      </div>
    </div>
  
    <!-- Boutons de validation -->
    <div class="grid grid-cols-2 gap-4 p-4">
      
      <!-- Bouton "Lancer la partie" -->
      <div
        :class="{
          'flex items-center justify-center rounded-xl':true,
          'bg-amber h-12  text-center text-lg font-bold cursor-pointer hover:scale-101 transition': userIsOwner,
          'cursor-not-allowed bg-gray-400': !userIsOwner || !gameisready,
        }"
        @click="lauchGame"
      >
        <p v-if="userIsOwner">Lancer la partie</p>
        <div v-else class="flex items-center justify-center space-x-2">
          <div class="w-3 h-3 bg-amber rounded-full animate-bounce animate-delay-0 animate-duration-1000"></div>
          <div class="w-3 h-3 bg-amber rounded-full animate-bounce animate-delay-100 animate-duration-1000"></div>
          <div class="w-3 h-3 bg-amber rounded-full animate-bounce animate-delay-200 animate-duration-1000"></div>
        </div>
      </div>
  
      <!-- Bouton "Copier le lien" -->
      <div 
        class="bg-amber h-12 flex items-center justify-center rounded-xl text-center text-lg font-bold cursor-pointer hover:scale-101 transition"
        @click="copyLink"
      >
        <p>{{ copyTextButton }}</p>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { useFetch } from '@/composable/useFetch'
import { computed, nextTick, ref, watch, watchEffect } from 'vue'
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import cardRole from '@/components/game/cardRole.vue'
import helpBoxComp from '../game/helpBoxComp.vue'
const { infoUser } = storeToRefs(useAuthStore())
const { currentGame } = storeToRefs(useGameStore())
const numberOfPlayer = ref(currentGame.value.gameOption.maxPlayers)
const copyTextButton = ref('Copier le Code')


const helpBox = ref({
  statut:false,
  role: {
    name: '',
    isPresent: false,
    locked: false,
    img: '',
  },
})
const optionsLoading = ref({
  players: false,
})
const userIsOwner = computed(
  () => currentGame.value.ownerId === infoUser.value.id,
)
const gameisready = computed(() => {
  return (
    currentGame.value.users.length >= 3 
  )
})
watch(
  () => currentGame.value.gameOption.maxPlayers,
  value => {
    numberOfPlayer.value = value
  },
)
watch(numberOfPlayer, (newValue, old) => {
  if (newValue < currentGame.value.users.length) {
    //console.log('inferieur')
    numberOfPlayer.value = old
  }
})
watchEffect(async () => {
  if (helpBox.value.statut) {
    await nextTick()
    const helpBoxElement = document.getElementById('helpBox')
    if (helpBoxElement) {
      helpBoxElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      })
    }
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
  if(userIsOwner.value===false) return false
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

function handleHelp(role:{name:string, isPresent:boolean, locked:boolean, img:string}) {
  helpBox.value.statut = true
  helpBox.value.role = role
}
function closeHelp() {
  helpBox.value.statut = false
}
</script>

<style scoped>
.image {
  background-image: url('http:/maison.laurisceresoli.fr/avatars/image.jpg');
}
</style>
