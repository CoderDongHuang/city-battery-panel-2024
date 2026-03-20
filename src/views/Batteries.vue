<template>
  <div class="batteries">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">电池管理</h1>
        <p class="page-subtitle">监控和管理所有电池状态及使用情况</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" @click="refreshBatteries">
          <span class="btn-icon">🔄</span>
          刷新数据
        </button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon">🔋</div>
        <div class="stat-content">
          <div class="stat-value">{{ totalBatteries }}</div>
          <div class="stat-label">电池总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🚗</div>
        <div class="stat-content">
          <div class="stat-value">{{ inUseBatteries }}</div>
          <div class="stat-label">使用中</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <div class="stat-value">{{ availableBatteries }}</div>
          <div class="stat-label">可用电池</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🔧</div>
        <div class="stat-content">
          <div class="stat-value">{{ maintenanceBatteries }}</div>
          <div class="stat-label">维护中</div>
        </div>
      </div>
    </div>

    <!-- 筛选和操作区域 -->
    <div class="filter-section">
      <div class="filter-controls">
        <div class="filter-group">
          <label class="filter-label">筛选状态:</label>
          <div class="filter-buttons">
            <button class="filter-btn" :class="{ active: filterStatus === 'all' }" @click="filterStatus = 'all'">
              全部 ({{ totalBatteries }})
            </button>
            <button class="filter-btn" :class="{ active: filterStatus === 'inUse' }" @click="filterStatus = 'inUse'">
              使用中 ({{ inUseBatteries }})
            </button>
            <button class="filter-btn" :class="{ active: filterStatus === 'available' }" @click="filterStatus = 'available'">
              可用 ({{ availableBatteries }})
            </button>
            <button class="filter-btn" :class="{ active: filterStatus === 'maintenance' }" @click="filterStatus = 'maintenance'">
              维护中 ({{ maintenanceBatteries }})
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 电池列表 -->
    <div class="batteries-container">
      <div class="section-header">
        <h3>电池列表</h3>
        <div class="view-controls">
          <span class="result-count">共 {{ filteredBatteries.length }} 个电池</span>
        </div>
      </div>

      <div class="batteries-grid">
        <div v-for="battery in filteredBatteries" :key="battery.pid" 
             class="battery-card"
             :class="getBatteryStatusClass(battery)">
          
          <!-- 电池头部 -->
          <div class="card-header">
            <div class="battery-info">
              <span class="battery-id">{{ battery.pid }}</span>
              <span class="status-badge" :class="battery.status">
                {{ getStatusText(battery.status) }}
              </span>
            </div>
            <div class="battery-actions">
              <span v-if="battery.health < 80" class="health-warning">
                ⚠️ 健康度低
              </span>
            </div>
          </div>

          <!-- 电池详情 -->
          <div class="card-body">
            <div class="info-grid">
              <div class="info-item">
                <label>当前车辆</label>
                <span class="info-value">{{ battery.currentVehicle || '未使用' }}</span>
              </div>
              <div class="info-item">
                <label>电压</label>
                <span class="info-value">{{ battery.voltage ? battery.voltage + 'V' : '--' }}</span>
              </div>
              <div class="info-item">
                <label>温度</label>
                <span class="info-value">{{ battery.temperature ? battery.temperature + '°C' : '--' }}</span>
              </div>
              <div class="info-item">
                <label>剩余电量</label>
                <span class="battery-level" :class="getBatteryLevelClass(battery.remainingCapacity)">
                  {{ battery.remainingCapacity ? battery.remainingCapacity + '%' : '--' }}
                </span>
              </div>
              <div class="info-item">
                <label>健康状态</label>
                <span class="health-level" :class="getHealthLevelClass(battery.health)">
                  {{ battery.health ? battery.health + '%' : '--' }}
                </span>
              </div>
              <div class="info-item">
                <label>循环次数</label>
                <span class="info-value">{{ battery.cycleCount || '--' }}</span>
              </div>
            </div>
          </div>

          <!-- 使用历史 -->
          <div class="card-footer" v-if="battery.history && battery.history.length > 0">
            <div class="history-section">
              <h4>最近使用记录</h4>
              <div class="history-list">
                <div v-for="(record, index) in battery.history.slice(-2)" :key="index" class="history-item">
                  <span class="history-time">{{ formatTime(record.timestamp) }}</span>
                  <span class="history-vehicle">{{ record.vehicleId }}</span>
                  <span class="history-capacity">{{ record.capacity }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredBatteries.length === 0" class="empty-state">
        <div class="empty-icon">🔋</div>
        <div class="empty-text">暂无电池数据</div>
      </div>
    </div>

    <!-- 数据图表区域 -->
    <div class="charts-section">
      <div class="section-header">
        <h3>电池数据趋势</h3>
      </div>
      <div class="charts-grid">
        <div class="chart-card">
          <div class="chart-header">
            <h4>电池容量分布</h4>
          </div>
          <div class="chart-container">
            <div class="mock-chart">
              <div class="chart-bars">
                <div class="chart-bar" style="height: 80%"></div>
                <div class="chart-bar" style="height: 60%"></div>
                <div class="chart-bar" style="height: 90%"></div>
                <div class="chart-bar" style="height: 70%"></div>
                <div class="chart-bar" style="height: 85%"></div>
              </div>
              <div class="chart-labels">
                <span>0-20%</span><span>20-40%</span><span>40-60%</span><span>60-80%</span><span>80-100%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="chart-card">
          <div class="chart-header">
            <h4>温度分布</h4>
          </div>
          <div class="chart-container">
            <div class="mock-chart">
              <div class="temperature-gauge">
                <div class="gauge-fill" style="height: 65%"></div>
                <div class="gauge-label">25°C</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApiBatteryStore } from '../store/modules/apiBatteryStore'

