<template>
  <div
    v-on-click-outside="deleteModal"
    class=" absolute gap-3 flex flex-col p-1 top-50% left-0% rounded-3xl max-w-200px w-[calc(100%-10%)] lg:(max-w-700px p-4) shadow-[4px_4px_0px_rgba(0,0,0,1)] border-4 border-black text-gray-800 bg-white"
    :style
    ref="bulle"
  >
    <!-- Flèche façon BD -->
    <div
      class="absolute w-6 h-6 bg-white border-l-4 border-b-4 border-black -transform-translate-x-1/2 transform-translate-y-1/2"
      :style="styleArrow"
    ></div>

    <!-- Contenu -->
    <div
      class="p-1 bg-white rounded-lg shadow-md flex flex-center-col gap-2 lg:(flex-row p-4 items-center)"
    >
      <p class="text-sm text-gray-600 font-semibold italic">
        Mon rôle {{ selectedPlayerInfo?.gameStat?.isAlive ? 'est' : 'était' }} :
      </p>
      <p
        class="text-xl lg:(text-2xl) font-medium text-gray-800 transform-translate-y--3px"
      >
        <span
          :class="{
            'font-bold': true,
            'text-green-500':
              selectedPlayerInfo?.gameStat?.roleIfDead === 'civil',
            'text-red-500':
              selectedPlayerInfo?.gameStat?.roleIfDead !== 'civil',
          }"
          >{{
            selectedPlayerInfo?.gameStat?.roleIfDead === null
              ? 'Inconnue'
              : selectedPlayerInfo?.gameStat?.roleIfDead
          }}</span
        >
      </p>
    </div>
    <!-- History -->
    <div class="p2 rounded-xl shadow bg-white dark:bg-gray-800  w-full flex-center-col">
      <!-- Contrôles de navigation -->
      <div class="flex items-center justify-between gap-5">
        <button
          @click="decrementCurrentManche"
          class="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
        >
          ‹
        </button>
        <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Tour {{ currentMancheHistory }}
        </p>
        <button
          @click="incrementCurrentManche"
          class="text-xl px3 py1 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
        >
          ›
        </button>
      </div>

      <!-- Historique -->
      <div class="overflow-hidden p-y-2">

          <div v-if="historyVote.length > 0 && currentGame.properties.round !== currentMancheHistory" :key="`histo-${animateKey}`" :class="`animate-fade-in-${historySens} animate-duration-300`">
            <HistoryComp :event="historyVote[0]" />
          </div>

          <div v-else class="text-align-center py5">
            <p class="text-gray-500 italic text-sm">Tour en cours de jeu.</p>
          </div>

      </div>

      <!-- Aucun historique -->
    </div>
    <!-- Liste des mots -->
    <div
      class="p-1 bg-white rounded-lg gap-2 shadow-md flex-center-col lg:(flex-center-col flex-row p-4)"
    >
      <p class="text-lg text-gray-600 font-semibold flex-shrink-0">
        J'ai dit :
      </p>
      <div
        class="text-lg flex flex-wrap gap-2 max-h-[300px] overflow-auto break-words"
        v-if="selectedPlayerInfo?.gameStat?.words.length! > 0"
      >
        <p
          v-for="word in selectedPlayerInfo?.gameStat?.words"
          :key="word"
          class="text-white font-medium bg-indigo-600 rounded-full py-1 px-3 transition-all transform hover:bg-indigo-700 hover:scale-101"
          :style="{
            fontSize: `${Math.max(0.8, Math.min(1.2, 1 - word.length / 15))}rem`,
          }"
        >
          {{ word }}
        </p>
      </div>
      <div v-else class="text-gray-500 italic text-sm">
        <p class="text-gray-500 italic text-sm">Aucun mot prononcé</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import { vOnClickOutside } from '@vueuse/components'
import HistoryComp from './HistoryComp.vue'
import {
  computed,
  nextTick,
  onMounted,
  ref,
  useTemplateRef,
  watch,
  watchEffect,
  type Ref,
  type StyleValue,
} from 'vue'
import { useElementBounding } from '@vueuse/core'
const { currentGame } = storeToRefs(useGameStore())
const historySens = ref<'left' | 'right'>('left')
const animateKey=ref(0)
const currentMancheHistory = ref(currentGame.value.properties.round! - 1)
const historyVote = computed(() => {
  return currentGame.value.properties.history![
    currentMancheHistory.value! - 1
  ].events.filter(
    el =>
      el.type === 'vote' && el.event.player === selectedPlayerInfo?.value?.id,
  )
})

const decrementCurrentManche = () => {
  historySens.value = 'left'
  animateKey.value=Math.random() * (10000 - 0) + 0;
  if (currentMancheHistory.value && currentMancheHistory.value > 1) {
    currentMancheHistory.value = currentMancheHistory.value - 1
  }
}
const incrementCurrentManche = () => {
  animateKey.value=Math.random() * (21000 - 11000) + 11000;
  historySens.value = 'right'
  if (
    currentMancheHistory.value &&
    currentMancheHistory.value < currentGame.value.properties.history!.length
  ) {
    currentMancheHistory.value = currentMancheHistory.value + 1
  }
}


