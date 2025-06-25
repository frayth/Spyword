import { computed, ref, toRaw, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Animation } from '@/models/animation.model'
import type { AnimationName } from '@/models/ws.model'
import { useGameStore } from './game'
export const useAnimationStore = defineStore('animation', () => {
  const animationList = ref<Animation[]>([])
  const defaultAnimationTime = ref('3000')
const timerAnimation = computed<Partial<Record<AnimationName, number>>>(() => {
  const base = +defaultAnimationTime.value;
  return {
    default: base,
    nextPlayer: base * 2.2 < 1500 ? 1500 : base * 2.2,
    resultVote: base * 2.2  < 2000 ? 2000 : base * 2.2,
    target: base * 100000,//5,
    nextTurn: base * 1.7 < 1500 ? 2000 : base * 1.7,
    newRound: base * 1 < 2000 ? 2000 : base * 1,
  };
});
  const currentAnimation = ref<Animation | null>(null)

  function addAnimation(animation: Animation) {
    console.log('addAnimation', animation.name)
    const gameStore = useGameStore()
    const snapShot=structuredClone(toRaw(gameStore.currentGame))
    animationList.value.push({duration:timerAnimation.value[animation.name]! === undefined?timerAnimation.value.default! : timerAnimation.value[animation.name]!,name: animation.name,gameSnapshot:snapShot})

    if (currentAnimation.value === null) play()
  }

  function play() {

    if (animationList.value.length > 0) {
      const animation=animationList.value.shift()!
      console.log('play animation', animation.gameSnapshot)
      currentAnimation.value = animation
    }
  }
  function end() {
    currentAnimation.value = null
  }
  const isVisible = computed(() => currentAnimation.value !== null)

  watch(currentAnimation, () => {
    if (currentAnimation.value === null) {
      play()
    }
  })

  return { addAnimation, currentAnimation, isVisible, end, animationList,defaultAnimationTime, timerAnimation }
})
