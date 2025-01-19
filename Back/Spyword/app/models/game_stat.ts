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
  @column({ serializeAs: null })
  declare role: string
  @column()
  declare urlAvatar: string

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  public resetStat() {
    this.score = 0
    this.role = 'civil'
  }
}
