import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Game from './game.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
export default class GameOption extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare maxPlayers: number
  @column()
  declare gameId: number
  @column({
    consume: (value: number) => Boolean(value),
    prepare: (value: boolean) => Number(value),
  })
  declare whiteIsPresent: boolean
  @column({
    consume: (value: number) => Boolean(value),
    prepare: (value: boolean) => Number(value),
  })
  declare verificationOwner: boolean
  @belongsTo(() => Game)
  declare game: BelongsTo<typeof Game>
}
