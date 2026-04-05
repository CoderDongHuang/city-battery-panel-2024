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
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: { title: '首页' }
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
    ]
  },
  {
    path: '/dashboard',
    component: UserLayout,
    redirect: '/dashboard/user',
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: () => import('../layout/DashboardLayout.vue'),
        children: [
          {
            path: 'user',
            name: 'UserDashboard',
            component: () => import('../views/UserDashboard.vue'),
            meta: { title: '控制台' }
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
            path: 'map',
            name: 'UserMap',
            component: () => import('../views/UserMap.vue'),
            meta: { title: '换电地图' }
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
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole') || 'user'
  
  // 检查 URL 中是否有 token 参数（GitHub 登录回调）
  const urlParams = new URLSearchParams(window.location.search)
  const urlToken = urlParams.get('token')
  
  // 如果是 GitHub 登录回调，先保存 token
  if (to.path === '/admin/dashboard' && urlToken && !token) {
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
    
    // 根据角色重定向
    if (role === 'admin') {
      next('/admin/dashboard')
    } else {
      next('/user/dashboard')
    }
    return
  }
  
  const currentToken = localStorage.getItem('token')
  const currentRole = localStorage.getItem('userRole') || 'user'
  
  // 允许访问登录和注册页面
  if (to.path === '/login' || to.path === '/register') {
    if (currentToken) {
      // 已登录用户根据角色重定向
      if (currentRole === 'admin') {
        next('/admin/dashboard')
      } else {
        next('/user/dashboard')
      }
    } else {
      next()
    }
    return
  }
  
  // 检查路由是否需要认证
  if (to.meta.requiresAuth) {
    if (!currentToken) {
      // 未登录，跳转到登录页
      next('/login')
      return
    }
    
    // 检查角色权限
    if (to.meta.role) {
      if (to.meta.role === 'admin' && currentRole !== 'admin') {
        // 普通用户尝试访问管理员页面
        next('/user/dashboard')
        return
      }
      if (to.meta.role === 'user' && currentRole === 'admin') {
        // 管理员尝试访问用户页面（允许访问）
        next()
        return
      }
    }
  }
  
  // 根路径重定向
  if (to.path === '/') {
    if (currentToken) {
      if (currentRole === 'admin') {
        next('/admin/dashboard')
      } else {
        next('/user/dashboard')
      }
    } else {
      next('/login')
    }
    return
  }
  
  next()
})

export default router