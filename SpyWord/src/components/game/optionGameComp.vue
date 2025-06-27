<template>
  <OnClickOutside @trigger="close" class="w-full h-fit  bg-black/20 backdrop-blur-sm rounded-2xl">
  <div class="p-6 max-w-xl h-full   rounded-xl   flex flex-col items-center justify-center gap-6">
    <div class=" w-full flex gap-3 flex-col items-center bg-white/35 rounded-2xl p-2">
      <label class="block text-lg font-semibold text-gray-800 whitespace-nowrap  ">
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
    <div class="h-fit w-full ">
    <LeaveGame action="help">
    </LeaveGame>
    </div>
    <LeaveGame v-if="userIsOwner && currentGame.inGame "  action="reset" />
    <LeaveGame action="leave" />
  </div>
  </OnClickOutside>

</template>

<script setup lang="ts">
  import LeaveGame from '../play/LeaveGame.vue';
  import { OnClickOutside } from '@vueuse/components';
  import { useAnimationStore } from '@/stores/animation';
  import { useGameStore } from '@/stores/game';
  import { useAuthStore } from '@/stores/auth';
  import { storeToRefs } from 'pinia';
  const { defaultAnimationTime } = storeToRefs( useAnimationStore() );
  const { userIsOwner } = storeToRefs( useAuthStore() );
  const { currentGame } = storeToRefs( useGameStore() );
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
