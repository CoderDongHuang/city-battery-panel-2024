<template>
  <div class="user-layout">
    <!-- 顶部导航栏 -->
    <header class="user-header">
      <div class="header-main">
        <div class="main-nav-container">
          <div class="logo-section">
            <img src="/images/cityswap-logo.png" alt="CitySwap Logo" class="header-logo" />
            <span class="app-title">CitySwap</span>
          </div>
          
          <nav class="main-nav">
            <router-link 
              :to="{ name: 'Home' }"
              class="nav-item"
              :class="{ active: $route.name === 'Home' }"
            >
              首页
            </router-link>
            
            <router-link 
              :to="{ name: 'UserDashboard' }"
              class="nav-item"
              :class="{ active: $route.name === 'UserDashboard' }"
            >
              控制台
            </router-link>
            
            <router-link 
              :to="{ name: 'Orders' }"
              class="nav-item"
              :class="{ active: $route.name === 'Orders' }"
            >
              订单中心
            </router-link>
            
            <router-link 
              :to="{ name: 'Stations' }"
              class="nav-item"
              :class="{ active: $route.name === 'Stations' }"
            >
              服务网点
            </router-link>
            
            <router-link 
              :to="{ name: 'Messages' }"
              class="nav-item"
              :class="{ active: $route.name === 'Messages' }"
            >
              消息
            </router-link>
            
            <!-- 帮助菜单（带下拉） -->
            <div 
              class="nav-item dropdown" 
              :class="{ active: isHelpRoute }" 
              @click="toggleHelpDropdown"
              style="cursor: pointer;"
            >
              <div class="dropdown-trigger">
                <span>帮助</span>
                <span class="nav-arrow" :class="{ rotated: showHelpDropdown }">▼</span>
              </div>
              <div v-if="showHelpDropdown" class="dropdown-menu">
                <router-link 
                  :to="{ name: 'Help' }"
                  class="dropdown-item"
                  :class="{ active: $route.name === 'Help' }"
                  @click="closeHelpDropdown"
                >
                  <span class="dropdown-icon">❓</span>
                  <span class="dropdown-text">帮助中心</span>
                </router-link>
                <router-link 
                  :to="{ name: 'Guide' }"
                  class="dropdown-item"
                  :class="{ active: $route.name === 'Guide' }"
                  @click="closeHelpDropdown"
                >
                  <span class="dropdown-icon">📖</span>
                  <span class="dropdown-text">使用指南</span>
                </router-link>
                <router-link 
                  :to="{ name: 'Contact' }"
                  class="dropdown-item"
                  :class="{ active: $route.name === 'Contact' }"
                  @click="closeHelpDropdown"
                >
                  <span class="dropdown-icon">💬</span>
                  <span class="dropdown-text">联系我们</span>
                </router-link>
              </div>
            </div>
          </nav>
          
          <div class="header-actions">
            <!-- 用户菜单 -->
            <div 
              class="user-menu" 
              @click="toggleProfileDropdown"
              style="cursor: pointer;"
            >
              <img 
                v-if="userAvatar" 
                :src="userAvatar" 
                alt="Avatar" 
                class="user-avatar"
              />
              <div v-else class="user-avatar-placeholder">
                {{ username?.charAt(0).toUpperCase() }}
              </div>
              <span class="user-name">{{ username }}</span>
              <span class="nav-arrow" :class="{ rotated: showProfileDropdown }">▼</span>
            </div>
            <button class="logout-btn" @click="handleLogout">
              退出登录
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 导航栏占位符，防止内容被遮挡 -->
    <div class="navbar-placeholder"></div>

    <!-- 用户下拉菜单 -->
    <div v-if="showProfileDropdown" class="profile-dropdown-menu-fixed">
      <div class="dropdown-item" @click="goToProfile">
        <span class="dropdown-icon">👨‍</span>
        <span>个人中心</span>
      </div>
      <div class="dropdown-divider"></div>
      <div class="dropdown-item" @click="handleLogout">
        <span class="dropdown-icon">🚪</span>
        <span>退出登录</span>
      </div>
    </div>

    <!-- 主内容区域 -->
    <main class="user-main-content">
      <router-view />
    </main>

    <!-- 消息通知弹窗 -->
    <MessageNotification />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MessageNotification from '../components/MessageNotification.vue'

const router = useRouter()
const route = useRoute()

const showProfileDropdown = ref(false)
const showHelpDropdown = ref(false)
const username = ref(localStorage.getItem('userUsername') || '用户')
const userAvatar = ref(localStorage.getItem('userAvatar') || '')

// 判断是否在帮助相关页面
const isHelpRoute = computed(() => {
  return ['Help', 'Guide', 'Contact'].includes(route.name)
})

