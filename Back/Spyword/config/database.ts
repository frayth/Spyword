import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'
const isProd = process.env.NODE_ENV === 'production'
console.log(
  '> DB PATH:',
  isProd ? app.makePath('production/db/prod.sqlite3') : app.tmpPath('dev.sqlite3')
)
const dbConfig = defineConfig({
  connection: 'sqlite',
  connections: {
    sqlite: {
      client: 'better-sqlite3',
      connection: {
        filename: isProd ? app.makePath('production/db/prod.sqlite3') : app.tmpPath('dev.sqlite3'),
      },
      useNullAsDefault: true,
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