const bodyElement = ref<HTMLElement | null>(null)
const mainPanelElement = ref<HTMLElement | null>(null)

onMounted(() => {
  bodyElement.value = document.querySelector('body')
  mainPanelElement.value = document.querySelector('#mainPanel')
  nextTick()
})
const bulle = useTemplateRef('bulle')
const { width: bodyWidth } = useElementBounding(bodyElement)
const {
  width: mainPanelWidth,
  height: mainPanelHeight,
  y: mainPanelY,
} = useElementBounding(mainPanelElement)
const {
  width: bulleWidth,
  x: xBulle,
  height: bulleHeight,
} = useElementBounding(bulle)
type Bounding = {
  height: Ref<number, number>
  bottom: Ref<number, number>
  left: Ref<number, number>
  right: Ref<number, number>
  top: Ref<number, number>
  width: Ref<number, number>
  x: Ref<number, number>
  y: Ref<number, number>
  update: () => void
}
const props = defineProps<{
  selectedPlayer: number | null
  bounding: Bounding
}>()

const emits = defineEmits(['clickOutside'])
const selectedPlayerInfo = computed(() => {
  return currentGame.value.users.find(user => user.id === props.selectedPlayer)
})

function deleteModal() {
  emits('clickOutside')
}

const parentXPosition = computed(() => {
  const middleParent =
    Number(props.bounding.x) + Number(props.bounding.width) / 2
  if (mainPanelWidth.value < 300) return 'center'
  if (
    middleParent + 210 < mainPanelWidth.value &&
    middleParent - 210 < mainPanelWidth.value
  )
    return 'right'
  if (middleParent + 210 > mainPanelWidth.value) return 'left'

  return 'right'
})

const parentYposition = computed(() => {
  const middleParent =
    Number(props.bounding.y) + Number(props.bounding.height) / 2
  if (middleParent < mainPanelHeight.value / 2) return 'bottom'
  else return 'top'
})

const topPosition = computed(() => {
  if (bodyWidth.value < 1024)
    return `${Number(props.bounding.y) + Number(props.bounding.height) + 10}px`
  else {
    switch (parentYposition.value) {
      case 'top':
        return `${Number(props.bounding.y) - Number(props.bounding.height) * 1.3}px`
      default:
        return `${Number(props.bounding.y) + Number(props.bounding.height) / 2.5}px`
    }
  }
})

const leftPosition = computed(() => {
  if (bodyWidth.value < 1024) {
    switch (parentXPosition.value) {
      case 'left':
        return `${Number(props.bounding.left) - bulleWidth.value + Number(props.bounding.width) / 2}px`
      default:
        return `${Number(props.bounding.left) + Number(props.bounding.width) / 2}px`
    }
  } else {
    return `${Number(props.bounding.left) + Number(props.bounding.width)}px`
  }
})

const style = computed((): StyleValue => {
  return {
    top: topPosition.value,
    left: leftPosition.value,
  }
})

const arrowRotation = computed(() => {
  if (bodyWidth.value < 1024) return 'rotate(135deg)'
  return 'rotate(45deg)'
})

const arrowTopPosition = computed(() => {
  if (bodyWidth.value >= 1024) {
    switch (parentYposition.value) {
      case 'top':
        return `${bulleHeight.value - 55}px`
      default:
        return `${25}px`
    } //calcule la position todo
  } else {
    return '-15px'
  }
})
const arrowLeftPosition = computed(() => {
  if (bodyWidth.value >= 1024) {
    return `-15px`
  } else {
    const delta = xBulle.value - Number(props.bounding.x)
    if (delta >= 0) {
      return `${20}px`
    } else {
      return `${Number(props.bounding.x) - xBulle.value}px`
    } //calcule la position todo
  }
})
const styleArrow = computed((): StyleValue => {
  return {
    top: arrowTopPosition.value,
    left: arrowLeftPosition.value,
    transform: arrowRotation.value,
  }
})
watchEffect(() => {
  if (
    (Number(props.bounding.x) < 0 ||
      Number(props.bounding.x) + Number(props.bounding.width) >
        mainPanelWidth.value) &&
    mainPanelWidth.value > 0
  ) {
    deleteModal()
  }
  nextTick(() => {
    if (
      Number(props.bounding.y) + Number(props.bounding.height) >
      mainPanelHeight.value + mainPanelY.value
    ) {
      deleteModal()
    }
  })
})
watch(bodyWidth, (oldValue, newValue) => {
  //console.log(oldValue, newValue)
  if (oldValue === 0 || newValue === 0) return
  if (
    xBulle.value < 0 ||
    xBulle.value + bulleWidth.value > mainPanelWidth.value
  ) {
    deleteModal()
  }
})
</script>

<style scoped>
  .slide-left-enter-active,
  .slide-left-leave-active {
    transition: all 0.3s ease;
  }
  .slide-left-enter,
  .slide-right-leave-to  {
    transform: translateX(100%);
    opacity: 0;
  }
  .slide-right-enter-active,
  .slide-right-leave-active {
    transition: all 0.3s ease;
  }
  .slide-right-enter,
  .slide-left-leave-to
  {
    transform: translateX(+100%);
    opacity: 0;
  }
</style>
