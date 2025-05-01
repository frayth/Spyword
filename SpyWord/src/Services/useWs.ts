import { Subscription, Transmit } from '@adonisjs/transmit-client'
import type { Game } from '@/models/game.model'
import type {
  WsMessages,
  UserWSMessages,
  GameWSMessage,
  AnimationName,
} from '@/models/ws.model'
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import router from '@/router'
import { useAlertStore } from '@/stores/alert'
import { useAnimationStore } from '@/stores/animation'
import { useAuthStore } from '@/stores/auth'
const defaultAnimationTime = 3000
type TimerAnimation = AnimationName | 'default'
const timerAnimation: Partial<Record<TimerAnimation, number>> = {
  default: defaultAnimationTime,
  nextPlayer : defaultAnimationTime * 2.2,
  resultVote: defaultAnimationTime * 2.2,
  target: defaultAnimationTime * 1.5,
  nextTurn: defaultAnimationTime * 1.7,
  newRound: defaultAnimationTime * 1,
}

const wsURL = 'http://apispyword.laurisceresoli.fr'

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
  const { addAnimation } = useAnimationStore()
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
      //console.log('ANIMATION', json.data)
      addAnimation({
        name: json.data,
        duration: timerAnimation[json.data as TimerAnimation]! || timerAnimation.default!,
      })
    }
  })
}

function handleUserAction(
  action: string,
  gameStore: ReturnType<typeof useGameStore>,
) {
  switch (action) {
    case 'leave':
      subscription?.delete()
      gameStore.resetGame()
      router.push('/')
      break
    default:
      console.warn('Action non reconnue:', action)
  }
}
