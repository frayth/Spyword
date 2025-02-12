<template>
  <div class="bg-white w-full h-screen lg:(p-5)">
    <div class="flex-center-col w-full h-full b-amber border" ref="bandeau">
      <div class="w-full grid grid-cols-[auto_auto_auto] items-center p-2">
        <LeaveGame />
        <h1 class="font-900 text-size-xl justify-self-center">SpyWord</h1>
        <div class=""></div>
      </div>
      <div :class="`h-100% w-100% bg-amber grid grid-col-[auto] grid-rows-[auto_1fr] lg:(grid grid-cols-3 gap-2 grid-rows-[auto] max-h-[calc(100vh-56px-42px)]) relative  `"  id="mainPanel">
        
        <div class="overflow-auto">
          <playerList />
        </div>

        <div class=" bg-red h-full p-2 overflow-auto relative lg:(grid-col-start-2 grid-col-span-2 p-5) " @click="animation=true" ref="mainPanel">
          
          <OptionsGame :game="game.currentGame" v-if="!game.currentGame.inGame"></OptionsGame>
          <gameComponent v-else> {{auth.infoUser.currentWord}}</gameComponent>
            <Animation :width="width" :height="height" :test="{width,height}" :isVisible="animation" @close="animation=false">
            </Animation>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import OptionsGame from '@/components/play/OptionsGame.vue'
import { useElementBounding } from '@vueuse/core'
import playerList from '@/components/play/playerList.vue'
import { useGameStore } from '@/stores/game'
import LeaveGame from '@/components/play/LeaveGame.vue'
import { JoinChanel } from '@/Services/useWs'
import { onMounted,ref, useTemplateRef } from 'vue'
import Animation from '@/components/game/animationComponent.vue'
import { useAuthStore } from '@/stores/auth'
import gameComponent from '@/components/play/gameComponent.vue'
const auth=useAuthStore()
const game = useGameStore()
const panel=useTemplateRef('mainPanel')
const {width,height}=useElementBounding(panel)


const animation=ref(false)

onMounted(() => {
  JoinChanel(game.currentGame.id)
})
</script>

<style scoped>

</style>
