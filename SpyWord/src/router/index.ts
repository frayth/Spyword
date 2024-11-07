import { createRouter, createWebHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'
import { useAppliStore } from '@/stores/appli'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component:()=>import('@/views/LoginView.vue'),
    },
    {
      path: '/',
      name: 'home',
      component:defineAsyncComponent(()=>import('@/views/HomeView.vue')),
    },
  ],
})

router.beforeEach((to, from) => {
  const {infoUser}=useAppliStore()

  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  console.log('infoUser',infoUser,authRequired)
  const loggedIn = infoUser.isConnect

  if (authRequired && !loggedIn) {
    return '/login'
  }else if(to.path==='/login' && loggedIn){
    return '/'
  }

})
router.onError((error) => {
  console.error('router error',error)
  router.go(0)
})


export default router
