<template>
  <div class="layout">
    <!-- 顶部导航栏：左侧项目名称，右侧时间+导航栏 -->
    <header class="header">
      <div class="header-bg-container">
        <!-- 使用固定背景图片，不随浏览器变化 -->
      </div>
      
      <div class="header-content">
        <!-- 左侧：项目名称 -->
        <div class="header-left">
          <div class="logo-container">
            <img src="/images/tram-icon.svg" alt="电车图标" class="logo">
          </div>
          <div class="title-container">
            <h1 class="title">城市智能电车管理系统</h1>
            <div class="subtitle">Urban Electric Vehicle Management System</div>
          </div>
        </div>
        
        <!-- 右侧：链接 + 时间 + 导航栏 -->
        <div class="header-right">
          <!-- 链接和时间在同一行 -->
          <div class="top-row">
            <!-- 项目相关链接 -->
            <div class="project-links">
              <a href="https://github.com" target="_blank" class="link-item" title="项目源码">
                <span class="link-icon">💻</span>
                <span class="link-text">项目源码(GitHub)</span>
              </a>
              <a href="https://docs.example.com" target="_blank" class="link-item" title="项目文档">
                <span class="link-icon">📚</span>
                <span class="link-text">项目文档(CSDN)</span>
              </a>
              <a href="https://status.example.com" target="_blank" class="link-item" title="系统状态">
                <span class="link-icon">📊</span>
                <span class="link-text">状态</span>
              </a>
            </div>
            
            <!-- 时间显示 -->
            <div class="time-display">{{ currentTime }}</div>
          </div>
          
          <!-- 导航栏 - 贴着右边 -->
          <nav class="horizontal-nav">
            <div class="nav-container">
              <!-- 系统概览 -->
              <router-link 
                :to="{ name: 'Dashboard' }"
                class="nav-item"
                :class="{ active: $route.name === 'Dashboard' }"
              >
                <span class="nav-icon">📊</span>
                <span class="nav-text">系统概览</span>
              </router-link>
              
              <!-- 车辆管理 -->
              <router-link 
                :to="{ name: 'Vehicles' }"
                class="nav-item"
                :class="{ active: $route.name === 'Vehicles' }"
              >
                <span class="nav-icon">🚗</span>
                <span class="nav-text">车辆管理</span>
              </router-link>
              
              <!-- 电池管理 -->
              <router-link 
                :to="{ name: 'Batteries' }"
                class="nav-item"
                :class="{ active: $route.name === 'Batteries' }"
              >
                <span class="nav-icon">🔋</span>
                <span class="nav-text">电池管理</span>
              </router-link>
              
              <!-- 报警管理（带下拉菜单） -->
              <div class="nav-item dropdown" :class="{ active: isAlarmRoute }" @click="toggleAlarmDropdown">
                <div class="dropdown-trigger">
                  <span class="nav-icon">🚨</span>
                  <span class="nav-text">报警管理</span>
                  <span class="nav-arrow" :class="{ rotated: showAlarmDropdown }">▼</span>
                </div>
                <div v-if="showAlarmDropdown" class="dropdown-menu" @click.stop>
                  <router-link 
                    :to="{ name: 'Alarms' }"
                    class="dropdown-item"
                    :class="{ active: $route.name === 'Alarms' }"
                    @click="closeAlarmDropdown"
                  >
                    <span class="nav-icon">⚠️</span>
                    <span class="nav-text">电池报警</span>
                  </router-link>
                  <router-link 
                    :to="{ name: 'Alerts' }"
                    class="dropdown-item"
                    :class="{ active: $route.name === 'Alerts' }"
                    @click="closeAlarmDropdown"
                  >
                    <span class="nav-icon">🔔</span>
                    <span class="nav-text">系统报警</span>
                  </router-link>
                </div>
              </div>
              
              <!-- 地图监控 -->
              <router-link 
                :to="{ name: 'Map' }"
                class="nav-item"
                :class="{ active: $route.name === 'Map' }"
              >
                <span class="nav-icon">🗺️</span>
                <span class="nav-text">地图监控</span>
              </router-link>
              
              <!-- 系统设置 -->
              <router-link 
                :to="{ name: 'Settings' }"
                class="nav-item"
                :class="{ active: $route.name === 'Settings' }"
              >
                <span class="nav-icon">⚙️</span>
                <span class="nav-text">系统设置</span>
              </router-link>
            </div>
          </nav>
        </div>
      </div>
    </header>

    <!-- 主内容区域 -->
    <div class="main-container">
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

// 图片加载处理
const onImageLoad = () => {
  console.log('头部背景图片加载成功')
}

const onImageError = () => {
  console.error('头部背景图片加载失败')
}

const route = useRoute()
const router = useRouter()

