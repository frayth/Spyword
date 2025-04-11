<template>
  <div
    :class="{
      'w-150px h-100px bg-white cursor-pointer rounded-xl relative lg:(w-200px h150px)': true,
      'cursor-default!': props.locked || !userIsOwner,
    }"
    @click="handleclick"
  >
    <Transition name="down" appear>
      <div
        v-if="error.value"
        class="absolute bg-red w-full h-40px rounded-xl bottom--20px left-0 flex items-end justify-center"
      >
        <span class="text-align-end text-size-3 cursor-">{{
          error.message
        }}</span>
      </div>
    </Transition>
    <div class="relative w-full h-full overflow-hidden rounded-xl">
      <div v-if="!isPresent" class="absolute w-full h-full z-9 bottom-10px">
        <img src="../../assets/images/crossRed.png" alt="" />
      </div>
      <div
        :class="{
          'absolute bottom-10px left-10% p-0 w-80% bg-white  border-black border flex-center-col z-10': true,
          'line-through': !isPresent,
        }"
      >
        <p>{{ name }}</p>
      </div>
      <img
        :class="{
          'rounded-xl': true,
          'filter-grayscale': !isPresent,
        }"
        :src="`/img/${img}`"
        alt=""
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { useAuthStore } from '@/stores/auth'
import { computed, ref, watchEffect } from 'vue'
type Error = {
  value: boolean
  message: string
}
const { currentGame } = useGameStore()
const { infoUser } = useAuthStore()
const event = ref<number | null>(null)
  type Props = {
  name: string
  isPresent: boolean
  locked: true
  img: 'civilianHd.jpg' | 'spyHd.jpg' | 'mrwhiteHd.jpg'
} | {
  name: string
  isPresent: boolean
  locked: false
  action: () => Promise<boolean> // Obligatoire quand locked = false
  img: 'civilianHd.jpg' | 'spyHd.jpg' | 'mrwhiteHd.jpg'
}
const props = defineProps<Props>()

const error = ref<Error>({ value: false, message: '' })

async function handleclick() {
  if (!(currentGame.ownerId === infoUser.id)) {
    return
  }
  if (props.locked) {
    error.value.value = true
    error.value.message = 'Rôle obligatoire'
    return
  }
  const result = await props.action?.()
  if (result === true) {
    error.value.value = true
    error.value.message = 'Condition non remplie'
  }
}
watchEffect(() => {
  if (error.value.value === true) {
    event.value = setTimeout(() => {
      error.value.value = false
    }, 3000)
  } else {
    clearTimeout(event.value as number)
  }
})
const userIsOwner=computed(()=>{
  return currentGame.ownerId === infoUser.id
})
</script>

<style scoped>
.down-enter-active,
.down-leave-active {
  transition: all 0.5s ease;
}

.down-enter-from,
.down-leave-to {
  transform: translateY(-100%);
}
</style>
