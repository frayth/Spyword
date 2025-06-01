<template>
  <div class="flex flex-center-col gap-2 select-none md:(gap-4)" ref="mainChangeAvatar">
    <div
      class="p-x3 p-y1 bg-gray-800 text-white rounded-lg shadow-lg w-full max-w-md text-center "
    >
      <h3 class="text-sm md:(text-lg)">Selectionner votre avatar</h3>
    </div>

    <div class="flex flex-center">
      <chevronLeftSvg
        class="w-10 h-10 cursor-pointer md:(w-15 h-15)"
        @click="handleDecrement"
      />

      <div class="w-20 h-20  md:(w-30 h-30) rounded-full overflow-hidden cursor-pointer"  @click="openPanel">
        <portraitComp :url="AvatarCurrentUser"></portraitComp>
      </div>
      <chevronLeftSvg
        class="w-10 h-10 cursor-pointer md:(w-15 h-15) cursor-pointer rotate-180"
        @click="handleIncrement"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import portraitComp from '../animation/assets/portraitComp.vue'
import { useGameStore } from '@/stores/game'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { computed, ref, useTemplateRef, watch } from 'vue'
import chevronLeftSvg from '@/assets/SVG/chevronLeftSvg.vue'
import { useFetch } from '@/composable/useFetch'

const emits= defineEmits(['open'])

const { infoUser } = storeToRefs(useAuthStore())
const mainChangeAvatar = useTemplateRef('mainChangeAvatar')
defineExpose({
  mainChangeAvatar
})
const isLoading = ref(false)
const lastChange = ref(0)
const timeBetwwenChanges = 500
const currentTime=ref(new Date().getTime())
const TimeIsOk= computed(() => {
  return currentTime.value - lastChange.value >= timeBetwwenChanges
})
const { currentGame } = storeToRefs(useGameStore())
const AvatarCurrentUser = computed(() => {
  const url = currentGame.value.users.find(
    user => user.id === infoUser.value.id,
  )?.gameStat?.urlAvatar
  if (url === undefined) return ''
  else return url
})
const handleDecrement = async () => {
  mainChangeAvatar.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
  currentTime.value = new Date().getTime()
  if (isLoading.value || !TimeIsOk.value) return
  lastChange.value = new Date().getTime()
  const { fetchData, error, loading,inError } = useFetch(`api/users/changeAvatar`, {
    method: 'POST',
    body: {
      mode: 'decrement',
    },
  })
  watch(loading, newValue => {
    isLoading.value = newValue
  })
  await fetchData()
  if (inError.value) {
    console.error('Error changing avatar:', error.value)
  }
}
const handleIncrement = async () => {
    mainChangeAvatar.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
  currentTime.value = new Date().getTime()
  if (isLoading.value || !TimeIsOk.value) return
  lastChange.value = new Date().getTime()
  const { fetchData, inError, loading,error } = useFetch(`api/users/changeAvatar`, {
    method: 'POST',
    body: {
      mode: 'increment',
    },
  })
  watch(loading, newValue => {
    isLoading.value = newValue
  })
  await fetchData()
  if (inError.value) {
    console.error('Error changing avatar:', error.value)
  }
}
const openPanel = () => {
  emits('open')
}
</script>

<style scoped></style>
