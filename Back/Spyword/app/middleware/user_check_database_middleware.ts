import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import User from '#models/user'
import { createUserValidator } from '#validators/user'
export default class UserCheckDatabaseMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const payload = await ctx.request.validateUsing(createUserValidator)
    if (!payload) {
      return ctx.response.status(400).send(payload)
    }
    const user = await User.findBy('full_name', ctx.request.body().name.trim())
    if (!user) {
      const output = await next()
      return output
    } else {
      return ctx.response.status(403).send('user already exists')
    }
  }
}
