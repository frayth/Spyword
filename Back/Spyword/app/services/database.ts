import User from '#models/user'
export default class UseDatabase {
  async addUser({ name, password }: { name: string; password: string }) {
    const user = await User.create({ fullName: name, password })
    const token = await User.accessTokens.create(user)
    return {
      type: 'Bearer',
      token: token.value?.release(),
    }
  }
}
