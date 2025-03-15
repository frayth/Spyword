<template>
  <div class="w-full p-5">
    <div class="flex gap-4 overflow-auto lg:flex-col lg:grid-cols-3 lg:gap-4 w-full">
      <div
        v-for="player in currentGame.users"
        :key="player.id"
        class="p-3 flex flex-col items-center gap-3 bg-gradient-to-b from-cyan-600 to-cyan-800 shadow-lg rounded-lg transition-all duration-300 lg:grid lg:grid-cols-[100px_auto_50px] lg:items-center"
      >
        <!-- Avatar -->
        <div class="relative w-20 h-20 lg:col-start-1">
          <div
            class="w-full h-full rounded-full overflow-hidden border-4 transition-all duration-300"
            :class="player.gameStat?.isAlive ? 'border-green-400' : 'border-red-400'"
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
            <img src="../../assets/images/UserProfile.png" class="w-full h-full object-contain" />
          </div>
  
          <!-- Icône Propriétaire -->
          <div
            v-if="player.id === currentGame.ownerId"
            class="absolute bottom-0 right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-md"
          >
            <img src="../../assets/images/superUser.png" class="w-full h-full object-contain" />
          </div>
  
          <!-- Bouton Expulsion -->
          <div
            v-else-if="!currentGame.inGame && !animationIsVisible && player.id !== infoUser.id && userIsOwner"
            class="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition-all"
            @click="kick(player.id === currentGame.ownerId, player.id)"
          >
            <img src="../../assets/images/delete.png" class="w-5 h-5" />
          </div>
        </div>
  
        <!-- Nom du joueur -->
        <div class="text-white text-sm font-medium truncate lg:col-start-2 lg:text-center">
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
            v-else-if="!currentGame.inGame && !animationIsVisible && player.id !== infoUser.id && userIsOwner"
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
</script>

<style scoped></style>