const currentTime = ref('')
const onlineVehiclesCount = ref(0)
const showAlarmDropdown = ref(false)

// 判断当前路由是否为报警管理相关路由
const isAlarmRoute = computed(() => {
  return ['Alarms', 'Alerts'].includes(route.name)
})

// 切换下拉菜单显示状态
const toggleAlarmDropdown = () => {
  showAlarmDropdown.value = !showAlarmDropdown.value
}

// 关闭下拉菜单
const closeAlarmDropdown = () => {
  showAlarmDropdown.value = false
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event) => {
  const dropdown = event.target.closest('.dropdown')
  if (!dropdown) {
    closeAlarmDropdown()
  }
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
  
  // 添加全局点击事件监听
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    clearInterval(timeTimer)
    clearInterval(vehicleTimer)
    document.removeEventListener('click', handleClickOutside)
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

/* 顶部导航栏样式 - 使用图片渐变 */
.header {
  height: 120px; /* 恢复原始高度 */
  color: rgba(255, 255, 255, 0.9);
  position: relative;
  overflow: visible; /* 改为visible，让下拉菜单可以显示 */
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  z-index: 100;
}

.header-bg-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    /* 渐变背景填充 */
    linear-gradient(
      90deg,
      rgba(15, 27, 61, 0.9) 0%,
      rgba(30, 60, 114, 0.7) 20%,
      rgba(30, 60, 114, 0.3) 40%,
      rgba(30, 60, 114, 0.1) 50%,
      rgba(42, 82, 152, 0.1) 50%,
      rgba(42, 82, 152, 0.3) 60%,
      rgba(42, 82, 152, 0.7) 80%,
      rgba(42, 82, 152, 0.9) 100%
    ),
    /* 只显示汽车部分的背景图片 */
    url('/images/header-bg.jpg') center/cover no-repeat;
  
  /* 调整背景位置以显示汽车部分 - 可测试不同位置 */
   background-position: 40% 40%; /* 选项A：显示图片下部（通常汽车位置） */
   /* background-position: 50% 60%; 选项B：显示图片中下部 */
   /* background-position: 50% 80%; 选项C：显示图片最底部 */
   background-size: cover;
}

.header-content {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: space-between; /* 左右分开 */
  height: 100%;
  padding: 0 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 100%;
  justify-content: flex-start;
}

.header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px; /* 链接时间和导航栏之间的间距 */
}

.top-row {
  display: flex;
  align-items: center;
  gap: 24px; /* 链接和时间之间的间距 */
}

.project-links {
  display: flex;
  gap: 12px;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-size: 14px;
}

.link-item:hover {
  color: rgba(255, 255, 255, 1);
  background: rgba(255, 255, 255, 0.1);
  text-shadow: 0 0 8px rgba(255,255,255,0.6);
}

.link-icon {
  font-size: 16px;
}

.link-text {
  font-weight: 500;
}

.header-center {
  display: flex;
  align-items: center;
  gap: 16px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  padding: 8px;
}

.title-container {
  display: flex;
  flex-direction: column;
}

.header-left .title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.header-left .subtitle {
  margin: 4px 0 0 0;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.3px;
  font-style: italic;
}

.header-right .time-display {
  font-size: 16px;
  font-weight: 500;
  font-family: monospace;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

/* 主容器 */
.main-container {
  flex: 1;
  display: flex;
  overflow: hidden;
  background: #f8fafc;
}

/* 水平导航栏样式 - 贴着右边显示 */
.horizontal-nav {
  background: transparent; /* 去掉背景色，与头部融为一体 */
  box-shadow: none;
  border-bottom: none;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px; /* 导航项之间的间距 */
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  gap: 8px;
  font-weight: 500;
}

.nav-item:hover {
  color: rgba(255, 255, 255, 1);
  text-shadow: 0 0 10px rgba(255,255,255,0.8);
}

.nav-item.active {
  color: rgba(255, 255, 255, 1);
  text-shadow: 0 0 15px rgba(255,255,255,1);
}

.nav-icon {
  font-size: 18px;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}

.nav-text {
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
}

.nav-arrow {
  font-size: 10px;
  margin-left: 4px;
  transition: transform 0.3s ease;
}

.nav-arrow.rotated {
  transform: rotate(180deg);
}

/* 下拉菜单样式 */
.dropdown {
  position: relative;
  cursor: pointer;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: rgba(30, 60, 114, 0.95);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 180px;
  z-index: 2000; /* 增加z-index确保显示在最上层 */
  overflow: hidden;
  backdrop-filter: blur(10px);
  animation: slideDown 0.3s ease;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all 0.2s ease;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item .nav-icon {
  font-size: 16px;
  width: 18px;
}

.dropdown-item .nav-text {
  font-size: 14px;
  font-weight: 500;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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