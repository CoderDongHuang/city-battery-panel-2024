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

      <!-- 主要内容区域：左边按钮，右边显示车辆和电池 -->
      <div class="dashboard-content">
        <!-- 左边：快捷操作按钮 -->
        <div class="quick-actions-sidebar">
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

        <!-- 右边：显示车辆和电池 -->
        <div class="assets-panel">
          <!-- 我的车辆区域 -->
          <div class="assets-section">
            <h2 class="assets-title">我的车辆</h2>
            <div v-if="vehicles.length === 0" class="empty-assets">
              <h3>暂无车辆</h3>
              <p>添加您的第一辆车，开始便捷的换电体验</p>
              <router-link :to="{ name: 'MyVehicles' }" class="add-btn">
                <span class="plus-icon">+</span>
                <span>添加车辆</span>
              </router-link>
            </div>
            <div v-else class="assets-list">
              <div v-for="vehicle in vehicles.slice(0, 3)" :key="vehicle.id" class="asset-item">
                <div class="asset-item-content">
                  <span class="asset-icon">🚗</span>
                  <span class="asset-name">{{ vehicle.name }}</span>
                  <span class="asset-status" :class="vehicle.status">{{ vehicle.status === 'online' ? '在线' : '离线' }}</span>
                </div>
                <div class="asset-item-actions">
                  <button class="asset-action-btn view" @click="viewVehicleDetail(vehicle)" title="详情">
                    <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                  <button class="asset-action-btn edit" @click="editVehicle(vehicle)" title="编辑">
                    <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button class="asset-action-btn delete" @click="deleteVehicle(vehicle)" title="删除">
                    <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div v-if="vehicleCount > 3" class="view-more">
                <router-link :to="{ name: 'MyVehicles' }">还有 {{ vehicleCount - 3 }} 辆车... 查看全部 →</router-link>
              </div>
            </div>
          </div>

          <!-- 我的电池区域 -->
          <div class="assets-section">
            <h2 class="assets-title">我的电池</h2>
            <div v-if="batteries.length === 0" class="empty-assets">
              <h3>暂无电池</h3>
              <p>添加您的第一块电池，开始便捷的换电体验</p>
              <router-link :to="{ name: 'MyBatteries' }" class="add-btn">
                <span class="plus-icon">+</span>
                <span>添加电池</span>
              </router-link>
            </div>
            <div v-else class="assets-list">
              <div v-for="battery in batteries.slice(0, 3)" :key="battery.id" class="asset-item">
                <div class="asset-item-content">
                  <span class="asset-icon">🔋</span>
                  <span class="asset-name">{{ battery.name }}</span>
                  <span class="asset-status" :class="battery.status">{{ battery.status === 'online' ? '在线' : '离线' }}</span>
                </div>
                <div class="asset-item-actions">
                  <button class="asset-action-btn view" @click="viewBatteryDetail(battery)" title="详情">
                    <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                  <button class="asset-action-btn edit" @click="editBattery(battery)" title="编辑">
                    <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button class="asset-action-btn delete" @click="deleteBattery(battery)" title="删除">
                    <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div v-if="batteryCount > 3" class="view-more">
                <router-link :to="{ name: 'MyBatteries' }">还有 {{ batteryCount - 3 }} 个电池... 查看全部 →</router-link>
              </div>
            </div>
          </div>
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
import { userStatsAPI, userVehicleAPI, userBatteryAPI } from '../services/userAPI'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '用户')
const vehicleCount = ref(0)
const batteryCount = ref(0)
const vehicles = ref([])
const batteries = ref([])

// 加载用户数据
const loadUserData = async () => {
  try {
    // 获取用户统计信息
    const statsRes = await userStatsAPI.getSummary()
    if (statsRes.code === 200) {
      vehicleCount.value = statsRes.data?.vehicles || 0
      batteryCount.value = statsRes.data?.batteries || 0
    }
    
    // 获取车辆列表
    const vehiclesRes = await userVehicleAPI.getVehicles()
    if (vehiclesRes.code === 200) {
      vehicles.value = vehiclesRes.data || []
    }
    
    // 获取电池列表
    const batteriesRes = await userBatteryAPI.getBatteries()
    if (batteriesRes.code === 200) {
      batteries.value = batteriesRes.data || []
    }
  } catch (error) {
    console.error('加载用户数据失败:', error)
  }
}

