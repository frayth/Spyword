import Game from '#models/game'

export default async function gameResponse(game: Game) {
  await game.load('users')
  await game.load('gameOption')
  return { ...game.toJSON(), users: game.users.map((el) => el.publicInfo) }
}
