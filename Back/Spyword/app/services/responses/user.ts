import User from '#models/user'
export async function userResponse(user: User) {
  await user.load('game')
  await user.load('gameStat')
  await user.game?.getAllInfo()
}