const toggleProfileDropdown = (event) => {
  event.stopPropagation()
  showProfileDropdown.value = !showProfileDropdown.value
  showHelpDropdown.value = false
}

const toggleHelpDropdown = (event) => {
  event.stopPropagation()
  showHelpDropdown.value = !showHelpDropdown.value
  showProfileDropdown.value = false
}

const closeHelpDropdown = () => {
  showHelpDropdown.value = false
}

const goToProfile = () => {
  router.push({ name: 'UserProfile' })
  showProfileDropdown.value = false
}

const handleLogout = () => {
  // 清除用户端登录状态
  localStorage.removeItem('userToken')
  localStorage.removeItem('userRefreshToken')
  localStorage.removeItem('userUsername')
  localStorage.removeItem('userId')
  localStorage.removeItem('userAvatar')
  localStorage.removeItem('userEmail')
  localStorage.removeItem('userRole')
  router.push('/login')
}

// 点击其他地方关闭下拉菜单
const closeDropdown = () => {
  showProfileDropdown.value = false
  showHelpDropdown.value = false
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
.user-layout {
  min-height: 100vh;
  background: var(--bg-primary);
  transition: background-color 0.3s ease;
}

/* 顶部导航栏 */
.user-header {
  background: var(--card-bg);
  box-shadow: 0 2px 8px var(--shadow-color);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

/* 导航栏占位符，防止内容被导航栏遮挡 */
.navbar-placeholder {
  height: 80px;
  width: 100%;
}

.header-main {
  background: var(--card-bg);
  transition: background-color 0.3s ease;
}

.main-nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  max-width: 1600px;
  margin: 0 auto;
  height: 80px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
}

.user-menu:hover {
  background: var(--hover-bg);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #0066cc;
  object-fit: cover;
}

.user-avatar-placeholder {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0066cc 0%, #00cc99 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.user-name {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-arrow {
  font-size: 10px;
  color: var(--text-secondary);
  transition: color 0.3s ease, transform 0.3s ease;
}

.nav-arrow.rotated {
  transform: rotate(180deg);
}

.logout-btn {
  padding: 8px 20px;
  background: linear-gradient(135deg, #0066cc 0%, #00cc99 100%);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 102, 204, 0.3);
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 102, 204, 0.4);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-logo {
  width: 64px;
  height: 64px;
  object-fit: contain;
}

.app-title {
  color: var(--text-primary);
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 3px;
  font-style: italic;
  transform: skew(-10deg);
  display: inline-block;
  background: linear-gradient(135deg, #0066cc 0%, #00cc99 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(2px 2px 4px var(--shadow-color));
  line-height: 1.2;
  padding: 4px 0;
  transition: color 0.3s ease;
}

.main-nav {
  display: flex;
  gap: 8px;
}

.nav-item {
  padding: 20px 24px;
  color: var(--text-primary);
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.nav-item:hover {
  color: #0066cc;
  background: var(--hover-bg);
}

.nav-item.active {
  color: #0066cc;
  background: var(--hover-bg);
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #0066cc 0%, #00cc99 100%);
  border-radius: 2px;
}

/* 下拉菜单样式 */
.nav-item.dropdown {
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 8px 24px var(--shadow-color);
  min-width: 180px;
  z-index: 1001;
  overflow: visible;
  animation: slideDown 0.3s ease;
  margin-top: 4px;
  border: 1px solid var(--border-color);
  transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--text-primary);
  text-decoration: none;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: var(--hover-bg);
}

.dropdown-item.active {
  color: #0066cc;
  background: var(--hover-bg);
}

.dropdown-icon {
  font-size: 18px;
}

.dropdown-text {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.nav-arrow {
  font-size: 10px;
  color: #666;
  transition: transform 0.3s ease;
  margin-left: 4px;
}

.nav-arrow.rotated {
  transform: rotate(180deg);
}

/* 用户下拉菜单（fixed 定位，在 header 外面） */
.profile-dropdown-menu-fixed {
  position: fixed;
  top: 88px;
  right: 100px;
  background: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 8px 24px var(--shadow-color);
  min-width: 180px;
  z-index: 9999;
  overflow: visible;
  animation: slideDown 0.3s ease;
  border: 1px solid var(--border-color);
  transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: var(--hover-bg);
}

.dropdown-icon {
  font-size: 18px;
}

.dropdown-divider {
  height: 1px;
  background: #e9ecef;
  margin: 0;
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

/* 主内容区域 */
.user-main-content {
  padding: 0;
  min-height: calc(100vh - 120px);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-nav {
    gap: 4px;
  }
  
  .nav-item {
    padding: 20px 16px;
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .top-bar {
    padding: 8px 20px;
  }
  
  .main-nav-container {
    padding: 0 20px;
  }
  
  .main-nav {
    display: none;
  }
}
</style>
