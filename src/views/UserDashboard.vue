<template>
  <div class="user-dashboard-wrapper">
    <!-- 主要内容 -->
    <div class="user-dashboard">
      <!-- 欢迎标题 -->
      <div class="welcome-title">
        <h1>欢迎回来，{{ username }}！</h1>
      </div>

      <!-- 四个按钮（扇形弧度排列） -->
      <div class="action-buttons-arc">
        <router-link :to="{ name: 'UserMap' }" class="arc-btn">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>查找换电站</span>
        </router-link>
        <router-link :to="{ name: 'MyVehicles' }" class="arc-btn">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63L6 12.4m10 3.6l-2-3.6m-2 3.6H8v2m0 0H4m4 0v2m8-2v2m-8-2H4"/>
          </svg>
          <span>添加车辆</span>
        </router-link>
        <router-link :to="{ name: 'MyBatteries' }" class="arc-btn">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="4" y="8" width="16" height="12" rx="2"/>
            <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            <line x1="8" y1="12" x2="8" y2="12"/>
            <line x1="12" y1="12" x2="12" y2="12"/>
            <line x1="16" y1="12" x2="16" y2="12"/>
          </svg>
          <span>添加电池</span>
        </router-link>
        <router-link :to="{ name: 'UserProfile' }" class="arc-btn">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span>个人中心</span>
        </router-link>
      </div>
      
      <!-- 分隔线 -->
      <div class="divider-line"></div>

      <!-- 主要内容区域：左右显示车辆和电池 -->
      <div class="dashboard-content">
        <!-- 我的车辆区域 -->
        <div class="assets-section">
          <div class="section-header">
            <h2 class="assets-title">我的车辆</h2>
            <div class="section-count">数量：{{ vehicleCount }}</div>
          </div>
          <div v-if="vehicles.length === 0" class="empty-assets">
            <h3>暂无车辆</h3>
            <p>添加您的第一辆车，开始便捷的换电体验</p>
            <router-link :to="{ name: 'MyVehicles' }" class="add-btn">
              <span class="plus-icon">+</span>
              <span>添加车辆</span>
            </router-link>
          </div>
          <div v-else class="assets-list">
            <div v-for="vehicle in vehicles" :key="vehicle.id" class="asset-item">
              <div class="asset-item-content">
                <span class="asset-icon">🚗</span>
                <span class="asset-name">{{ vehicle.name }}</span>
              </div>
              <div class="asset-item-actions">
                <span class="asset-status" :class="vehicle.status">{{ vehicle.status === 'online' ? '🟢 在线' : '🔴 离线' }}</span>
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
          </div>
        </div>
        
        <!-- 中间分隔线 -->
        <div class="dashboard-divider"></div>

        <!-- 我的电池区域 -->
        <div class="assets-section">
          <div class="section-header">
            <h2 class="assets-title">我的电池</h2>
            <div class="section-count">数量：{{ batteryCount }}</div>
          </div>
          <div v-if="batteries.length === 0" class="empty-assets">
            <h3>暂无电池</h3>
            <p>添加您的第一块电池，开始便捷的换电体验</p>
            <router-link :to="{ name: 'MyBatteries' }" class="add-btn">
              <span class="plus-icon">+</span>
              <span>添加电池</span>
            </router-link>
          </div>
          <div v-else class="assets-list">
            <div v-for="battery in batteries" :key="battery.id" class="asset-item">
              <div class="asset-item-content">
                <span class="asset-icon">🔋</span>
                <span class="asset-name">{{ battery.name }}</span>
              </div>
              <div class="asset-item-actions">
                <span class="asset-status" :class="battery.status">{{ battery.status === 'online' ? '🟢 在线' : '🔴 离线' }}</span>
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
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <SiteFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userStatsAPI, userVehicleAPI, userBatteryAPI } from '../services/userAPI'
import SiteFooter from '../components/SiteFooter.vue'

const router = useRouter()
const username = ref(localStorage.getItem('userUsername') || '用户')
const vehicleCount = ref(0)
const batteryCount = ref(0)
const vehicles = ref([])
const batteries = ref([])

