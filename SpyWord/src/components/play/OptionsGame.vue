<template>
  <div class="w-full h-full flex flex-col">
    <p class="self-center font-900  lg:(text-size-2xl)">PARAMETRES DE LA PARTIE</p>
    <div class="w-full h-full m-t-4 grid grid-rows-[auto_1fr_1fr_auto] grid-cols-[1fr_1fr] gap-4 overflow-auto lg:()">
      <select
        :disabled="optionsLoading.players || !userIsOwner"
        name="player"
        id="nbPlayer"
        class="w-full h-30px grid-col-span-2 lg:(h-50px) "
        @change="changeNumberOfPlayer"
        v-model="numberOfPlayer"
      >
        <option :value="3">3 Joueurs</option>
        <option :value="4">4 Joueurs</option>
        <option :value="5">5 Joueurs</option>
        <option :value="6">6 Joueurs</option>
        <option :value="7">7 Joueurs</option>
        <option :value="8">8 Joueurs</option>
        <option :value="9">9 Joueurs</option>
        <option :value="10">10 Joueurs</option>
        <option :value="15">15 Joueurs</option>
        <option :value="20">20 Joueurs</option>
      </select>
      <div class="grid-row-start-2 grid-row-span-3 grid-col-span-2 grid-col-start-1 w-full  bg-gray grid-row-[auto_1fr]">
        <div class="justify-self-center  p-5">
          <p class="font-900 text-sm text-center lg:(text-xl) ">Choissisez les rôles présents dans la partie</p>
          <p class="text-center">Civil et espion ne peuvent pas être désactivé</p>
        </div>
        <div class="w-full justify-center   flex flex-wrap p-1 gap-2 content-start lg:(gap-4 p-5)">
          <div class="w-150px h-100px bg-white  rounded-xl overflow-hidden relative lg:(w-200px h150px)">
            <div class="absolute bottom-10px left-10% p-0 w-80% bg-white border-black border flex-center-col">
              <p class="">Civil</p>
            </div>
            
            <img src="../../assets//images/civilian.jpg" alt="">
          </div>
          <div class="w-150px h-100px bg-white  rounded-xl overflow-hidden relative lg:(w-200px h150px)">
            <div class="absolute bottom-10px left-10% p-0 w-80% bg-white border-black border flex-center-col">
              <p class="">Espion</p>
            </div>
            <img src="../../assets//images/spy.jpg" alt="">
          </div>
          <div class="w-150px h-100px bg-white  cursor-pointer rounded-xl overflow-hidden relative lg:(w-200px h150px)" @click="handleMrWhite">
            <div v-if="!currentGame.gameOption.whiteIsPresent" class="absolute w-full h-full z-9 bottom-10px"><img src="../../assets/images/crossRed.png" alt=""></div>
            <div :class="
            {
              'absolute bottom-10px left-10% p-0 w-80% bg-white border-black border flex-center-col z-10':true,
              'line-through':!currentGame.gameOption.whiteIsPresent
            }">
              <p>Mr.White</p>
            </div>
            <img :class="{'filter-grayscale':!currentGame.gameOption.whiteIsPresent}" src="../../assets//images/mrwhite.webp" alt="" >
          </div>
        </div>
      </div>
      <div :class="{
        'grid-row-start-5 grid-col-start-1 bg-amber h-50px grid-center rounded-xl cursor-pointer':true,
        'cursor-auto! bg-gray-400':!userIsOwner
      }"
      @click="lauchGame">
      <p v-if="userIsOwner">Lancer la partie</p>
      <div v-else class="flex items-center justify-center space-x-2 ">
        <div class="w-4 h-4 bg-amber rounded-full animate-bounce animate-delay-0 animate-duration-[1000ms]"></div>
        <div class="w-4 h-4 bg-amber rounded-full animate-bounce animate-delay-100 animate-duration-[1000ms]"></div>
        <div class="w-4 h-4 bg-amber rounded-full animate-bounce  animate-delay-200 animate-duration-[1000ms]"></div>
        </div>
    </div>
      <div class="grid-row-start-5 grid-col-start-2 bg-amber h-50px grid-center rounded-xl cursor-pointer"
      @click="copyLink">
      <p>{{copyTextButton}}</p>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFetch } from '@/composable/useFetch'
import {  computed, ref, watch } from 'vue'
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
const {infoUser}=storeToRefs(useAuthStore())
const {currentGame} = storeToRefs(useGameStore())
const numberOfPlayer = ref(currentGame.value.gameOption.maxPlayers)
const copyTextButton =ref("Copier le Code")  
const optionsLoading = ref({
  players:false
})
const userIsOwner=computed(()=>currentGame.value.ownerId === infoUser.value.id)

watch(()=>currentGame.value.gameOption.maxPlayers,(value)=>{
  numberOfPlayer.value=value
})

async function changeNumberOfPlayer() {
  if(currentGame.value.ownerId !== infoUser.value.id)return
  const {fetchData,loading} = useFetch(`api/games/${currentGame.value.id}/options/players?players=${numberOfPlayer.value}`,{method:'PUT'})
  optionsLoading.value.players=true
  await fetchData()
  if(!loading.value){
    optionsLoading.value.players=false
  }
}
async function copyLink(){
  await navigator.clipboard.writeText(`${currentGame.value.slug}`)
  copyTextButton.value="Lien copié"
  setTimeout(() => {
    copyTextButton.value="Copier le Code"
  }, 2000);
}
async function handleMrWhite(){
  if(currentGame.value.ownerId !== infoUser.value.id)return
  if(currentGame.value.gameOption.maxPlayers<=3)return
  const {fetchData} = useFetch(`api/games/${currentGame.value.id}/options/white?present=${!currentGame.value.gameOption.whiteIsPresent}`,{method:'PUT'})
  await fetchData()
}

async function lauchGame(){
  if(currentGame.value.ownerId !== infoUser.value.id)return
  const {fetchData} = useFetch(`api/games/start`,{method:'PUT'})
  await fetchData()
}

</script>

<style scoped>
.image{
  background-image: url('http:/maison.laurisceresoli.fr/avatars/image.jpg');
}
</style>
