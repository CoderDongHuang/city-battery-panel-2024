<template>
  <div class="layout">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-left">
        <div class="logo">
          <div class="logo-icon">⚡</div>
          <div class="logo-text">
            <h1 class="title">城市智能电车管理系统</h1>
            <span class="subtitle">City Smart EV Management System</span>
          </div>
        </div>
      </div>
      
      <div class="header-center">
        <div class="system-status">
          <div class="status-item">
            <span class="status-label">系统状态</span>
            <span class="status-value online">在线</span>
          </div>
          <div class="status-item">
            <span class="status-label">最后更新</span>
            <span class="status-value">{{ currentTime }}</span>
          </div>
        </div>
      </div>
      
      <div class="header-right">
        <div class="user-info">
          <div class="user-avatar">👤</div>
          <div class="user-details">
            <span class="user-name">管理员</span>
            <span class="user-role">系统管理员</span>
          </div>
        </div>
      </div>
    </header>
    
    <!-- 主内容区域 -->
    <div class="main-container">
      <!-- 侧边栏 -->
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
            <span class="nav-badge" v-if="getRouteBadge(route.name)">{{ getRouteBadge(route.name) }}</span>
          </router-link>
        </nav>
        
        <div class="sidebar-footer">
          <div class="system-info">
            <div class="info-item">
              <span class="info-label">版本</span>
              <span class="info-value">v1.0.0</span>
            </div>
            <div class="info-item">
              <span class="info-label">在线车辆</span>
              <span class="info-value">{{ onlineVehiclesCount }}</span>
            </div>
          </div>
        </div>
      </aside>
      
      <!-- 主内容区域 -->
      <main class="main-content">
        <div class="content-wrapper">
          <div class="page-header">
            <h2 class="page-title">{{ getPageTitle() }}</h2>
            <div class="page-actions">
              <button class="btn btn-primary" @click="refreshData">
                <span class="btn-icon">🔄</span>
                刷新数据
              </button>
            </div>
          </div>
          <router-view />
        </div>
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
    Settings: '⚙️'
  }
  return icons[routeName] || '📄'
}

const getRouteBadge = (routeName) => {
  const badges = {
    Vehicles: '3',
    Batteries: '4',
    Map: '1'
  }
  return badges[routeName]
}

const getPageTitle = () => {
  const currentRoute = routes.value.find(r => r.name === route.name)
  return currentRoute ? currentRoute.meta.title : '页面'
}

const refreshData = () => {
  // 模拟刷新数据
  console.log('刷新数据')
  // 这里可以添加实际的数据刷新逻辑
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

// 模拟在线车辆数量更新
const updateOnlineVehicles = () => {
  onlineVehiclesCount.value = Math.floor(Math.random() * 3) + 2 // 2-4辆在线
}

onMounted(() => {
  updateTime()
  updateOnlineVehicles()
  
  const timeTimer = setInterval(updateTime, 1000)
  const vehicleTimer = setInterval(updateOnlineVehicles, 30000) // 30秒更新一次
  
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
  height: 70px;
  background: linear-gradient(90deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  position: relative;
  z-index: 100;
}

.header-left .logo {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-icon {
  font-size: 28px;
  background: rgba(255,255,255,0.2);
  padding: 8px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.logo-text .title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.logo-text .subtitle {
  font-size: 12px;
  opacity: 0.8;
  font-weight: 300;
}

.header-center {
  display: flex;
  align-items: center;
}

.system-status {
  display: flex;
  gap: 30px;
  background: rgba(255,255,255,0.1);
  padding: 8px 20px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.status-label {
  font-size: 12px;
  opacity: 0.8;
  font-weight: 300;
}

.status-value {
  font-size: 14px;
  font-weight: 600;
}

.status-value.online {
  color: #4cd964;
}

.header-right .user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255,255,255,0.1);
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s;
}

.user-info:hover {
  background: rgba(255,255,255,0.2);
}

.user-avatar {
  font-size: 20px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
}

.user-role {
  font-size: 12px;
  opacity: 0.8;
  font-weight: 300;
}

/* 主容器样式 */
.main-container {
  flex: 1;
  display: flex;
  overflow: hidden;
  background: #f8fafc;
}

/* 侧边栏样式 */
.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
  overflow-y: auto;
  box-shadow: 4px 0 12px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.nav-menu {
  padding: 30px 0;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 16px 25px;
  color: #bdc3c7;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  border-left: 3px solid transparent;
  min-height: 52px;
  box-sizing: border-box;
  line-height: 1;
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
  margin-right: 15px;
  font-size: 18px;
  transition: transform 0.3s;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.nav-item:hover .nav-icon {
  transform: scale(1.1);
}

.nav-text {
  font-size: 15px;
  font-weight: 500;
  flex: 1;
  line-height: 1.4;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nav-badge {
  background: #e74c3c;
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  margin-left: 8px;
  flex-shrink: 0;
  min-width: 20px;
  text-align: center;
  line-height: 1;
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

/* 主内容区域样式 */
.main-content {
  flex: 1;
  padding: 30px;
  background: #f8fafc;
  overflow-y: auto;
}

.content-wrapper {
  width: 100%;
  margin: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  background: linear-gradient(90deg, #2c3e50, #3498db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-actions {
  display: flex;
  gap: 12px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(90deg, #3498db, #2980b9);
  color: white;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
}

.btn-icon {
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .sidebar {
    width: 220px;
  }
  
  .header {
    padding: 0 20px;
  }
  
  .main-content {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 200px;
  }
  
  .header-center {
    display: none;
  }
  
  .logo-text .subtitle {
    display: none;
  }
}
</style>