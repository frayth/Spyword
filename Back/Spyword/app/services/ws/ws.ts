import Game from '#models/game'
import transmit from '@adonisjs/transmit/services/main'
import type { TypeUser, WsMessages, Action, InfoUser } from './ws.model.js'

export function transmitGame(id: number, data: Game) {
  transmit.broadcast(`game/${id}`, JSON.stringify({ type: 'game', data }))
}

export function transmitUser(id: number, type: 'action', data: Action): void
export function transmitUser(id: number, type: 'info', data: InfoUser): void
export function transmitUser(id: number, type: TypeUser, data: any) {
  const message: WsMessages = {
    type,
    data,
  }
  transmit.broadcast(`user/${id}`, JSON.stringify(message))
}
