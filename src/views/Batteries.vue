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

    <!-- 错误提示 -->
    <div v-if="batteryStore.error" class="error-message">
      <div class="error-icon">⚠️</div>
      <div class="error-text">{{ batteryStore.error }}</div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon">🔋</div>
        <div class="stat-content">
          <div class="stat-value">{{ batteryStatistics?.totalBatteries ?? batteryStore.totalBatteries }}</div>
          <div class="stat-label">电池总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🚗</div>
        <div class="stat-content">
          <div class="stat-value">{{ batteryStore.inUseBatteries }}</div>
          <div class="stat-label">使用中</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <div class="stat-value">{{ batteryStore.availableBatteries }}</div>
          <div class="stat-label">可用电池</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🔧</div>
        <div class="stat-content">
          <div class="stat-value">{{ batteryStore.maintenanceBatteries }}</div>
          <div class="stat-label">维护中</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⚡</div>
        <div class="stat-content">
          <div class="stat-value">{{ batteryStatistics?.lowVoltageBatteries ?? batteryStore.lowVoltageBatteries }}</div>
          <div class="stat-label">低电压</div>
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
              全部 ({{ batteryStore.totalBatteries }})
            </button>
            <button class="filter-btn" :class="{ active: filterStatus === 'inUse' }" @click="filterStatus = 'inUse'">
              使用中 ({{ batteryStore.inUseBatteries }})
            </button>
            <button class="filter-btn" :class="{ active: filterStatus === 'available' }" @click="filterStatus = 'available'">
              可用 ({{ batteryStore.availableBatteries }})
            </button>
            <button class="filter-btn" :class="{ active: filterStatus === 'maintenance' }" @click="filterStatus = 'maintenance'">
              维护中 ({{ batteryStore.maintenanceBatteries }})
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
          <div class="col-source">来源</div>
          <div class="col-status">状态</div>
          <div class="col-vehicle">当前车辆</div>
          <div class="col-voltage">电压</div>
          <div class="col-temperature">温度</div>
          <div class="col-capacity">剩余电量</div>
          <div class="col-update">最后更新</div>
          <div class="col-actions">操作</div>
        </div>

        <div class="table-body">
          <div v-for="battery in filteredBatteries" :key="battery.pid" 
               class="table-row"
               :class="getBatteryStatusClass(battery)">
            
            <div class="col-id">
              <span class="battery-id">{{ battery.name || battery.pid }}</span>
            </div>
            
            <div class="col-source">
              <span class="source-badge" :class="battery.source">
                {{ battery.source === 'admin' ? '管理端' : '用户端' }}
              </span>
            </div>
            
            <div class="col-status">
              <span class="status-badge" :class="battery.status">
                {{ getStatusText(battery.status) }}
              </span>
            </div>
            
            <div class="col-vehicle">
              <span class="vehicle-value">{{ battery.vid || '未使用' }}</span>
            </div>
            
            <div class="col-voltage">
              <span class="voltage-value">{{ battery.voltage ? battery.voltage + 'V' : '--' }}</span>
            </div>
            
            <div class="col-temperature">
              <span class="temperature-value">{{ battery.temperature ? battery.temperature + '°C' : '--' }}</span>
            </div>
            
            <div class="col-capacity">
              <span class="battery-level" :class="getBatteryLevelClass(battery.batteryLevel)">
                {{ battery.batteryLevel !== null && battery.batteryLevel !== undefined ? battery.batteryLevel + '%' : '--' }}
              </span>
            </div>
            
            <div class="col-update">
              <span class="update-time">{{ battery.lastUpdate ? formatTime(battery.lastUpdate) : '--' }}</span>
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
          <div class="chart-container" @click="openChartModal('capacity')">
            <div class="fixed-line-chart">
              <svg class="line-chart-svg" viewBox="0 0 550 300" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#007bff"/>
                    <stop offset="100%" stop-color="#66b3ff"/>
                  </linearGradient>
                </defs>
                
                <line x1="50" y1="20" x2="50" y2="260" stroke="#aaa" stroke-width="1.5"/>
                <line x1="50" y1="260" x2="530" y2="260" stroke="#aaa" stroke-width="1.5"/>
                
                <text x="35" y="20" text-anchor="end" font-size="10" fill="#666">100%</text>
                <line x1="45" y1="20" x2="50" y2="20" stroke="#aaa"/>
                <text x="35" y="68" text-anchor="end" font-size="10" fill="#666">80%</text>
                <line x1="45" y1="68" x2="50" y2="68" stroke="#aaa"/>
                <text x="35" y="116" text-anchor="end" font-size="10" fill="#666">60%</text>
                <line x1="45" y1="116" x2="50" y2="116" stroke="#aaa"/>
                <text x="35" y="164" text-anchor="end" font-size="10" fill="#666">40%</text>
                <line x1="45" y1="164" x2="50" y2="164" stroke="#aaa"/>
                <text x="35" y="212" text-anchor="end" font-size="10" fill="#666">20%</text>
                <line x1="45" y1="212" x2="50" y2="212" stroke="#aaa"/>
                <text x="35" y="260" text-anchor="end" font-size="10" fill="#666">0%</text>
                <line x1="45" y1="260" x2="50" y2="260" stroke="#aaa"/>
                
                <line x1="50" y1="20" x2="530" y2="20" stroke="#e9ecef" stroke-dasharray="3 3"/>
                <line x1="50" y1="68" x2="530" y2="68" stroke="#e9ecef" stroke-dasharray="3 3"/>
                <line x1="50" y1="116" x2="530" y2="116" stroke="#e9ecef" stroke-dasharray="3 3"/>
                <line x1="50" y1="164" x2="530" y2="164" stroke="#e9ecef" stroke-dasharray="3 3"/>
                <line x1="50" y1="212" x2="530" y2="212" stroke="#e9ecef" stroke-dasharray="3 3"/>
                <line x1="50" y1="260" x2="530" y2="260" stroke="#e9ecef" stroke-dasharray="3 3"/>
                
                <template v-if="capacityChartData.length > 0">
                  <polyline :points="capacityChartPoints" 
                            fill="none" stroke="url(#lineGradient)" stroke-width="2.5" stroke-linecap="round"/>
                  
                  <circle v-for="(point, index) in capacityChartPointsArray" :key="index"
                          :cx="point.x" :cy="point.y" r="4" fill="#007bff" stroke="white"/>
                  
                  <text v-for="(point, index) in capacityChartPointsArray" :key="'label-' + index"
                        :x="point.x" :y="point.y - 12" text-anchor="middle" font-size="11" fill="#007bff">
                    {{ point.level }}%
                  </text>
                </template>
                
                <text v-else x="290" y="140" text-anchor="middle" font-size="14" fill="#999">
                  暂无电量数据
                </text>
              </svg>
            </div>
          </div>
        </div>
        
        <div class="chart-card">
          <div class="chart-header">
            <h4>温度分布</h4>
          </div>
          <div class="chart-container" @click="openChartModal('temperature')">
            <div class="fixed-pie-container">
              <canvas ref="tempPieCanvas" width="600" height="600" style="width: 100%; max-width: 400px; height: auto; aspect-ratio: 1/1;"></canvas>
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
                  <div class="detail-value">{{ selectedBatteryDetails.name || selectedBatteryDetails.pid }}</div>
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
                  <div class="detail-value">{{ selectedBatteryDetails.vid || '未使用' }}</div>
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
                    <span class="battery-level" :class="getBatteryLevelClass(selectedBatteryDetails.batteryLevel)">
                      {{ selectedBatteryDetails.batteryLevel ? selectedBatteryDetails.batteryLevel + '%' : '--' }}
                    </span>
                  </div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">最后更新时间</div>
                  <div class="detail-value">{{ selectedBatteryDetails.lastUpdate || '--' }}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">创建时间</div>
                  <div class="detail-value">{{ selectedBatteryDetails.createdTime || '--' }}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">电池ID</div>
                  <div class="detail-value">{{ selectedBatteryDetails.id || '--' }}</div>
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

    <!-- 图表放大模态框 -->
    <div v-if="showChartModal" class="chart-modal-overlay" @click="closeChartModal">
      <div class="chart-modal-content" @click.stop>
        <div class="chart-modal-header">
          <h3>{{ getChartModalTitle() }}</h3>
          <button class="chart-modal-close" @click="closeChartModal">×</button>
        </div>
        
        <div class="chart-modal-body">
          <!-- 电池容量分布图放大版 -->
          <div v-if="currentChartType === 'capacity'" class="enlarged-chart">
            <div class="chart-container-large">
              <div class="fixed-line-chart-large">
                <svg class="line-chart-svg-large" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="lineGradientLarge" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#007bff"/>
                      <stop offset="100%" stop-color="#66b3ff"/>
                    </linearGradient>
                  </defs>
                  
                  <!-- 背景网格线 -->
                  <line x1="0" y1="80" x2="800" y2="80" stroke="#e9ecef" stroke-width="1"/>
                  <line x1="0" y1="160" x2="800" y2="160" stroke="#e9ecef" stroke-width="1"/>
                  <line x1="0" y1="240" x2="800" y2="240" stroke="#e9ecef" stroke-width="1"/>
                  <line x1="0" y1="320" x2="800" y2="320" stroke="#e9ecef" stroke-width="1"/>
                  
                  <!-- 折线 -->
                  <!-- 数据点: 80% -> y=80, 60% -> y=160, 90% -> y=40, 70% -> y=120, 85% -> y=60 -->
                  <polyline points="80,80 240,160 400,40 560,120 720,60" 
                            fill="none" stroke="url(#lineGradientLarge)" stroke-width="3"/>
                  
                  <!-- 数据点 -->
                  <circle cx="80" cy="80" r="6" fill="#007bff" stroke="white" stroke-width="2"/>
                  <circle cx="240" cy="160" r="6" fill="#007bff" stroke="white" stroke-width="2"/>
                  <circle cx="400" cy="40" r="6" fill="#007bff" stroke="white" stroke-width="2"/>
                  <circle cx="560" cy="120" r="6" fill="#007bff" stroke="white" stroke-width="2"/>
                  <circle cx="720" cy="60" r="6" fill="#007bff" stroke="white" stroke-width="2"/>
                  
                  <!-- 数据标签 -->
                  <text x="80" y="70" text-anchor="middle" font-size="12" fill="#007bff">80%</text>
                  <text x="240" y="150" text-anchor="middle" font-size="12" fill="#007bff">60%</text>
                  <text x="400" y="30" text-anchor="middle" font-size="12" fill="#007bff">90%</text>
                  <text x="560" y="110" text-anchor="middle" font-size="12" fill="#007bff">70%</text>
                  <text x="720" y="50" text-anchor="middle" font-size="12" fill="#007bff">85%</text>
                </svg>
              </div>
            </div>
          </div>
          
          <!-- 温度分布图放大版 -->
          <div v-if="currentChartType === 'temperature'" class="enlarged-chart">
            <div class="chart-container-large">
              <div class="fixed-pie-container-large">
                <canvas ref="tempPieCanvasLarge" width="800" height="800" style="width: 100%; max-width: 600px; height: auto; aspect-ratio: 1/1;"></canvas>
              </div>
            </div>
          </div>
        </div>
        
        <div class="chart-modal-footer">
          <button class="btn btn-primary" @click="closeChartModal">关闭</button>
        </div>
      </div>
    </div>
    
    <!-- 页脚 -->
    <SiteFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useBatteryStore } from '../store/modules/batteryStore'