// 编辑车辆
const editVehicle = (vehicle) => {
  router.push({ name: 'MyVehicles' })
  // 可以在这里设置编辑状态
}

// 删除车辆
const deleteVehicle = async (vehicle) => {
  if (confirm(`确定要删除车辆"${vehicle.name}"吗？`)) {
    try {
      const res = await userVehicleAPI.deleteVehicle(vehicle.id)
      if (res.code === 200) {
        await loadUserData()
      }
    } catch (error) {
      console.error('删除失败:', error)
    }
  }
}

// 编辑电池
const editBattery = (battery) => {
  router.push({ name: 'MyBatteries' })
}

// 删除电池
const deleteBattery = async (battery) => {
  if (confirm(`确定要删除电池"${battery.name}"吗？`)) {
    try {
      const res = await userBatteryAPI.deleteBattery(battery.id)
      if (res.code === 200) {
        await loadUserData()
      }
    } catch (error) {
      console.error('删除失败:', error)
    }
  }
}

// 查看详情
const viewVehicleDetail = (vehicle) => {
  router.push({ name: 'MyVehicles' })
}

const viewBatteryDetail = (battery) => {
  router.push({ name: 'MyBatteries' })
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



/* 主要内容区域：左边按钮，右边显示车辆和电池 */
.dashboard-content {
  display: flex;
  gap: 32px;
  margin-top: 24px;
}

/* 左边：快捷操作按钮 */
.quick-actions-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 280px;
  flex-shrink: 0;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 28px 20px;
  background: white;
  border-radius: 16px;
  border: 1px solid #e8e8e8;
  text-decoration: none;
  color: #333;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.quick-action-btn:hover {
  background: #ffffff;
  border-color: #d9d9d9;
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.action-icon {
  width: 28px;
  height: 28px;
  stroke: #333;
}

/* 右边：显示车辆和电池 */
.assets-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 资产区域 */
.assets-section {
  background: #f5f5f5;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.assets-title {
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: 600;
  color: #666;
  text-align: left;
}

/* 空状态 */
.empty-assets {
  text-align: center;
  padding: 60px 20px;
}

.empty-assets .empty-icon {
  font-size: 80px;
  margin-bottom: 24px;
  opacity: 0.5;
}

.empty-assets h3 {
  margin: 0 0 12px 0;
  font-size: 20px;
  color: #666;
}

.empty-assets p {
  margin: 0 0 24px 0;
  font-size: 15px;
  color: #999;
}

.add-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: white;
  color: #333;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.add-btn:hover {
  background: #ffffff;
  border-color: #d9d9d9;
  transform: translateY(-2px);
}

.plus-icon {
  font-size: 18px;
  font-weight: bold;
}

/* 资产列表 */
.assets-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.asset-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
}

.asset-item-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.asset-icon {
  font-size: 28px;
}

.asset-name {
  font-size: 16px;
  color: #333;
  font-weight: 500;
  flex: 1;
}

.asset-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
}

.asset-status.online {
  background: #e8f5e9;
  color: #2e7d32;
}

.asset-status.offline {
  background: #ffebee;
  color: #c62828;
}

.asset-item-actions {
  display: flex;
  gap: 8px;
}

.asset-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.asset-action-btn .btn-icon {
  width: 18px;
  height: 18px;
  stroke: currentColor;
}

.asset-action-btn.view {
  color: #2e7d32;
  background: #e8f5e9;
}

.asset-action-btn.view:hover {
  background: #c8e6c9;
}

.asset-action-btn.edit {
  color: #1976d2;
  background: #e3f2fd;
}

.asset-action-btn.edit:hover {
  background: #bbdefb;
}

.asset-action-btn.delete {
  color: #c62828;
  background: #ffebee;
}

.asset-action-btn.delete:hover {
  background: #ffcdd2;
}

.view-more {
  padding: 12px 20px;
  font-size: 14px;
  color: #999;
  font-style: italic;
  text-align: center;
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
