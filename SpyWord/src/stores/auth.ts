import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useFetch } from '@/composable/useFetch'
import type { Token } from '@/models/token.model'
import { useStorage } from '@vueuse/core'
import router from '@/router'
import { initialRoute } from '@/router'
import type { UserResponse, User, WordResponse } from '@/models/user.model'
import { useGameStore } from './game'
import { JoinUserChannel } from '@/Services/useWs'

export const useAuthStore = defineStore('auth', () => {
  const gameStore = useGameStore()
  const userIsOwner = computed(() => {
    return infoUser.value.id === gameStore.currentGame.ownerId
  })

  const infoUser = ref<
    User & { isConnect: boolean; currentWord: string | null }
  >({
    createdAt: '',
    fullName: '',
    gameId: 0,
    id: 0,
    updatedAt: '',
    isConnect: false,
    gameStat: null,
    currentWord: null,
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

  function logout() {
    setCredentials({ name: '', token: { type: '', value: '' } })
    infoUser.value.isConnect = false
    router.replace('/login')
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
      const info = useFetch<WordResponse>(`api/users/word`, {
        method: 'GET',
      })
      await info.fetchData()
      if (info.isComplete.value) {
        infoUser.value.currentWord = info.data.value!.data
      }
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
    logout,
    userIsOwner,
  }
})
