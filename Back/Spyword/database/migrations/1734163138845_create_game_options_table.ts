import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'game_options'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('game_id').unsigned().references('games.id').onDelete('CASCADE')
      table.integer('max_players').notNullable().defaultTo(3)
      table.boolean('white_is_present').notNullable().defaultTo(false)
      table.boolean('verification_owner').notNullable().defaultTo(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
