import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'game_stats'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('game_id').unsigned().references('games.id').onDelete('CASCADE')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
      table.string('role').references('roles.name').onDelete('SET NULL')
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.integer('score').defaultTo(0)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
