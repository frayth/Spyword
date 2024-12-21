import User from '#models/user'
import Game from '#models/game'

export async function createGame(this: User): Promise<void> {
  if (this.gameId) {
    throw new Error('User already in a game')
  }
  const game = await Game.create({ ownerId: this.id })
  await game.addPlayer(this)
}

export async function joinGame(this: User, game: Game): Promise<void> {
  if (this.gameId) {
    throw new Error('User already in a game')
  }
  await game.addPlayer(this)
}
export async function leaveGame(this: User): Promise<void> {
  if (!this.gameId) {
    throw new Error('User not in a game')
  }
  const game = await Game.findOrFail(this.gameId)
  try {
    await this.load('gameStat')
    await this.gameStat?.delete()
    this.gameId = null
    await this.save()
  } catch (err) {
    throw new Error('User not in a game')
  }
  await game.checkForDelete()
}
export async function createToken(user: User): Promise<{
  name: string
  type: string
  token: string | undefined
}> {
  const token = await User.accessTokens.create(user)
  return {
    name: user.fullName!,
    type: 'Bearer',
    token: token.value?.release(),
  }
}
