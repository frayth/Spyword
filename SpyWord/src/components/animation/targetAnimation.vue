<template>
  <div class="grid place-items-center text-white p-6 w-full h-full bg-gray-950">

    <Teleport to="body">
        <div
          ref="nameOverPortrait"
          v-if="currentOverPortrait !== null"
          class="absolute z-[1200000] px-4 py-3 rounded-xl bg-white border border-black text-black text-sm pointer-events-none"
          :style="{
            top: `${y}px`,
            left: `${x + 20 + ToolWidth >=appli.infoWindow.width? `${x - 20 - ToolWidth}` : `${x + 20}`   }px`,
            boxShadow: '2px 2px 0 #000, 4px 4px 0 #555',
          }"
        >
          <div class="relative">
            <div class="text-sm leading-tight">
              <div class="font-bold text-pink-700 tracking-wide lg:(text-4)">
                {{ nameOver }}
              </div>
              <div class="text-pink-400 italic">{{currentOverPortrait.role==='target'?'Cible':'Agent Secret'}}</div>
            </div>
          </div>
        </div>
    </Teleport>
    <div v-if="introIsOpen" class="flex items-center justify-center z-50">
    <div
      class="bg-white text-black border border-gray-200 shadow-lg rounded-2xl p-6 max-w-sm w-full text-center animate-fade-in"
    >
      <div class="flex flex-col items-center justify-center space-y-4">
        <svg class="w-12 h-12 text-green-500" fill="none" stroke="currentColor" stroke-width="1.5"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M4.5 12.75l6 6 9-13.5" />
        </svg>
        <p class="text-gray-600">Les votes sont maintenant terminés.</p>
      </div>
    </div>
  </div>
    <div v-else class="flex flex-col gap-6 w-full lg:w-90%">
      <div
        v-for="({ target, idList },idTarget) in game.currentGame.properties.resultRound
          ?.history"
        :key="target"
        class="b b-amber grid grid-rows-[20px_3fr] grid-cols-[auto_1fr] gap-x-4 items-center w-full bg-gray-800 p-4 rounded-2xl shadow-lg md:(grid-rows-[1fr_3fr] grid-cols-[auto_1fr] gap-x-10) lg:(min-h-200px )"
      >
        <!-- Joueur cible (celui qui a reçu des votes) -->
        <div class="grid-row-start-1 grid-row-end-3">
          <div class="relative w-fit">
            <div
              class="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md relative lg:(w-40 h-40)"
            >
              <portraitComp
                  @mouseenter="handleNameShow($event, target, 'target');handleHandClick(idTarget,0)"
                  @mouseleave="currentOverPortrait = null"
                  @click.stop="mobileHandleNameShow($event, target, 'target');handleHandClick(idTarget,0)"
                  :animation="showclickHand && idTarget === 0 && tutoStore.tutoStep.targetAnimation"

                :url="
                  game.currentGame.users.find(el => el.id === target)?.gameStat
                    ?.urlAvatar!
                "
                class="relative"
              >
              </portraitComp>
            </div>
            <span
              class="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow"
            >
              Cible
            </span>
          </div>
        </div>

        <!-- Liste des votants -->
        <div class="grid-row-start-2 flex flex-wrap justify-left gap-2">
          <TransitionGroup
            tag="div"
            class="flex flex-wrap justify-center gap-2 lg:(gap-5)"
            appear
            @before-enter="beforeEnter"
            @enter="enter"
          >
            <div
              v-for="(id,i) in idList"
              :key="`ennemy-${id}`"
              class="relative w-14 h-14 opacity-0 lg:(w-20 h-20)"
            >
              <div
                class="w-full h-full rounded-full overflow-hidden border-2 border-red-500 shadow-md"
                :id="`ennemy-${id}`"
              >
                <portraitComp
                  @mouseenter="handleNameShow($event, id, 'ennemy');handleHandClick(i,idTarget)"
                  @mouseleave="handleLeave()"
                  :animation="showclickHand && i === 0 && idTarget === 0 && tutoStore.tutoStep.targetAnimation"
                  @click.stop="mobileHandleNameShow($event, id, 'ennemy');handleHandClick(i,idTarget)"
                  :url="
                    game.currentGame.users.find(el => el.id === id)?.gameStat
                      ?.urlAvatar!
                  "
                ></portraitComp>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { useMouse } from '@vueuse/core'
import portraitComp from '@/components/animation/assets/portraitComp.vue'
import { computed, ref, useTemplateRef, watchEffect } from 'vue'
import { useTutoStore } from '@/stores/tuto'
import { useElementBounding } from '@vueuse/core'
import { useAppliStore } from '@/stores/appli'
const appli = useAppliStore()
const nameToolTip = useTemplateRef('nameOverPortrait')
const {width:ToolWidth} = useElementBounding(nameToolTip)
const tutoStore = useTutoStore()
const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0
const showclickHand = ref(true)
const introIsOpen = ref(true)
setTimeout(() => {
  introIsOpen.value = false
}, 2000) // Adjust the duration as needed
const { x, y } = useMouse()
const game = useGameStore()
const currentOverPortrait = ref<null | {
  id:number,
  role:'target'|'ennemy'
  position:{x:number,y:number}
}>(null)

const beforeEnter = (el: Element) => {
  ;(el as HTMLElement).style.opacity = '0'
  ;(el as HTMLElement).style.transform = 'translateY(-5px)'
}

const nameOver = computed(() => {
  const target = game.currentGame.users.find(
    el => el.id === currentOverPortrait.value?.id,
  )
  return target?.fullName
})

const enter = (el: Element, done: () => void) => {
  const delay = (Array.from(el.parentNode!.children).indexOf(el) + 1) * 500
  setTimeout(() => {
    ;(el as HTMLElement).style.transition = 'all 0.5s'
    ;(el as HTMLElement).style.opacity = '1'
    ;(el as HTMLElement).style.transform = 'translateY(0px)'
    done()
  }, delay)
}

const handleNameShow = (event: MouseEvent, id: number ,role: 'target' | 'ennemy') => {
  if(isMobile) return
  currentOverPortrait.value ={id,role,position:{x:x.value,y:y.value}}
}
watchEffect(()=>{
  if(!isMobile || currentOverPortrait.value === null)return
  if(Math.abs(currentOverPortrait.value.position.x! - x.value) > 50 || Math.abs(currentOverPortrait.value.position.y! - y.value) > 50){
    currentOverPortrait.value = null
  }
})
const mobileHandleNameShow = (event: MouseEvent, id: number ,role: 'target' | 'ennemy') => {
  if( currentOverPortrait.value !== null) return
  currentOverPortrait.value ={id,role,position:{x:x.value,y:y.value}}
}
const handleLeave = () => {
  if(isMobile) return
  currentOverPortrait.value = null
}
const handleHandClick= (i:number,idTarget:number) => {
  if(!tutoStore.tutoStep.targetAnimation)return
  if(i === 0 && idTarget === 0){
    tutoStore.setTutoStep('targetAnimation', false)
  }
}

</script>

<style scoped>
.fade-enter-active {
  animation: fadeIn 0.5s ease-in-out both;
}

.fade-leave-active {
  animation: fadeOut 0.3s ease-in-out both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}

</style>
