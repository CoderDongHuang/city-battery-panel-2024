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
          <div class="chart-container" @click="openChartModal('vehicleTrend')">
            <div class="fixed-bar-chart">
              <div class="bars-wrapper">
                <div v-for="(item, index) in barData" :key="index" class="bar-item">
                  <div class="bar-fill" :style="{ height: item.percent + '%' }"></div>
                  <div class="bar-value">{{ item.value }}%</div>
                </div>
              </div>
              <div class="x-axis">
                <span v-for="(label, idx) in weekDays" :key="idx">{{ label }}</span>
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
          <div class="chart-container" @click="openChartModal('batteryStatus')">
            <div class="fixed-pie-container">
              <canvas ref="batteryPieCanvas" width="600" height="600" style="width: 100%; max-width: 400px; height: auto; aspect-ratio: 1/1;"></canvas>
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

    <!-- 图表放大模态框 -->
    <div v-if="showChartModal" class="chart-modal-overlay" @click="closeChartModal">
      <div class="chart-modal-content" @click.stop>
        <div class="chart-modal-header">
          <h3>{{ getChartModalTitle() }}</h3>
          <button class="chart-modal-close" @click="closeChartModal">×</button>
        </div>
        
        <div class="chart-modal-body">
          <!-- 车辆运营趋势图放大版 -->
          <div v-if="currentChartType === 'vehicleTrend'" class="enlarged-chart">
            <div class="chart-container-large">
              <div class="fixed-bar-chart-large">
                <div class="bars-wrapper-large">
                  <div v-for="(item, index) in barData" :key="index" class="bar-item-large">
                    <div class="bar-fill-large" :style="{ height: item.percent + '%' }"></div>
                    <div class="bar-value-large">{{ item.value }}%</div>
                  </div>
                </div>
                <div class="x-axis-large">
                  <span v-for="(label, idx) in weekDays" :key="idx">{{ label }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 电池状态分布图放大版 -->
          <div v-if="currentChartType === 'batteryStatus'" class="enlarged-chart">
            <div class="chart-container-large">
              <div class="fixed-pie-container-large">
                <canvas ref="batteryPieCanvasLarge" width="800" height="800" style="width: 100%; max-width: 600px; height: auto; aspect-ratio: 1/1;"></canvas>
              </div>
            </div>
          </div>
        </div>
        
        <div class="chart-modal-footer">
          <button class="btn btn-primary" @click="closeChartModal">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
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
    
    // 计算属性 - 使用实际store数据
    const availableBatteriesCount = computed(() => batteryStore.availableBatteries)
    const inUseBatteriesCount = computed(() => batteryStore.inUseBatteries)
    const urgentAlertsCount = computed(() => 0) // 暂时设为0，后续可从报警store获取
    const resolvedAlertsCount = computed(() => 0) // 暂时设为0，后续可从报警store获取
    const activeStationsCount = computed(() => 0) // 暂时设为0，后续可从充电站API获取
    const maintenanceStationsCount = computed(() => 0) // 暂时设为0，后续可从充电站API获取
    
    const currentTime = computed(() => {
      return new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    })
    
    // 柱状图数据
    const barData = ref([
      { value: 80, percent: 80 },
      { value: 60, percent: 60 },
      { value: 90, percent: 90 },
      { value: 70, percent: 70 },
      { value: 85, percent: 85 },
      { value: 75, percent: 75 },
      { value: 95, percent: 95 }
    ])
    const weekDays = ['一', '二', '三', '四', '五', '六', '日']
    
    const loadData = () => {
      // 使用实际store数据
      if (vehicleStore.vehicles.length > 0) {
        onlineVehiclesCount.value = vehicleStore.vehicles.filter(v => v.status === 'online').length
      }
      if (batteryStore.batteries.length > 0) {
        totalBatteriesCount.value = batteryStore.batteries.length
      }
      
      // 报警和充电站数据暂时设为0，后续可从相应API获取
      activeAlertsCount.value = 0
      chargingStationsCount.value = 0
    }
    
    const refreshData = () => {
      loadData()
      console.log('数据已刷新')
    }
    
    // 饼图绘制（右上角图例，无引导线）
    const batteryPieCanvas = ref(null)
    const batteryPieCanvasLarge = ref(null)
    
    // 图表放大相关状态
    const showChartModal = ref(false)
    const currentChartType = ref('')
    
    // 打开图表模态框
    const openChartModal = (chartType) => {
      currentChartType.value = chartType
      showChartModal.value = true
      
      // 如果是电池状态饼图，需要重新绘制放大版的饼图
      if (chartType === 'batteryStatus') {
        nextTick(() => {
          drawBatteryPie(true)
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
        vehicleTrend: '车辆运营趋势 - 放大视图',
        batteryStatus: '电池状态分布 - 放大视图'
      }
      return titles[currentChartType.value] || '图表详情'
    }
    
    const drawBatteryPie = (isLarge = false) => {
      const canvas = isLarge ? batteryPieCanvasLarge.value : batteryPieCanvas.value
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      const size = canvas.width   // 普通模式600，放大模式800
      const centerX = size / 2
      const centerY = size / 2
      const radius = isLarge ? size * 0.35 : size * 0.28   // 放大模式半径更大
      
      const data = [
        { label: '良好', percent: 60, color: '#28a745' },
        { label: '一般', percent: 25, color: '#ffc107' },
        { label: '需维护', percent: 15, color: '#dc3545' }
      ]
      
      let startAngle = -Math.PI / 2
      ctx.clearRect(0, 0, size, size)
      
      // 绘制扇形
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        const angle = (item.percent / 100) * Math.PI * 2
        const endAngle = startAngle + angle
        
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, startAngle, endAngle)
        ctx.closePath()
        ctx.fillStyle = item.color
        ctx.fill()
        
        startAngle = endAngle
      }
      
      // 绘制图例（放大模式下调整位置和字体大小）
      const legendX = size - (isLarge ? 40 : 20)
      const legendY = isLarge ? 40 : 20
      const itemHeight = isLarge ? 28 : 24
      const itemSpacing = isLarge ? 12 : 8
      const fontSize = isLarge ? '16px' : '14px'
      
      ctx.font = `${fontSize} "Segoe UI", "PingFang SC"`
      ctx.textAlign = 'right'
      ctx.textBaseline = 'middle'
      
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        const y = legendY + i * (itemHeight + itemSpacing)
        
        // 色块
        ctx.fillStyle = item.color
        ctx.fillRect(legendX - 20, y - 8, 14, 14)
        
        // 文字
        ctx.fillStyle = '#333'
        ctx.fillText(`${item.label} ${item.percent}%`, legendX - 28, y)
      }
    }
    
    onMounted(() => {
      loadData()
      nextTick(() => {
        drawBatteryPie()
        window.addEventListener('resize', drawBatteryPie)
      })
    })
    
    onUnmounted(() => {
      window.removeEventListener('resize', drawBatteryPie)
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
      refreshData,
      barData,
      weekDays,
      batteryPieCanvas,
      batteryPieCanvasLarge,
      showChartModal,
      currentChartType,
      openChartModal,
      closeChartModal,
      getChartModalTitle
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
  overflow: visible;
}

/* 修复后的柱状图样式 - 底部对齐，数值在上方 */
.fixed-bar-chart {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.bars-wrapper {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: calc(100% - 30px);
  gap: 16px;
  margin-bottom: 12px;
}
.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  position: relative;
}
.bar-fill {
  width: 100%;
  background: linear-gradient(to top, #007bff, #66b3ff);
  border-radius: 6px 6px 0 0;
  transition: height 0.3s ease;
  min-height: 4px;
}
.bar-value {
  margin-top: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #007bff;
  background: white;
  padding: 2px 6px;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  white-space: nowrap;
}
.x-axis {
  display: flex;
  justify-content: space-around;
  gap: 16px;
  font-size: 14px;
  color: #666;
  text-align: center;
  border-top: 1px solid #e9ecef;
  padding-top: 8px;
}
.x-axis span {
  flex: 1;
  text-align: center;
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

/* 图表放大模态框样式 - 与Batteries.vue保持一致 */
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

/* 柱状图放大版样式 */
.fixed-bar-chart-large {
  width: 100%;
  max-width: 800px;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
}

.bars-wrapper-large {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 100%;
  gap: 20px;
}

.bar-item-large {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  max-width: 80px;
  height: 100%;
  justify-content: flex-end;
}

.bar-fill-large {
  width: 60px;
  background: linear-gradient(180deg, #007bff, #66b3ff);
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
  min-height: 20px;
  /* 高度由Vue动态设置 */
}

.bar-value-large {
  margin-top: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #007bff;
}

.x-axis-large {
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e9ecef;
}

.x-axis-large span {
  font-size: 14px;
  color: #666;
  flex: 1;
  text-align: center;
}

/* 饼图放大版样式 */
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

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* 模态框按钮样式 */
.chart-modal-btn {
  padding: 12px 32px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.chart-modal-btn:hover {
  background: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
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
  
  .fixed-bar-chart-large {
    height: 300px;
  }
  
  .bars-wrapper-large {
    gap: 10px;
  }
  
  .bar-item-large {
    max-width: 60px;
  }
  
  .bar-fill-large {
    width: 40px;
  }
}
</style>