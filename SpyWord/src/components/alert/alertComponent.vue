<template>
  <div class="z-1001 w-full h-full relative opacity-100" id="alertWindow">
    <div
    :class="`fixed border border-black/20 w-72 lg:w-96 p-5 shadow-lg rounded-lg bg-white flex flex-col items-center touch-none select-none`"
    ref="alertWindow"
    :style="style"
  >
    <!-- Bandeau de couleur -->
    <div
      :class="`absolute top-0 left-0 w-full h-2 rounded-t-lg bg-${colorAlert}`"
    ></div>
  
    <!-- Message -->
    <p class="mt-4 text-center font-semibold text-gray-800 lg:text-lg">
      {{ message }}
    </p>
  
    <!-- Bouton -->
    <button
      class="mt-4 bg-amber-500 text-white px-4 py-2 rounded-md shadow-md transition-all hover:bg-amber-600 active:scale-95"
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
