import { DateTime } from 'luxon'
import { BaseModel, column, hasOne } from '@adonisjs/lucid/orm'
import { serialize } from 'node:v8'

export default class GameStat extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column()
  declare score: number
  @column({ serialize: (value: number) => (value === 0 ? false : true) })
  declare isAlive: boolean

  @column()
  declare gameId: number

  @column()
  declare userId: number

  @column()
  declare vote: number | null

  @column({ serialize: (value: number) => (value === 0 ? false : true) })
  declare asVoted: boolean

  @column({ serializeAs: null })
  declare role: string

  @column({ serializeAs: null })
  declare word: string

  @column()
  declare urlAvatar: string

  @column({
    prepare: (value: string[]) => JSON.stringify(value),
    consume: (value: string) => JSON.parse(value),
  })
  declare words: string[]

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  public resetStat() {
    this.role = 'civil'
    this.words = []
    this.isAlive = true
    this.vote = null
    this.asVoted = false
    this.isAlive = true
  }
}
