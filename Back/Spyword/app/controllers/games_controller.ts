import type { HttpContext } from '@adonisjs/core/http'
import {
  joinGameValidator,
  kickGameValidator,
  propositionValidator,
  validateWordValidator,
} from '#validators/game'
import Game from '#models/game'
import User from '#models/user'
import gameResponse from '#services/responses/game'
import { transmitGame, transmitUser } from '#services/ws/ws'
import { nextPlayer, lauchPlay } from '#services/game/game'

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
      if (game.inGame) {
        return response.status(403).send({ message: 'game alredy started', code: 4038 })
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
      let gameCurr = await Game.findBy('id', gameid)
      if (gameCurr?.inGame) {
        console.log('reset game')
        await gameCurr.resetGame()
      }
      // if game still exist
      if (gameCurr) {
        console.log('transmit game')
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
    if (user.game.inGame) {
      return response.status(403).send({ message: 'game already started', code: 4039 })
    }
    await userToKick.leaveGame()
    transmitUser(userToKick.id, 'action', 'leave')
    await gameResponse(user.game)
    transmitGame(user.game.id, user.game)
    return response.status(200).send({ message: 'kick ok', code: 200 })
  }

  async start({ auth, response }: HttpContext) {
    const user = auth.user!

    await user.preload('game', (gameQuery) => {
      gameQuery.preload('users').preload('gameOption')
    })
    if (!user.game) {
      return response.status(400).send({ message: 'not in game', code: 4002 })
    }
    if (user.game.ownerId !== user.id) {
      return response.status(403).send({ message: 'not owner', code: 4033 })
    }
    if (user.game.gameOption.whiteIsPresent && user.game.users.length <= 3) {
      return response.status(400).send({ message: 'not enough players', code: 4036 })
    }

    await user.game.getAllInfo()
    // if (user.game.users.length < 3) {
    //   return response.status(400).send({ message: 'not enough players', code: 4036 })
    // }
    // if (!user.game.checkForStart()) {
    //   return response.status(400).send({ message: 'error Game Option', code: 4037 })
    // }
    await user.game.initGame()
    await user.game.defineRole()
    transmitGame(user.game.id, user.game)
    user.game.users.forEach((el) => {
      transmitUser(el.id, 'animate', 'start')
      if (el.gameStat.role === 'white') {
        transmitUser(el.id, 'info', { word: '' })
      } else if (el.gameStat.role === 'spy') {
        transmitUser(el.id, 'info', { word: user.game.properties.words?.spy })
      } else {
        transmitUser(el.id, 'info', { word: user.game.properties.words?.civil })
      }
    })
    response.status(200).send({ message: 'game started', code: 200 })
  }

  async open({ auth, response }: HttpContext) {
    const user = auth.user!
    await user.load('game')
    await user.game.getAllInfo()
    if (!user.game.properties.playersReady) {
      user.game.properties.playersReady = []
      await user.game.save()
    }

    if (!user.game.properties.playersReady.includes(user.id)) {
      user.game.properties.playersReady.push(user.id)
      await user.game.save()
    }

    if (
      user.game.properties.playersReady.length === user.game.users.length &&
      user.game.properties.gamePhase === 'choose'
    ) {
      lauchPlay(user.game)
    }

    response.status(200).send({ message: 'game opened', code: 200 })
  }

  async proposition({ auth, response, request }: HttpContext) {
    const { word } = await request.validateUsing(propositionValidator)
    console.log(word)
    const user = auth.user!
    await user.load('gameStat')
    await user.load('game')
    await user.game.getAllInfo()
    const userIsOwner = user.game.ownerId === user.id

    if (!user.game.properties)
      return response.status(400).send({ message: 'game not started', code: 4003 })

    if (user.id !== user.game.properties.orderGame![user.game.properties.indexCurrentPlayer!])
      return response.status(403).send({ message: 'not your turn', code: 4035 })

    user.gameStat.words.push(word)
    await user.gameStat.save()
    await user.game.load('users', (query) => query.preload('gameStat'))

    if (!userIsOwner) {
      user.game.properties.verifyPhase = true
      await user.game.save()
      transmitGame(user.game.id, user.game)
    } else {
      nextPlayer(user.game)
      transmitGame(user.game.id, user.game)
      //change the phase
    }
    return response.status(200).send({ message: 'proposition ok', code: 200 })
  }

  async validateWord({ auth, response, request }: HttpContext) {
    const { value } = await request.validateUsing(validateWordValidator)
    const user = auth.user!
    await user.load('game')
    await user.game.getAllInfo()
    const currentPlayer = user.game.users.find(
      (el) => el.id === user.game.properties.orderGame![user.game.properties.indexCurrentPlayer!]
    )
    if (value) {
      user.game.properties.verifyPhase = false
      await user.game.save()
      nextPlayer(user.game)
    } else {
      user.game.properties.verifyPhase = false
      currentPlayer?.gameStat.words.pop()
      await currentPlayer?.gameStat.save()
    }
    transmitGame(user.game.id, user.game)
    return response.status(200).send({ message: 'validate ok', code: 200 })
  }
  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {}
}
