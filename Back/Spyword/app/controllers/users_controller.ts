import type { HttpContext } from '@adonisjs/core/http'
import db from '#services/database'
import { createUserValidator } from '#validators/user'
import { inject } from '@adonisjs/core'

export default class UsersController {
  @inject()
  async create({ request, response }: HttpContext, database: db) {
    const payload = await request.validateUsing(createUserValidator)
    if (!payload) {
      return response.status(400).send(payload)
    }
    try {
      const user = await database.addUser(payload)
      return response.status(201).send(user)
    } catch (e) {
      return response.status(403).send('user already exists')
    }
  }
}
