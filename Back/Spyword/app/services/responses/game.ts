import Game from '#models/game'

export default async function gameResponse(game: Game) {
  await game.load('users')
  for (const user of game.users) {
    await user.load('gameStat')
  }
  await game.load('gameOption')
}
