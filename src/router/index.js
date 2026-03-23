import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../layout/Layout.vue'

const routes = [
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
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/Settings.vue'),
        meta: { title: '系统设置' }
      },
      {
        path: 'light-control-test',
        name: 'LightControlTest',
        component: () => import('../views/LightControlTest.vue'),
        meta: { title: '灯光控制测试' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router