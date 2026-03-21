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

      <!-- 电池表格 -->
      <div class="batteries-table">
        <div class="table-header">
          <div class="col-id">电池编号</div>
          <div class="col-status">状态</div>
          <div class="col-vehicle">当前车辆</div>
          <div class="col-voltage">电压</div>
          <div class="col-temperature">温度</div>
          <div class="col-capacity">剩余电量</div>
          <div class="col-health">健康状态</div>
          <div class="col-cycles">循环次数</div>
          <div class="col-actions">操作</div>
        </div>

        <div class="table-body">
          <div v-for="battery in filteredBatteries" :key="battery.pid" 
               class="table-row"
               :class="getBatteryStatusClass(battery)">
            
            <div class="col-id">
              <span class="battery-id">{{ battery.pid }}</span>
            </div>
            
            <div class="col-status">
              <span class="status-badge" :class="battery.status">
                {{ getStatusText(battery.status) }}
              </span>
            </div>
            
            <div class="col-vehicle">
              <span class="vehicle-value">{{ battery.currentVehicle || '未使用' }}</span>
            </div>
            
            <div class="col-voltage">
              <span class="voltage-value">{{ battery.voltage ? battery.voltage + 'V' : '--' }}</span>
            </div>
            
            <div class="col-temperature">
              <span class="temperature-value">{{ battery.temperature ? battery.temperature + '°C' : '--' }}</span>
            </div>
            
            <div class="col-capacity">
              <span class="battery-level" :class="getBatteryLevelClass(battery.remainingCapacity)">
                {{ battery.remainingCapacity ? battery.remainingCapacity + '%' : '--' }}
              </span>
            </div>
            
            <div class="col-health">
              <span class="health-level" :class="getHealthLevelClass(battery.health)">
                {{ battery.health ? battery.health + '%' : '--' }}
              </span>
              <span v-if="battery.health < 80" class="health-warning">
                ⚠️
              </span>
            </div>
            
            <div class="col-cycles">
              <span class="cycles-value">{{ battery.cycleCount || '--' }}</span>
            </div>
            
            <div class="col-actions">
              <button class="btn btn-small btn-primary" @click="viewBatteryDetails(battery)">
                查看详情
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredBatteries.length === 0" class="empty-state">
          <div class="empty-icon">🔋</div>
          <div class="empty-text">暂无电池数据</div>
        </div>
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
            <!-- 全新的折线图实现 - 使用正确的SVG坐标系 -->
            <div class="grid-line-chart">
              <svg class="line-chart-svg" viewBox="0 0 500 200" preserveAspectRatio="none">
                <!-- 背景网格线 -->
                <line x1="0" y1="40" x2="500" y2="40" stroke="#e9ecef" stroke-width="1" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="#e9ecef" stroke-width="1" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="#e9ecef" stroke-width="1" />
                <line x1="0" y1="160" x2="500" y2="160" stroke="#e9ecef" stroke-width="1" />
                
                <!-- 折线 -->
                <polyline points="50,160 150,120 250,180 350,140 450,165" 
                          fill="none" stroke="#007bff" stroke-width="2" />
                
                <!-- 数据点 -->
                <circle cx="50" cy="160" r="4" fill="#007bff" stroke="white" stroke-width="1" />
                <circle cx="150" cy="120" r="4" fill="#007bff" stroke="white" stroke-width="1" />
                <circle cx="250" cy="180" r="4" fill="#007bff" stroke="white" stroke-width="1" />
                <circle cx="350" cy="140" r="4" fill="#007bff" stroke="white" stroke-width="1" />
                <circle cx="450" cy="165" r="4" fill="#007bff" stroke="white" stroke-width="1" />
                
                <!-- 数据标签 -->
                <text x="50" y="155" text-anchor="middle" font-size="10" fill="#007bff">80%</text>
                <text x="150" y="115" text-anchor="middle" font-size="10" fill="#007bff">60%</text>
                <text x="250" y="175" text-anchor="middle" font-size="10" fill="#007bff">90%</text>
                <text x="350" y="135" text-anchor="middle" font-size="10" fill="#007bff">70%</text>
                <text x="450" y="160" text-anchor="middle" font-size="10" fill="#007bff">85%</text>
              </svg>
              <div class="x-axis-labels">
                <span>0-20%</span>
                <span>20-40%</span>
                <span>40-60%</span>
                <span>60-80%</span>
                <span>80-100%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="chart-card">
          <div class="chart-header">
            <h4>温度分布</h4>
          </div>
          <div class="chart-container">
            <div class="temperature-distribution">
              <!-- 饼图：使用单一 conic-gradient -->
              <div class="temperature-pie">
                <div class="pie-segments" style="background: conic-gradient(
                  #28a745 0% 40%,
                  #ffc107 40% 70%,
                  #fd7e14 70% 90%,
                  #dc3545 90% 100%
                );"></div>
                <div class="pie-center">
                  <span class="pie-value">25°C</span>
                  <span class="pie-label">平均温度</span>
                </div>
              </div>
              <div class="temperature-legend">
                <div class="legend-item">
                  <span class="legend-color" style="background: #28a745;"></span>
                  <span class="legend-label">正常 (0-25°C)</span>
                  <span class="legend-count">40%</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color" style="background: #ffc107;"></span>
                  <span class="legend-label">偏高 (25-35°C)</span>
                  <span class="legend-count">30%</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color" style="background: #fd7e14;"></span>
                  <span class="legend-label">高温 (35-45°C)</span>
                  <span class="legend-count">20%</span>
                </div>
                <div class="legend-item">
                  <span class="legend-color" style="background: #dc3545;"></span>
                  <span class="legend-label">危险 (>45°C)</span>
                  <span class="legend-count">10%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 电池详情模态框 -->
    <div v-if="showBatteryDetails" class="modal-overlay" @click="showBatteryDetails = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>电池详细信息</h3>
          <button class="modal-close" @click="showBatteryDetails = false">×</button>
        </div>
        
        <div class="modal-body">
          <div v-if="selectedBatteryDetails" class="details-container">
            <!-- 基本信息表格 -->
            <div class="details-section">
              <h4>基本信息</h4>
              <div class="details-table">
                <div class="detail-row">
                  <div class="detail-label">电池编号</div>
                  <div class="detail-value">{{ selectedBatteryDetails.pid }}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">状态</div>
                  <div class="detail-value">
                    <span class="status-badge" :class="selectedBatteryDetails.status">
                      {{ getStatusText(selectedBatteryDetails.status) }}
                    </span>
                  </div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">当前车辆</div>
                  <div class="detail-value">{{ selectedBatteryDetails.currentVehicle || '未使用' }}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">电压</div>
                  <div class="detail-value">{{ selectedBatteryDetails.voltage ? selectedBatteryDetails.voltage + 'V' : '--' }}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">温度</div>
                  <div class="detail-value">{{ selectedBatteryDetails.temperature ? selectedBatteryDetails.temperature + '°C' : '--' }}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">剩余电量</div>
                  <div class="detail-value">
                    <span class="battery-level" :class="getBatteryLevelClass(selectedBatteryDetails.remainingCapacity)">
                      {{ selectedBatteryDetails.remainingCapacity ? selectedBatteryDetails.remainingCapacity + '%' : '--' }}
                    </span>
                  </div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">健康状态</div>
                  <div class="detail-value">
                    <span class="health-level" :class="getHealthLevelClass(selectedBatteryDetails.health)">
                      {{ selectedBatteryDetails.health ? selectedBatteryDetails.health + '%' : '--' }}
                    </span>
                    <span v-if="selectedBatteryDetails.health < 80" class="health-warning">⚠️ 健康度低</span>
                  </div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">循环次数</div>
                  <div class="detail-value">{{ selectedBatteryDetails.cycleCount || '--' }}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">生产日期</div>
                  <div class="detail-value">{{ selectedBatteryDetails.productionDate || '--' }}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">最后维护时间</div>
                  <div class="detail-value">{{ selectedBatteryDetails.lastMaintenance || '--' }}</div>
                </div>
              </div>
            </div>

            <!-- 使用历史表格 -->
            <div v-if="selectedBatteryDetails.history && selectedBatteryDetails.history.length > 0" class="details-section">
              <h4>使用历史 (最近5条)</h4>
              <div class="history-table">
                <div class="table-header">
                  <div class="col-time">时间</div>
                  <div class="col-vehicle">车辆编号</div>
                  <div class="col-capacity">电量</div>
                  <div class="col-duration">使用时长</div>
                </div>
                <div class="table-body">
                  <div v-for="(record, index) in selectedBatteryDetails.history.slice(-5)" :key="index" class="table-row">
                    <div class="col-time">{{ formatTime(record.timestamp) }}</div>
                    <div class="col-vehicle">{{ record.vehicleId || '--' }}</div>
                    <div class="col-capacity">{{ record.capacity ? record.capacity + '%' : '--' }}</div>
                    <div class="col-duration">{{ record.duration || '--' }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="details-section">
              <h4>使用历史</h4>
              <div class="no-history">暂无使用记录</div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-primary" @click="showBatteryDetails = false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBatteryStore } from '../store/modules/batteryStore'