import { batteryAPI } from '../services/api'
import { getUserBatteries } from '../services/adminUserDataService'
import SiteFooter from '../components/SiteFooter.vue'

const batteryStore = useBatteryStore()
const filterStatus = ref('all')
const batteryStatistics = ref(null)
const statisticsLoading = ref(false)

// 计算属性
const totalBatteries = computed(() => batteryStore.batteries.length)
const inUseBatteries = computed(() => batteryStore.batteries.filter(b => b.vid && b.vid.trim() !== '').length)
const availableBatteries = computed(() => batteryStore.batteries.filter(b => !b.vid || b.vid.trim() === '').length)
const maintenanceBatteries = computed(() => batteryStore.batteries.filter(b => b.status === 'maintenance').length)

const filteredBatteries = computed(() => {
  if (filterStatus.value === 'all') {
    return batteryStore.batteries
  }
  if (filterStatus.value === 'inUse') {
    return batteryStore.batteries.filter(battery => battery.vid && battery.vid.trim() !== '')
  }
  if (filterStatus.value === 'available') {
    return batteryStore.batteries.filter(battery => !battery.vid || battery.vid.trim() === '')
  }
  return batteryStore.batteries.filter(battery => battery.status === filterStatus.value)
})

const capacityChartData = computed(() => {
  const batteries = batteryStore.batteries
  if (batteries.length === 0) return []
  
  const sortedBatteries = [...batteries]
    .filter(b => b.batteryLevel !== null && b.batteryLevel !== undefined)
    .sort((a, b) => a.batteryLevel - b.batteryLevel)
  
  const step = Math.max(1, Math.floor(sortedBatteries.length / 10))
  const sampledBatteries = []
  for (let i = 0; i < sortedBatteries.length; i += step) {
    sampledBatteries.push(sortedBatteries[i])
  }
  
  return sampledBatteries.slice(0, 10).map(b => ({
    pid: b.pid,
    level: b.batteryLevel
  }))
})

