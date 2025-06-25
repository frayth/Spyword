import type { HttpContext } from '@adonisjs/core/http'
import {
  joinGameValidator,
  kickGameValidator,
  propositionValidator,
  validateWordValidator,
  whiteValidationValidator,
  whiteGuessValidator,
} from '#validators/game'
import Game from '#models/game'
import User from '#models/user'
import gameResponse from '#services/responses/game'
import { transmitGame, transmitUser } from '#services/ws/ws'
import {
  nextPlayer,
  lauchPlay,
  lauchAnimation,
  lauchResultVote,
  checkForEndCondition,
  nextTurn,
  eliminationPlayer,
} from '#services/game/game'

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
        ////console.log('reset game')
        await gameCurr.resetGame('leave')
        await gameCurr.refresh()
      }
      // if game still exist
      if (gameCurr) {
        ////console.log('transmit game')
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
    if (user.game.users.length < 3) {
      return response.status(400).send({ message: 'not enough players', code: 4036 })
    }
    if (!user.game.checkForStart()) {
      return response.status(400).send({ message: 'error Game Option', code: 4037 })
    }
    await user.game.initGame()
    await user.game.defineRole()
    lauchAnimation(user.game, 'start', () => {
      user.game.users.forEach((el) => {
        if (el.gameStat.role === 'white') {
          transmitUser(el.id, 'info', { word: '' })
        } else if (el.gameStat.role === 'spy') {
          transmitUser(el.id, 'info', { word: user.game.properties.words?.spy })
        } else {
          transmitUser(el.id, 'info', { word: user.game.properties.words?.civil })
        }
      })
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

    const user = auth.user!
    await user.load('gameStat')
    await user.load('game')
    await user.game.getAllInfo()
    const userIsOwner = user.game.ownerId === user.id

    if (!user.game.properties)
      return response.status(400).send({ message: 'game not started', code: 4003 })

    if (user.id !== user.game.properties.orderGame![user.game.properties.indexCurrentPlayer!])
      return response.status(403).send({ message: 'not your turn', code: 4035 })

    if (user.gameStat.words.length >= user.game.properties.round!)
      return response.status(400).send({ message: 'too much words', code: 4004 })

    user.gameStat.words.push(word)
    await user.gameStat.save()
    await user.game.load('users', (query) => query.preload('gameStat'))
    transmitGame(user.game.id, user.game)
    if (!userIsOwner && user.game.gameOption.verificationOwner) {
      user.game.properties.verifyPhase = true
      await user.game.save()
      transmitGame(user.game.id, user.game)
    } else {
      await user.game.addEvent(
        { type: 'proposition', event: { player: user.id, word: word } },
        user.game.properties.round!
      )
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
      if (currentPlayer) {
        await user.game.addEvent(
          {
            type: 'proposition',
            event: {
              player: currentPlayer.id!,
              word: currentPlayer.gameStat.words[currentPlayer?.gameStat.words.length - 1],
            },
          },
          user.game.properties.round!
        )
      }
      nextPlayer(user.game)
    } else {
      user.game.properties.verifyPhase = false
      currentPlayer?.gameStat.words.pop()
      await currentPlayer?.gameStat.save()
    }
    transmitGame(user.game.id, user.game)
    return response.status(200).send({ message: 'validate ok', code: 200 })
  }

  async vote({ auth, response, request }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(kickGameValidator)
    await user.load('game')
    await user.game.getAllInfo()
    await user.load('gameStat')
    if (!user.gameStat.isAlive) {
      return response.status(400).send({ message: 'user is dead', code: 4005 })
    }
    if (!user.game.inGame)
      return response.status(400).send({ message: 'game not started', code: 4003 })

    if (user.gameStat.asVoted)
      return response.status(403).send({ message: 'already voted', code: 40313 })

    if (!user.game.users.find((el) => el.id === +payload.user_id)) {
      return response.status(400).send({
        message: "impossible de voter pour un joueur qui n'est pas dans la partie",
        code: 40311,
      })
    }

    if (+payload.user_id === user.id) {
      return response.status(400).send({
        message: 'impossible de voter pour soi-même',
        code: 40312,
      })
    }
    const target = await User.findBy('id', +payload.user_id)
    if (!target) {
      return response.status(404).send({ message: 'user not found', code: 4041 })
    }
    await target.load('gameStat')
    if (target.gameStat.isAlive === false) {
      return response.status(400).send({ message: 'user is dead', code: 4005 })
    }
    user.gameStat.vote = +payload.user_id
    user.gameStat.asVoted = true
    await user.gameStat.save()
    await user.load('game')
    await user.game.getAllInfo()
    await user.game.addEvent(
      { type: 'vote', event: { player: user.id, target: +payload.user_id } },
      user.game.properties.round!
    )
    await user.game.refresh()
    transmitGame(user.game.id, user.game)
    if (
      user.game.users
        .filter((el) => user.game.properties.orderGame?.includes(el.id))
        .every((el) => el.gameStat.asVoted)
    ) {
      lauchResultVote(user.game)
    }
    return response.status(200).send({ message: 'vote ok', code: 200 })
  }

  async reset({ auth, response }: HttpContext) {
    const user = auth.user!
    await user.load('game')
    await user.game.getAllInfo()
    if (user.id !== user.game.ownerId) {
      return response.status(403).send({ message: 'not owner', code: 4033 })
    }

    await user.game.resetGame('reset')
    await user.game.refresh()
    await user.game.load('users')
    await Promise.all(
      user.game.users.map(async (el) => {
        await el.load('gameStat')
        el.gameStat.resetStat()
        await el.gameStat.save()
      })
    )
    transmitGame(user.game.id, user.game)
    return response.status(200).send({ message: 'game reset', code: 200 })
  }

  async nextRound({ auth, response }: HttpContext) {
    const user = auth.user!
    await user.load('game')
    await user.game.getAllInfo()
    if (user.id !== user.game.ownerId) {
      return response.status(403).send({ message: 'not owner', code: 4033 })
    }
    if (user.game.properties.gamePhase !== 'end') {
      return response.status(400).send({ message: 'not end phase', code: 4006 })
    }
    await user.game.nextRound()
    lauchAnimation(user.game, 'newRound', () => {})
    return response.status(200).send({ message: 'next round', code: 200 })
  }

  async whiteGuess({ auth, response, request }: HttpContext) {
    const user = auth.user!
    const { word } = await request.validateUsing(whiteGuessValidator)
    await user.load('game')
    await user.game.getAllInfo()
    if (user.game.properties.gamePhase !== 'white') {
      return response.status(400).send({ message: 'not white phase', code: 4007 })
    }
    if (user.game.properties.whitePhase?.whiteId !== user.id) {
      return response.status(403).send({ message: 'player cant play, not his turn', code: 4035 })
    }
    if (user.game.properties.whitePhase?.validation) {
      return response.status(400).send({ message: 'already validated', code: 4008 })
    }
    user.game.properties.whitePhase.word = word
    user.game.properties.whitePhase.validation = true
    await user.game.save()
    transmitGame(user.game.id, user.game)
    return response.status(200).send({ message: 'white guess', code: 200 })
  }

  async whiteValidate({ auth, response, request }: HttpContext) {
    const user = auth.user!
    const { response: responseUser } = await request.validateUsing(whiteValidationValidator)
    await user.load('game')
    await user.game.getAllInfo()
    await user.load('gameStat')
    if (
      user.game.properties.gamePhase !== 'white' &&
      !user.game.properties.whitePhase?.validation
    ) {
      return response.status(400).send({ message: 'not validation white phase', code: 4007 })
    }
    if (user.game.properties.whitePhase?.playersValidation.find((el) => el.id === user.id)) {
      return response.status(400).send({ message: 'already validated', code: 4008 })
    }
    if (user.gameStat.role === 'white') {
      return response.status(400).send({ message: 'white cant validate', code: 4009 })
    }
    user.game.properties.whitePhase!.playersValidation.push({
      id: user.id,
      vote: responseUser,
    })
    await user.game.save()
    transmitGame(user.game.id, user.game)
    if (user.game.properties.whitePhase!.playersValidation.length === user.game.users.length - 1) {
      const result = await user.game.calculateWhiteVote()
      ////console.log('white a trouve le mot', result)
      if (result) {
        ////console.log('white a trouve le mot')
        user.game.users.forEach((el) => {
          if (el.gameStat.role !== 'white') el.gameStat.isAlive = false
          el.gameStat.save()
        })
        user.game.properties.gamePhase = 'end'
        const { winner, winnersId } = await checkForEndCondition(user.game)
        user.game.properties.endDetails = { winner, winnersId }
        user.game.save()
        lauchAnimation(user.game, 'whiteWin', () => {})
      } else {
        const whitePlayer = user.game.users.find((el) => el.gameStat.role === 'white')
        await eliminationPlayer(user.game, whitePlayer!)
        await user.game.getAllInfo()
        const { winner, gameIsOver, winnersId } = await checkForEndCondition(user.game)
        if (gameIsOver) {
          ////console.log('game is over')
          user.game.properties.gamePhase = 'end'
          user.game.properties.endDetails = { winner, winnersId }
          lauchAnimation(user.game, 'whiteLose', () => {})
          //lauch animation
        } else {
          ////console.log('game pas fini')
          nextTurn(user.game)
          await eliminationPlayer(user.game, whitePlayer!)
          await user.game.getAllInfo()
          user.game.properties.gamePhase = 'play'
          user.game.properties.whitePhase = {
            word: null,
            playersValidation: [],
            whiteId: null,
            validation: false,
          }
          user.game.save()
          if (whitePlayer) {
            await user.game.addEvent(
              { type: 'elimination', event: { player: whitePlayer.id } },
              user.game.properties.round!
            )
          }

          lauchAnimation(user.game, 'whiteLose', () => {
            lauchAnimation(user.game, 'nextTurn', () => {})
          })

          //lauch animation next turn
        }
      }
    }

    return response.status(200).send({ message: 'white validation', code: 200 })
  }
}
