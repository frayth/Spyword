<template>
  <OnClickOutside @trigger="close" class="w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl">
  <div class="p-6 max-w-xl    rounded-xl  space-y-6 flex flex-col items-center">
    <div class="space-y-4 w-full flex gap-3 flex-col items-center bg-white/35 rounded-2xl p-2">
      <label class="block text-lg font-semibold text-gray-800 ">
        Durée de l'animation
      </label>

      <div class="w-full m-0! flex items-center justify-center">
        <input
          type="range"
          min="0"
          max="5000"
          step="1000"
          v-model="defaultAnimationTime"
          @change="changeTimer($event)"
        />
      </div>
      <span
        class="block text-sm m-0!  text-center text-gray-700 dark:text-gray-300"
        :class="defaultAnimationTime === '0' ? 'italic opacity-70' : 'font-semibold'"
      >
        {{ defaultAnimationTime === '0' ? 'Pas d\'animation' : `Vitesse animation : ${+defaultAnimationTime / 1000}` }}
      </span>
    </div>

    <LeaveGame />
  </div>
  </OnClickOutside>

</template>

<script setup lang="ts">
  import LeaveGame from '../play/LeaveGame.vue';
  import { OnClickOutside } from '@vueuse/components';
  import { useAnimationStore } from '@/stores/animation';
import { storeToRefs } from 'pinia';
  const { defaultAnimationTime } = storeToRefs( useAnimationStore() );

  const emits=defineEmits(['close']);
  const close = () => {
    emits('close');
  };
  const changeTimer = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target) {
      defaultAnimationTime.value = target.value;
    }
  };
</script>

<style scoped>

</style>
