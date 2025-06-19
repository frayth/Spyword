import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useElementBounding,type UseElementBoundingReturn,type MaybeComputedElementRef } from '@vueuse/core'
import { useBreakpoints } from '@vueuse/core'
import type {WindowInfos} from '@/models/appli.model'
export const useAppliStore = defineStore('appli', () => {
  const breakPoints=useBreakpoints({
    mobile: 0,
    tablet: 640,
    laptop: 768,
    desktop: 1024,
  })
  const activeBreakPoint = breakPoints.active()

  const infoWindow=ref<WindowInfos>({
    width:window.innerWidth,
    height:window.innerHeight
  })
  const gameWindowBoundaries=ref<UseElementBoundingReturn>()
  function setGameWindowBoundaries(element:MaybeComputedElementRef){
    gameWindowBoundaries.value=useElementBounding(element)
  }
  window.addEventListener('resize',()=>{
      infoWindow.value.width=window.innerWidth
      infoWindow.value.height=window.innerHeight
  })

  return { infoWindow,setGameWindowBoundaries,gameWindowBoundaries,activeBreakPoint }
})
