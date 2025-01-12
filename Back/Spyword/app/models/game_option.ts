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
  @column()
  declare whiteIsPresent: boolean
  @belongsTo(() => Game)
  declare game: BelongsTo<typeof Game>
}
