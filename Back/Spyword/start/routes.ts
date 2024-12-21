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
import transmit from '@adonisjs/transmit/services/main'

const UsersController = () => import('#controllers/users_controller')
const GamesController = () => import('#controllers/games_controller')
router.post('/test', [UsersController, 'create'])
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
  })
  .prefix('api/games')
  .use([middleware.auth()])
