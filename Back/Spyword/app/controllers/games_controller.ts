import type { HttpContext } from '@adonisjs/core/http'
import { joinGameValidator, kickGameValidator } from '#validators/game'
import Game from '#models/game'
import User from '#models/user'
import gameResponse from '#services/responses/game'
import { transmitGame, transmitUser } from '#services/ws/ws'
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
    await gameResponse(game)
    return response.status(201).send({ message: 'game created', data: user.game, code: 2011 })
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
      transmitGame(game.id, game)
      return response.status(200).send({ message: 'game joined', data: responseGame, code: 200 })
    } catch (e) {
      return response.status(401).send({ message: e, code: 4013 })
    }
  }

  async leave({ auth, response }: HttpContext) {
    const user = auth.user!
    await user.load('game')
    if (!user.game) {
      return response.status(400).send({ message: 'not in game', code: 4002 })
    }
    const gameid = user.game.id
    try {
      await user.leaveGame()
      const gameCurr = await Game.findBy('id', gameid)
      // if game still exist
      if (gameCurr) {
        await gameResponse(gameCurr)
        transmitGame(gameCurr.id, gameCurr)
        transmitUser(user.id, 'action', 'leave')
      }
      return response.status(200).send({ message: 'game left', code: 200 })
    } catch (e) {
      return response.status(400).send({ message: e.message, code: 4001 })
    }
  }

  async kick({ auth, response, request }: HttpContext) {
    const payload = await request.validateUsing(kickGameValidator)
    const user = auth.user!
    await user.load('game')
    if (user.game && user.game.ownerId !== user.id) {
      return response.status(403).send({ message: 'not owner', code: 4033 })
    }
    const userToKick = await User.find(payload.user_id)
    if (!userToKick) {
      return response.status(404).send({ message: 'user not found', code: 4041 })
    }
    await userToKick.load('game')

    if (!userToKick.game || userToKick.game.id !== user.game?.id) {
      return response.status(403).send({ message: 'user not in game', code: 4034 })
    }
    await userToKick.leaveGame()
    transmitUser(userToKick.id, 'action', 'leave')
    await gameResponse(user.game)
    transmitGame(user.game.id, user.game)
    return response.status(200).send({ message: 'kick ok', code: 200 })
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
