<template>
  <div class="w-full h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 p-3">
    <Transition name="fade" mode="out-in">
      <h1 v-if="!isSelected" class="text-3xl font-bold text-center mb-10 lg:text-4xl lg:mb-20 text-white tracking-wide">
        Choisissez une enveloppe !
      </h1>
      <div v-else class="flex justify-center mb-10 lg:mb-20">
        <span class="text-2xl lg:text-3xl text-white" v-if="auth.infoUser.currentWord">
          Votre mot est <span class="text-4xl lg:text-5xl font-semibold">{{ auth.infoUser.currentWord }}</span>
        </span>
        <span v-else class="text-2xl lg:text-3xl text-white">Vous êtes Mr White</span>
      </div>
    </Transition>

    <div class="flex flex-wrap justify-center mb-10 lg:mb-20">
      <div v-for="i in numberOfIndex" :key="`enveloppe${i}`" class="transform transition-transform duration-300 hover:scale-105 w-fit h-fit">
        <EnveloppeSvg
          :width="appli.infoWindow.width <= 1024 ? 100 : 200"
          :open="open === i ? true : false"
          @click="openEnveloppe(i)"
          class="cursor-pointer  hover:shadow-2xl transition-all ease-in-out"
        />
      </div>
    </div>

    <Transition name="fade">
      <div v-if="isSelected" class="flex-center-col">
        <div class="blink text-lg text-white font-semibold">En attente des autres joueurs...</div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import EnveloppeSvg from '@/assets/SVG/EnveloppeSvg.vue'
import { useGameStore } from '@/stores/game'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppliStore } from '@/stores/appli'
import { useAuthStore } from '@/stores/auth'
import { useFetch } from '@/composable/useFetch'
const auth = useAuthStore()
const appli=useAppliStore()
const { currentGame } = storeToRefs(useGameStore())
const isSelected = ref(false)
const open = ref<number | null>(null)
const loadingOpening=ref(false)
const numberOfIndex=currentGame.value.gameOption.whiteIsPresent ? 3 : 2
async function openEnveloppe(index: number) {
  if (isSelected.value && loadingOpening) return
  const {loading,inError,fetchData}=useFetch('api/games/open',{method:'POST'})
  await fetchData()
  loadingOpening.value=loading.value
  if(!inError.value){
    open.value = index
    isSelected.value = true
  }
}
</script>

<style scoped>
.blink {
  animation: blink 1s  infinite;
}
@keyframes blink {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
