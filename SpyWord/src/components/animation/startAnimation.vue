<template>
  <div >
    <div class="bg-white w-90% h-50% grid px-15 py-10 items-center justify-center rounded-3 shadow-amber-3 bg shadow-lg text-size-sm font-bold md:(px-5 w-75%)   lg:( px-10 text-size-xl w-80%)">
      <textTimer class="bg-white/50 rounded-3 p-6 " :timer="1500" value="La partie va commencer..."/>
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
 background-position: top left;
  background-repeat: no-repeat;


}
</style>