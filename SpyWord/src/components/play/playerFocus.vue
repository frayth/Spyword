<template>
  <div class="w-full md:min-w-500px lg:min-w-700px">
    <div class="flex-center-col justify-center gap-10 w-full">
      <div class="relative">
        <div class="flex justify-center items-center gap-4 w-200px overflow-hidden rounded-full relative">
        <portraitComp :url="currentPlayer?.gameStat?.urlAvatar!"></portraitComp>
      </div>
        <div class="absolute! h-100px! w-100px! translate-50% right-50px bottom-50px rounded-full! overflow-hidden border-2 border-cyan-500 shadow-lg" v-if="currentGame.properties.verifyPhase">
          <portraitComp  :url="owner?.gameStat?.urlAvatar!"></portraitComp>
        </div>
      </div>


      <span v-if="!currentGame.properties.verifyPhase"
        ><span class="font-bold text-size-lg">{{
          currentPlayer?.fullName
        }}</span>
        va proposer un mot <span class="pointAnime">.</span
        ><span class="pointAnime point-2">.</span
        ><span class="pointAnime point-3">.</span></span
      >
      <span v-else>

        Le <span class="text-cyan-500 font-900">propriétaire</span>  vérifie le mot <span class="pointAnime">.</span
        ><span class="pointAnime point-2">.</span
        ><span class="pointAnime point-3">.</span>
      </span>
      <Transition name="down" appear
        ><verificationComp
          ref="verification"
          v-if="currentGame.properties.verifyPhase && userIsOwner"
        ></verificationComp
      ></Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import verificationComp from '../verification/verificationComp.vue'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import portraitComp from '../animation/assets/portraitComp.vue'
const { infoUser } = storeToRefs(useAuthStore())
const { currentGame } = storeToRefs(useGameStore())
const userIsOwner = computed(() => {
  return currentGame.value.ownerId === infoUser.value.id
})

const currentPlayer = computed(() =>
  currentGame.value.users.find(
    user =>
      user.id ===
      currentGame.value.properties.orderGame![
        currentGame.value.properties.indexCurrentPlayer!
      ],
  ),
)
const owner= computed(() =>
  currentGame.value.users.find(user => user.id === currentGame.value.ownerId),
)
</script>

<style scoped>
@keyframes flash {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.pointAnime {
  animation: flash 2s infinite;
}

.point-2 {
  animation-delay: 250ms;
}
.point-3 {
  animation-delay: 500ms;
}
.portrait {
  box-shadow: 0 30px 50px rgba(0, 0, 0, 0.5);
  animation: levitation 5s ease-in-out infinite;
}
.portrait:hover {
  transform: translateY(-15px);
}
.down-enter-active,
.down-leave-active {
  transition: all 0.3s;
}
.down-enter-from,
.down-leave-to {
  transform: translateY(-10%);
  opacity: 0;
}
.down-enter-to,
.down-leave-from {
  transform: translateY(0);
}
</style>
