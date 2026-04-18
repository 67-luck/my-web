import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import FoodDraw from '../views/FoodDraw.vue'
import Memory from '../views/Memory.vue'

import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Sync from '../views/Sync.vue'
import { useAuthStore } from '../stores/auth'

// 认证中间件
const requireAuth = (to, from, next) => {
  const authStore = useAuthStore()
  if (authStore.isLoggedIn) {
    next()
  } else {
    next('/login')
  }
}

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/food',
    name: 'FoodDraw',
    component: FoodDraw,
    meta: { requiresAuth: true }
  },
  {
    path: '/memory',
    name: 'Memory',
    component: Memory,
    meta: { requiresAuth: true }
  },
  {
    path: '/sync',
    name: 'Sync',
    component: Sync,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 每次都初始化auth store，确保状态正确
  authStore.init()
  
  // 智能路由控制
  if (to.meta.requiresAuth) {
    // 需要认证的页面
    if (authStore.isLoggedIn) {
      next()
    } else {
      // 未登录，重定向到登录页面
      next('/login')
    }
  } else if (to.path === '/login') {
    // 登录页面
    // 已登录用户访问登录页面时重定向到首页
    if (authStore.isLoggedIn) {
      next('/home')
    } else {
      next()
    }
  } else if (to.path === '/register') {
    // 注册页面
    // 已登录用户访问注册页面时重定向到首页
    if (authStore.isLoggedIn) {
      next('/home')
    } else if (!authStore.canRegister) {
      // 注册已满，重定向到登录页面
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
