<template>
  <div class="z-1001 w-full h-full relative opacity-100" id="alertWindow">
    <div
      :class="`bg-white fixed border b-black/80 grid grid-cols-1 grid-rows-[auto_1fr_auto] w-250px h-200px p-4 shadow-md shadow-${colorAlert}-500/50 touch-none select-none rounded-sm lg:(w-350px h-300px)`"
    ref="alertWindow"
    :style="style"
      >
      <div
        :class="`w-full h-30px bg-${colorAlert} opacity-80 absolute top-0`"
      ></div>
      <div class="h-15px"></div>
      <p class="grid-row-start-2 justify-center font-700 text-align-center self-center lg:(text-size-lg )">{{ message }}</p>
      <button
        class="bg-amber w-fit justify-self-center p-[5px_10px] rounded-sm grid-row-start-3 lg:(p-[10px_20px])"
        @click="alertStore.closeAlert(index)"
      >
        Fermer
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAlertStore } from '@/stores/alert'
import type { AlertType } from '@/models/appli.model'
import {useDraggable,useElementBounding} from'@vueuse/core'
import { computed, nextTick, ref, watch } from 'vue'
import { useAppliStore } from '@/stores/appli'
const props = defineProps<props>()
const colorAlert=computed(()=>{
  switch(props.type){
    case 'error':
      return 'red'
    case 'warning':
      return 'orange'
    case 'success':
      return 'green'
    case 'info':
      return 'blue'
    default:
      return 'gray'
  }
})
const alertWindow=ref()
const {infoWindow}=useAppliStore()
const alertStore = useAlertStore()
const {height,width}=useElementBounding(alertWindow)

const { x, y, style ,isDragging} = useDraggable(alertWindow, {
  initialValue: { x:infoWindow.width/2, y: infoWindow.height/2+(height.value/2) },
  preventDefault: true,
})
nextTick(()=>{
  x.value=infoWindow.width/2-width.value/2-props.index*10
  y.value=infoWindow.height/2-height.value/2+props.index*10
})
watch(x,()=>{
  
    if(x.value<0)x.value=0
    if(x.value+width.value>infoWindow.width)x.value=infoWindow.width-width.value
})

watch(y,()=>{
    if(y.value<0)y.value=0
    if(y.value+height.value>infoWindow.height)y.value=infoWindow.height-height.value
})
watch(infoWindow,()=>{
  x.value=infoWindow.width/2-(width.value/2)-props.index*10
  y.value=infoWindow.height/2-height.value/2+props.index*10
})
interface props {
  message: string
  type: AlertType
  visible: boolean
  index: number
  zIndex: number
}

watch(isDragging,()=>{
  if(isDragging.value){
    alertStore.changeAlertZIndex(props.index)
  }
})
</script>

<style scoped>

</style>
