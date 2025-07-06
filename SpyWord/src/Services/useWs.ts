import { Subscription, Transmit } from '@adonisjs/transmit-client'
import type { Game } from '@/models/game.model'
import type {
  WsMessages,
  UserWSMessages,
  GameWSMessage,
} from '@/models/ws.model'
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import router from '@/router'
import { useAlertStore } from '@/stores/alert'
import { useAnimationStore } from '@/stores/animation'
import { useAuthStore } from '@/stores/auth'
import { useErrorsStore } from '@/stores/errors'


const wsURL = import.meta.env.VITE_WEBSOCKET_URL

export let subscription: null | Subscription = null

export let userSubscription: null | Subscription = null

export const transmit = new Transmit({
  baseUrl: wsURL,
  uidGenerator: () => {
    return Math.random().toString(36).substring(2, 9)
  },
})

export async function JoinChanel(id: number) {
  const { currentGame } = storeToRefs(useGameStore())
  if (subscription !== null) {
    await subscription.delete()
  }
  subscription = transmit.subscription(`game/${id}`)
  await subscription.create()

  subscription.onMessage(async (message: GameWSMessage) => {
    //console.log('message de la partie')
    //console.log(message)
    const json = JSON.parse(message as unknown as string) as WsMessages
    if (json.type === 'game') {
      const data = json.data as Game
      currentGame.value = data
    }
  })
}

export async function JoinUserChannel(id: number) {
  const auth = useAuthStore()
  const gameStore = useGameStore()
  const { addAnimation,timerAnimation } = useAnimationStore()
  const { addAlert } = useAlertStore()

  if (userSubscription !== null) {
    await userSubscription.delete()
  }
  userSubscription = transmit.subscription(`user/${id}`)
  await userSubscription.create()

  userSubscription.onMessage(async (message: UserWSMessages) => {
    const json = JSON.parse(message as unknown as string) as UserWSMessages
    //console.log(message)
    if (json.type === 'action') {
      handleUserAction(json.data, gameStore)
    } else if (json.type === 'alert') {
      addAlert(json.data)
    } else if (json.type === 'info') {
      if (json.data.word) {
        auth.infoUser.currentWord = json.data.word
      }else{
        auth.infoUser.currentWord = ''
      }
    } else if (json.type === 'animate') {
      //console.log('ANIMATION',json.type)
      if (json.data === 'resultVote') {
        //console.log('ANIMATION TARGET')
        addAnimation({
          name: 'target',
          duration:timerAnimation.target!
        })
      }
      addAnimation({
        name: json.data,
        duration: timerAnimation[json.data]! || timerAnimation.default!,
      })
    }
  })
}

function handleUserAction(
  action: string,
  gameStore: ReturnType<typeof useGameStore>,
) {
  const errorsStore = useErrorsStore()
  switch (action) {
    case 'leave':
      subscription?.delete()
      gameStore.resetGame()
      router.push('/')
      break
    case 'verifyCancel':
      errorsStore.addError('Le propriétaire de la partie n\'a pas validé votre mot.')
    default:
      console.warn('Action non reconnue:', action)
  }
}
