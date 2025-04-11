<template>
  <div class="grid place-items-center text-white p-6 w-full h-full bg-gray-950" >
    <div class=" bg space-y-6 w-full text-center h-70% grid place-items-center  bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-yellow-400 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
      <textTimer class="bg-white/50 rounded-3 p-6 w-90% m-t-20% c-black text-xl " :timer="1500" value="La partie va commencer..."/>
    </div>
     
  </div>
</template>

<script setup lang="ts">
import textTimer from './assets/textTimer.vue';
</script>

<style scoped>
.bg{
  background-image: url('../../assets/images/start.jpg');
  background-size: cover;
  background-position: center;
  background-position: center;
  background-repeat: no-repeat;


}
</style>