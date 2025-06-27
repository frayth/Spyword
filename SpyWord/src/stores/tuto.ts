import { defineStore } from 'pinia';
import { onMounted, ref } from 'vue';
import { useStorage } from '@vueuse/core';
export const useTutoStore = defineStore('tuto', () => {
  const tutoStep=ref({
    playerList:true,
    targetAnimation:true
  })
  const tutoStepStorage = useStorage('tutoStep', {
    playerList: true,
    targetAnimation: true
  },localStorage,{mergeDefaults: true});
  onMounted(() => {
    // Initialize the reactive reference with the stored value
    tutoStep.value = tutoStepStorage.value;
  });
  const setTutoStep = (step: keyof typeof tutoStep.value, value: boolean) => {
    // Update the reactive reference
    tutoStep.value[step] = value;
    // Also update the storage
    localStorage.setItem('tutoStep', JSON.stringify(tutoStep.value));
  }
  const clearTutoStep = () => {
    // Clear the storage
    tutoStep.value = {
      playerList: true,
      targetAnimation: true
    };
    localStorage.setItem('tutoStep', JSON.stringify(tutoStep.value));
  }
  return {tutoStep,setTutoStep,clearTutoStep};

});
