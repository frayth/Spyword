<template>
  <div class="w-full m-y-2 p-x-2 grid place-items-center overflow-visible " >
      <!--verifVisibilité-->

    <!-- Liste des joueurs -->
    <div
      class="flex gap-2 z-1000000  items-center lg:flex-col lg:grid-cols-3 lg:gap-4 w-full h-full overflow-visible"
      ref="userList"
    >
      <div
        @click="selectPlayer($event, player.id)"
        v-for="player in sortedUsers"
        :key="player.id"
        :class="{
          ' overflow-visible container-player cursor-pointer transform scale-90 lg:(scale-100 scale-x-95 origin-left)   p-3 flex flex-col items-center gap-3 bg-gradient-to-b from-cyan-600 to-cyan-800 shadow-lg rounded-lg transition-all  lg:grid lg:grid-cols-[100px_auto_50px] lg:items-center lg:w-full': true,
          'scale-100! cursor-default! from-cyan-600! to-cyan-800! ':!currentGame.inGame || currentGame.properties?.gamePhase === 'end' || currentGame.properties?.gamePhase === 'vote' ,
          'transform scale-100! from-amber-600! to-amber-800!  ': currentGame.inGame &&
            player.id ===
            currentGame.properties?.orderGame![
              currentGame.properties?.indexCurrentPlayer!
            ],
        }"
      >
      
        
          <bulleComp
          v-if="selectedPlayer === player.id"
            :selected-player="selectedPlayer"
            :bounding="bounding!"
            @click-outside="deleteModal"
          ></bulleComp>


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

        <!-- Nom du joueur -->
        <div
          class="text-white text-sm font-medium truncate lg:col-start-2 lg:text-center"
        >
          {{ player.fullName }}
        </div>

        <!-- Icône Propriétaire (Desktop) -->
        <div v-if="infoWindow.width > 1025" class="lg:col-start-3">
          <img
            v-if="player.id === currentGame.ownerId"
            src="../../assets/images/superUser.png"
            class="w-6 h-6"
          />
          <img
            v-else-if="
              !currentGame.inGame &&
              !animationIsVisible &&
              player.id !== infoUser.id &&
              userIsOwner
            "
            src="../../assets/images/delete.png"
            class="w-6 h-6 cursor-pointer hover:scale-110 transition-all"
            @click="kick(player.id === currentGame.ownerId, player.id)"
          />
        </div>
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
import { computed, ref, shallowRef, useTemplateRef, watchEffect, type Ref } from 'vue'
import { useElementBounding } from '@vueuse/core'
import bulleComp from '../game/bulleComp.vue'
import type { User } from '@/models/user.model'




const { infoWindow } = useAppliStore()
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
const userList=useTemplateRef('userList')
const parentRef = shallowRef<HTMLElement | null>(null) // Référence réactive pour le parent
const bounding = ref<{
  height: Ref<number, number>
  bottom: Ref<number, number>
  left: Ref<number, number>
  right: Ref<number, number>
  top: Ref<number, number>
  width: Ref<number, number>
  x: Ref<number, number>
  y: Ref<number, number>
  update: () => void
}>() // Stocke les dimensions

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
    bounding.value = useElementBounding(parentRef) // Met à jour le bounding
  }
}

watchEffect(() => {
  if (Number(bounding.value?.y) < 0) {
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

<style scoped>
</style>
