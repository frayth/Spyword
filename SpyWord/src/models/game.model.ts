import type { User } from "./user.model";

export interface GameResponse{
  message:string,
  data:Game,
  code:number
}

export interface Game {
  id: number,
  ownerId: number,
  name: string,
  createdAt: string,
  inGame: boolean,
  slug: string,
  users:User[],
  gameOption:GameOption,
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
}

export interface GameOption {
  maxPlayers:number,
  gameId:number,
  id:number
  whiteIsPresent:boolean,
}