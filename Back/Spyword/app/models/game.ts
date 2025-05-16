import { DateTime } from 'luxon'
import {
  afterCreate,
  afterUpdate,
  BaseModel,
  beforeCreate,
  belongsTo,
  column,
  hasMany,
  hasOne,
} from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import GameStat from './game_stat.js'
import GameOption from './game_option.js'
import {
  addPlayer,
  generateSlug,
  checkForDelete,
  getAllInfo,
  checkForStart,
  initGame,
  resetGame,
  defineRoles,
  nextRound,
  alert,
  calculateWhiteVote,
  addEvent,
} from '#services/game_functions'
import type { GameEvent } from '#services/game_functions'
interface GameProperties {
  gamePhase?: 'choose' | 'play' | 'vote' | 'white' | 'end' | 'resultVote'
  verifyPhase?: boolean
  words?: {
    civil: string
    spy: string
  }
  orderGame?: number[]
  indexCurrentPlayer?: number
  playersReady?: number[]
  round?: number
  endDetails?: {
    winner: 'civil' | 'spy' | 'white' | 'none'
    winnersId: number[]
  }
  resultRound?: {
    egalite: boolean
    eliminated: User | null
    role: string | null
    history: { target: number; numberOfVote: number; idList: number[] }[]
  }
  whitePhase?: {
    whiteId: number | null
    word: string | null
    playersValidation: { id: number; vote: boolean }[]
    validation: boolean
  }
  history?: {
    round: number
    events: GameEvent[]
  }[]
}
export default class Game extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column({
    prepare: (value: GameProperties) => JSON.stringify(value),
    consume: (value: string) => JSON.parse(value),
    serialize: (value: GameProperties) => {
      if (value) {
        return {
          gamePhase: value.gamePhase,
          orderGame: value.orderGame,
          indexCurrentPlayer: value.indexCurrentPlayer,
          verifyPhase: value.verifyPhase,
          round: value.round,
          resultRound: value.resultRound,
          endDetails: value.endDetails,
          whitePhase: value.whitePhase,
          history: value.history,
        }
      } else {
        return null
      }
    },
  })
  declare properties: GameProperties

  @column()
  declare slug: string

  @column()
  declare ownerId: number

  @column({ columnName: 'in_game', serialize: (value: number) => (value === 0 ? false : true) })
  declare inGame: boolean

  @column()
  declare playerTurn: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime
  @afterUpdate()
  public static async checkForDelete(game: Game) {
    if (game.users.length === 0) {
      await game.delete()
    }
  }
  @beforeCreate()
  public static async generateName(game: Game) {
    const response = await Game.query().max('id as maxId').firstOrFail()
    const maxId = response.$extras.maxId
    game.name = `game#${maxId + 1}`
  }
  @beforeCreate()
  public static async generateSlug(game: Game) {
    game.slug = await generateSlug()
  }
  @afterCreate()
  public static async createGameOption(game: Game) {
    await GameOption.create({
      gameId: game.id,
    })
  }

  // @afterFind()
  // public static async afterFindHook(game: Game) {
  //   await game.load('gameOption')
  //   await game.load('users')
  // }
  // Relation avec les utilisateurs
  @hasMany(() => User)
  declare users: HasMany<typeof User>

  @hasOne(() => GameOption)
  declare gameOption: HasOne<typeof GameOption>

  @belongsTo(() => User, {
    foreignKey: 'ownerId',
  })
  declare owner: BelongsTo<typeof User>

  @hasMany(() => GameStat)
  declare playersStats: HasMany<typeof GameStat>

  @belongsTo(() => User, {
    foreignKey: 'playerTurn',
  })
  declare activePlayer: BelongsTo<typeof User>
  public checkForDelete = checkForDelete
  public addPlayer = addPlayer
  public getAllInfo = getAllInfo
  public checkForStart = checkForStart
  public initGame = initGame
  public resetGame = resetGame
  public defineRole = defineRoles
  public alert = alert
  public nextRound = nextRound
  public calculateWhiteVote = calculateWhiteVote
  public addEvent = addEvent
}