const batteryStore = useBatteryStore()
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

const showBatteryDetails = ref(false)
const selectedBatteryDetails = ref(null)

const viewBatteryDetails = (battery) => {
  console.log('查看电池详情:', battery)
  selectedBatteryDetails.value = battery
  showBatteryDetails.value = true
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

/* 电池表格 */
.batteries-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: grid;
  grid-template-columns: 120px 100px 120px 100px 100px 100px 100px 80px 120px;
  padding: 20px 24px;
  background: #f8f9fa;
  font-weight: 600;
  color: #666;
  border-bottom: 1px solid #e9ecef;
  gap: 16px;
}

.table-body {
  max-height: 500px;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 120px 100px 120px 100px 100px 100px 100px 80px 120px;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.table-row:hover {
  background: #f8f9fa;
  transform: translateY(-1px);
}

.table-row.in-use {
  border-left: 4px solid #28a745;
}

.table-row.available {
  border-left: 4px solid #17a2b8;
}

.table-row.maintenance {
  border-left: 4px solid #ffc107;
}

/* 表格列样式 */
.col-id .battery-id {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.col-status .status-badge {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.col-status .status-badge.inUse {
  background: #d4edda;
  color: #155724;
}

.col-status .status-badge.available {
  background: #d1ecf1;
  color: #0c5460;
}

.col-status .status-badge.maintenance {
  background: #fff3cd;
  color: #856404;
}

.col-vehicle .vehicle-value {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 500;
}

.col-voltage .voltage-value,
.col-temperature .temperature-value {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 500;
}

.col-capacity .battery-level {
  font-size: 14px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
}

.col-capacity .battery-level.high {
  background: #d4edda;
  color: #155724;
}

.col-capacity .battery-level.medium {
  background: #fff3cd;
  color: #856404;
}

.col-capacity .battery-level.low {
  background: #f8d7da;
  color: #721c24;
}

.col-capacity .battery-level.unknown {
  background: #f8f9fa;
  color: #6c757d;
}

.col-health .health-level {
  font-size: 14px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  margin-right: 8px;
}

.col-health .health-level.excellent {
  background: #d4edda;
  color: #155724;
}

.col-health .health-level.good {
  background: #d1ecf1;
  color: #0c5460;
}

.col-health .health-level.fair {
  background: #fff3cd;
  color: #856404;
}

.col-health .health-level.poor {
  background: #f8d7da;
  color: #721c24;
}

.col-health .health-level.unknown {
  background: #f8f9fa;
  color: #6c757d;
}

.col-health .health-warning {
  display: inline-flex;
  align-items: center;
  padding: 4px 6px;
  background: #fff3cd;
  color: #856404;
  border-radius: 4px;
  font-size: 12px;
}

.col-cycles .cycles-value {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 500;
}

.col-actions .btn-small {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.col-actions .btn-small:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6c757d;
  grid-column: 1 / -1;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  font-weight: 500;
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

.chart-container {
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 全新的折线图实现 - 使用正确的SVG坐标系 */
 .grid-line-chart {
   height: 100%;
   width: 100%;
   display: flex;
   flex-direction: column;
 }
 
 .line-chart-svg {
   flex: 1;
   width: 100%;
   height: calc(100% - 24px);
   background: transparent;
 }
 
 .x-axis-labels {
   display: flex;
   justify-content: space-between;
   padding: 4px 0 0 0;
   font-size: 10px;
   color: #666;
 }

/* 温度分布饼图样式 */
.temperature-distribution {
  display: flex;
  align-items: center;
  gap: 24px;
  height: 100%;
  width: 100%;
  justify-content: center;
}
.temperature-pie {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.pie-segments {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.pie-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.pie-value {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}
.pie-label {
  font-size: 10px;
  color: #666;
  margin-top: 2px;
}
.temperature-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}
.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}
.legend-label {
  flex: 1;
  color: #666;
}
.legend-count {
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

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
  border-radius: 12px 12px 0 0;
}

.modal-header h3 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: #e9ecef;
  color: #333;
}

.modal-body {
  padding: 0;
}

.modal-footer {
  padding: 24px;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  background: #f8f9fa;
  border-radius: 0 0 12px 12px;
}

/* 详情容器样式 */
.details-container {
  padding: 24px;
}

.details-section {
  margin-bottom: 32px;
}

.details-section h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #007bff;
}

.details-table {
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
}

.detail-row {
  display: flex;
  border-bottom: 1px solid #e9ecef;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  flex: 0 0 150px;
  padding: 16px;
  background: #e9ecef;
  font-weight: 600;
  color: #495057;
  border-right: 1px solid #dee2e6;
}

.detail-value {
  flex: 1;
  padding: 16px;
  background: white;
  color: #1a1a1a;
}

/* 使用历史表格样式 */
.history-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.history-table .table-header {
  display: grid;
  grid-template-columns: 200px 120px 100px 120px;
  padding: 16px 20px;
  background: #f8f9fa;
  font-weight: 600;
  color: #666;
  border-bottom: 1px solid #e9ecef;
  gap: 16px;
  text-align: center;
}

.history-table .table-body {
  max-height: 200px;
  overflow-y: auto;
}

.history-table .table-row {
  display: grid;
  grid-template-columns: 200px 120px 100px 120px;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.history-table .table-row:last-child {
  border-bottom: none;
}

.no-history {
  text-align: center;
  padding: 32px;
  color: #6c757d;
  font-style: italic;
}
</style>