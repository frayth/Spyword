<template>
  <div
    class="w-fit h-fit z-1000 absolute top-10% right-0 select-none pointer-events-none flex flex-col bg-transparent overflow-hidden transition-none pt-4 pl-4 pb-4 scrollbar-none"
    :style="{
      maxWidth: appliStore.infoWindow.width - 10 + 'px',
      maxHeight: appliStore.infoWindow.height * 0.5 + 'px',
    }"
    ref="errorField"
  >
    <TransitionGroup
      name="list"
      tag="ul"
      appear
      class="flex flex-col gap-2 items-end"
      mode="in-out"
    >
      <li
        v-for="error in errorsStore.errorsList"
        :key="error.id"
        class="pointer-events-auto shadow-black shadow-md flex items-center w-fit h-30px md:h-50px rounded-l-lg scrollbar-none"
        @mouseenter="errorsStore.removeError(error.id)"
      >
        <div
          class="bg-white w-30px h-30px md:(w-50px h-50px)  overflow-hidden flex items-center justify-center shrink-0 rounded-l-lg"
        >
          <img src="/icone/crossError.png" class="w-25px h-25px md:(w-40px h-40px)" alt="" />
        </div>
        <div
          class="bg-red-500 h-full w-full flex items-center justify-end px-1 md:px-4"
          :style="{
            fontSize: `${Math.max(10, 20 - error.message.length / (appliStore.infoWindow.width<= 750 ? 2 : 4))}px`,
          }"
        >
          {{ error.message }}
        </div>
      </li>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useErrorsStore } from '@/stores/errors'
import { useAppliStore } from '@/stores/appli'

const appliStore = useAppliStore()
const errorsStore = useErrorsStore()



</script>

<style scoped>
.modal-enter {
  opacity: 0;
  transform: translateY(20px);
}
.modal-enter-active {
  transition: all 0.3s ease-out;
  opacity: 1;
  transform: translateY(0);
}
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
