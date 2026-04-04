import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../layout/Layout.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { title: '系统概览' }
      },
      {
        path: 'vehicles',
        name: 'Vehicles',
        component: () => import('../views/Vehicles.vue'),
        meta: { title: '车辆管理' }
      },
      {
        path: 'batteries',
        name: 'Batteries',
        component: () => import('../views/Batteries.vue'),
        meta: { title: '电池管理' }
      },
      {
        path: 'map',
        name: 'Map',
        component: () => import('../views/Map.vue'),
        meta: { title: '地图监控' }
      },
      {
        path: 'alerts',
        name: 'Alerts',
        component: () => import('../views/Alerts.vue'),
        meta: { title: '报警管理' }
      },
      {
        path: 'alarms',
        name: 'Alarms',
        component: () => import('../views/Alarms.vue'),
        meta: { title: '电池报警' }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/Settings.vue'),
        meta: { title: '系统设置' }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue'),
        meta: { title: '个人中心' }
      },

    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  // 检查 URL 中是否有 token 参数（GitHub 登录回调）
  const urlParams = new URLSearchParams(window.location.search)
  const urlToken = urlParams.get('token')
  
  // 如果是 GitHub 登录回调，先保存 token
  if (to.path === '/dashboard' && urlToken && !token) {
    localStorage.setItem('token', urlToken)
    const refreshToken = urlParams.get('refreshToken')
    const username = urlParams.get('username')
    const id = urlParams.get('id')
    const avatar = urlParams.get('avatar')
    const email = urlParams.get('email')
    const role = urlParams.get('role')
    
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
    if (username) localStorage.setItem('username', username)
    if (id) localStorage.setItem('userId', id)
    if (avatar) localStorage.setItem('userAvatar', avatar)
    if (email) localStorage.setItem('userEmail', email)
    if (role) localStorage.setItem('userRole', role)
  }
  
  const currentToken = localStorage.getItem('token')
  
  // 允许访问登录和注册页面
  if (to.path === '/login' || to.path === '/register') {
    if (currentToken) {
      next('/dashboard')
    } else {
      next()
    }
    return
  }
  
  // 其他页面需要登录
  if (!currentToken) {
    next('/login')
  } else {
    next()
  }
})

export default router