export type TypeUser = 'action' | 'info' | 'alert'
export type Action = 'leave'
export interface InfoUser {
  id: number
  name: string
  avatar: string
  score: number
  isSpy: boolean
  isReady: boolean
  isMaster: boolean
}

export interface WsMessages {
  type: TypeUser
  data: Action | InfoUser | Alert
}

export interface Alert {
  message: string
  code: number
}
