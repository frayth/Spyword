import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, belongsTo, column, computed, hasOne } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import Game from './game.js'
import GameStat from './game_stat.js'
import { createGame, joinGame, createToken, leaveGame, getAll } from '#services/user_fonctions'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['fullname'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare gameId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Game)
  declare game: BelongsTo<typeof Game>

  @hasOne(() => GameStat)
  declare gameStat: HasOne<typeof GameStat>

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30days',
    prefix: 'user',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 64,
  })
  public createGame = createGame
  public joinGame = joinGame
  public createToken = createToken
  public leaveGame = leaveGame
  public getAll = getAll
}
