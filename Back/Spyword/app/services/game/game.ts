import Game from '#models/game'
import { transmitGame } from '#services/ws/ws'

export function nextPlayer(game: Game) {
  if (!game.properties) throw new Error('Game properties not found')
  game.properties.indexCurrentPlayer = game.properties.indexCurrentPlayer! + 1
  if (game.properties.indexCurrentPlayer >= game.users.length) {
    game.properties.indexCurrentPlayer = 0
    game.properties.gamePhase = 'vote'
  }
  game.save()
}

export function lauchPlay(game: Game) {
  setTimeout(async () => {
    game.properties.gamePhase = 'play'
    game.save()
    transmitGame(game.id, game)
  }, 5000)
}
