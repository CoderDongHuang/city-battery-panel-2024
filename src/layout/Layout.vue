<template>
  <div class="layout">
    <!-- 顶部导航栏：左侧标题，右侧时间 -->
    <header class="header">
      <div class="header-left">
        <h1 class="title">城市智能电车管理系统</h1>
      </div>
      <div class="header-right">
        <div class="time-display">{{ currentTime }}</div>
      </div>
    </header>

    <!-- 主内容区域 -->
    <div class="main-container">
      <!-- 侧边栏保持不变 -->
      <aside class="sidebar">
        <nav class="nav-menu">
          <router-link 
            v-for="route in routes" 
            :key="route.name"
            :to="{ name: route.name }"
            class="nav-item"
            :class="{ active: $route.name === route.name }"
          >
            <span class="nav-icon">{{ getRouteIcon(route.name) }}</span>
            <span class="nav-text">{{ route.meta.title }}</span>
          </router-link>
        </nav>
        <div class="sidebar-footer">
          <div class="system-info">
            <div class="info-item">
              <span class="info-label">版本</span>
              <span class="info-value">v2.0.0</span>
            </div>
            <div class="info-item">
              <span class="info-label">在线车辆</span>
              <span class="info-value">{{ onlineVehiclesCount }}</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- 右侧主内容区域：无左右内边距，内容由内部组件控制 -->
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const currentTime = ref('')
const onlineVehiclesCount = ref(0)

const routes = computed(() => {
  return router.getRoutes().filter(r => r.meta && r.meta.title)
})

const getRouteIcon = (routeName) => {
  const icons = {
    Dashboard: '📊',
    Vehicles: '🚗',
    Batteries: '🔋',
    Map: '🗺️',
    Alerts: '🚨',
    Settings: '⚙️'
  }
  return icons[routeName] || '📄'
}

const getPageTitle = () => {
  const currentRoute = routes.value.find(r => r.name === route.name)
  return currentRoute ? currentRoute.meta.title : '页面'
}

const refreshData = () => {
  console.log('刷新数据')
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const updateOnlineVehicles = () => {
  onlineVehiclesCount.value = Math.floor(Math.random() * 3) + 2
}

onMounted(() => {
  updateTime()
  updateOnlineVehicles()
  const timeTimer = setInterval(updateTime, 1000)
  const vehicleTimer = setInterval(updateOnlineVehicles, 30000)
  onUnmounted(() => {
    clearInterval(timeTimer)
    clearInterval(vehicleTimer)
  })
})
</script>

<style scoped>
.layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 顶部导航栏样式 */
.header {
  height: 80px;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;   /* 左右保留边距，让内容不贴边，但背景全宽 */
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  z-index: 100;
}

.header-left .title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.5px;
  background: linear-gradient(45deg, #fff, #e3f2fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-right .time-display {
  font-size: 16px;
  font-weight: 500;
  font-family: monospace;
  background: rgba(255,255,255,0.2);
  padding: 8px 16px;
  border-radius: 24px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255,255,255,0.1);
}

/* 主容器 */
.main-container {
  flex: 1;
  display: flex;
  overflow: hidden;
  background: #f8fafc;
}

/* 侧边栏样式 */
.sidebar {
  width: 280px;
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
  overflow-y: auto;
  box-shadow: 8px 0 32px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255,255,255,0.1);
}

.nav-menu {
  padding: 30px 0;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 18px 28px;
  color: #bdc3c7;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  border-left: 4px solid transparent;
  min-height: 56px;
  gap: 16px;
}

.nav-item:hover {
  background: rgba(255,255,255,0.08);
  color: white;
  border-left-color: #3498db;
  transform: translateX(4px);
}

.nav-item.active {
  background: linear-gradient(90deg, rgba(52, 152, 219, 0.2) 0%, transparent 100%);
  color: white;
  border-left-color: #3498db;
}

.nav-icon {
  font-size: 20px;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.nav-text {
  font-size: 16px;
  font-weight: 600;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-footer {
  padding: 20px 25px;
  border-top: 1px solid rgba(255,255,255,0.1);
  background: rgba(0,0,0,0.1);
}

.system-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: 12px;
  color: #bdc3c7;
}

.info-value {
  font-size: 12px;
  color: white;
  font-weight: 600;
}

/* 右侧主内容区域：无左右内边距 */
.main-content {
  flex: 1;
  background: linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%);
  overflow-y: auto;
  padding: 0;   /* 关键：去掉左右内边距，让内部组件自己控制 */
}

/* 响应式 */
@media (max-width: 1024px) {
  .sidebar {
    width: 220px;
  }
  .header {
    padding: 0 20px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }
}
</style>