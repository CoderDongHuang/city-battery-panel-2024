<template>
  <div class="dashboard">
    <!-- 核心业务指标（大模块） -->
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

      <!-- 四个等宽卡片网格 -->
      <div class="metrics-grid">
        <!-- 在线车辆监控 -->
        <div class="metric-card">
          <div class="metric-icon">🚗</div>
          <div class="metric-content">
            <h3 class="metric-title">在线车辆监控</h3>
            <div class="metric-value">{{ onlineVehiclesCount }}</div>
            <div class="metric-comparison positive">
              <span>+2</span> <span class="metric-compare-label">较昨日</span>
            </div>
            <div class="metric-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: (onlineVehiclesCount / 10) * 100 + '%' }"></div>
              </div>
              <span class="progress-text">容量利用率 {{ Math.round((onlineVehiclesCount / 10) * 100) }}%</span>
            </div>
          </div>
        </div>

        <!-- 电池总数 -->
        <div class="metric-card">
          <div class="metric-icon">🔋</div>
          <div class="metric-content">
            <h3 class="metric-title">电池总数</h3>
            <div class="metric-value">{{ totalBatteriesCount }}</div>
            <div class="metric-detail">
              <span>可用: {{ availableBatteriesCount }}</span>
              <span>使用中: {{ inUseBatteriesCount }}</span>
            </div>
          </div>
        </div>

        <!-- 异常报警 -->
        <div class="metric-card">
          <div class="metric-icon">⚠️</div>
          <div class="metric-content">
            <h3 class="metric-title">异常报警</h3>
            <div class="metric-value">{{ activeAlertsCount }}</div>
            <div class="metric-detail">
              <span>需处理: {{ urgentAlertsCount }}</span>
              <span>已处理: {{ resolvedAlertsCount }}</span>
            </div>
          </div>
        </div>

        <!-- 换电站 -->
        <div class="metric-card">
          <div class="metric-icon">🏢</div>
          <div class="metric-content">
            <h3 class="metric-title">换电站</h3>
            <div class="metric-value">{{ chargingStationsCount }}</div>
            <div class="metric-detail">
              <span>运营中: {{ activeStationsCount }}</span>
              <span>维护中: {{ maintenanceStationsCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 系统功能导航（大模块） -->
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

    <!-- 数据可视化分析（大模块） -->
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
            <!-- 简化的柱状图布局 -->
            <div class="simple-bar-chart">
              <div class="chart-bars">
                <div class="chart-bar-container">
                  <div class="chart-bar" style="height: 80%">
                    <span class="bar-value">80%</span>
                  </div>
                  <span class="x-axis-label">一</span>
                </div>
                <div class="chart-bar-container">
                  <div class="chart-bar" style="height: 60%">
                    <span class="bar-value">60%</span>
                  </div>
                  <span class="x-axis-label">二</span>
                </div>
                <div class="chart-bar-container">
                  <div class="chart-bar" style="height: 90%">
                    <span class="bar-value">90%</span>
                  </div>
                  <span class="x-axis-label">三</span>
                </div>
                <div class="chart-bar-container">
                  <div class="chart-bar" style="height: 70%">
                    <span class="bar-value">70%</span>
                  </div>
                  <span class="x-axis-label">四</span>
                </div>
                <div class="chart-bar-container">
                  <div class="chart-bar" style="height: 85%">
                    <span class="bar-value">85%</span>
                  </div>
                  <span class="x-axis-label">五</span>
                </div>
                <div class="chart-bar-container">
                  <div class="chart-bar" style="height: 75%">
                    <span class="bar-value">75%</span>
                  </div>
                  <span class="x-axis-label">六</span>
                </div>
                <div class="chart-bar-container">
                  <div class="chart-bar" style="height: 95%">
                    <span class="bar-value">95%</span>
                  </div>
                  <span class="x-axis-label">日</span>
                </div>
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
            <div class="pie-chart-container">
              <!-- 多扇形饼图 + 引导线 -->
              <div class="pie-chart">
                <div class="pie-segment" style="--percentage: 60; --color: #28a745; --start: 0;">
                  <div class="connector-line" style="--angle: 30;"></div>
                </div>
                <div class="pie-segment" style="--percentage: 25; --color: #ffc107; --start: 60;">
                  <div class="connector-line" style="--angle: 120;"></div>
                </div>
                <div class="pie-segment" style="--percentage: 15; --color: #dc3545; --start: 85;">
                  <div class="connector-line" style="--angle: 200;"></div>
                </div>
                <div class="pie-center">
                  <span class="pie-value">状态</span>
                  <span class="pie-label">分布</span>
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
    </div>

    <!-- 快速操作面板（大模块） -->
    <div class="quick-actions">
      <div class="section-header">
        <h2>快速操作</h2>
      </div>
      <div class="actions-grid">
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
      onlineVehiclesCount.value = mockData.onlineVehicles
      totalBatteriesCount.value = mockData.totalBatteries
      activeAlertsCount.value = mockData.activeAlerts
      chargingStationsCount.value = mockData.chargingStations
      
      if (vehicleStore.vehicles.length > 0) {
        onlineVehiclesCount.value = vehicleStore.vehicles.filter(v => v.status === 'online').length
      }
      if (batteryStore.batteries.length > 0) {
        totalBatteriesCount.value = batteryStore.batteries.length
      }
    }
    
    const refreshData = () => {
      loadData()
      console.log('数据已刷新')
    }
    
    onMounted(() => {
      loadData()
      // 暂时注释掉实时更新功能，避免错误
      // vehicleStore.startRealTimeUpdates()
      // batteryStore.startRealTimeUpdates()
    })
    
    onUnmounted(() => {
      // 暂时注释掉WebSocket连接关闭，避免错误
      // if (vehicleStore.wsConnection) vehicleStore.wsConnection.close()
      // if (batteryStore.wsConnection) batteryStore.wsConnection.close()
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
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* 大模块间距设置 - 独立控制，不受父组件限制 */
.business-metrics-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 48px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.system-navigation-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 48px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.data-visualization-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 48px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.quick-actions {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

/* 大模块悬停效果 */
.business-metrics-section:hover,
.system-navigation-section:hover,
.data-visualization-section:hover,
.quick-actions:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

/* 移除外层card-section样式，避免重复 */

/* 保持原有内部间距 */
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

/* 四个等宽卡片网格 */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

/* 统一卡片样式 */
.metric-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid #e9ecef;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.metric-icon {
  font-size: 32px;
  margin-bottom: 16px;
}

.metric-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metric-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.3;
}

.metric-value {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
}

.metric-comparison {
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}
.metric-comparison.positive {
  color: #28a745;
}
.metric-compare-label {
  font-weight: normal;
  color: #666;
}

.metric-detail {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #666;
  flex-wrap: wrap;
}

.metric-progress {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.progress-bar {
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #007bff, #66b3ff);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #666;
}

/* 系统功能导航区域 */
.system-navigation-section {
  /* 原有样式已被外层 card-section 覆盖，但保留内部样式 */
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
  /* 原有样式已被外层 card-section 覆盖 */
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

/* 简化的柱状图布局 */
.simple-bar-chart {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.chart-bars {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 8px;
  height: 100%;
  width: 100%;
  margin-bottom: 8px;
}

.chart-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
}

.chart-bar {
  width: 100%;
  background: linear-gradient(to top, #007bff, #66b3ff);
  border-radius: 4px 4px 0 0;
  min-height: 20px;
  transition: height 0.5s ease;
  position: relative;
  display: flex;
  align-items: start;
  justify-content: center;
}

.bar-value {
  position: absolute;
  bottom: 100%;
  margin-bottom: 5px;
  font-size: 12px;
  font-weight: 600;
  color: #007bff;
  background: white;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #e9ecef;
  white-space: nowrap;
}

.x-axis-label {
  font-size: 14px;
  color: #666;
  margin-top: 8px;
  text-align: center;
  width: 100%;
}

/* 饼图样式（多扇形 + 引导线） */
.pie-chart-container {
  display: flex;
  align-items: center;
  gap: 40px;
  width: 100%;
  justify-content: center;
}
.pie-chart {
  position: relative;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
.pie-segment {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    from calc(var(--start) * 3.6deg),
    var(--color) 0deg,
    var(--color) calc(var(--percentage) * 3.6deg),
    transparent calc(var(--percentage) * 3.6deg),
    transparent 360deg
  );
  mask: radial-gradient(circle at center, transparent 50%, black 51%);
}
.connector-line {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 70px;
  height: 2px;
  background: #1a1a1a;
  transform-origin: left center;
  transform: rotate(calc(var(--angle) * 1deg)) translateY(-50%);
  z-index: 1;
  pointer-events: none;
}
.pie-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 4px white;
  z-index: 2;
}
.pie-value {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
}
.pie-label {
  font-size: 14px;
  color: #666;
}
.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 120px;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}
.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}
.legend-label {
  color: #666;
  font-weight: 500;
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

/* 快速操作面板 */
.quick-actions {
  /* 原有样式已被外层 card-section 覆盖 */
}
.quick-actions .section-header {
  margin-bottom: 24px;
}
.quick-actions .section-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  line-height: 1.2;
}
.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}
.action-btn {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  min-height: 120px;
}
.action-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #007bff;
}
.action-btn.primary {
  background: linear-gradient(135deg, #007bff, #66b3ff);
  color: white;
  border-color: #007bff;
}
.action-btn.primary:hover {
  background: linear-gradient(135deg, #0056b3, #4d94ff);
}
.action-icon {
  font-size: 32px;
  line-height: 1;
}
.action-text {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .card-section {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 0 16px;
  }
  .card-section {
    padding: 16px;
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
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  .navigation-grid {
    grid-template-columns: 1fr;
  }
  .visualization-grid {
    grid-template-columns: 1fr;
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