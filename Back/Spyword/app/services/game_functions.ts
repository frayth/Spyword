import User from '#models/user'
import Game from '#models/game'
import GameStat from '#models/game_stat'
import { v4 as uuidv4 } from 'uuid'
import { getRandomAvatar } from './avatar/avatar.js'
import { transmitUser } from './ws/ws.js'
export async function addPlayer(this: Game, user: User) {
  console.log('addPlayer')
  user.gameId = this.id
  await user.save()
  const existingGameStat = await GameStat.query()
    .where('gameId', this.id)
    .andWhere('userId', user.id)
    .first()
  if (existingGameStat) {
    throw new Error('User already in game')
  }
  await GameStat.create({
    gameId: this.id,
    userId: user.id,
    urlAvatar: `public/images/avatars/${getRandomAvatar()}`,
  })
}

export async function checkForDelete(this: Game) {
  await this.load('users')
  if (this.users.length === 0) {
    await this.delete()
  } else {
    const firstUser = this.users[0]
    this.ownerId = firstUser.id
    await this.save()
  }
}

export async function generateSlug(): Promise<string> {
  let slug = uuidv4()
  let slugNotOk = true
  while (slugNotOk) {
    const slugAlreadyExist = await Game.query().where('slug', slug).first()
    if (!slugAlreadyExist) {
      slugNotOk = false
    }
  }
  return slug
}

export async function getAllInfo(this: Game) {
  await this.load('users')
  for (const user of this.users) {
    await user.load('gameStat')
  }
  await this.load('gameOption')
}

export function checkForStart(this: Game) {
  if (this.gameOption.whiteIsPresent && this.users.length <= 3) {
    console.log('return false for white')
    return false
  }
  if (this.users.length < 3) {
    console.log('return false for players')
    return false
  }
  return true
}

export async function initGame(this: Game) {
  await this.getAllInfo()
  const arrayIndex = shuffleArray(this.users)
  this.properties.gamePhase = 'choose'
  this.properties.indexCurrentPlayer = 0
  this.properties.orderGame = arrayIndex
  this.inGame = true
  await this.save()
}

function shuffleArray(array: User[]): number[] {
  const arrayIndex: number[] = []
  for (let i = 0; i < array.length; i++) {
    arrayIndex.push(i)
  }
  for (let i = arrayIndex.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arrayIndex[i], arrayIndex[j]] = [arrayIndex[j], arrayIndex[i]]
  }
  return arrayIndex
}

export async function resetGame(this: Game) {
  this.inGame = false
  this.properties = {}
  await this.load('users')
  for (const user of this.users) {
    await user.load('gameStat')
    user.gameStat.resetStat()
    await user.gameStat.save()
  }
  await this.save()
  await this.refresh()
  for (const user of this.users) {
    console.log('transmit reset', user.fullName, this.inGame)
    transmitUser(user.id, 'alert', { code: 10, message: 'game reset' })
  }
}
