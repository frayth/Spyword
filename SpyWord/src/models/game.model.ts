import type { User } from "./user.model";

export interface GameResponse{
  message:string,
  data:Game,
  code:number
}
export interface GameProperties {
  gamePhase?: 'choose' | 'play' | 'vote' | 'white' |'resultVote' | 'end',
  indexCurrentPlayer?: number,
  orderGame?: number[],
  verifyPhase?: boolean,
  round?: number,
  resultRound?: {
    egalite: boolean,
    eliminated: null | User,
    role: null | string,
    history: { target: number, numberOfVote: number, idList: number[] }[]
  },
  endDetails?: {
    winner: 'civil' | 'spy' | 'white' | 'none'
    winnersId: number[]
  },
  whitePhase?: {
    word: string | null
    playersValidation: { id: number; vote: boolean }[]
    whiteId: number | null
    validation: boolean
  },
  history?: {
    round: number
    events: GameEvent[]
  }[]
}
export type GameEventType = 'vote' | 'proposition' | 'elimination'
export type GameEvent =
  | { type: 'vote'; event: { player: number; target: number } }
  | { type: 'proposition'; event: { player: number; word: string } }
  | { type: 'elimination'; event: { player: number } }

export interface Game {
  id: number,
  ownerId: number,
  name: string,
  createdAt: string,
  inGame: boolean,
  slug: string,
  users:User[],
  gameOption:GameOption,
  properties:GameProperties,
}

export interface UserPublicInfo {
  id: number,
  fullname: string,
  gameId: number,
}

export interface GameStat {
  createdAt:string,
  gameId:number,
  id:number,
  score:number,
  updatedAt:string,
  userId:number,
  urlAvatar:string,
  word:string,
  words:string[]
  isAlive:boolean,
  vote:number |null,
  asVoted:boolean,
  roleIfDead:string | null,
}

export interface GameOption {
  maxPlayers:number,
  gameId:number,
  id:number
  whiteIsPresent:boolean,
  verificationOwner:boolean,
}
