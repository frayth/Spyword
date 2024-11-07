import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('users', (table) => {
      table.dropColumn('email')
    })
  }

  async down() {
    this.schema.alterTable('users', (table) => {
      table.string('email', 254).notNullable().unique()
    })
  }
}
