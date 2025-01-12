import type { Game, GameStat } from '@/models/game.model'

export interface UserResponse {
  createdAt: string
  fullName: string
  gameId: number | null
  id: number
  game: Game | null
  gameStat: GameStat | null
  publicInfo: {
    fullName: string
    gameId: number
    id: number
  }
  updatedAt: string
}

export interface User {
  createdAt: string
  fullName: string
  gameId: number | null
  id: number
  updatedAt: string
  gameStat: GameStat | null
}


export interface UserInfos {
  message: string,
  data:{
    id: number,
    fullname: string,
    gameId: number,
    createdAt: string,
    updatedAt: string,
    game: Game | null,
    gameStat: GameStat | null,
  }
}