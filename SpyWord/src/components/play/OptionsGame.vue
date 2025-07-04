<template>
  <div class="w-full h-full flex flex-col pt-2 md:gap-3 relative">
    <div
      v-if="helpBox.statut"
      id="helpBox"
      class="z-11 bg-black/20 absolute backdrop-blur-1 top-0 left-0 w-full h-full overflow-auto grid justify-center px-4 color-white"
      @click="closeHelp"
    >
      <helpBoxComp
        class=""
        :name="helpBox.role.name"
        :isPresent="helpBox.role.isPresent"
        :locked="helpBox.role.locked"
        :img="`/img/${helpBox.role.img}`"
      />
    </div>
    <div
      v-if="selectAvatarPanelOpen"
      class="absolute top-0 left-0 w-full h-full z-999 bg-gray-900/50 grid justify-center items-center"
    >
      <AvatarPanel @close="closeAvatarPanel" />
    </div>
    <!-- Avatar de l'utilisateur -->
    <changeAvatar
      class="self-center"
      @open="selectAvatarPanelOpen = true"
      ref="changeAvatarElement"
    />
    <hr class="border-gray-300 dark:border-gray-600 my-2" />
    <!-- Conteneur principal -->
    <div
      class="w-full h-full mt-2 grid grid-rows-[auto_auto_1fr_1fr_auto] grid-cols-2 md:gap-4 grow overflow-visible"
    >
      <!-- Sélection du nombre de joueurs -->
      <div
        class="w-full md:(max-w-md ) p-1 grid-col-start-1 grid-col-span-1 justify-self-center rounded-xl"
      >
        <label for="nbPlayer">
          <h2
            class="text-sm md:(text-lg) font-bold text-center mb-3 text-gray-800 dark:text-white"
          >
            Sélectionner le nombre de joueurs max
          </h2>
        </label>

        <div class="relative">
          <select
            :disabled="optionsLoading.players || !userIsOwner"
            id="nbPlayer"
            v-model="numberOfPlayer"
            @change="changeNumberOfPlayer"
            class="appearance-none w-full h-12 md:h-14 text-base text-center font-medium text-gray-700 dark:text-gray-100 bg-white border-yellow-400 rounded-lg px-4 pr-10 cursor-pointer transition-all duration-200 ease-in-out hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option
              v-for="n in [3, 4, 5, 6, 7, 8, 9, 10, 15, 20]"
              :key="n"
              :value="n"
            >
              {{ n }} Joueurs
            </option>
          </select>

          <!-- Petite flèche pour indiquer que c'est un menu déroulant -->
          <div
            class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-300"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
      <div
        class="w-full md:max-w-md p-1 grid-col-start-2 grid-col-span-1 justify-self-center rounded-xl grid grid-rows-[auto_1fr] overflow-visible"
      >
        <h2
          class="text-sm md:text-lg font-bold text-center mb-4 text-gray-800 dark:text-white"
        >
          Options de Partie
        </h2>

        <div
          class="flex gap-3 items-center justify-center md:justify-start overflow-visible"
        >
          <input
            type="checkbox"
            id="verifPlayer"
            class="accent-amber-500 scale-110 rounded-sm w-3 h-3 md:(w-4 h-4)"
            @click="handleVerifOption"
            v-model="currentGame.gameOption.verificationOwner"
            :disabled="!userIsOwner"
          />

          <label
            for="verifPlayer"
            class="text-sm md:text-base text-gray-700 dark:text-gray-300"
          >
            <span class="font-medium text-8px md:(text-sm) select-none"
              >Vérification par Joueur</span
            >
          </label>

          <!-- Info Tooltip -->
          <div class="relative group overflow-visible">
            <div
              class="w-4 h-4 md:(w-6 h-6 text-sm) bg-amber-500 text-white text-8px font-bold rounded-lg cursor-pointer flex items-center justify-center hover:scale-105 transition-transform"
              @mouseenter="optionToolBoxIsVisible = true"
              @mouseleave="optionToolBoxIsVisible = false"
            >
              ?
            </div>
            <div
              v-if="optionToolBoxIsVisible"
              class="absolute bottom-120% left--100px md:left-1/2 -translate-x-1/2 w-max max-w-[200px] text-xs px-3 py-2 bg-gray-700 text-white rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-10"
            >
              Si cette option est activée, le propriétaire devra valider
              manuellement chaques propositions.
            </div>
          </div>
        </div>
      </div>
      <hr class="border-gray-300 dark:border-gray-600 my-2 grid-col-span-2" />
      <!-- Sélection des rôles -->
      <div
        class="grid-row-start-3 grid-row-span-3 grid-col-span-2 w-full grid grid-rows-[auto_1fr]"
      >
        <!-- Titre rôles -->
        <div class="text-center p-5">
          <p class="font-black text-sm md:text-xl">
            Choisissez les rôles présents dans la partie
          </p>
          <p class="text-gray-600">
            Civil et espion ne peuvent pas être désactivés
          </p>
        </div>

        <!-- Cartes des rôles -->
        <div
          id="card-container"
          class="w-full flex flex-wrap justify-center gap-6 p-1 md:gap-7 md:p-5"
        >
          <cardRole
            @help="handleHelp"
            is-present
            locked
            :action="() => {}"
            name="Civil"
            img="civilianHd.jpg"
          />
          <cardRole
            @help="handleHelp"
            is-present
            locked
            :action="() => {}"
            name="Espion"
            img="spyHd.jpg"
          />
          <cardRole
            @help="handleHelp"
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
      ref="lauchGameButton"
        :class="{
          'flex items-center justify-center rounded-xl': true,
          'bg-amber h-12  text-center text-lg font-bold cursor-pointer hover:scale-101 transition':
            userIsOwner,
          'cursor-not-allowed bg-gray-400': !userIsOwner || !gameisready,
        }"
        @click="lauchGame"
      >
        <button
          :class="{
            'select-none font-100': true,
            'cursor-not-allowed bg-gray-400': !userIsOwner || !gameisready,
          }"
          v-if="userIsOwner"
        >
          Lancer la partie
        </button>
        <div
          v-else
          class="flex justify-center space-x-3 px-4 py-2 bg-white/5 rounded-xl w-full h-full shadow-md border border-white/10 backdrop-blur-md"
        >
          <div
            v-if="timerButton"
            class="flex items-center justify-center gap-1 space-x-1"
          >
            <div
              :class="{
                'w-3 h-3 bg-white rounded-full animate-bounce animate-delay-0! animate-duration-1000': true,
                'w-2! h-2!': activeBreakPoint === 'mobile',
              }"
            ></div>
            <div
              :class="{
                'w-3 h-3 bg-white rounded-full animate-bounce animate-delay-150! animate-duration-1000': true,
                'w-2! h-2!': activeBreakPoint === 'mobile',
              }"
            ></div>
            <div
              :class="{
                'w-3 h-3 bg-white rounded-full animate-bounce animate-delay-300! animate-duration-1000': true,
                'w-2! h-2!': activeBreakPoint === 'mobile',
              }"
            ></div>
          </div>
          <div
            v-else
            class="flex items-center space-x-2 text-sm text-white/80 font-medium"
          >
            <span
              :class="{
                'text-0.58rem text-center': activeBreakPoint === 'mobile',
              }"
              >En attente du Propriétaire...</span
            >
          </div>
        </div>
      </div>

      <!-- Bouton "Copier le lien" -->
      <div
        class="bg-amber h-12 flex items-center justify-center rounded-xl text-center text-lg font-bold cursor-pointer hover:scale-101 transition"
        @click="copyLink"
      >
        <p class="select-none">{{ copyTextButton }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFetch } from '@/composable/useFetch'
