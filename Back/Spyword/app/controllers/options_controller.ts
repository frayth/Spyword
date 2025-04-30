import type { HttpContext } from '@adonisjs/core/http'
import { playerOptionValidator, whiteOptionValidator } from '#validators/options'
import db from '#services/use_database'
import { inject } from '@adonisjs/core'
import { transmitGame } from '#services/ws/ws'
export default class OptionsController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {}
  @inject()
  async changePlayers({ auth, request, params, response }: HttpContext, { findGame }: db) {
    const payload = await request.validateUsing(playerOptionValidator)
    const user = auth.user!
    try {
      const game = await findGame(params.id)
      await game.getAllInfo()
      if (user.id !== game.ownerId) {
        return response.status(403).send({ message: 'not owner', code: 4033 })
      }
      game.gameOption.maxPlayers = payload.players
      if (payload.players <= 3 && game.gameOption.whiteIsPresent) {
        game.gameOption.whiteIsPresent = false
      }
      await game.gameOption.save()
      transmitGame(game.id, game)
      response.status(200).send({ message: 'ok', code: 200 })
    } catch (e) {
      return response.status(400).send({ message: e, code: 4002 })
    }
  }

  @inject()
  async changeWhite({ auth, request, params, response }: HttpContext, { findGame }: db) {
    const payload = await request.validateUsing(whiteOptionValidator)
    const user = auth.user!
    try {
      const game = await findGame(params.id)
      await game.getAllInfo()
      if (game.gameOption.maxPlayers <= 3) {
        return response
          .status(403)
          .send({ message: 'maxPlayers must be greater than 3', code: 4035 })
      }
      if (user.id !== game.ownerId) {
        return response.status(403).send({ message: 'not owner', code: 4033 })
      }
      game.gameOption.whiteIsPresent = payload.present
      await game.gameOption.save()
      transmitGame(game.id, game)
      response.status(200).send({ message: 'ok', code: 200 })
    } catch (e) {
      return response.status(400).send({ message: e, code: 4002 })
    }
  }
  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({}: HttpContext) {}

  /**
   * Show individual record
   */
  async show({}: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({}: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({}: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({}: HttpContext) {}
}
