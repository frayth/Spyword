<template>
  <div
    v-on-click-outside="deleteModal"
    class="bg-white rounded-2xl p-1 min-w-200px border-5 border-black shadow-lg"
    ref="bulle"
  >
    <!-- Flèche façon BD -->
    <div
      v-show="props.arrowPosition.side !== 'none'"
      :class="{
        'absolute w-6 h-6 bg-white border-l-4 border-b-4 border-black': true,
      }"
      :style="arrowStyle"
    ></div>

    <!-- Contenu -->
    <div
      :class="{
        'p-1 bg-white rounded-lg shadow-md flex  gap-2 flex-row p-4 justify-center items-center': true,
        'flex-center-col ': bulleBounding.width < 300,
      }"
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
            'text-green-500': roleSelectedPlayer === 'Civil',
            'text-red-500': roleSelectedPlayer !== 'Civil',
          }"
          >{{ roleSelectedPlayer }}</span
        >
      </p>
    </div>
    <!-- History -->
    <div
      class="p2 rounded-xl shadow bg-white dark:bg-gray-800 w-full flex-center-col"
    >
      <!-- Contrôles de navigation -->
      <div class="flex items-center justify-between gap-5">
        <div
          @click="decrementCurrentManche"
          class="cursor-pointer p-2 rounded-full flex justify-center items-center text-2xl bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
        >
          <button class="h-fit flex justify-center items-center">
            <chevronLeftSvg :stroke-width="2" :size="18" />
          </button>
        </div>

        <p class="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Tour
          <span
            :key="animateKey"
            :class="{ 'roll-animation': animationLoad }"
            >{{ currentMancheHistory }}</span
          >
        </p>
        <div
          @click="incrementCurrentManche"
          class="cursor-pointer text-2xl p-2 rounded-full flex justify-center items-center bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
        >
          <button class="h-fit flex justify-center items-center">
            <chevronLeftSvg
              :stroke-width="2"
              :size="18"
              class="rotate-180deg"
            />
          </button>
        </div>
      </div>

      <!-- Historique -->
      <div class="overflow-hidden pt-5">
        <div
          v-if="
            historyVote.length > 0 &&
            currentGame.properties.round !== currentMancheHistory
          "
          :key="`histo-${animateKey}`"
          :class="{
            'animate-duration-200': true,
            'animate-fade-in-left': historySens === 'left' && animationLoad,
            'animate-fade-in-right': historySens === 'right' && animationLoad,
          }"
        >
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
          v-for="(word, index) in selectedPlayerInfo?.gameStat?.words"
          :key="word"
          class="inline-block m-2 px-4 py-2 rounded shadow-md cursor-default transition-all duration-200 font-semibold text-gray-800 font-handwriting hover:scale-105"
          :class="[
            [
              'bg-yellow-200',
              'bg-pink-200',
              'bg-green-200',
              'bg-blue-200',
              'bg-orange-200',
            ][index % 5],
          ]"
          :style="{
            fontSize: `${Math.max(0.8, Math.min(1.2, 1 - word.length / 15))}rem`,
            transform: `rotate(${((index % 3) - 1) * 3}deg)`,
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
import type { UseElementBoundingReturn } from '@vueuse/core'
import chevronLeftSvg from '@/assets/SVG/chevronLeftSvg.vue'
import {
  computed,
  onMounted,
  onUpdated,
  ref,
  useTemplateRef,
  withDefaults,
} from 'vue'
import { useElementBounding } from '@vueuse/core'
const { currentGame, playersRoles } = storeToRefs(useGameStore())
const historySens = ref<'left' | 'right'>('left')
const animateKey = ref(0)
const animationLoad = ref(false)
const currentMancheHistory = ref(
  currentGame.value.properties.round! === 1
    ? 1
    : currentGame.value.properties.round! - 1,
)
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

  if (currentMancheHistory.value && currentMancheHistory.value > 1) {
    if (!animationLoad.value) animationLoad.value = true
    animateKey.value = Date.now()
    currentMancheHistory.value = currentMancheHistory.value - 1
  }
}

