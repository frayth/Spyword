export type TypeUser = 'action' | 'info'
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
  data: Action | InfoUser
}
