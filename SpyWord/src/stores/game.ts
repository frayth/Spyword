import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Game } from '@/models/game.model'
import { useFetch } from '@/composable/useFetch'
import type { UserInfos } from '@/models/user.model'
export const useGameStore = defineStore('game', () => {
  const currentGame = ref<Game>({
    id: 0,
    ownerId: 0,
    name: '',
    createdAt: '',
    inGame: false,
    slug: '',
    properties:{},
    users: [],
    gameOption: {
      id: 0,
      gameId: 0,
      maxPlayers: 0,
      whiteIsPresent: true,
      verificationOwner:true
    },
  })

  async function fetchUserInfo() {
      const { data, fetchData } = useFetch<UserInfos>('api/users/info', {
    method: 'GET',
    })
    await fetchData()
    //console.log('fetch data')
    if (data.value === null || data.value.data.game === null) return //TODO handle error
    //console.log('not return')
    currentGame.value = data.value.data.game
  }
  function resetGame() {
    currentGame.value = {
      id: 0,
      ownerId: 0,
      name: '',
      createdAt: '',
      inGame: false,
      slug: '',
      users: [],
      properties:{},
      gameOption: {
        id: 0,
        gameId: 0,
        maxPlayers: 0,
        whiteIsPresent: true,
        verificationOwner:true
      },
    }
  }

  async function endGame(){
    const {fetchData,inError } = useFetch('api/games/reset',{
    method: 'PUT'
    })
    await fetchData()
    return !inError.value
  }
  function add(){
    //console.log('add')
  }
  return { currentGame, fetchUserInfo, resetGame,add,endGame }
})
