import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/user/:id',
      name: 'userBlog',
      component: () => import('@/views/UserBlog.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/post/:id',
      name: 'postDetail',
      component: () => import('@/views/PostDetail.vue'),
      meta: { requiresAuth: true }
    }
  ]
})


router.beforeEach((to, from) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth !== false
  
  if (requiresAuth && !authStore.isAuthenticated) {
    return '/login'
  }
  
  if (to.path === '/login' && authStore.isAuthenticated) {
    return '/'
  }
  
  return true
})

export default router