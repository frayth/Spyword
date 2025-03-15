export type TypeUser = 'action' | 'info' | 'alert' | 'animate' | 'verify'
export type Action = 'leave' | 'animate'
export interface InfoUser {
  role?: string
  word?: string
}

export interface WsMessages {
  type: TypeUser
  data: Action | InfoUser | Alert
}

export interface Alert {
  message: string
  code: number
}

export type AnimationName =
  | 'start'
  | 'vote'
  | 'nextPlayer'
  | 'resultVote'
  | 'nextManche'
  | 'end'
  | 'nextTurn'
