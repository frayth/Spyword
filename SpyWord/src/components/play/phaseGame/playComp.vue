<template>
  <div class="flex-center-col gap-2 justify-center">
    <div class="flex-center-col">
      <span class="text-size-5">Votre mot est</span>
      <span :class="{
        'text-size-6 font-bold cursor-pointer lg:(text-size-8)':true,
        'blur-7px':!seeWord
      }
      "
      @click="showWord" 
      >{{infoUser.currentWord}}</span>
    </div>
    <div class="m-y-1 w-full flex-center justify-center">
      <playerFocus v-if="currentPlayer!.id!==infoUser.id" />
      <wordProposition v-else></wordProposition>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game';
import { useAuthStore } from '@/stores/auth';
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia'
import playerFocus from '../playerFocus.vue';
import wordProposition from '../wordProposition.vue';
const seeWord=ref(false)
const { currentGame } = storeToRefs( useGameStore() );
const { infoUser } = storeToRefs( useAuthStore() );
const currentPlayer=computed(()=>{
  return currentGame.value.users.find(
    user =>
      user.id ===
      currentGame.value.properties.orderGame![
        currentGame.value.properties.indexCurrentPlayer!
      ],
  )
})
function showWord(){
 if(seeWord.value)return
  seeWord.value=true
  setTimeout(() => {
    seeWord.value=false
  }, 5000);
}
</script>

<style scoped>

</style>