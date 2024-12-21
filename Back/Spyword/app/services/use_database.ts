import User from '#models/user'

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
    console.log(user)
    const listOfToken = await User.accessTokens.all(user)
    for (const token of listOfToken) {
      await User.accessTokens.delete(user, token.identifier)
    }
    console.log(listOfToken.length)
  }
}
