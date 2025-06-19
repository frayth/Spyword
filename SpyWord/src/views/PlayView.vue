<template>
  <div class="bg-white w-full h-screen lg:p-5">
    <div
      class="grid grid-rows-[1fr] w-full h-full border border-amber"
      ref="bandeau"
    >
      <!-- Bandeau supérieur -->


      <!-- Contenu principal -->
      <div
        :class="`h-full w-full grid grid-rows-[auto_2px_3fr] lg:(grid-rows-1 grid-cols-[1fr_2px_2fr])  lg:max-h-[calc(100vh)] relative bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 dark:from-gray-800 dark:via-gray-900 dark:to-black`"
        id="mainPanel"
        ref="gameView"
      >
        <!-- Liste des joueurs -->
        <div class="overflow-auto">
          <playerList />
        </div>

        <div
          id="separator"
          class="h-2px w-full bg-amber-300 lg:(h-full w-2px)"
        ></div>
        <!-- Zone de jeu -->
        <div
          class="h-full overflow-auto relative grid grid-rows-[auto_1fr]"
          @click="animation = true"
          ref="mainPanel"
        >
        <div class="w-full flex justify-end py-2 px-3"><optionSvg class="cursor-pointer" @click="optionIsOpen=true"></optionSvg></div>
          <OptionsGame
            v-if="!game.currentGame.inGame"
            :game="game.currentGame"
          />
          <gameComponent v-else>
            {{ auth.infoUser.currentWord }}
          </gameComponent>
          <div class=" w-fit h-fit min-w-200px absolute top-50% left-50% translate--50% shadow-2xl z-10 rounded-2xl" v-if="optionIsOpen">
            <optionGameComp @close="optionIsOpen = false" />
          </div>
          <Animation
            :width="width"
            :height="height"
            :test="{ width, height }"
            :isVisible="animation"
            @close="animation = false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import OptionsGame from '@/components/play/OptionsGame.vue'
import { useAppliStore } from '@/stores/appli'
import { useElementBounding, useWakeLock } from '@vueuse/core'
import playerList from '@/components/play/playerList.vue'
import { useGameStore } from '@/stores/game'
import optionGameComp from '@/components/game/optionGameComp.vue'
import optionSvg from '@/assets/SVG/optionSvg.vue'
import { JoinChanel } from '@/Services/useWs'
import { onMounted, reactive, ref, useTemplateRef } from 'vue'
import Animation from '@/components/game/animationComponent.vue'
import { useAuthStore } from '@/stores/auth'
import gameComponent from '@/components/play/gameComponent.vue'
const wakeLock = reactive(useWakeLock())
const appli = useAppliStore()
const gameView = useTemplateRef('gameView')
appli.setGameWindowBoundaries(gameView)
const auth = useAuthStore()
const game = useGameStore()
const panel = useTemplateRef('mainPanel')
const bodyElement = ref<HTMLElement | null>(null)
const optionIsOpen = ref(false)
onMounted(() => {
  bodyElement.value = document.querySelector('body')
})
const { width, height } = useElementBounding(panel)
const animation = ref(false)

onMounted(() => {
  JoinChanel(game.currentGame.id)
  wakeLock.request('screen')
})
</script>

<style scoped></style>