const temperatureChartData = computed(() => {
  const batteries = batteryStore.batteries
  if (batteries.length === 0) {
    return [
      { label: '正常 (0-25°C)', count: 0, color: '#28a745' },
      { label: '偏高 (25-35°C)', count: 0, color: '#ffc107' },
      { label: '高温 (35-45°C)', count: 0, color: '#fd7e14' },
      { label: '危险 (>45°C)', count: 0, color: '#dc3545' }
    ]
  }
  
  const normal = batteries.filter(b => b.temperature !== null && b.temperature !== undefined && b.temperature >= 0 && b.temperature < 25).length
  const warm = batteries.filter(b => b.temperature !== null && b.temperature !== undefined && b.temperature >= 25 && b.temperature < 35).length
  const hot = batteries.filter(b => b.temperature !== null && b.temperature !== undefined && b.temperature >= 35 && b.temperature < 45).length
  const danger = batteries.filter(b => b.temperature !== null && b.temperature !== undefined && b.temperature >= 45).length
  
  const total = normal + warm + hot + danger || 1
  
  return [
    { label: '正常 (0-25°C)', count: normal, percent: Math.round(normal / total * 100), color: '#28a745' },
    { label: '偏高 (25-35°C)', count: warm, percent: Math.round(warm / total * 100), color: '#ffc107' },
    { label: '高温 (35-45°C)', count: hot, percent: Math.round(hot / total * 100), color: '#fd7e14' },
    { label: '危险 (>45°C)', count: danger, percent: Math.round(danger / total * 100), color: '#dc3545' }
  ]
})

