import { Subscription, Transmit } from '@adonisjs/transmit-client'
import type { Game } from '@/models/game.model'
import type { WsMessages,UserWSMessage,GameWSMessage} from '@/models/ws.model'
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
import router from '@/router'
export let subscription: null | Subscription = null
export let userSubscription: null | Subscription = null
export const transmit = new Transmit({
  baseUrl: 'http://maison.laurisceresoli.fr:5003',
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
    console.log('message de la partier')
    const json = JSON.parse(message as unknown as string) as WsMessages
    if (json.type === 'game') {
      const data = json.data as Game
      currentGame.value = data
    }
  })
}

export async function JoinUserChannel(id: number) {
  const gameStore = useGameStore()
  
  if (userSubscription !== null) {
    await userSubscription.delete()
  }
  userSubscription = transmit.subscription(`user/${id}`)
  await userSubscription.create()

  userSubscription.onMessage(async (message: UserWSMessage) => {
    const json = JSON.parse(message as unknown as string) as UserWSMessage
  console.log(message)
    if (json.type === 'action'){
      console.log('is an action',json.data)
      switch (json.data) {
        case 'leave':
         await subscription?.delete()
          gameStore.resetGame()  
          router.push('/')
          break
      }
    }
  })
}
