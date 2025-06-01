<template>
  <div
    ref="target"
    class="w-[90vw] max-w-xl max-h-500px bg-white rounded-2xl shadow-xl p-6 border border-gray-200 overflow-hidden"
  >
    <h2
      class="text-xl font-semibold text-center text-gray-800 p-b-4 md:(text-2xl)"
    >
      Sélectionnez votre avatar
    </h2>

    <div
      class="flex flex-wrap justify-center gap-4 overflow-y-auto max-h-100"
      :style="{ height: 'calc(100vh - 200px)' }"
    >
      <div
        v-for="i in numberOfAvatars"
        :key="i"
        @click="selectAvatar(i - 1)"
        class="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 shadow-md hover:shadow-lg hover:border-blue-400 transition-all duration-200 md:(w-24 h-24)"
      >
        <PortraitComp
          :url="`public/images/avatars/avatar${i - 1}.jpg`"
          class="w-full h-full object-cover"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { onMounted, ref, useTemplateRef } from 'vue'
import { useFetch } from '@/composable/useFetch'
import PortraitComp from '../animation/assets/portraitComp.vue'
const emits = defineEmits(['close'])
const target = useTemplateRef<HTMLElement>('target')
const numberOfAvatars = ref(0)
onClickOutside(target, () => emits('close'))

onMounted(async () => {
  target.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })
  const { fetchData, inError, data } = useFetch<number>('api/divers/avatars', {
    method: 'GET',
  })
  await fetchData()
  if (!inError.value) numberOfAvatars.value = data.value || 0
  else console.error('Error fetching number of avatars:', inError.value)
})
const selectAvatar = async (id: number) => {
  const { fetchData, inError } = useFetch('api/users/changeAvatar', {
    method: 'POST',
    body: { mode: 'choose', avatar: id },
  })

  await fetchData()
  if (!inError.value) {
    emits('close')
  } else {
    console.error('Error changing avatar:', inError.value)
  }
}
</script>

<style scoped></style>
