<template>
  <div class=" w-full  md:min-w-500px lg:min-w-700px ">
    <div class="flex-center-col justify-center gap-10 w-full">
      <div
        :class="`w-200px h150px rounded-full overflow-hidden flex-center portrait `"
        :style="{
          backgroundImage: `url(${url}${currentPlayer?.gameStat?.urlAvatar})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }"
      ></div>
      <span
        ><span class="font-bold text-size-lg">{{
          currentPlayer?.fullName
        }}</span>
        va proposer un mot <span class="pointAnime">.</span
        ><span class="pointAnime point-2">.</span
        ><span class="pointAnime point-3">.</span></span
      >
      <Transition name="down" appear
        ><verificationComp
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
import { computed, ref } from 'vue'
const { infoUser } = storeToRefs(useAuthStore())
const url = ref(import.meta.env.VITE_URL_API)
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
