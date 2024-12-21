import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import Role from './role.js'
import type { HasOne } from '@adonisjs/lucid/types/relations'

export default class GameStat extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column()
  declare score: number
  @column()
  declare gameId: number
  @column()
  declare userId: number

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasOne(() => Role)
  declare role: HasOne<typeof Role>
}