// 分页相关
const itemsPerPage = ref(5) // 每页显示 5 个
const vehicleCurrentPage = ref(1)
const batteryCurrentPage = ref(1)

// 分页计算属性
const paginatedVehicles = computed(() => {
  const start = (vehicleCurrentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return vehicles.value.slice(start, end)
})

const paginatedBatteries = computed(() => {
  const start = (batteryCurrentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return batteries.value.slice(start, end)
})

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
  background: var(--bg-primary);
  width: 100%;
  transition: background-color 0.3s ease;
}

/* 主要内容 */
.user-dashboard {
  padding: 24px;
  width: 100%;
  flex: 1;
}

/* 页脚样式 */
.user-dashboard-wrapper :deep(.site-footer) {
  margin-top: 80px;
}

/* 欢迎标题 */
.welcome-title {
  text-align: center;
  padding: 40px 24px 20px;
  margin-bottom: 32px;
}

.welcome-title h1 {
  margin: 0;
  font-size: 42px;
  font-weight: 700;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

/* 深色模式下，欢迎标题保持深色（因为在浅色背景上） */
html.dark-mode .welcome-title h1 {
  color: #333333;
}

/* 四个按钮（扇形弧度排列） */
.action-buttons-arc {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 48px;
  padding: 40px 20px 20px;
  position: relative;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

/* 扇形排列：中间高两边低的弧线 */
.action-buttons-arc .arc-btn:nth-child(1) {
  transform: translateY(15px) rotate(-10deg);
}

.action-buttons-arc .arc-btn:nth-child(2) {
  transform: translateY(-5px) rotate(-3deg);
}

.action-buttons-arc .arc-btn:nth-child(3) {
  transform: translateY(-5px) rotate(3deg);
}

.action-buttons-arc .arc-btn:nth-child(4) {
  transform: translateY(15px) rotate(10deg);
}

.arc-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 36px;
  background: var(--card-bg);
  border: 2px solid var(--text-primary);
  border-radius: 16px;
  text-decoration: none;
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 600;
  width: 200px;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

.btn-icon {
  width: 36px;
  height: 36px;
  stroke: var(--text-primary);
  transition: stroke 0.3s ease;
}

.arc-btn:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
  border-color: var(--text-primary);
}

.arc-btn:hover .btn-icon {
  stroke: var(--text-primary);
}
.divider-line {
  width: 100%;
  height: 2px;
  background: var(--text-primary);
  margin: 24px 0 48px;
  transition: background-color 0.3s ease;
}

/* 资产区域 */
.assets-section {
  flex: 1;
  padding: 32px;
  background: var(--card-bg);
  border-radius: 16px;
  box-shadow: 0 2px 8px var(--shadow-color);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

/* 主要内容区域：左右布局 */
.dashboard-content {
  display: flex;
  gap: 24px;
  margin-top: 24px;
}

/* 中间垂直分隔线 */
.dashboard-divider {
  width: 2px;
  background: var(--text-primary);
  flex-shrink: 0;
  align-self: stretch;
  transition: background-color 0.3s ease;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--border-color);
  transition: border-color 0.3s ease;
}

.assets-title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

/* 深色模式下，区块标题保持深色（因为在浅色背景上） */
html.dark-mode .assets-title {
  color: #333333;
}

html.dark-mode .section-count {
  color: #666666;
}

.section-count {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 600;
  transition: color 0.3s ease;
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
  color: var(--text-secondary);
}

.empty-assets p {
  margin: 0 0 24px 0;
  font-size: 15px;
  color: var(--text-tertiary);
}

.add-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: var(--card-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.add-btn:hover {
  background: var(--hover-bg);
  border-color: var(--border-color);
  transform: translateY(-2px);
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
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.asset-name {
  font-size: 16px;
  color: var(--text-primary);
  font-weight: 500;
  flex: 1;
  transition: color 0.3s ease;
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

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  transition: border-color 0.3s ease;
}

.page-btn {
  padding: 8px 16px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background: var(--hover-bg);
  border-color: var(--border-color);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
  transition: color 0.3s ease;
}

.view-more {
  padding: 12px 20px;
  font-size: 14px;
  color: var(--text-tertiary);
  font-style: italic;
  text-align: center;
  transition: color 0.3s ease;
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
