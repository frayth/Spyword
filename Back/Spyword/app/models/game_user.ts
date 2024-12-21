import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class GameUser extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare game_id: number

  @column()
  declare user_id: number
}
