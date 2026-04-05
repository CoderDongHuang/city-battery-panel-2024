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
            
            <router-link 
              :to="{ name: 'Help' }"
              class="nav-item"
              :class="{ active: $route.name === 'Help' }"
            >
              帮助
            </router-link>
          </nav>
          
          <div class="header-actions">
            <div class="user-profile" @click="toggleProfileDropdown">
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

    <!-- 用户下拉菜单 -->
    <div v-if="showProfileDropdown" class="profile-dropdown-overlay" @click="closeDropdown"></div>
    <div v-if="showProfileDropdown" class="profile-dropdown-menu">
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
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const showProfileDropdown = ref(false)
const username = ref(localStorage.getItem('username') || '用户')
const userAvatar = ref(localStorage.getItem('userAvatar') || '')

const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value
}

const goToProfile = () => {
  router.push({ name: 'UserProfile' })
  showProfileDropdown.value = false
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('username')
  localStorage.removeItem('userId')
  localStorage.removeItem('userAvatar')
  localStorage.removeItem('userEmail')
  localStorage.removeItem('userRole')
  router.push('/login')
}

// 点击其他地方关闭下拉菜单
const closeDropdown = () => {
  showProfileDropdown.value = false
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
  background: #f5f7fa;
}

/* 顶部导航栏 */
.user-header {
  background: #F5F5F5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-main {
  background: #F5F5F5;
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
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.user-profile:hover {
  background: rgba(0, 0, 0, 0.05);
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
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

.nav-arrow {
  font-size: 10px;
  color: #666;
  transition: transform 0.3s ease;
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
  color: #333;
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
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1));
  line-height: 1.2;
  padding: 4px 0;
}

.main-nav {
  display: flex;
  gap: 8px;
}

.nav-item {
  padding: 20px 24px;
  color: #333;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.nav-item:hover {
  color: #0066cc;
  background: rgba(0, 102, 204, 0.05);
}

.nav-item.active {
  color: #0066cc;
  background: rgba(0, 102, 204, 0.08);
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

/* 用户下拉菜单 */
.profile-dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1999;
}

.profile-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  min-width: 180px;
  z-index: 2000;
  overflow: hidden;
  animation: slideDown 0.3s ease;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: #f5f5f5;
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
