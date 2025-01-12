import User from '#models/user'
import Game from '#models/game'
export default class UseDatabase {
  async createUser({ name, password }: { name: string; password: string }) {
    const user = await User.create({ fullName: name, password })
    const token = await user.createToken(user)
    return token
  }
  async find(name: string) {
    return await User.findBy('fullName', name)
  }

  async deleteToken(user: User) {
    const listOfToken = await User.accessTokens.all(user)
    for (const token of listOfToken) {
      await User.accessTokens.delete(user, token.identifier)
    }
  }

  async findGame(id: number) {
    return await Game.findOrFail(id)
  }
}
