import User from '#models/user'
export async function userResponse(user: User) {
  await user.load('game')
  await user.load('gameStat')
  await user.game?.load('users')
  await user.game?.load('gameOption')
  const response = { ...user.toJSON() }
  return response
}
