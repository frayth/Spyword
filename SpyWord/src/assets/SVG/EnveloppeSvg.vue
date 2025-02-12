<template>
  <svg viewBox="0 0 200 150" :width  xmlns="http://www.w3.org/2000/svg">
    <!-- Corps de l'enveloppe -->
    <rect x="10" y="40" width="180" height="100" fill="#f4e4bc" stroke="#8b7355" stroke-width="2"/>
    
    <!-- Rabat fermé -->
    <path :d="`${ouverture.gauche} ${ouverture.centre} ${ouverture.droite}`" fill="#f4e4bc" stroke="#8b7355" stroke-width="2"/>
    <path v-if="open" d="M10,40 L190,40" stroke="#8b7355" stroke-width="1"></path>
    <!-- Lignes de pli (décoratives) -->
    <path d="M10,40 L100,90 L190,40" fill="#f4e4bc" stroke="#8b7355" :stroke-width="open?1:2"/>
    <circle v-if="!open" cx="100" cy="90" r="8" fill="#E3B23C"/>
  </svg>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props=defineProps({
  width: {
    type: Number,
    default: 200,
  },
  open :{
    type: Boolean,
    default: false,
  }
});
const animation=ref({
  open:{
    gauche:'M10,40',
    centre:'L100,5',
    droite:'L190,40'
  },
  close:{
    gauche:'M10,40',
    centre:'L100,80',
    droite:'L190,40'
  }
})
const ouverture=ref({
  gauche:'M10,40',
  centre:'L100,80',
  droite:'L190,40'
})
watch(()=>props.open,(value)=>{
  if(value){
    ouverture.value=animation.value.open
  }else{
    ouverture.value=animation.value.close
  }
})
</script>

<style scoped>

</style>