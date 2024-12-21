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
import { addPlayer, generateSlug, checkForDelete } from '#services/game_functions'
export default class Game extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare ownerId: number

  @column({ columnName: 'in_game' })
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
}
