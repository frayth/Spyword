import type { HttpContext } from '@adonisjs/core/http'
import { joinGameValidator } from '#validators/game'
import Game from '#models/game'
import gameResponse from '#services/responses/game'
import transmit from '@adonisjs/transmit/services/main'
export default class GamesController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {}

  /**
   * Display form to create a new record
   */
  async create({ auth, response }: HttpContext) {
    const user = auth.user!
    try {
      await user.createGame()
    } catch (e) {
      return response.status(400).send({ message: e.message, code: 4001 })
    }
    await user.load('game')
    const game = user.game
    const responseGame = await gameResponse(game)
    return response.status(201).send({ message: 'game created', data: responseGame, code: 2011 })
  }

  async join({ auth, response, request }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(joinGameValidator)
    try {
      const game = await Game.findByOrFail('slug', payload.game_id)
      await game.load('gameOption')
      await game.load('users')
      if (game.users.length >= game.gameOption.maxPlayers) {
        return response.status(401).send({ message: 'game full', code: 4014 })
      }
      await user.joinGame(game)
      const responseGame = await gameResponse(game)
      transmit.broadcast(`game/${game.id}`, 'Une personne nous a rejoins mes loulou!!')
      return response.status(200).send({ message: 'game joined', data: responseGame, code: 200 })
    } catch (e) {
      return response.status(401).send({ message: e, code: 4013 })
    }
  }

  async leave({ auth, response }: HttpContext) {
    const user = auth.user!
    await user.load('game')
    try {
      await user.leaveGame()
      transmit.broadcast(`game/${user.game.id}`, 'ho NO! une personne est partie mes loulou!!')
      return response.status(200).send({ message: 'game left', code: 200 })
    } catch (e) {
      return response.status(400).send({ message: e.message, code: 4001 })
    }
  }
  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({}: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
