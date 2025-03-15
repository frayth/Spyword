import Game from '#models/game'
import User from '#models/user'
import { transmitGame, transmitUser } from '#services/ws/ws'
import { AnimationName } from '#services/ws/ws.model'

export async function nextPlayer(game: Game) {
  if (!game.properties) throw new Error('Game properties not found')
  const nextIndex = game.properties.indexCurrentPlayer! + 1

  if (nextIndex >= game.properties.orderGame!.length) {
    lauchAnimation(game, 'nextPlayer', () => {})
    lauchAnimation(game, 'vote', () => {
      game.properties.indexCurrentPlayer = 0
      changePhase(game)
    })
    await game.save()
  } else {
    lauchAnimation(game, 'nextPlayer', () => {
      game.properties.indexCurrentPlayer = nextIndex
    })
    await game.save()
  }
}

export function lauchPlay(game: Game) {
  setTimeout(async () => {
    changePhase(game)
    game.save()
    transmitGame(game.id, game)
  }, 5000)
}

export async function lauchResultVote(game: Game) {
  const summaryVote = game.users
    .filter((el) => el.gameStat.isAlive)
    .reduce(
      (acc, el) => {
        const vote = el.gameStat?.vote!
        const index = acc.findIndex((e) => e.id === vote)
        if (index === -1) {
          acc = [...acc, { id: vote, vote: 1 }]
        } else {
          acc[index].vote++
        }
        return acc
      },
      [] as { id: number; vote: number }[]
    )

  const { id: idPlayerWithMoreVote, vote: maxVote } = summaryVote.reduce((acc, el) =>
    el.vote > acc.vote ? el : acc
  )
  const isAnEgality = summaryVote.filter((el) => el.vote === maxVote).length > 1
  const player = await User.findBy('id', idPlayerWithMoreVote)
  await player?.load('gameStat')
  if (player === null) throw new Error('Player not found in lauchResult')
  let eliminatedRole: string | null = null
  if (player) {
    eliminatedRole = player.gameStat.role
  }
  if (isAnEgality) {
    console.log("égalité personne n'est eliminé")
    game.properties.resultRound = {
      egalite: true,
      eliminated: null,
      role: null,
      history: summaryVote.map(({ id: targetID, vote: numberOfVote }) => {
        const userVotedForThisId = game.users
          .filter((el) => el.gameStat.vote === targetID)
          .map((el) => el.id)
        return { target: targetID, numberOfVote: numberOfVote, idList: userVotedForThisId }
      }),
    }
    await game.save()
  } else {
    game.properties.resultRound = {
      egalite: false,
      eliminated: player,
      role: eliminatedRole,
      history: summaryVote.map(({ id: targetID, vote: numberOfVote }) => {
        const userVotedForThisId = game.users
          .filter((el) => el.gameStat.vote === targetID)
          .map((el) => el.id)
        return { target: targetID, numberOfVote: numberOfVote, idList: userVotedForThisId }
      }),
    }
    await eliminationPlayer(game, player!)
  }

  await player.load('game')
  await player.game.getAllInfo()
  transmitGame(player.game.id, player.game)
  const { gameIsOver, winner, winnersId } = await checkForEndCondition(player.game)
  if (gameIsOver) {
    lauchAnimation(player.game, 'resultVote', async () => {
      player.game.properties.endDetails = { winner, winnersId }
      player.game.properties.gamePhase = 'end'
      await player.game.save()
    })
  } else {
    nextTurn(player.game)
    await player.game.save()
    lauchAnimation(player.game, 'resultVote', async () => {
      changePhase(player.game)
      lauchAnimation(player.game, 'nextTurn', async () => {})
    })
  }
}

export function changePhase(game: Game): void {
  switch (game.properties.gamePhase) {
    case 'choose':
      game.properties.gamePhase = 'play'
      break
    case 'play':
      game.properties.gamePhase = 'vote'
      break
    case 'vote':
      game.properties.gamePhase = 'play'
      break
    case 'white':
      game.properties.gamePhase = 'end'
      break
    default:
      break
  }
}

export async function eliminationPlayer(game: Game, player: User): Promise<void> {
  await player.load('gameStat')
  player.gameStat.isAlive = false
  await player.gameStat.save()
  game.properties.orderGame = game.properties.orderGame?.filter((el) => el !== player.id)
  await game.save()
}

export function lauchAnimation(
  game: Game,
  animation: AnimationName,
  callback: () => void = () => {}
): void {
  game.users.forEach((el) => {
    transmitUser(el.id, 'animate', animation)
  })
  setTimeout(() => {
    callback()
    game.save()
    transmitGame(game.id, game)
  }, 1000)
}

export async function nextTurn(game: Game): Promise<void> {
  await game.load('users')
  game.properties.indexCurrentPlayer = 0
  game.properties.round!++
  game.users.forEach(async (el) => {
    await el.load('gameStat')
    el.gameStat.vote = null
    el.gameStat.asVoted = false
    el.gameStat.save()
  })
}

export async function checkForEndCondition(game: Game): Promise<{
  gameIsOver: boolean
  winner: 'spy' | 'civil' | 'none'
  winnersId: number[]
}> {
  await game.load('users')

  await Promise.all(game.users.map((el) => el.load('gameStat')))
  let winner: 'spy' | 'civil' | 'none' = 'none'
  const spyIsAlive = game.users.some((el) => {
    return el.gameStat.role === 'spy' && Boolean(el.gameStat.isAlive)
  })

  const numberOfPlayerAlive = game.users.filter((el) => {
    return Boolean(el.gameStat.isAlive)
  }).length

  console.log('spyIsAlive', spyIsAlive)
  console.log('numberOfPlayerAlive', numberOfPlayerAlive)

  if (!spyIsAlive) {
    winner = 'civil'
  }
  if (numberOfPlayerAlive <= 2 && spyIsAlive) {
    winner = 'spy'
  }
  const winnersId = game.users.filter((el) => el.gameStat.role === winner).map((el) => el.id)

  return {
    gameIsOver: winner !== 'none',
    winner,
    winnersId,
  }
}
