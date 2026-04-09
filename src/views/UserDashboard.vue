<template>
  <div class="user-dashboard-wrapper">
    <!-- 主要内容 -->
    <div class="user-dashboard">
      <!-- 欢迎横幅 -->
      <div class="welcome-banner">
        <div class="banner-content">
          <h1>欢迎回来，{{ username }}！👋</h1>
          <p>管理您的车辆和电池，享受便捷的换电服务</p>
        </div>
        <div class="banner-stats">
          <div class="mini-stat">
            <div class="mini-stat-value">{{ vehicleCount }}</div>
            <div class="mini-stat-label">我的车辆</div>
          </div>
          <div class="mini-stat">
            <div class="mini-stat-value">{{ batteryCount }}</div>
            <div class="mini-stat-label">我的电池</div>
          </div>
        </div>
      </div>

      <!-- 快速操作 -->
      <div class="quick-actions-container">
        <div class="quick-actions">
          <router-link :to="{ name: 'UserMap' }" class="quick-action-btn">
            <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>查找换电站</span>
          </router-link>
          <router-link :to="{ name: 'MyVehicles' }" class="quick-action-btn">
            <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63L6 12.4m10 3.6l-2-3.6m-2 3.6H6m10 0h4m-4 0v-2H8v2m0 0H4m4 0v2m8-2v2m-8-2H4"/>
            </svg>
            <span>添加车辆</span>
          </router-link>
          <router-link :to="{ name: 'MyBatteries' }" class="quick-action-btn">
            <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="4" y="8" width="16" height="12" rx="2"/>
              <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              <line x1="8" y1="12" x2="8" y2="12"/>
              <line x1="12" y1="12" x2="12" y2="12"/>
              <line x1="16" y1="12" x2="16" y2="12"/>
            </svg>
            <span>添加电池</span>
          </router-link>
          <router-link :to="{ name: 'UserProfile' }" class="quick-action-btn">
            <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>个人中心</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <SiteFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SiteFooter from '../components/SiteFooter.vue'
import { vehicleAPI, batteryAPI } from '../services/api'

const username = ref(localStorage.getItem('username') || '用户')
const vehicleCount = ref(0)
const batteryCount = ref(0)

// 加载用户数据
const loadUserData = async () => {
  try {
    // 加载车辆数据
    const vehicleRes = await vehicleAPI.getVehicles()
    if (vehicleRes.code === 200) {
      vehicleCount.value = vehicleRes.data?.length || 0
    }

    // 加载电池数据
    const batteryRes = await batteryAPI.getBatteries()
    if (batteryRes.code === 200) {
      batteryCount.value = batteryRes.data?.length || 0
    }
  } catch (error) {
    console.error('加载用户数据失败:', error)
  }
}

onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
.user-dashboard-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 主要内容 */
.user-dashboard {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  flex: 1;
  width: 100%;
}

/* 页脚样式 */
.user-dashboard-wrapper :deep(.site-footer) {
  margin-top: 80px;
}

/* 欢迎横幅 */
.welcome-banner {
  background: #f5f5f5;
  border-radius: 16px;
  padding: 32px 48px;
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  color: #333;
  text-align: center;
}

.banner-content {
  flex: 1;
  text-align: left;
}

.banner-content h1 {
  margin: 0 0 12px 0;
  font-size: 36px;
  font-weight: 700;
  color: #333;
}

.banner-content p {
  margin: 0;
  font-size: 16px;
  color: #666;
}

/* 横幅统计 */
.banner-stats {
  display: flex;
  gap: 48px;
  align-items: center;
}

.mini-stat {
  text-align: center;
  padding: 16px 24px;
}

.mini-stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.mini-stat-label {
  font-size: 14px;
  color: #666;
}



/* 快速操作 */
.quick-actions-container {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  max-width: 1200px;
  width: 100%;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px 24px;
  background: transparent;
  border-radius: 16px;
  border: 1px solid #d9d9d9;
  text-decoration: none;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.quick-action-btn:hover {
  background: #f5f5f5;
  border-color: #d9d9d9;
  transform: translateY(-2px);
}

.action-icon {
  width: 28px;
  height: 28px;
  stroke: #333;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .quick-actions {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .banner-stats {
    gap: 24px;
  }
  
  .mini-stat {
    padding: 12px 16px;
  }
  
  .mini-stat-value {
    font-size: 24px;
  }
}

@media (max-width: 768px) {
  .quick-actions {
    grid-template-columns: 1fr;
  }
  
  .welcome-banner {
    flex-direction: column;
    padding: 32px 24px;
    text-align: center;
  }
  
  .banner-content {
    text-align: center;
    margin-bottom: 24px;
  }
  
  .banner-content h1 {
    font-size: 24px;
  }
  
  .banner-stats {
    gap: 16px;
  }
  
  .mini-stat {
    padding: 12px 20px;
  }
  
  .mini-stat-value {
    font-size: 28px;
  }
  
  .mini-stat-label {
    font-size: 13px;
  }
}
</style>
