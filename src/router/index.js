import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../layout/Layout.vue'
import UserLayout from '../layout/UserLayout.vue'

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
    component: UserLayout,
    redirect: '/home',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'dashboard',
        name: 'UserDashboard',
        component: () => import('../views/UserDashboard.vue'),
        meta: { title: '控制台' }
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('../views/Orders.vue'),
        meta: { title: '订单中心' }
      },
      {
        path: 'stations',
        name: 'Stations',
        component: () => import('../views/Stations.vue'),
        meta: { title: '服务网点' }
      },
      {
        path: 'messages',
        name: 'Messages',
        component: () => import('../views/Messages.vue'),
        meta: { title: '消息中心' }
      },
      {
        path: 'help',
        name: 'Help',
        component: () => import('../views/Help.vue'),
        meta: { title: '帮助中心' }
      },
      {
        path: 'guide',
        name: 'Guide',
        component: () => import('../views/Guide.vue'),
        meta: { title: '使用指南' }
      },
      {
        path: 'contact',
        name: 'Contact',
        component: () => import('../views/Contact.vue'),
        meta: { title: '联系我们' }
      },
      {
        path: 'vehicles',
        name: 'MyVehicles',
        component: () => import('../views/MyVehicles.vue'),
        meta: { title: '我的车辆' }
      },
      {
        path: 'batteries',
        name: 'MyBatteries',
        component: () => import('../views/MyBatteries.vue'),
        meta: { title: '我的电池' }
      },
      {
        path: 'smart-swap',
        name: 'SmartSwap',
        component: () => import('../views/SmartSwap.vue'),
        meta: { title: '智能换电' }
      },
      {
        path: 'alerts',
        name: 'UserAlerts',
        component: () => import('../views/UserAlerts.vue'),
        meta: { title: '我的报警' }
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('../views/UserProfile.vue'),
        meta: { title: '个人中心' }
      },
    ]
  },
  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/dashboard',
    meta: { requiresAuth: true, role: 'admin' },
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
        path: 'stations',
        name: 'AdminStations',
        component: () => import('../views/AdminStations.vue'),
        meta: { title: '换电站管理' }
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
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/Settings.vue'),
        meta: { title: '系统设置' }
      },
      {
        path: 'messages',
        name: 'MessageManagement',
        component: () => import('../views/MessageManagement.vue'),
        meta: { title: '消息管理' }
      },
      {
        path: 'profile',
        name: 'AdminProfile',
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
  // 管理端和用户端使用不同的 token key，实现登录状态隔离
  const adminToken = localStorage.getItem('adminToken')
  const userToken = localStorage.getItem('userToken')
  const adminRole = localStorage.getItem('adminRole') || 'admin'
  const userRole = localStorage.getItem('userRole') || 'user'
  
  // 检查 URL 中是否有 token 参数（GitHub 登录回调）
  const urlParams = new URLSearchParams(window.location.search)
  const urlToken = urlParams.get('token')
  const urlRole = urlParams.get('role')
  
  // 如果是 GitHub 登录回调，根据角色保存到不同的 key
  if (urlToken) {
    if (urlRole === 'admin') {
      // 管理员登录
      localStorage.setItem('adminToken', urlToken)
      const refreshToken = urlParams.get('refreshToken')
      const username = urlParams.get('username')
      const id = urlParams.get('id')
      const avatar = urlParams.get('avatar')
      const email = urlParams.get('email')
      
      if (refreshToken) localStorage.setItem('adminRefreshToken', refreshToken)
      if (username) localStorage.setItem('adminUsername', username)
      if (id) localStorage.setItem('userId', id)
      if (avatar) localStorage.setItem('adminAvatar', avatar)
      if (email) localStorage.setItem('adminEmail', email)
      if (urlRole) localStorage.setItem('adminRole', urlRole)
      
      next('/admin/dashboard')
    } else {
      // 普通用户登录
      localStorage.setItem('userToken', urlToken)
      const refreshToken = urlParams.get('refreshToken')
      const username = urlParams.get('username')
      const id = urlParams.get('id')
      const avatar = urlParams.get('avatar')
      const email = urlParams.get('email')
      
      if (refreshToken) localStorage.setItem('userRefreshToken', refreshToken)
      if (username) localStorage.setItem('userUsername', username)
      if (id) localStorage.setItem('userId', id)
      if (avatar) localStorage.setItem('userAvatar', avatar)
      if (email) localStorage.setItem('userEmail', email)
      if (urlRole) localStorage.setItem('userRole', urlRole)
      
      next('/dashboard')
    }
    return
  }
  
  // 允许访问登录和注册页面
  if (to.path === '/login' || to.path === '/register') {
    next()
    return
  }
  
  // 检查路由是否需要认证
  if (to.meta.requiresAuth) {
    // 管理端路由
    if (to.meta.role === 'admin') {
      if (!adminToken) {
        alert('请先登录管理端')
        next('/login')
        return
      }
      next()
      return
    }
    
    // 用户端路由
    if (to.meta.role === 'user' || !to.meta.role) {
      if (!userToken) {
        next('/login')
        return
      }
      next()
      return
    }
  }
  
  // 根路径重定向
  if (to.path === '/') {
    if (adminToken) {
      next('/admin/dashboard')
    } else if (userToken) {
      next('/dashboard')
    } else {
      next('/login')
    }
    return
  }
  
  next()
})

export default router