<template>
  <div class="user-dashboard">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <div class="banner-content">
        <h1>欢迎回来，{{ username }}！👋</h1>
        <p>管理您的车辆和电池，享受便捷的换电服务</p>
      </div>
      <div class="banner-stats">
        <div class="mini-stat">
          <div class="mini-stat-value">{{ myVehicles.length }}</div>
          <div class="mini-stat-label">我的车辆</div>
        </div>
        <div class="mini-stat">
          <div class="mini-stat-value">{{ myBatteries.length }}</div>
          <div class="mini-stat-label">我的电池</div>
        </div>
        <div class="mini-stat">
          <div class="mini-stat-value">{{ activeAlerts }}</div>
          <div class="mini-stat-label">活跃报警</div>
        </div>
      </div>
    </div>

    <!-- 主要内容卡片 -->
    <div class="dashboard-content">
      <!-- 我的车辆 -->
      <div class="dashboard-card">
        <div class="card-header">
          <h2>🚗 我的车辆</h2>
          <router-link :to="{ name: 'MyVehicles' }" class="view-all">
            查看全部 <span class="arrow">→</span>
          </router-link>
        </div>
        <div class="card-content">
          <div v-if="myVehicles.length > 0" class="vehicle-list">
            <div 
              v-for="vehicle in myVehicles.slice(0, 3)" 
              :key="vehicle.id"
              class="vehicle-item"
            >
              <div class="vehicle-info">
                <div class="vehicle-name">{{ vehicle.name }}</div>
                <div class="vehicle-plate">{{ vehicle.plateNumber || '未登记' }}</div>
              </div>
              <div class="vehicle-status" :class="vehicle.status">
                {{ vehicle.status === 'online' ? '🟢 在线' : '🔴 离线' }}
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <div class="empty-icon">🚗</div>
            <p>暂无车辆信息</p>
            <router-link :to="{ name: 'MyVehicles' }" class="add-btn">添加车辆</router-link>
          </div>
        </div>
      </div>

      <!-- 我的电池 -->
      <div class="dashboard-card">
        <div class="card-header">
          <h2>🔋 我的电池</h2>
          <router-link :to="{ name: 'MyBatteries' }" class="view-all">
            查看全部 <span class="arrow">→</span>
          </router-link>
        </div>
        <div class="card-content">
          <div v-if="myBatteries.length > 0" class="battery-list">
            <div 
              v-for="battery in myBatteries.slice(0, 3)" 
              :key="battery.id"
              class="battery-item"
            >
              <div class="battery-info">
                <div class="battery-name">{{ battery.name }}</div>
                <div class="battery-soc">
                  <div class="soc-bar">
                    <div class="soc-fill" :style="{ width: battery.soc + '%' }"></div>
                  </div>
                  <span class="soc-text">{{ battery.soc }}%</span>
                </div>
              </div>
              <div class="battery-status" :class="battery.status">
                {{ battery.status === 'good' ? '✅ 良好' : '⚠️ 注意' }}
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <div class="empty-icon">🔋</div>
            <p>暂无电池信息</p>
            <router-link :to="{ name: 'MyBatteries' }" class="add-btn">添加电池</router-link>
          </div>
        </div>
      </div>

      <!-- 最近报警 -->
      <div class="dashboard-card">
        <div class="card-header">
          <h2>🔔 最近报警</h2>
          <router-link :to="{ name: 'UserAlerts' }" class="view-all">
            查看全部 <span class="arrow">→</span>
          </router-link>
        </div>
        <div class="card-content">
          <div v-if="recentAlerts.length > 0" class="alert-list">
            <div 
              v-for="alert in recentAlerts.slice(0, 5)" 
              :key="alert.id"
              class="alert-item"
              :class="alert.level"
            >
              <div class="alert-icon">
                {{ alert.level === 'high' ? '🔴' : alert.level === 'medium' ? '🟡' : '🟢' }}
              </div>
              <div class="alert-content">
                <div class="alert-title">{{ alert.title }}</div>
                <div class="alert-time">{{ formatTime(alert.timestamp) }}</div>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <div class="empty-icon">✅</div>
            <p>暂无报警信息</p>
          </div>
        </div>
      </div>

      <!-- 快速操作 -->
      <div class="dashboard-card">
        <div class="card-header">
          <h2>⚡ 快速操作</h2>
        </div>
        <div class="card-content">
          <div class="quick-actions">
            <router-link :to="{ name: 'UserMap' }" class="quick-action-btn primary">
              <span class="action-icon">🗺️</span>
              <span>查找换电站</span>
            </router-link>
            <router-link :to="{ name: 'MyVehicles' }" class="quick-action-btn">
              <span class="action-icon">🚗</span>
              <span>添加车辆</span>
            </router-link>
            <router-link :to="{ name: 'MyBatteries' }" class="quick-action-btn">
              <span class="action-icon">🔋</span>
              <span>添加电池</span>
            </router-link>
            <router-link :to="{ name: 'UserProfile' }" class="quick-action-btn">
              <span class="action-icon">👤</span>
              <span>个人中心</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 页脚 -->
    <SiteFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { vehicleAPI, batteryAPI, alertAPI } from '../services/api'
