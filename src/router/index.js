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

    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.path !== '/login' && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router