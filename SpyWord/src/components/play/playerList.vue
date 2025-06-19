<template>
  <div class="w-full my-2 px-2 grid place-items-center" ref="userList">
    <Teleport to="body">
      <bulleComp
        ref="bulle"
        :class="`absolute  z-1000000`"
        :style="positionStyle"
        v-if="selectedPlayer !== null"
        :selected-player="selectedPlayer"
        @click-outside="deleteModal"
        :arrow-position="{
          side: `${infoWindow.width < 1024 ? 'top' : 'left'}`,
          offset: positionStyle.offset!,
        }"
      />
    </Teleport>

    <!-- Liste des joueurs -->
    <div
      class="flex gap-2 items-center lg:flex-col lg:grid-cols-3 lg:gap-4 w-full h-full"
    >
      <!-- Joueurs actifs -->
      <div
        v-for="player in sortedUsers"
        :key="player.id"
        @click="selectPlayer($event, player.id)"
        :class="[
          'overflow-visible  container-player transform scale-90 lg:(scale-100 scale-x-95 origin-left) p-3 flex flex-col items-center gap-3 bg-gradient-to-b shadow-md rounded-lg transition-all lg:grid lg:grid-cols-[100px_auto_50px] lg:items-center lg:w-full',

          // Si pas en jeu ou phase finale/vote : fond doux bleu-gris
          !currentGame.inGame ||
          currentGame.properties?.gamePhase === 'end' ||
          currentGame.properties?.gamePhase === 'vote'
            ? 'scale-100! from-sky-100! to-sky-200! '
            : '',

          // Joueur actif pendant la phase de jeu : jaune doux
          currentGame.inGame &&
          player.id ===
            currentGame.properties?.orderGame?.[
              currentGame.properties?.indexCurrentPlayer!
            ] &&
          currentGame.properties.gamePhase === 'play'
            ? 'scale-100! from-amber-300! to-amber-400! '
            : '',

          // Si en jeu et non actif : fond neutre doux
          currentGame.inGame
            ? 'cursor-pointer from-cyan-300 to-cyan-400  '
            : '',
        ]"
      >
        <!-- Avatar -->
        <div class="relative w-20 h-20 lg:col-start-1">
          <div
            class="w-full h-full rounded-full overflow-hidden border-4 transition-all"
            :class="
              player.gameStat?.isAlive ? 'border-green-400' : 'border-red-400'
            "
          >
            <portraitComp
              :url="player.gameStat?.urlAvatar!"
              :eliminated="!player.gameStat?.isAlive"
            />
          </div>

          <!-- Icône utilisateur -->
          <div
            v-if="player.id === infoUser.id"
            class="absolute bottom-0 left-2 w-6 h-6 bg-green-500 rounded-full p-1 flex items-center justify-center shadow-md"
          >
            <img
              src="../../assets/images/UserProfile.png"
              class="w-full h-full object-contain"
            />
          </div>

          <!-- Icône Propriétaire -->
          <div
            v-if="player.id === currentGame.ownerId"
            class="absolute bottom-0 right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-md"
          >
            <img
              src="../../assets/images/superUser.png"
              class="w-full h-full object-contain"
            />
          </div>

          <!-- Bouton Expulsion -->
          <div
            v-else-if="
              !currentGame.inGame &&
              !animationIsVisible &&
              player.id !== infoUser.id &&
              userIsOwner
            "
            class="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition-all"
            @click="kick(player.id === currentGame.ownerId, player.id)"
          >
            <img src="../../assets/images/delete.png" class="w-5 h-5" />
          </div>
        </div>

        <!-- Nom -->
        <div
          class="text-gray-700 ___ text-sm font-medium truncate lg:col-start-2 lg:(text-center text-lg font-semibold)"
        >
          {{ player.fullName }}
        </div>
      </div>

      <!-- Slots vides -->
      <div
        v-for="empty in emptySlot"
        :key="`empty${empty}`"
        class="overflow-visible container-player transform scale-90 lg:(scale-100 scale-x-95 origin-left) p-3 flex flex-col items-center gap-3 bg-gradient-to-b from-gray-600 to-gray-800 shadow-inner rounded-lg transition-all lg:grid lg:grid-cols-[100px_auto_50px] lg:items-center lg:w-full opacity-75"
      >
        <div
          class="rounded-full overflow-hidden h-20 w-20 border-black/30 border-4"
        >
          <portraitComp url="/img/emptySlot.jpg" class="w-20 h-20" />
        </div>
        <p class="text-white text-sm font-semibold lg:text-lg">Vide</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useFetch } from '@/composable/useFetch'
import { useAppliStore } from '@/stores/appli'
import { useAnimationStore } from '@/stores/animation'
import portraitComp from '../animation/assets/portraitComp.vue'
import {
  computed,
  ref,
  shallowRef,
  useTemplateRef,
  watchEffect,
  type Ref,
} from 'vue'
import { useElementBounding } from '@vueuse/core'
import bulleComp from '../game/bulleComp.vue'
import type { User } from '@/models/user.model'

