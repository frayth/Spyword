import { computed, nextTick, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Animation } from '@/models/animation.model'
export const useAnimationStore = defineStore('animation', () => {
  const animationList = ref<Animation[]>([])
  const currentAnimation = ref<Animation | null>(null)
  function addAnimation(animation: Animation) {
    animationList.value.push(animation)
    if(currentAnimation.value===null) play()
  }

  function play() {

    if (animationList.value.length > 0) {
      currentAnimation.value = animationList.value.shift()!
    }
  }
  function end() {
    currentAnimation.value = null
  }
  const isVisible=computed(()=>currentAnimation.value!==null)

  watch(currentAnimation, () => {
    if (currentAnimation.value === null){
      nextTick(() => {
        play()
      })
    }
  })

  return { addAnimation, currentAnimation,isVisible,end,animationList }
})
