<template>
  <div class="w-full h-full max-h-screen min-h-screen" @scroll="handleScroll" ref="main">
    <div class="m-auto w-full  min-h-screen  sm:max-w-screen-lg grid grid-rows-[auto_1fr_auto]">
      <headerComp
        ref="header"
        :class="{
          grid: true,
          'place-items-center': true,
          'bg-amber': true,
          'h-100px': true,
          'position-sticky': scrollY > 2 * header?.header.offsetHeight!,
          'top-0': true,
          test: true,
        }"
      ></headerComp>
      <RouterView class="h-full flex-basis-2xl" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import headerComp from '@/components/inputs/headerComp.vue'
const scrollY = ref(0)
const main = ref<HTMLElement | null>(null)
const header = ref<{header:HTMLElement}|null>(null)


function handleScroll() {
  if (main.value) {
    scrollY.value = main.value.scrollTop
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}
.fade-enter-to {
  opacity: 1;
  height: 100%;
}
.fade-leave-to {
  opacity: 0;
}
</style>