const { infoWindow, gameWindowBoundaries } = storeToRefs(useAppliStore())
const { currentGame } = storeToRefs(useGameStore())
const { infoUser } = storeToRefs(useAuthStore())
const { isVisible: animationIsVisible } = storeToRefs(useAnimationStore())
async function kick(isOwner: boolean, playerId: number) {
  if (isOwner) return
  const { fetchData } = useFetch(`api/games/kick?user_id=${playerId}`, {
    method: 'PUT',
  })
  await fetchData()
}
const userIsOwner = currentGame.value.ownerId === infoUser.value.id
const selectedPlayer = ref<number | null>(null)
const userList = useTemplateRef('userList')
const bulle = useTemplateRef('bulle')
const positionStyle = computed(() => {
  if (infoWindow.value.width < 1024) {
    let initialValue = 0
    let additionalOffset = 0
    const leftlimit = 0
    const rightLimit = Number(gameWindowBoundaries.value?.width)
    if (bulle.value?.bulleBounding) {
      initialValue =
        userBounding.value?.x -
        bulle.value?.bulleBounding.width / 2 +
        userBounding.value?.width / 2
      if (initialValue < leftlimit) {
        initialValue = leftlimit
      }
      if (initialValue + bulle.value?.bulleBounding.width > rightLimit) {
        additionalOffset = -50
        initialValue =
          initialValue -
          (bulle.value?.bulleBounding.width - (rightLimit - initialValue))
      }
    }
    return {
      top: `${userBounding.value?.y + userBounding.value?.height + 10}px`,
      left: `${initialValue}px`,
      width: `${userBounding.value?.width * 2.5}px`,
      offset:
        Math.abs(
          initialValue -
            (userBounding.value?.x + userBounding.value?.width / 2),
        ) + additionalOffset,
    }
  } else {
    let initialValue = 0
    let additionalOffset = 0
    const toplimit = Number(gameWindowBoundaries.value?.y)
    const botLimit = Number(gameWindowBoundaries.value?.bottom)
    if (bulle.value?.bulleBounding) {
      initialValue =
        userBounding.value?.y -
        bulle.value?.bulleBounding.height / 2 +
        userBounding.value?.height / 2

      if (initialValue < toplimit) {
        additionalOffset = 10
        initialValue = toplimit
      }
      if (initialValue + bulle.value?.bulleBounding.height > botLimit) {
        additionalOffset = -30
        initialValue =
          initialValue -
          (bulle.value?.bulleBounding.height - (botLimit - initialValue))
      }
    }
    return {
      top: `${initialValue}px`,
      left: `${userBounding.value?.x + userBounding.value?.width + 10}px`,
      width: `${userBounding.value?.width}px`,
      offset:
        Math.abs(
          initialValue -
            (userBounding.value?.y + userBounding.value?.height / 2),
        ) + additionalOffset,
    }
  }
})
const emptySlot = computed(() => {
  if (currentGame.value.inGame) return 0
  return (
    currentGame.value.gameOption.maxPlayers - currentGame.value.users.length
  )
}) // Vérifie si la liste des utilisateurs est vide
// Récupère les dimensions de la liste des utilisateurs
const parentRef = shallowRef<HTMLElement | null>(null) // Référence réactive pour le parent // Récupère les dimensions de la bulle
const userBounding = ref<{
  height: Ref<number, number>
  bottom: Ref<number, number>
  left: Ref<number, number>
  right: Ref<number, number>
  top: Ref<number, number>
  width: Ref<number, number>
  x: Ref<number, number>
  y: Ref<number, number>
  update: () => void
}>({
  height: ref(0),
  bottom: ref(0),
  left: ref(0),
  right: ref(0),
  top: ref(0),
  width: ref(0),
  x: ref(0),
  y: ref(0),
  update: () => {},
}) // Stocke les dimensions

const selectPlayer = (event: MouseEvent, id: number) => {
  if (!currentGame.value.inGame) return
  selectedPlayer.value = id
  const playerElement = event.target as HTMLElement
  const parent = playerElement.closest(
    '.container-player',
  ) as HTMLElement | null

  if (parent) {
    // Fait défiler l'élément dans la vue
    parentRef.value = parent // Stocke la référence du parent
    userBounding.value = useElementBounding(parentRef) // Met à jour le bounding
  }
}

watchEffect(() => {
  if (
    Number(userBounding.value?.x + userBounding.value.width / 2) < 0 ||
    Number(userBounding.value?.x + userBounding.value?.width / 2) >
      infoWindow.value.width ||
    Number(userBounding.value?.y + userBounding.value.height / 2) <
      Number(gameWindowBoundaries.value!.y) ||
    userBounding.value?.bottom - userBounding.value.height / 2 >
      Number(gameWindowBoundaries.value?.bottom)
  ) {
    parentRef.value = null
    selectedPlayer.value = null
  }
})

function deleteModal() {
  selectedPlayer.value = null
}

const sortedUsers = computed(() => {
  if (currentGame.value.properties?.orderGame === undefined) {
    return currentGame.value.users
  }
  const order = currentGame.value.properties.orderGame
  const userSortedByOrder = new Set<User>()

  // Ajout des joueurs selon l'ordre du jeu
  order?.forEach(userId => {
    const user = currentGame.value.users.find(user => user.id === userId)
    if (user) {
      userSortedByOrder.add(user)
    }
  })

  // Ajout des joueurs éliminés qui ne sont pas déjà dans userSortedByOrder
  currentGame.value.users.forEach(user => {
    if (user.gameStat?.isAlive === false) {
      userSortedByOrder.add(user)
    }
  })

  // Conversion en tableau et séparation entre vivants et éliminés
  const sortedArray = Array.from(userSortedByOrder)
  const userAlive = sortedArray.filter(user => user.gameStat?.isAlive)
  const userEliminated = sortedArray.filter(user => !user.gameStat?.isAlive)

  return [...userAlive, ...userEliminated]
})
</script>

<style scoped></style>