const batteryStore = useApiBatteryStore()
const filterStatus = ref('all')

// 计算属性
const totalBatteries = computed(() => batteryStore.batteries.length)
const inUseBatteries = computed(() => batteryStore.batteries.filter(b => b.status === 'inUse').length)
const availableBatteries = computed(() => batteryStore.batteries.filter(b => b.status === 'available').length)
const maintenanceBatteries = computed(() => batteryStore.batteries.filter(b => b.status === 'maintenance').length)

const filteredBatteries = computed(() => {
  if (filterStatus.value === 'all') {
    return batteryStore.batteries
  }
  return batteryStore.batteries.filter(battery => battery.status === filterStatus.value)
})

const getStatusText = (status) => {
  const statusMap = {
    inUse: '使用中',
    available: '可用',
    maintenance: '维护中'
  }
  return statusMap[status] || '未知'
}

const getBatteryStatusClass = (battery) => {
  return {
    'in-use': battery.status === 'inUse',
    'available': battery.status === 'available',
    'maintenance': battery.status === 'maintenance'
  }
}

const getBatteryLevelClass = (level) => {
  if (!level) return 'unknown'
  if (level > 80) return 'high'
  if (level > 30) return 'medium'
  return 'low'
}

const getHealthLevelClass = (health) => {
  if (!health) return 'unknown'
  if (health > 90) return 'excellent'
  if (health > 70) return 'good'
  if (health > 50) return 'fair'
  return 'poor'
}

const formatTime = (timestamp) => {
  if (!timestamp) return '--'
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const refreshBatteries = async () => {
  try {
    await batteryStore.fetchBatteries()
  } catch (error) {
    console.error('刷新电池数据失败:', error)
  }
}

onMounted(async () => {
  await refreshBatteries()
  batteryStore.startRealTimeUpdates()
})
</script>

<style scoped>
.batteries {
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.header-content .page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.header-content .page-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 按钮样式 */
.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* 统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  font-size: 32px;
  margin-right: 16px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

/* 筛选区域 */
.filter-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.filter-label {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
}

.filter-buttons {
  display: flex;
  gap: 8px;
}

.filter-btn {
  padding: 8px 16px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: #f8f9fa;
  color: #495057;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.filter-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.filter-btn:hover {
  background: #e9ecef;
}

.filter-btn.active:hover {
  background: #0056b3;
}

/* 电池容器 */
.batteries-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.result-count {
  font-size: 14px;
  color: #666;
}

/* 电池网格 */
.batteries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.battery-card {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  background: white;
  transition: all 0.3s ease;
  overflow: hidden;
}

.battery-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.battery-card.in-use {
  border-left: 4px solid #28a745;
}

.battery-card.available {
  border-left: 4px solid #17a2b8;
}

.battery-card.maintenance {
  border-left: 4px solid #ffc107;
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.battery-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.battery-id {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.inUse {
  background: #d4edda;
  color: #155724;
}

.status-badge.available {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.maintenance {
  background: #fff3cd;
  color: #856404;
}

.health-warning {
  background: #fff3cd;
  color: #856404;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

/* 卡片主体 */
.card-body {
  padding: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 600;
}

.battery-level {
  font-weight: 600;
}

.battery-level.high {
  color: #28a745;
}

.battery-level.medium {
  color: #ffc107;
}

.battery-level.low {
  color: #dc3545;
}

.battery-level.unknown {
  color: #6c757d;
}

.health-level {
  font-weight: 600;
}

.health-level.excellent {
  color: #28a745;
}

.health-level.good {
  color: #17a2b8;
}

.health-level.fair {
  color: #ffc107;
}

.health-level.poor {
  color: #dc3545;
}

.health-level.unknown {
  color: #6c757d;
}

/* 卡片底部 */
.card-footer {
  padding: 16px 20px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.history-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin: 0 0 12px 0;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #666;
}

.history-time {
  font-weight: 600;
}

.history-vehicle {
  flex: 1;
  text-align: center;
}

.history-capacity {
  font-weight: 600;
  color: #007bff;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #666;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
}

/* 图表区域 */
.charts-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.chart-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  background: #f8f9fa;
}

.chart-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
}

.mock-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.chart-bars {
  display: flex;
  align-items: end;
  gap: 8px;
  height: 100px;
  width: 100%;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(to top, #007bff, #66b3ff);
  border-radius: 2px 2px 0 0;
  min-height: 20px;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 10px;
  color: #666;
}

.temperature-gauge {
  position: relative;
  width: 80px;
  height: 100px;
  background: #e9ecef;
  border-radius: 40px 40px 0 0;
  overflow: hidden;
}

.gauge-fill {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: linear-gradient(to top, #dc3545, #ff6b6b);
  transition: height 0.3s ease;
}

.gauge-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 600;
  color: #1a1a1a;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .batteries {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .batteries-grid {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .filter-controls {
    flex-direction: column;
    gap: 12px;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-buttons {
    flex-wrap: wrap;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

.chart-placeholder {
  height: 200px;
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #6c757d;
}
</style>