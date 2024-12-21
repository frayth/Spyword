import gameList from './game_list.js'
import User from '#models/user'
export default class Game {
  game: {
    id: number
    players: User[]
    words: string[]
    spymaster: string | null
    board: string[]
    turn: number
    winner: string | null
    gameover: boolean
  }
  constructor(id: number) {
    this.game = {
      id: id,
      players: [],
      words: [],
      spymaster: null,
      board: [],
      turn: 0,
      winner: null,
      gameover: false,
    }
  }
  addPlayer(player: User) {
    this.game.players.push(player)
  }
  removePlayer(player: User) {
    this.game.players = this.game.players.filter((p) => p !== player)
    if (this.game.players.length === 0) {
      gameList.removeGame(this)
    }
  }
}
