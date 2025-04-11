import { HttpContext } from '@adonisjs/core/http'
import db from '#services/use_database'
import { createUserValidator, connectUserValidator } from '#validators/user'
import { inject } from '@adonisjs/core'
import hash from '@adonisjs/core/services/hash'
import { userResponse } from '#services/responses/user'
export default class UsersController {
  @inject()
  async create({ request, response, auth }: HttpContext, { createUser, find, deleteToken }: db) {
    console.log('create user')
    const payload = await request.validateUsing(createUserValidator)
    //essaye de creer un utilisateur si aucune authentification n'est presente
    if (
      !request.headers().authorization ||
      !request.headers().authorization?.startsWith('Bearer ')
    ) {
      console.log('no auth')
      try {
        const token = await createUser(payload)
        return response.status(201).send(token)
      } catch (e) {
        //si utilisateur existe deja test le mot de passe fournis
        console.log('user already exist')
        const user = await find(payload.name)
        if (user) {
          const checkPassword = await hash.verify(user.password, payload.password)
          if (checkPassword) {
            await deleteToken(user)
            const token = await user.createToken(user)
            return response.status(201).send(token)
          } else {
            return response.status(403).send({ message: 'error credentials', code: 4031 })
          }
        } else {
          return response.status(403).send({ message: 'user already exist', code: 4031 })
        }
      }
    } else {
      console.log('auth')
      //si authentification presente verifie que le token correspond a l'utilisateur
      try {
        const user = await auth.authenticate()
        if (user.fullName === payload.name) {
          console.log('auth ok')
          return response.status(200)
        } else {
          console.log('auth nok')
          deleteToken(user)
          return response.status(401).send({ message: 'error between token and data', code: 4011 })
        }
      } catch (e) {
        return response.status(401).send({ error: e, message: 'erreur inconnue', code: 4012 })
      }
    }
  }

  @inject()
  async connect({ request, response, auth }: HttpContext, { deleteToken }: db) {
    //verifie que le token correspond a l'utilisateur
    const payload = await request.validateUsing(connectUserValidator)
    if (!payload) {
      return response.status(400)
    }
    try {
      const user = await auth.authenticate()
      if (user && user.fullName === payload.name) {
        await user.load('game')
        await user.load('gameStat')
        const responseUser = { ...user.toJSON() }
        return response.status(200).send(responseUser)
      } else {
        deleteToken(user)
        throw { message: 'Invalid Token', code: 4012 }
      }
    } catch (e) {
      return response.status(401).send(e.message)
    }
  }

  async info({ auth, response, request }: HttpContext) {
    const user = auth.user!
    if (user.gameId === null) {
      return response.status(403).send({ message: 'not in the game', code: 4032 })
    }
    await userResponse(user)
    return response.status(200).send({ message: 'game info', data: user, code: 200 })
  }

  async getWord({ auth, response }: HttpContext) {
    const user = auth.user!
    await user.load('gameStat')
    return response.status(200).send({ message: 'word', data: user.gameStat?.word, code: 200 })
  }
}