import { useAppliStore } from '@/stores/appli'

import {
  computed,
  nextTick,
  onUnmounted,
  ref,
  useTemplateRef,
  watch,
  watchEffect,
} from 'vue'
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import cardRole from '@/components/game/cardRole.vue'
import helpBoxComp from '../game/helpBoxComp.vue'
import changeAvatar from './changeAvatar.vue'
import AvatarPanel from './AvatarPanel.vue'
const { activeBreakPoint } = storeToRefs(useAppliStore())
const { infoUser } = storeToRefs(useAuthStore())
const { currentGame } = storeToRefs(useGameStore())
const numberOfPlayer = ref(currentGame.value.gameOption.maxPlayers)
const copyTextButton = ref('Copier le Code')
const selectAvatarPanelOpen = ref(false)
const changeAvatarElement = useTemplateRef('changeAvatarElement')
const timerButton = ref(false)
const optionToolBoxIsVisible = ref(false)
const timerButtonEvent = setInterval(() => {
  timerButton.value = !timerButton.value
}, 5000)
onUnmounted(() => {
  clearInterval(timerButtonEvent)
})
const helpBox = ref({
  statut: false,
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
  return currentGame.value.users.length >= 3
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
watch(checkWhiteCondition,async (newValue)=>{
  if (newValue === false && currentGame.value.gameOption.whiteIsPresent) {
    currentGame.value.gameOption.whiteIsPresent = false
    await changeMrWhite()
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
  if (userIsOwner.value === false) return false
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

function handleHelp(role: {
  name: string
  isPresent: boolean
  locked: boolean
  img: string
}) {
  helpBox.value.statut = true
  helpBox.value.role = role
}
function closeHelp() {
  helpBox.value.statut = false
}

function closeAvatarPanel() {
  selectAvatarPanelOpen.value = false
  changeAvatarElement.value?.mainChangeAvatar?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
}
const handleVerifOption = async () => {
  const {fetchData,inError} = useFetch(
    `api/games/${currentGame.value.id}/options/verification?verification=${!currentGame.value.gameOption.verificationOwner}`,
    { method: 'PUT' },
  )
  if (!userIsOwner.value) {
    setTimeout(() => {
      currentGame.value.gameOption.verificationOwner =
        !currentGame.value.gameOption.verificationOwner
    }, 10)
    return
  }
  await fetchData()
  if (inError.value) {
    currentGame.value.gameOption.verificationOwner =
      !currentGame.value.gameOption.verificationOwner
  }
}
</script>

<style scoped>
.image {
  background-image: url('http:/maison.laurisceresoli.fr/avatars/image.jpg');
}
</style>