const incrementCurrentManche = () => {
  historySens.value = 'right'
  if (
    currentMancheHistory.value &&
    currentMancheHistory.value < currentGame.value.properties.history!.length
  ) {
    if (!animationLoad.value) animationLoad.value = true
    animateKey.value = Date.now()
    currentMancheHistory.value = currentMancheHistory.value + 1
  }
}

const bulle = useTemplateRef('bulle')

const bulleBounding = ref<UseElementBoundingReturn>({
  height: ref(0),
  bottom: ref(0),
  left: ref(0),
  right: ref(0),
  top: ref(0),
  width: ref(0),
  x: ref(0),
  y: ref(0),
  update: () => {},
})

onUpdated(() => {
  emits('infoBulle', {
    x: bulleBounding.value?.x,
    y: bulleBounding.value?.y,
    width: bulleBounding.value?.width,
    height: bulleBounding.value?.height,
  })
})

onMounted(async () => {
  bulleBounding.value = useElementBounding(bulle)
})

type ArrowPosition = {
  side: 'left' | 'right' | 'top' | 'bottom' | 'none'
  offset?: number
}
const props = withDefaults(
  defineProps<{
    selectedPlayer: number | null
    arrowPosition?: ArrowPosition
  }>(),
  {
    arrowPosition: () => {
      return {
        side: 'left',
        offset: 0,
      }
    },
  },
)
defineExpose({
  bulleBounding,
})
const emits = defineEmits(['clickOutside', 'infoBulle'])
const selectedPlayerInfo = computed(() => {
  return currentGame.value.users.find(user => user.id === props.selectedPlayer)
})

const roleSelectedPlayer = computed(() => {
  type Role = 'civil' | 'spy' | 'white'
  const role = playersRoles.value.find(user => user.id === props.selectedPlayer)
    ?.role as Role | undefined

  const tradRole: Record<Role, string> = {
    civil: 'Civil',
    spy: 'Espion',
    white: 'Mr White',
  }

  return role
    ? tradRole[role]
    : selectedPlayerInfo.value?.gameStat?.roleIfDead
      ? tradRole[selectedPlayerInfo.value?.gameStat?.roleIfDead as Role]
      : 'Inconnue'
})

const validOffset = computed(() => {
  return props.arrowPosition.offset! >= 0 ||
    props.arrowPosition.offset! <= bulleBounding.value.height
    ? props.arrowPosition.offset!
    : 0
})

const arrowStyle = computed(() => {
  //.value en erreur typescript pas reussi a resoudre le soucis
  switch (props.arrowPosition?.side) {
    case 'right':
      return {
        right: `-6px`,
        top: `${validOffset.value > bulleBounding.value.height ? bulleBounding.value.height - 50 : validOffset.value + 10}px`,
        transform: 'rotate(225deg) translateX(-50%)',
      }
    case 'left':
      return {
        left: `-6px`,
        top: `${validOffset.value > bulleBounding.value.height ? bulleBounding.value.height - 35 : validOffset.value}px`,
        transform: 'rotate(45deg) translateX(-50%)',
      }

    case 'bottom':
      return {
        bottom: `-6px`,
        left: `${validOffset.value > bulleBounding.value.width ? bulleBounding.value.width - 50 : validOffset.value + 25}px`,
        transform: 'rotate(315deg) translateX(-50%)',
      }
    default:
      return {
        top: `-6px`,
        left: `${validOffset.value > bulleBounding.value.width ? bulleBounding.value.width - 50 : validOffset.value}px`,
        transform: 'rotate(135deg) translateX(-50%)',
      }
  }
})

function deleteModal() {
  emits('clickOutside')
}
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}
.slide-left-enter,
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}
.slide-right-enter,
.slide-left-leave-to {
  transform: translateX(+100%);
  opacity: 0;
}

@keyframes roll {
  0% {
    transform: rotateX(90deg);
    opacity: 0;
  }
  100% {
    transform: rotateX(0deg);
    opacity: 1;
  }
}

.roll-animation {
  animation: roll 0.3s ease-in-out;
  display: inline-block;
}
</style>
