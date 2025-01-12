import { createRouter, createWebHistory } from 'vue-router'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useGameStore } from '@/stores/game'
import { storeToRefs } from 'pinia'
export const initialRoute = ref('/')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/play/:slug',
      name: 'play',
      component: () => import('@/views/PlayView.vue'),
      beforeEnter: (to, from, next) => {
        const { currentGame } = storeToRefs(useGameStore())
        if (currentGame.value.id !== 0) {
          next()
        } else {
          next('/')
        }
      }
    },
    {
      path: '/',
      component: () => import('@/views/MainLayout.vue'),
      children: [
        {
          path: '/game',
          name: 'game',
          component: () => import('@/views/GameView.vue'),
        },
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})
window.addEventListener('storage', () => {
  const { infoUser, credentials } = useAuthStore()
  if (credentials.token.value === '' || credentials.token.value === undefined) {
    infoUser.isConnect = false
    router.push('/login')
  }
})

router.beforeEach((to,from) => {
  const { infoUser } = useAuthStore()
  const {currentGame} = storeToRefs(useGameStore())
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = infoUser.isConnect
  if (authRequired && !loggedIn) {
    initialRoute.value = to.path
    return '/login'
  } else if (to.path === '/login' && loggedIn) {
    return '/'
  }else if(from.path.startsWith('/play/') && currentGame.value.slug !== '')
  {
    return false
  }else {
    return true
  }
})
router.onError(() => {
  console.log('error router')
  router.go(0)
})

export default router