import SiteFooter from '../components/SiteFooter.vue'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '用户')
const myVehicles = ref([])
const myBatteries = ref([])
const recentAlerts = ref([])

const activeAlerts = computed(() => {
  return recentAlerts.value.filter(a => !a.resolved).length
})

// 加载用户数据
const loadUserData = async () => {
  try {
    // 加载车辆数据
    const vehicleRes = await vehicleAPI.getAll()
    if (vehicleRes.code === 200) {
      myVehicles.value = vehicleRes.data || []
    }

    // 加载电池数据
    const batteryRes = await batteryAPI.getAll()
    if (batteryRes.code === 200) {
      myBatteries.value = batteryRes.data || []
    }

    // 加载报警数据
    const alertRes = await alertAPI.getAll()
    if (alertRes.code === 200) {
      recentAlerts.value = alertRes.data || []
    }
  } catch (error) {
    console.error('加载用户数据失败:', error)
  }
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return date.toLocaleDateString('zh-CN')
}

onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
.user-dashboard {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 欢迎横幅 */
.welcome-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  color: white;
}

.banner-content h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
}

.banner-content p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.banner-stats {
  display: flex;
  gap: 32px;
}

.mini-stat {
  text-align: center;
}

.mini-stat-value {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 4px;
}

.mini-stat-label {
  font-size: 14px;
  opacity: 0.8;
}

/* 主要内容卡片 */
.dashboard-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.dashboard-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.view-all {
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
}

.view-all:hover {
  gap: 8px;
}

.arrow {
  transition: transform 0.2s ease;
}

.view-all:hover .arrow {
  transform: translateX(4px);
}

.card-content {
  min-height: 200px;
}

/* 车辆列表 */
.vehicle-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vehicle-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.vehicle-item:hover {
  background: #f0f0f0;
}

.vehicle-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.vehicle-name {
  font-weight: 600;
  color: #333;
  font-size: 15px;
}

.vehicle-plate {
  font-size: 13px;
  color: #666;
}

.vehicle-status {
  font-size: 13px;
  font-weight: 500;
}

.vehicle-status.online {
  color: #52c41a;
}

.vehicle-status.offline {
  color: #ff4d4f;
}

/* 电池列表 */
.battery-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.battery-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.battery-item:hover {
  background: #f0f0f0;
}

.battery-info {
  flex: 1;
}

.battery-name {
  font-weight: 600;
  color: #333;
  font-size: 15px;
  margin-bottom: 8px;
}

.battery-soc {
  display: flex;
  align-items: center;
  gap: 12px;
}

.soc-bar {
  flex: 1;
  width: 100px;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.soc-fill {
  height: 100%;
  background: linear-gradient(90deg, #52c41a 0%, #95de64 100%);
  transition: width 0.3s ease;
}

.soc-text {
  font-size: 13px;
  font-weight: 600;
  color: #52c41a;
  min-width: 40px;
}

.battery-status {
  font-size: 13px;
  font-weight: 500;
}

.battery-status.good {
  color: #52c41a;
}

.battery-status.warning {
  color: #faad14;
}

/* 报警列表 */
.alert-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #e9ecef;
  transition: all 0.2s ease;
}

.alert-item:hover {
  background: #f0f0f0;
}

.alert-item.high {
  border-left-color: #ff4d4f;
  background: #fff2f0;
}

.alert-item.medium {
  border-left-color: #faad14;
  background: #fff7e6;
}

.alert-item.low {
  border-left-color: #52c41a;
}

.alert-icon {
  font-size: 20px;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-weight: 500;
  color: #333;
  font-size: 14px;
  margin-bottom: 4px;
}

.alert-time {
  font-size: 12px;
  color: #999;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  margin: 0 0 16px 0;
  font-size: 14px;
}

.add-btn {
  display: inline-block;
  padding: 8px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* 快速操作 */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 20px;
  background: #f8f9fa;
  border-radius: 12px;
  text-decoration: none;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.quick-action-btn:hover {
  background: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.quick-action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.quick-action-btn.primary:hover {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.action-icon {
  font-size: 20px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
  
  .welcome-banner {
    flex-direction: column;
    text-align: center;
    gap: 24px;
  }
  
  .banner-stats {
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .quick-actions {
    grid-template-columns: 1fr;
  }
}
</style>
