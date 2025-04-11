import type { AlertType } from './appli.model'
import type { Game } from './game.model'

export interface BaseWSMessage {
  type: string
}

export interface GameWSMessage extends BaseWSMessage {
  type: 'game'
  data: Game
}

export type UserAction = 'leave' | 'alert'

export type AnimationName =
  | 'start'
  | 'vote'
  | 'nextPlayer'
  | 'resultVote'
  | 'nextManche'
  | 'end'
  | 'target'
  | 'nextTurn'
  | 'newRound'
  | 'whiteWin'
  | 'whiteLose'

export type InfoUser = {
  role?: string
  word?: string
}

export interface Alert {
  message: string
  code: number
  type?: AlertType
  zIndex?: number
}

export type UserWSMessages =
  | {
      type: 'action'
      data: UserAction
    }
  | {
      type: 'info'
      data: InfoUser
    }
  | {
      type: 'alert'
      data: Alert
    }
  | {
      type: 'animate'
      data: AnimationName
    }
export type WsMessages = GameWSMessage
