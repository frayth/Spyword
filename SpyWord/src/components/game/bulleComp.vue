<template>
  <div
    v-on-click-outside="deleteModal"
    class=" z-1000 absolute gap-3 flex flex-col p-1 top-50% left-0% rounded-3xl max-w-200px w-[calc(100%-10%)] lg:(max-w-700px p-4) shadow-[4px_4px_0px_rgba(0,0,0,1)] border-4 border-black text-gray-800 bg-white"
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
      <p class="text-sm text-gray-600 font-semibold italic">Mon rôle {{ selectedPlayerInfo?.gameStat?.isAlive? 'est' : 'était' }} :</p>
      <p class="text-xl lg:(text-2xl) font-medium text-gray-800 transform-translate-y--3px ">
        <span :class="{
          'font-bold':true,
          'text-green-500': selectedPlayerInfo?.gameStat?.roleIfDead === 'civil',
          'text-red-500': selectedPlayerInfo?.gameStat?.roleIfDead !== 'civil',
        }">{{ selectedPlayerInfo?.gameStat?.roleIfDead=== null ? 'Inconnue' : selectedPlayerInfo?.gameStat?.roleIfDead }}</span>
      </p>
    </div>

    <div
      class="p-1 bg-white rounded-lg gap-2 shadow-md flex-center-col lg:(flex-center-col flex-row p-4)"
    >
      <p class="text-lg text-gray-600 font-semibold flex-shrink-0">
        J'ai dit :
      </p>
      <div class=" text-lg flex flex-wrap gap-2 max-h-[300px] overflow-auto break-words"  v-if="selectedPlayerInfo?.gameStat?.words.length! > 0">
        <p
          v-for="word in selectedPlayerInfo?.gameStat?.words "
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

<style scoped></style>
