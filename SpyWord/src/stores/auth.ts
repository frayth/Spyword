import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useFetch } from '@/composable/useFetch'
import type { Token } from '@/models/token.model'
import { useStorage } from '@vueuse/core'
import router from '@/router'
import { initialRoute } from '@/router'
import type { UserResponse, User } from '@/models/user.model'
import { useGameStore } from './game'
import { JoinUserChannel } from '@/Services/useWs'
export const useAuthStore = defineStore('auth', () => {
  const gameStore = useGameStore()
  const infoUser = ref<User & { isConnect: boolean }>({
    createdAt: '',
    fullName: '',
    gameId: 0,
    id: 0,
    updatedAt: '',
    isConnect: false,
    gameStat: null,
  })

  const credentials = useStorage(
    'credentials',
    { name: '', token: { type: '', value: '' } },
    localStorage,
    { mergeDefaults: true },
  )

  const isCredentials = computed(
    () => credentials.value.name !== '' && credentials.value.token.value !== '',
  )

  function setCredentials(payload: {
    name: string
    token: { type: string; value: string }
  }) {
    credentials.value = payload
  }

  function login(name: string, password: string) {
    const { data, error, loading, fetchData, getErrorMessage } =
      useFetch<Token>('api/users/create', {
        method: 'POST',
        body: {
          name,
          password,
        },
      })
    fetchData()
    watch(loading, () => {
      if (error.value.error.code === 401) {
        setCredentials({ name: '', token: { type: '', value: '' } })
      }
    })
    return { data, error, loading, getErrorMessage }
  }

  async function connect() {
    const { data, error, loading, fetchData, getErrorMessage, isComplete } =
      useFetch<UserResponse>(
        `api/users/connect?name=${credentials.value.name}`,
        {
          method: 'GET',
        },
      )
    await fetchData()

    if (isComplete.value === false) {
      setCredentials({ name: '', token: { type: '', value: '' } })
    } else {
      infoUser.value.fullName = data.value!.fullName
      infoUser.value.id = data.value!.id
      infoUser.value.createdAt = data.value!.createdAt
      infoUser.value.updatedAt = data.value!.updatedAt
      infoUser.value.isConnect = true
      await JoinUserChannel(infoUser.value.id)
      if (data.value?.gameId !== null) {
        infoUser.value.gameId = data.value!.gameId
        await gameStore.fetchUserInfo()
        router.replace(`/play/${data.value!.game?.slug}`)
      } else {
        router.replace(initialRoute.value)
      }
    }
    return { data, error, loading, getErrorMessage }
  }

  return {
    infoUser,
    login,
    setCredentials,
    credentials,
    isCredentials,
    connect,
  }
})
