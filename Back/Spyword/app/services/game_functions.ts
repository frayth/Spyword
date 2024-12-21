import User from '#models/user'
import Game from '#models/game'
import GameStat from '#models/game_stat'
import { v4 as uuidv4 } from 'uuid'
export async function addPlayer(this: Game, user: User) {
  console.log('addPlayer')
  user.gameId = this.id
  await user.save()
  const existingGameStat = await GameStat.query()
    .where('gameId', this.id)
    .andWhere('userId', user.id)
    .first()
  if (existingGameStat) {
    throw new Error('User already in game')
  }
  await GameStat.create({
    gameId: this.id,
    userId: user.id,
  })
}
export async function checkForDelete(this: Game) {
  await this.load('users')
  console.log('checkForDelete', this.users.length)
  if (this.users.length === 0) {
    await this.delete()
  }
}

export async function generateSlug(): Promise<string> {
  let slug = uuidv4()
  let slugNotOk = true
  while (slugNotOk) {
    const slugAlreadyExist = await Game.query().where('slug', slug).first()
    if (!slugAlreadyExist) {
      slugNotOk = false
    }
  }
  return slug
}
