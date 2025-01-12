/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import { middleware } from './kernel.js'
import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller')
const GamesController = () => import('#controllers/games_controller')
const OptionsController = () => import('#controllers/options_controller')
const ImagesController = () => import('#controllers/images_controller')
router
  .group(() => {
    router.post('/create', [UsersController, 'create'])
    router.get('/connect', [UsersController, 'connect'])
    router.get('/info', [UsersController, 'info']).use([middleware.auth()])
  })
  .prefix('api/users')

router
  .group(() => {
    router.post('/create', [GamesController, 'create'])
    router.put('/join', [GamesController, 'join'])
    router.put('/leave', [GamesController, 'leave'])
    router.put('/kick', [GamesController, 'kick'])
  })
  .prefix('api/games')
  .use([middleware.auth()])

router
  .group(() => {
    router.put('/players', [OptionsController, 'changePlayers'])
    router.put('/white', [OptionsController, 'changeWhite'])
  })
  .prefix('api/games/:id/options')
  .use([middleware.auth()])

router
  .group(() => {
    router.get('/images/:folder/:name', [ImagesController, 'show'])
  })
  .prefix('api/public')
