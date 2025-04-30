<template>
  <button
    @click="joinGame"
    class="bg-amber  h-50px text-size-sm b-rounded-lg m-1 p-x-20px text-size-md md:(w-150px text-size-lg)"
  >
    <p v-if="!loading">Rejoindre</p>
    <div v-else>Chargement</div>
  </button>
</template>

<script setup lang="ts">
import { useFetch } from '@/composable/useFetch'
import { useError } from '@/composable/useError';
import type { GameResponse } from '@/models/game.model'
import { useGameStore } from '@/stores/game';
import {ref } from 'vue'
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
const router = useRouter()  
const {currentGame}= storeToRefs(useGameStore())
const props = defineProps({
  game_id: {
    type: String,
    required: true,
  },
})
const emit = defineEmits({
  error(err: string) {
    return err
  },
})

const loading = ref(false)

async function joinGame() {
  const {data, fetchData, inError,error } = useFetch<GameResponse>(
  `api/games/join?game_id=${props.game_id}`,
  {
    method: 'PUT',
  },
)
  loading.value = true
  await fetchData()
  loading.value = false
  if (inError.value) {
    const formatedError=useError(error.value!.data!.code)
    emit('error', formatedError)
  }else{
    currentGame.value=data.value!.data
    router.push(`/play/${props.game_id}`)
  }
}
</script>

<style scoped></style>
