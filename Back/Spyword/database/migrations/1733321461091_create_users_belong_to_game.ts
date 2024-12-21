import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    // this.schema.alterTable(this.tableName, (table) => {
    //   table.integer('game_id').unsigned().nullable().references('games.id').onDelete('SET NULL')
    // })
  }

  async down() {
    // this.schema.alterTable(this.tableName, (table) => {
    //   table.dropColumn('game_id')
    // })
  }
}
