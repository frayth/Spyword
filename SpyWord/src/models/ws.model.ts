import type { Game } from "./game.model"

export interface BaseWSMessage{
  type:string
}

export interface GameWSMessage extends BaseWSMessage{
  type:'game'
  data:Game
}

export type UserAction='leave'

export type InfoUser='info'

export interface UserWSMessage extends BaseWSMessage{
  type:'action'|'info'
  data:UserAction|InfoUser
}
export type WsMessages = GameWSMessage