const capacityChartPointsArray = computed(() => {
  const data = capacityChartData.value
  if (data.length === 0) return []
  
  const chartWidth = 480
  const chartHeight = 240
  const startX = 70
  const startY = 20
  
  return data.map((item, index) => {
    const x = startX + (index / Math.max(data.length - 1, 1)) * chartWidth
    const y = startY + (1 - item.level / 100) * chartHeight
    return { x: Math.round(x), y: Math.round(y), level: item.level }
  })
})

const capacityChartPoints = computed(() => {
  return capacityChartPointsArray.value.map(p => `${p.x},${p.y}`).join(' ')
})

const getStatusText = (status) => {
  const statusMap = {
    // 管理端状态
    inUse: '使用中',
    available: '可用',
    maintenance: '维护中',
    normal: '正常',
    low: '低电量',
    overheat: '过热',
    low_voltage: '低电压',
    // 用户端状态
    online: '在线',
    offline: '离线',
    charging: '充电中'
  }
  return statusMap[status] || status || '未知'
}

// 格式化时间显示
const formatTime = (timeString) => {
  if (!timeString) return '--'
  try {
    const date = new Date(timeString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return timeString
  }
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

const showBatteryDetails = ref(false)
const selectedBatteryDetails = ref(null)

// 图表放大相关状态
const showChartModal = ref(false)
const currentChartType = ref('')

const viewBatteryDetails = (battery) => {
  console.log('查看电池详情:', battery)
  selectedBatteryDetails.value = battery
  showBatteryDetails.value = true
}

// 打开图表模态框
const openChartModal = (chartType) => {
  currentChartType.value = chartType
  showChartModal.value = true
  
  // 如果是温度饼图，需要重新绘制放大版的饼图
  if (chartType === 'temperature') {
    nextTick(() => {
      drawTempPie(true)
    })
  }
}

// 关闭图表模态框
const closeChartModal = () => {
  showChartModal.value = false
  currentChartType.value = ''
}

// 获取图表模态框标题
const getChartModalTitle = () => {
  const titles = {
    capacity: '电池容量分布 - 放大视图',
    temperature: '温度分布 - 放大视图'
  }
  return titles[currentChartType.value] || '图表详情'
}
// 刷新电池数据
const refreshBatteries = async () => {
  try {
    // 获取管理端电池
    const adminRes = await batteryAPI.getBatteries()
    const adminBatteries = adminRes.data?.content || adminRes.data || []
    const adminBatteriesWithSource = adminBatteries.map(b => ({
      ...b,
      source: 'admin',
      pid: b.pid,
      name: b.pid,
      model: b.model || '未知型号',
      code: b.code || b.pid,
      capacity: b.capacity || 100,
      // 当前车辆可能是中文或英文，直接使用
      vid: b.vid || null
    }))
    
    // 获取用户端电池
    try {
      const userRes = await getUserBatteries({ page: 1, size: 1000 })
      if (userRes.code === 200 && userRes.data) {
        const userBatteriesData = userRes.data.content || userRes.data || []
        const userBatteries = userBatteriesData.map(b => ({
          ...b,
          source: 'user',
          pid: `UB${b.id}`,
          // 电池编号使用 name 字段（如："主电池包"）
          name: b.name || '未命名电池',
          model: b.model || '未知型号',
          code: b.code || b.pid,
          capacity: b.capacity || 100,
          voltage: b.voltage || 3.7,
          temperature: b.temperature || 25,
          batteryLevel: b.batteryLevel || 0,
          health: b.health || 100,
          status: b.status || 'available',
          // 当前车辆使用 currentVehicleName 字段（如："特斯拉 Model 3"）
          vid: b.currentVehicleName || null,
          lastUpdate: b.lastUpdateTime || new Date().toISOString()
        }))
        
        // 合并管理端和用户端电池
        batteryStore.batteries = [...adminBatteriesWithSource, ...userBatteries]
      } else {
        // 如果用户端数据获取失败，至少显示管理端数据
        batteryStore.batteries = adminBatteriesWithSource
      }
    } catch (userError) {
      console.error('获取用户端电池失败:', userError)
      // 如果获取用户端失败，至少显示管理端数据
      batteryStore.batteries = adminBatteriesWithSource
    }
  } catch (error) {
    console.error('刷新电池数据失败:', error)
  }
}

// 获取电池统计信息
 const fetchBatteryStatistics = async () => {
   statisticsLoading.value = true
   try {
     const stats = await batteryStore.fetchBatteryStatistics()
     batteryStatistics.value = stats
     console.log('电池统计信息加载成功:', stats)
   } catch (error) {
     console.error('获取电池统计信息失败:', error)
   } finally {
     statisticsLoading.value = false
   }
 }

 // 温度分布饼图绘制（支持普通和放大模式）
const tempPieCanvas = ref(null)
const tempPieCanvasLarge = ref(null)
const drawTempPie = (isLarge = false) => {
  const canvas = isLarge ? tempPieCanvasLarge.value : tempPieCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const size = canvas.width
  const centerX = size / 2
  const centerY = size / 2
  const radius = isLarge ? size * 0.35 : size * 0.30
  
  const data = temperatureChartData.value
  
  let startAngle = -Math.PI / 2
  ctx.clearRect(0, 0, size, size)
  
  const total = data.reduce((sum, item) => sum + item.count, 0)
  if (total === 0) {
    ctx.font = `${isLarge ? '18px' : '14px'} "Segoe UI", "PingFang SC"`
    ctx.fillStyle = '#999'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('暂无温度数据', centerX, centerY)
    return
  }
  
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    const angle = (item.count / total) * Math.PI * 2
    if (angle === 0) continue
    
    const endAngle = startAngle + angle
    
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.closePath()
    ctx.fillStyle = item.color
    ctx.fill()
    
    startAngle = endAngle
  }
  
  const legendX = size - (isLarge ? 40 : 20)
  const legendY = isLarge ? 60 : 40
  const itemHeight = isLarge ? 28 : 24
  const itemSpacing = isLarge ? 12 : 8
  const fontSize = isLarge ? '16px' : '13px'
  
  ctx.font = `${fontSize} "Segoe UI", "PingFang SC"`
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    const y = legendY + i * (itemHeight + itemSpacing)
    
    ctx.fillStyle = item.color
    ctx.fillRect(legendX - 20, y - 8, 14, 14)
    
    ctx.fillStyle = '#333'
    ctx.fillText(`${item.label} ${item.percent}%`, legendX - 28, y)
  }
}

