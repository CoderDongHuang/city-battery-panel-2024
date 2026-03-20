<template>
  <div class="dashboard">
    <!-- 企业级头部区域 -->
    <div class="enterprise-header">
      <div class="header-content">
        <div class="header-title-section">
          <h1 class="main-title">城市智能电车管理系统</h1>
          <p class="system-description">
            基于物联网技术的智能电车运营管理平台，提供实时监控、智能调度、数据分析等全方位服务，
            助力城市绿色出行体系建设，提升运营效率和服务质量。
          </p>
        </div>
        <div class="header-status-section">
          <div class="system-status">
            <div class="status-indicator online"></div>
            <span class="status-text">系统运行正常</span>
          </div>
          <div class="last-update">
            <span class="update-label">最后更新</span>
            <span class="update-time">{{ currentTime }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 核心业务指标 -->
    <div class="business-metrics-section">
      <div class="section-header">
        <div class="section-title-group">
          <h2 class="section-title">核心业务指标</h2>
          <p class="section-description">实时展示系统关键运营数据，帮助您快速了解整体运营状况</p>
        </div>
        <div class="section-controls">
          <div class="time-range-selector">
            <span class="selector-label">时间范围：</span>
            <div class="selector-buttons">
              <button class="selector-btn active">今日</button>
              <button class="selector-btn">本周</button>
              <button class="selector-btn">本月</button>
            </div>
          </div>
          <button class="refresh-btn" @click="refreshData">
            <span class="refresh-icon">🔄</span>
            刷新数据
          </button>
        </div>
      </div>
      
      <div class="metrics-grid">
        <!-- 主要指标卡片 -->
        <div class="primary-metric-card">
          <div class="metric-header">
            <div class="metric-icon">🚗</div>
            <div class="metric-info">
              <h3 class="metric-title">在线车辆监控</h3>
              <p class="metric-description">当前在线运行的电动车辆数量</p>
            </div>
          </div>
          <div class="metric-body">
            <div class="metric-value">{{ onlineVehiclesCount }}</div>
            <div class="metric-comparison">
              <span class="comparison-value positive">+2</span>
              <span class="comparison-label">较昨日</span>
            </div>
          </div>
          <div class="metric-footer">
            <div class="metric-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: (onlineVehiclesCount / 10) * 100 + '%' }"></div>
              </div>
              <span class="progress-text">容量利用率 {{ Math.round((onlineVehiclesCount / 10) * 100) }}%</span>
            </div>
          </div>
        </div>

        <!-- 次要指标卡片组 -->
        <div class="secondary-metrics-grid">
          <div class="secondary-metric-card">
            <div class="metric-icon">🔋</div>
            <div class="metric-content">
              <div class="metric-value">{{ totalBatteriesCount }}</div>
              <div class="metric-label">电池总数</div>
              <div class="metric-detail">
                <span class="detail-item">可用: {{ availableBatteriesCount }}</span>
                <span class="detail-item">使用中: {{ inUseBatteriesCount }}</span>
              </div>
            </div>
          </div>
          
          <div class="secondary-metric-card">
            <div class="metric-icon">⚠️</div>
            <div class="metric-content">
              <div class="metric-value">{{ activeAlertsCount }}</div>
              <div class="metric-label">异常报警</div>
              <div class="metric-detail">
                <span class="detail-item">需处理: {{ urgentAlertsCount }}</span>
                <span class="detail-item">已处理: {{ resolvedAlertsCount }}</span>
              </div>
            </div>
          </div>
          
          <div class="secondary-metric-card">
            <div class="metric-icon">🏢</div>
            <div class="metric-content">
              <div class="metric-value">{{ chargingStationsCount }}</div>
              <div class="metric-label">换电站</div>
              <div class="metric-detail">
                <span class="detail-item">运营中: {{ activeStationsCount }}</span>
                <span class="detail-item">维护中: {{ maintenanceStationsCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 系统功能导航 -->
    <div class="system-navigation-section">
      <div class="section-header">
        <div class="section-title-group">
          <h2 class="section-title">系统功能导航</h2>
          <p class="section-description">快速访问系统各功能模块，高效管理城市电车运营</p>
        </div>
      </div>
      
      <div class="navigation-grid">
        <router-link to="/vehicles" class="navigation-card">
          <div class="card-header">
            <div class="card-icon">🚗</div>
            <div class="card-badge">{{ onlineVehiclesCount }} 在线</div>
          </div>
          <div class="card-body">
            <h3 class="card-title">车辆管理</h3>
            <p class="card-description">
              实时监控车辆状态、位置信息、电池电量等关键数据，
              支持车辆调度、远程控制等操作。
            </p>
          </div>
          <div class="card-footer">
            <span class="card-action">进入管理 →</span>
          </div>
        </router-link>
        
        <router-link to="/batteries" class="navigation-card">
          <div class="card-header">
            <div class="card-icon">🔋</div>
            <div class="card-badge">{{ totalBatteriesCount }} 总数</div>
          </div>
          <div class="card-body">
            <h3 class="card-title">电池管理</h3>
            <p class="card-description">
              全面管理电池库存、使用状态、健康度等信息，
              提供电池更换、维护等全生命周期管理。
            </p>
          </div>
          <div class="card-footer">
            <span class="card-action">进入管理 →</span>
          </div>
        </router-link>
        
        <router-link to="/map" class="navigation-card">
          <div class="card-header">
            <div class="card-icon">🗺️</div>
            <div class="card-badge">实时监控</div>
          </div>
          <div class="card-body">
            <h3 class="card-title">地图监控</h3>
            <p class="card-description">
              在地图上实时展示车辆分布、换电站位置，
              支持路径规划、区域监控等高级功能。
            </p>
          </div>
          <div class="card-footer">
            <span class="card-action">进入监控 →</span>
          </div>
        </router-link>
        
        <router-link to="/alerts" class="navigation-card">
          <div class="card-header">
            <div class="card-icon">🚨</div>
            <div class="card-badge">{{ activeAlertsCount }} 报警</div>
          </div>
          <div class="card-body">
            <h3 class="card-title">报警中心</h3>
            <p class="card-description">
              集中管理所有系统报警信息，支持报警分类、
              处理跟踪、统计分析等功能。
            </p>
          </div>
          <div class="card-footer">
            <span class="card-action">进入中心 →</span>
          </div>
        </router-link>
      </div>
    </div>

    <!-- 数据可视化图表 -->
    <div class="data-visualization-section">
      <div class="section-header">
        <div class="section-title-group">
          <h2 class="section-title">数据可视化分析</h2>
          <p class="section-description">通过图表直观展示系统运营数据，辅助决策分析</p>
        </div>
      </div>
      
      <div class="visualization-grid">
        <div class="chart-card">
          <div class="chart-header">
            <h3>车辆运营趋势</h3>
            <div class="chart-actions">
              <button class="chart-btn active">日</button>
              <button class="chart-btn">周</button>
              <button class="chart-btn">月</button>
            </div>
          </div>
          <div class="chart-container">
            <div class="mock-chart">
              <div class="chart-bars">
                <div class="chart-bar" style="height: 80%"></div>
                <div class="chart-bar" style="height: 60%"></div>
                <div class="chart-bar" style="height: 90%"></div>
                <div class="chart-bar" style="height: 70%"></div>
                <div class="chart-bar" style="height: 85%"></div>
                <div class="chart-bar" style="height: 75%"></div>
                <div class="chart-bar" style="height: 95%"></div>
              </div>
              <div class="chart-labels">
                <span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span>
              </div>
            </div>
          </div>
          <div class="chart-footer">
            <p class="chart-summary">本周车辆平均在线率 85%，较上周提升 5%</p>
          </div>
        </div>
        
        <div class="chart-card">
          <div class="chart-header">
            <h3>电池状态分布</h3>
          </div>
          <div class="chart-container">
            <div class="mock-pie-chart">
              <div class="pie-segment" style="--percentage: 60; --color: #28a745;"></div>
              <div class="pie-segment" style="--percentage: 25; --color: #ffc107;"></div>
              <div class="pie-segment" style="--percentage: 15; --color: #dc3545;"></div>
              <div class="pie-center">
                <span class="pie-value">85%</span>
                <span class="pie-label">健康</span>
              </div>
            </div>
            <div class="pie-legend">
              <div class="legend-item">
                <span class="legend-color" style="background: #28a745;"></span>
                <span class="legend-label">良好 (60%)</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: #ffc107;"></span>
                <span class="legend-label">一般 (25%)</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: #dc3545;"></span>
                <span class="legend-label">需维护 (15%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速操作面板 -->
    <div class="quick-actions">
      <div class="section-header">
        <h2>快速操作</h2>
      </div>
      
      <div class="actions-grid">
        <button class="action-btn primary">
          <span class="action-icon">🔄</span>
          <span class="action-text">刷新数据</span>
        </button>
        
        <button class="action-btn">
          <span class="action-icon">📊</span>
          <span class="action-text">生成报表</span>
        </button>
        
        <button class="action-btn">
          <span class="action-icon">🔔</span>
          <span class="action-text">通知设置</span>
        </button>
        
        <button class="action-btn">
          <span class="action-icon">⚙️</span>
          <span class="action-text">系统设置</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useApiVehicleStore } from '../store/modules/apiVehicleStore'
import { useApiBatteryStore } from '../store/modules/apiBatteryStore'

export default {
  name: 'Dashboard',
  
  setup() {
    const vehicleStore = useApiVehicleStore()
    const batteryStore = useApiBatteryStore()
    
    const onlineVehiclesCount = ref(0)
    const totalBatteriesCount = ref(0)
    const activeAlertsCount = ref(0)
    const chargingStationsCount = ref(0)
    
    // 模拟数据
    const mockData = {
      onlineVehicles: 8,
      totalBatteries: 15,
      activeAlerts: 3,
      chargingStations: 5,
      availableBatteries: 10,
      inUseBatteries: 5,
      urgentAlerts: 1,
      resolvedAlerts: 2,
      activeStations: 4,
      maintenanceStations: 1
    }
    
    // 计算属性
    const availableBatteriesCount = computed(() => mockData.availableBatteries)
    const inUseBatteriesCount = computed(() => mockData.inUseBatteries)
    const urgentAlertsCount = computed(() => mockData.urgentAlerts)
    const resolvedAlertsCount = computed(() => mockData.resolvedAlerts)
    const activeStationsCount = computed(() => mockData.activeStations)
    const maintenanceStationsCount = computed(() => mockData.maintenanceStations)
    
    const currentTime = computed(() => {
      return new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    })
    
    const loadData = () => {
      // 使用模拟数据
      onlineVehiclesCount.value = mockData.onlineVehicles
      totalBatteriesCount.value = mockData.totalBatteries
      activeAlertsCount.value = mockData.activeAlerts
      chargingStationsCount.value = mockData.chargingStations
      
      // 如果有真实数据，优先使用真实数据
      if (vehicleStore.vehicles.length > 0) {
        onlineVehiclesCount.value = vehicleStore.vehicles.filter(v => v.status === 'online').length
      }
      
      if (batteryStore.batteries.length > 0) {
        totalBatteriesCount.value = batteryStore.batteries.length
      }
    }
    
    const refreshData = () => {
      loadData()
      // 可以添加刷新动画或提示
      console.log('数据已刷新')
    }
    
    onMounted(() => {
      loadData()
      
      // 启动WebSocket实时更新
      vehicleStore.startRealTimeUpdates()
      batteryStore.startRealTimeUpdates()
      
      // 更新时间显示
      setInterval(() => {
        // 更新时间会自动更新
      }, 1000)
    })
    
    onUnmounted(() => {
      // 清理WebSocket连接
      if (vehicleStore.wsConnection) {
        vehicleStore.wsConnection.close()
      }
      if (batteryStore.wsConnection) {
        batteryStore.wsConnection.close()
      }
    })
    
    return {
      onlineVehiclesCount,
      totalBatteriesCount,
      activeAlertsCount,
      chargingStationsCount,
      availableBatteriesCount,
      inUseBatteriesCount,
      urgentAlertsCount,
      resolvedAlertsCount,
      activeStationsCount,
      maintenanceStationsCount,
      currentTime,
      refreshData
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* 企业级头部区域 */
.enterprise-header {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  padding: 40px 0;
  margin-bottom: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-content {
  width: 100%;
  margin: 0;
  padding: 0 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
  box-sizing: border-box;
}

.header-title-section {
  flex: 1;
  min-width: 0;
}

.main-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 16px 0;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.system-description {
  font-size: 16px;
  line-height: 1.6;
  opacity: 0.9;
  margin: 0;
  max-width: 600px;
  font-weight: 300;
}

.header-status-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-end;
  min-width: 200px;
}

.system-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #28a745;
  animation: pulse 2s infinite;
}

.status-indicator.online {
  background: #28a745;
}

.status-text {
  font-size: 14px;
  font-weight: 500;
}

.last-update {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.update-label {
  font-size: 12px;
  opacity: 0.8;
}

.update-time {
  font-size: 14px;
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

/* 核心业务指标区域 */
.business-metrics-section {
  width: 100%;
  margin: 0 0 40px 0;
  padding: 0 32px;
  box-sizing: border-box;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 32px;
  gap: 24px;
}

.section-title-group {
  flex: 1;
  min-width: 0;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  line-height: 1.2;
}

.section-description {
  font-size: 16px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.section-controls {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;
}

.time-range-selector {
  display: flex;
  align-items: center;
  gap: 12px;
}

.selector-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  white-space: nowrap;
}

.selector-buttons {
  display: flex;
  gap: 8px;
}

.selector-btn {
  padding: 8px 16px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: #f8f9fa;
  color: #495057;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.selector-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.selector-btn:hover {
  background: #e9ecef;
}

.selector-btn.active:hover {
  background: #0056b3;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 1px solid #007bff;
  border-radius: 6px;
  background: white;
  color: #007bff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  background: #007bff;
  color: white;
}

.refresh-icon {
  font-size: 16px;
}

/* 指标网格布局 */
.metrics-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  align-items: stretch;
}

/* 主要指标卡片 */
.primary-metric-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.primary-metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.metric-icon {
  font-size: 48px;
  flex-shrink: 0;
}

.metric-info {
  flex: 1;
  min-width: 0;
}

.metric-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.metric-description {
  font-size: 16px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.metric-body {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 24px;
}

.metric-value {
  font-size: 56px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
  letter-spacing: -1px;
}

.metric-comparison {
  display: flex;
  align-items: center;
  gap: 8px;
}

.comparison-value {
  font-size: 18px;
  font-weight: 600;
}

.comparison-value.positive {
  color: #28a745;
}

.comparison-value.negative {
  color: #dc3545;
}

.comparison-label {
  font-size: 14px;
  color: #666;
}

.metric-footer {
  margin-top: 20px;
}

.metric-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-bar {
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #007bff, #66b3ff);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #666;
}

/* 次要指标网格 */
.secondary-metrics-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.secondary-metric-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid #e9ecef;
  flex: 1;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.secondary-metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.secondary-metric-card .metric-icon {
  font-size: 32px;
  margin-bottom: 16px;
}

.secondary-metric-card .metric-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.secondary-metric-card .metric-value {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
}

.secondary-metric-card .metric-label {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

.metric-detail {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #888;
}

.detail-item {
  display: inline-block;
}

/* 系统功能导航区域 */
.system-navigation-section {
  width: 100%;
  margin: 0 0 40px 0;
  padding: 0 32px;
  box-sizing: border-box;
}

.navigation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.navigation-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  text-decoration: none;
  color: inherit;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.navigation-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
  border-color: #007bff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-icon {
  font-size: 40px;
}

.card-badge {
  background: #007bff;
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
}

.card-body {
  flex: 1;
  margin-bottom: 20px;
}

.card-title {
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.card-description {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  margin: 0;
}

.card-footer {
  margin-top: auto;
}

.card-action {
  color: #007bff;
  font-size: 16px;
  font-weight: 600;
  transition: color 0.3s ease;
}

.navigation-card:hover .card-action {
  color: #0056b3;
}

/* 数据可视化区域 */
.data-visualization-section {
  width: 100%;
  margin: 0 0 40px 0;
  padding: 0 32px;
  box-sizing: border-box;
}

.visualization-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 32px;
  align-items: start;
}

.chart-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 300px;
}

.chart-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-shrink: 0;
}

.chart-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.3;
}

.chart-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.chart-btn {
  padding: 8px 16px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: #f8f9fa;
  color: #495057;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.chart-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.chart-btn:hover {
  background: #e9ecef;
}

.chart-btn.active:hover {
  background: #0056b3;
}

.chart-container {
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  flex: 1;
  min-height: 250px;
  position: relative;
  overflow: hidden;
}

.mock-chart {
  display: flex;
  align-items: end;
  gap: 12px;
  height: 160px;
  width: 100%;
}

.chart-bars {
  display: flex;
  align-items: end;
  gap: 12px;
  height: 100%;
  width: 100%;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(to top, #007bff, #66b3ff);
  border-radius: 4px 4px 0 0;
  min-height: 20px;
  transition: height 0.5s ease;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  font-size: 14px;
  color: #666;
}

.chart-footer {
  border-top: 1px solid #e9ecef;
  padding-top: 20px;
  flex-shrink: 0;
}

.chart-summary {
  font-size: 16px;
  color: #666;
  margin: 0;
  text-align: center;
  line-height: 1.5;
}

/* 饼图样式 */
.mock-pie-chart {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(
    var(--color) 0% calc(var(--percentage) * 1%),
    transparent calc(var(--percentage) * 1%) 100%
  );
}

.pie-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pie-value {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
}

.pie-label {
  font-size: 12px;
  color: #666;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 20px;
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
  color: #666;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 24px;
  }
  
  .header-status-section {
    align-items: center;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .secondary-metrics-grid {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .secondary-metric-card {
    flex: 1;
    min-width: 200px;
  }
}

@media (max-width: 768px) {
  .enterprise-header {
    padding: 24px 0;
  }
  
  .header-content {
    padding: 0 16px;
  }
  
  .main-title {
    font-size: 28px;
  }
  
  .business-metrics-section,
  .system-navigation-section,
  .data-visualization-section {
    padding: 0 16px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .section-controls {
    width: 100%;
    justify-content: space-between;
  }
  
  .navigation-grid {
    grid-template-columns: 1fr;
  }
  
  .visualization-grid {
    grid-template-columns: 1fr;
  }
  
  .secondary-metrics-grid {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .section-controls {
    flex-direction: column;
    gap: 12px;
  }
  
  .time-range-selector {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .selector-buttons {
    width: 100%;
    justify-content: space-between;
  }
}
</style>