<template>
  <div :class="{
    'w-full h-full  p-6  flex flex-col items-center  justify-center':true,
    'justify-start!':app.activeBreakPoint === 'mobile',
  }">
    <div
    :class="{
      'w-full h-fit bg-zinc-300   p4 rounded-2xl shadow-lg lg:py-10!  items-center flex flex-col justify-center ':true,
      'h-80%!': app.activeBreakPoint !== 'mobile',
    }"
    ref="container">
    <Transition name="fade" mode="out-in">
      <h1 v-if="!isSelected" class="text-2xl font-extrabold h-100px text-center mb-12 lg:text-4xl text-white tracking-wider drop-shadow-lg">
        Choisissez une enveloppe !
      </h1>
      <div v-else class=" h-fit w-50% flex justify-center    mb-12 lg:mb-20 text-white text-center bg-white/30 px-6 py-4 rounded-2xl shadow-lg">
        <span class="text-xl lg:text-3xl gap-4 flex-center-col" v-if="auth.infoUser.currentWord">
          <span>Votre mot est</span><span class="text-4xl inline-block color-amber lg:text-6xl font-bold text-gray-300 drop-shadow-md">{{ auth.infoUser.currentWord }}</span>
        </span>
        <span v-else class="text-2xl lg:text-3xl  font-semibold color-amber">Vous êtes Mr White</span>
      </div>
    </Transition>

    <div class="flex flex-wrap justify-center gap-6 mb-12 lg:mb-20">
      <div v-for="i in numberOfIndex" :key="`enveloppe${i}`" class="transform transition-all duration-300 hover:scale-110">
        <EnveloppeSvg
          :width="containerWidth <= 500 ? 100 : 150"
          :open="open === i"
          @click="openEnveloppe(i)"
          class="cursor-pointer  transition-all ease-in-out "
        />
      </div>
    </div>

    <Transition name="fade">
      <div v-if="isSelected" class="flex flex-col items-center text-center">
        <div class="animate-pulse text-lg text-white font-semibold">En attente des autres joueurs...</div>
      </div>
    </Transition>
    </div>

  </div>

</template>

<script setup lang="ts">
import EnveloppeSvg from '@/assets/SVG/EnveloppeSvg.vue'
import { useGameStore } from '@/stores/game'
import { ref, useTemplateRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useFetch } from '@/composable/useFetch'
import { useElementBounding } from '@vueuse/core'
import { useAppliStore } from '@/stores/appli'
const auth = useAuthStore()
const app= useAppliStore()
const { currentGame } = storeToRefs(useGameStore())
const container= useTemplateRef('container')
const { width:containerWidth } = useElementBounding(container)
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