onMounted(async () => {
  await fetchBatteryStatistics()
  await refreshBatteries()
  batteryStore.startRealTimeUpdates()
  nextTick(() => {
    drawTempPie()
    window.addEventListener('resize', drawTempPie)
  })
})

watch(() => batteryStore.batteries, () => {
  nextTick(() => {
    drawTempPie()
  })
}, { deep: true })

onUnmounted(() => {
  window.removeEventListener('resize', drawTempPie)
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
  background: #4a4a4a;
  color: white;
}

.btn-primary:hover {
  background: #5a5a5a;
}

/* 错误提示 */
.error-message {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  margin-bottom: 24px;
  color: #856404;
}

.error-icon {
  font-size: 20px;
  margin-right: 12px;
}

.error-text {
  font-size: 14px;
  font-weight: 500;
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
  grid-template-columns: 120px 100px 100px 120px 100px 100px 100px 100px 80px 120px;
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
  grid-template-columns: 120px 100px 100px 120px 100px 100px 100px 100px 80px 120px;
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

.col-source .source-badge {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.col-source .source-badge.admin {
  background: #cce5ff;
  color: #004085;
}

.col-source .source-badge.user {
  background: #d4edda;
  color: #155724;
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
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

/* 修复后的折线图容器 */
.fixed-line-chart {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.line-chart-svg {
  width: 100%;
  height: 100%;
  background: transparent;
  overflow: visible;
}

/* 饼图容器 - 无额外框框 */
.fixed-pie-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fixed-pie-container canvas {
  max-width: 100%;
  height: auto;
  background: transparent;
  box-shadow: none;
  border-radius: 0;
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

/* 图表放大模态框样式 */
.chart-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.chart-modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 1000px;
  max-height: 85vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: chartModalSlideIn 0.4s ease;
}

@keyframes chartModalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(-30px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.chart-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.chart-modal-header h3 {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.chart-modal-close {
  background: none;
  border: none;
  font-size: 28px;
  color: #6c757d;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.chart-modal-close:hover {
  background: #e9ecef;
  color: #dc3545;
  transform: rotate(90deg);
}

.chart-modal-body {
  padding: 32px;
  max-height: calc(85vh - 160px);
  overflow-y: auto;
}

.chart-modal-footer {
  padding: 24px 32px;
  border-top: 1px solid #e9ecef;
  text-align: center;
  background: #f8f9fa;
}

/* 放大版图表容器 */
.chart-container-large {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 500px;
}

.fixed-line-chart-large {
  width: 100%;
  max-width: 800px;
  height: 400px;
}

.line-chart-svg-large {
  width: 100%;
  height: 100%;
}

.fixed-pie-container-large {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 600px;
}

/* 图表容器点击效果 */
.chart-container {
  cursor: pointer;
  transition: all 0.3s ease;
}

.chart-container:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 123, 255, 0.15);
}

.chart-container:active {
  transform: scale(0.98);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chart-modal-content {
    width: 95%;
    max-width: none;
    margin: 20px;
  }
  
  .chart-modal-body {
    padding: 20px;
  }
  
  .chart-container-large {
    min-height: 400px;
  }
  
  .fixed-line-chart-large {
    height: 300px;
  }
}
</style>