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
    router.post('/changeAvatar', [UsersController, 'changeAvatar']).use([middleware.auth()])
    router.get('/info', [UsersController, 'info']).use([middleware.auth()])
    router.get('/word', [UsersController, 'getWord']).use([middleware.auth()])
  })
  .prefix('api/users')

router
  .group(() => {
    router.post('/create', [GamesController, 'create'])
    router.put('/join', [GamesController, 'join'])
    router.put('/leave', [GamesController, 'leave'])
    router.put('/kick', [GamesController, 'kick'])
    router.put('/start', [GamesController, 'start'])
    router.post('/open', [GamesController, 'open'])
    router.post('/proposition', [GamesController, 'proposition'])
    router.post('/validateWord', [GamesController, 'validateWord'])
    router.post('/vote', [GamesController, 'vote'])
    router.put('/reset', [GamesController, 'reset'])
    router.post('/nextRound', [GamesController, 'nextRound'])
    router.post('/white/guess', [GamesController, 'whiteGuess'])
    router.post('/white/validate', [GamesController, 'whiteValidate'])
  })
  .prefix('api/games')
  .use([middleware.auth()])

router
  .group(() => {
    router.put('/players', [OptionsController, 'changePlayers'])
    router.put('/white', [OptionsController, 'changeWhite'])
    router.put('/verification', [OptionsController, 'changeVerification'])
  })
  .prefix('api/games/:id/options')
  .use([middleware.auth()])

router
  .group(() => {
    router.get('/images/:folder/:name', [ImagesController, 'show'])
  })
  .prefix('api/public')

router
  .group(() => {
    router.get('/avatars', [ImagesController, 'getNumbersOfAvatars'])
  })
  .prefix('api/divers')
