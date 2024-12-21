<template>
  <div class="flex justify-between gap-5 p-2px md:gap-10 p-10px" ref="header">
    <div class="ml-5  ">
      <p class="font-900 md:text-size-2xl">{{infoUser.fullName}}</p>
    </div>
    <div class="flex gap-5 p-10px md:gap-10 items-center">
      <div class="relative">
        <RouterLink to="/" class="text-size-3 font-700 md:text-size-5 link" @mouseover.stop="handleAfterElement(1)" @mouseleave="handleAfterElement(0)">Régles</RouterLink>
        <Transition name="toto">
          <div class="absolute h-2px w-100% bg-black" v-if="overElement==1"></div>
        </Transition>
        
      </div>
      <div class="relative">
        <routerLink to="game" class="text-size-3 font-700 md:text-size-5 link" @mouseover.stop="handleAfterElement(2)" @mouseleave="handleAfterElement(0)">Jouer</routerLink>
        <Transition name="toto">
          <div class="absolute h-2px w-100% bg-black" v-if="overElement==2"></div>
        </Transition>
      </div>
      
      <button class="bg-white b-rounded-full p-5px transition-all hover:bg-red-500 md:p-10px">Se deconnecter</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
const {infoUser}=useAuthStore()
const overElement= ref(0)
const header = ref<HTMLElement | null>(null)
defineExpose({header})
function handleAfterElement(element:number) {
  overElement.value=element
}
</script>

<style scoped>
.toto-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}

.toto-enter-from{
  width:0;
  opacity:0
}
.toto-enter-to{
  width:100%;
  opacity:1
}
.toto-leave-to {
  width:0;
  opacity:0
}
.toto-leave-from{
  width:100%;
  opacity:1
}
</style>