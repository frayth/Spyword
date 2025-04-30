import User from '#models/user'
import Game from '#models/game'
import GameStat from '#models/game_stat'
import { v4 as uuidv4 } from 'uuid'
import { getRandomAvatar } from './avatar/avatar.js'
import { transmitUser } from './ws/ws.js'
import words from '../assets/words.js'
import type { Word } from '../assets/words.js'

export async function addPlayer(this: Game, user: User) {
  //console.log('addPlayer')
  await this.load('users')
  await Promise.all(
    this.users.map(async (el) => {
      await el.load('gameStat')
    })
  )
  const avatarAlreadyExist = this.users.map((el) => el.gameStat.urlAvatar)
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
    urlAvatar: `public/images/avatars/${getRandomAvatar(avatarAlreadyExist)}`,
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
    //console.log('return false for white')
    return false
  }
  if (this.users.length < 3) {
    //console.log('return false for players')
    return false
  }
  return true
}

export async function initGame(this: Game) {
  await this.getAllInfo()
  const arrayIndex = shuffleArray(this.users)
  this.properties.playersReady = []
  this.properties.gamePhase = 'choose'
  this.properties.indexCurrentPlayer = 0
  this.properties.orderGame = arrayIndex
  this.properties.verifyPhase = false
  this.properties.round = 1
  this.inGame = true
  this.properties.resultRound = {
    egalite: false,
    eliminated: null,
    role: null,
    history: [],
  }
  this.properties.endDetails = {
    winner: 'none',
    winnersId: [],
  }
  this.properties.whitePhase = {
    word: null,
    playersValidation: [],
    whiteId: null,
    validation: false,
  }
  await this.save()
}

function shuffleArray(array: User[]): number[] {
  const arrayIndex: number[] = []
  for (let user of array) {
    arrayIndex.push(user.id)
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
  await this.getAllInfo()
  for (const user of this.users) {
    await user.load('gameStat')
    user.gameStat.resetStat()
    await user.gameStat.save()
  }
  await this.save()
  await this.alert(10, 'Un joueur à quitté la partie')
}

export async function alert(this: Game, code: number, message: string) {
  await this.load('users')
  for (const user of this.users) {
    transmitUser(user.id, 'alert', { code, message })
  }
}

export async function defineRoles(this: Game) {
  await this.load('users')
  await this.load('gameOption')
  const word = getWord()
  this.properties.words = {
    civil: word.word,
    spy: word.spy[Math.floor(Math.random() * word.spy.length)],
  }
  await this.save()
  for (const user of this.users) {
    await user.load('gameStat')
  }
  const civilWord = this.properties.words.civil
  this.users.forEach(async (user) => {
    user.gameStat.role = 'civil'
    user.gameStat.word = civilWord
    user.gameStat.save()
  })
  if (this.gameOption.whiteIsPresent) {
    const whiteId =
      this.properties.orderGame![Math.floor(Math.random() * (this.users.length - 1)) + 1]
    //console.log('whiteId', whiteId)
    //console.log('ordergame', this.properties.orderGame)
    const user = this.users.find((el) => el.id === whiteId)
    user!.gameStat.role = 'white'
    user!.gameStat.word = ''
    user!.gameStat.save()
  }
  this.refresh()
  const eligibleUsers = this.users.filter((user) => user.gameStat.role === 'civil')
  const spyIndex = Math.floor(Math.random() * eligibleUsers.length)
  //console.log('spyIndex', spyIndex)
  eligibleUsers[spyIndex].gameStat.role = 'spy'
  eligibleUsers[spyIndex].gameStat.word = this.properties.words.spy
  eligibleUsers[spyIndex].gameStat.save()
  await this.refresh()
  for (const user of this.users) {
    switch (user.gameStat.role) {
      case 'spy':
        transmitUser(user.id, 'info', {
          role: user.gameStat.role,
          word: this.properties.words.spy,
        })
        break
      case 'white':
        transmitUser(user.id, 'info', {
          role: user.gameStat.role,
          word: '',
        })
        break
      case 'civil':
        transmitUser(user.id, 'info', {
          role: user.gameStat.role,
          word: this.properties.words.civil,
        })
        break
    }
  }
}

function getWord(): Word {
  const index = Math.floor(Math.random() * words.length)
  return words[index]
}

export async function nextRound(this: Game) {
  await this.load('users')
  this.initGame()
  await this.save()
  for (const user of this.users) {
    await user.load('gameStat')
    user.gameStat.resetStat()
    await user.gameStat.save()
  }
  await this.defineRole()
}

export async function calculateWhiteVote(this: Game): Promise<boolean> {
  this.getAllInfo()
  const numberOfCivil = this.users.filter((el) => el.gameStat.role === 'civil').length
  const whiteVoteWithOnlyCivil = this.properties.whitePhase?.playersValidation.filter((el) => {
    const role = this.users.find((user) => user.id === el.id)?.gameStat.role
    if (role === 'civil') return true
    return false
  })
  const numberOfPositiveVote = whiteVoteWithOnlyCivil?.filter((el) => el.vote).length
  if (!numberOfPositiveVote || numberOfPositiveVote < numberOfCivil / 2) {
    return false
  }
  return true
}
