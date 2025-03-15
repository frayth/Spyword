<template>
  <div class="flex justify-between items-center p-3 md:p-5 bg-gray-900 text-white shadow-md" ref="header">
    <!-- Nom de l'utilisateur -->
    <div class="ml-3 md:ml-5">
      <p class="font-bold text-lg md:text-2xl text-cyan-400">{{ infoUser.fullName }}</p>
    </div>
  
    <!-- Liens de navigation -->
    <div class="flex gap-6 md:gap-10 items-center">
      <div class="relative">
        <RouterLink 
          to="/" 
          class="text-sm md:text-lg font-semibold tracking-wide relative after:content-[''] after:block after:h-0.5 after:w-0 after:bg-cyan-400 after:transition-all hover:after:w-full"
          @mouseover.stop="handleAfterElement(1)" 
          @mouseleave="handleAfterElement(0)"
        >
          Règles
        </RouterLink>
      </div>
  
      <div class="relative">
        <RouterLink 
          to="game" 
          class="text-sm md:text-lg font-semibold tracking-wide relative after:content-[''] after:block after:h-0.5 after:w-0 after:bg-cyan-400 after:transition-all hover:after:w-full"
          @mouseover.stop="handleAfterElement(2)" 
          @mouseleave="handleAfterElement(0)"
        >
          Jouer
        </RouterLink>
      </div>
  
      <!-- Bouton de déconnexion -->
      <button class="bg-red-600 text-white px-4 py-2 rounded-full transition-all duration-300 hover:bg-red-700 active:scale-95">
        Se déconnecter
      </button>
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