<template>
  <div class="w-full h-full bg-amber">
    <Transition name="fade" mode="out-in">
      <h1 v-if="!isSelected" class="text-size-5 font-900 text-center m-b-10 lg:(text-size-10 m-b-20)">
        Choississez une enveloppe !
      </h1>
      <div v-else class="flex justify-center m-b-10 lg:(m-b-20) ">
        <span class="text-size-4 lg:(text-size-5)" v-if="auth.infoUser.currentWord">Votre mot est <span class="text-size-6 font-bold lg:(text-size-8)">{{auth.infoUser.currentWord}}</span></span>
        <span v-else>Vous êtes Mr White</span>
      </div>
    </Transition>
    <div class="flex flex-wrap justify-center m-b-10 lg:(m-b-20)">
      <div v-for="i in numberOfIndex" :key="`enveloppe${i}`">
        <EnveloppeSvg
          :width="appli.infoWindow.width<=1024 ? 100 : 200"
          :open="open === i ? true : false"
          @click="openEnveloppe(i)"
        />
      </div>
    </div>
    <Transition>
      <div v-if="isSelected" class="flex-center-col">
        <div class="blink"> En attente des autre joueurs ...</div>
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
