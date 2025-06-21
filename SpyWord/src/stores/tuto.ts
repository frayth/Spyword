import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useTutoStore = defineStore('tuto', () => {
  const tutoStep=ref({
    playerList:true,
    targetAnimation:true
  })
  return {tutoStep};

});
