import app from '@adonisjs/core/services/app'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig } from '@adonisjs/lucid'

const Filename = fileURLToPath(import.meta.url)
const Dirname = path.dirname(Filename)

function resolveProdDbPath() {
  const basePath = Dirname.includes('/build')
    ? path.join(Dirname, '../production/db/prod.sqlite3')
    : path.join(process.cwd(), 'production/db/prod.sqlite3')

  return basePath
}
const isProd = process.env.NODE_ENV === 'production'
console.log('> DB PATH:', isProd ? resolveProdDbPath() : app.tmpPath('dev.sqlite3'))
const dbConfig = defineConfig({
  connection: 'sqlite',
  connections: {
    sqlite: {
      client: 'better-sqlite3',
      connection: {
        filename: isProd
          ? path.join(process.cwd(), 'production/db/prod.sqlite3')
          : app.tmpPath('dev.sqlite3'),
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
