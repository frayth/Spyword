import Game from './game.js'
export class GameList {
  games: Game[]
  constructor() {
    this.games = []
  }
  addGame(game: Game) {
    this.games.push(game)
  }
  removeGame(game: Game) {
    this.games = this.games.filter((g) => g !== game)
  }
  getGame(id: number) {
    return this.games.find((g) => g.game.id === id)
  }
}

export default new GameList()
