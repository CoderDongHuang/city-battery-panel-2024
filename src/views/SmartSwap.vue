<template>
  <div class="smart-swap-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-wrapper">
          <h1 class="page-title">智能换电</h1>
          <button class="refresh-btn" @click="refreshAllData" :disabled="isRefreshing" title="刷新数据">
            <span :class="{ 'spinning': isRefreshing }">🔄</span>
          </button>
        </div>
        <p class="page-subtitle">实时监控电池电量，智能推荐换电站，AI 预测用电趋势</p>
      </div>
    </div>

    <!-- 核心功能区域 -->
    <div class="smart-swap-section">
      <!-- 电池电量监控 -->
      <div class="battery-monitor-card">
        <div class="card-header">
          <div class="card-icon">🔋</div>
          <h2>电池电量监控</h2>
        </div>
        <div class="card-body">
          <div v-if="loadingBatteries" class="loading-state">
            <div class="loading-spinner">🔄</div>
            <p>加载电池数据...</p>
          </div>
          
          <div v-else-if="batteries.length === 0" class="empty-state">
            <div class="empty-icon">🔋</div>
            <h3>暂无电池</h3>
            <p>您还没有绑定任何电池</p>
          </div>
          
          <div v-else class="battery-list">
            <div 
              v-for="battery in batteries" 
              :key="battery.id"
              class="battery-item"
              :class="getBatteryLevelClass(battery.level || battery.soc || 0)"
            >
              <div class="battery-info">
                <div class="battery-header">
                  <span class="battery-id">{{ battery.id || battery.batteryId }}</span>
                  <span class="battery-status" :class="battery.status">
                    {{ getBatteryStatusText(battery.status) }}
                  </span>
                </div>
                <div class="battery-level-display">
                  <div class="level-bar">
                    <div 
                      class="level-fill" 
                      :class="getBatteryLevelClass(battery.level || battery.soc || 0)"
                      :style="{ width: (battery.level || battery.soc || 0) + '%' }"
                    ></div>
                  </div>
                  <span class="level-text">{{ battery.level || battery.soc || 0 }}%</span>
                </div>
                <div class="battery-details">
                  <span class="detail-item">
                    <span class="detail-label">续航：</span>
                    <span class="detail-value">{{ estimateRange(battery.level || battery.soc || 0) }} km</span>
                  </span>
                  <span class="detail-item">
                    <span class="detail-label">健康度：</span>
                    <span class="detail-value">{{ battery.health || battery.soh || 95 }}%</span>
                  </span>
                </div>
                <div v-if="(battery.level || battery.soc || 0) <= 20" class="low-battery-warning">
                  ⚠️ 电量过低，建议尽快换电
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 智能推荐换电站 -->
      <div class="recommend-card" v-if="showRecommendation">
        <div class="card-header">
          <div class="card-icon">🎯</div>
          <h2>智能推荐</h2>
        </div>
        <div class="card-body">
          <div class="recommend-station">
            <div class="station-header">
              <h3>推荐换电站</h3>
              <span class="recommend-badge">最佳选择</span>
            </div>
            <div class="station-info">
              <div class="station-name">{{ recommendedStation?.name }}</div>
              <div class="station-address">📍 {{ recommendedStation?.address }}</div>
              <div class="station-stats">
                <div class="stat">
                  <span class="stat-label">距离</span>
                  <span class="stat-value">{{ recommendedStation?.distance?.toFixed(2) || 0 }} km</span>
                </div>
                <div class="stat">
                  <span class="stat-label">可用电池</span>
                  <span class="stat-value">{{ recommendedStation?.availableBatteries || 0 }}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">状态</span>
                  <span class="stat-value" :class="recommendedStation?.status">
                    {{ getStationStatusText(recommendedStation?.status) }}
                  </span>
                </div>
              </div>
            </div>
            <div class="station-actions">
              <button class="action-btn primary" @click="navigateToStation">
                🚀 开始导航
              </button>
              <button class="action-btn secondary" @click="reserveBattery">
                📱 预约电池
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 电池趋势预测 -->
      <div class="prediction-card">
        <div class="card-header">
          <div class="card-icon">📊</div>
          <h2>电池趋势预测</h2>
          <span class="ai-badge">AI 预测</span>
        </div>
        <div class="card-body">
          <div v-if="loadingPrediction" class="loading-state">
            <div class="loading-spinner">🤖</div>
            <p>AI 模型分析中...</p>
          </div>
          
          <div v-else class="prediction-content">
            <div class="prediction-chart">
              <div class="chart-container">
                <svg viewBox="0 0 400 200" class="prediction-svg">
                  <!-- 背景网格 -->
                  <line v-for="i in 5" :key="'h' + i" 
                    :x1="0" :y1="i * 40" :x2="400" :y2="i * 40" 
                    class="grid-line" />
                  <line v-for="i in 10" :key="'v' + i" 
                    :x1="i * 40" :y1="0" :x2="i * 40" :y2="200" 
                    class="grid-line" />
                  
                  <!-- 预测曲线 -->
                  <polyline
                    :points="predictionLinePoints"
                    class="prediction-line"
                    fill="none"
                  />
                  
                  <!-- 数据点 -->
                  <circle
                    v-for="(point, index) in predictionData"
                    :key="index"
                    :cx="index * 57.14"
                    :cy="200 - (point.value * 2)"
                    class="data-point"
                    :class="{ 'current-point': index === predictionData.length - 1 }"
                  />
                </svg>
              </div>
            </div>
            
            <div class="prediction-info">
              <div class="info-row">
                <span class="info-label">当前电量：</span>
                <span class="info-value">{{ currentBatteryLevel }}%</span>
              </div>
              <div class="info-row">
                <span class="info-label">预计耗尽：</span>
                <span class="info-value warning">{{ predictedDepletionTime }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">建议换电时间：</span>
                <span class="info-value success">{{ suggestedSwapTime }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">AI 分析：</span>
                <p class="ai-analysis">{{ aiAnalysis }}</p>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userBatteryAPI } from '../services/userAPI.js'
import { userStationAPI } from '../services/userAPI.js'
import SiteFooter from '../components/SiteFooter.vue'

const router = useRouter()

// 刷新状态
const isRefreshing = ref(false)

// 电池数据
const batteries = ref([])
const loadingBatteries = ref(false)

// 推荐换电站
const showRecommendation = ref(false)
const recommendedStation = ref(null)

// 预测数据
const loadingPrediction = ref(false)
const predictionData = ref([])
const currentBatteryLevel = ref(0)
const predictedDepletionTime = ref('')
const suggestedSwapTime = ref('')
const aiAnalysis = ref('')

// 计算属性：预测曲线点
const predictionLinePoints = computed(() => {
  if (predictionData.value.length === 0) return ''
  return predictionData.value
    .map((point, index) => `${index * 57.14},${200 - (point.value * 2)}`)
    .join(' ')
})

// 刷新所有数据
const refreshAllData = async () => {
  isRefreshing.value = true
  await Promise.all([
    loadBatteries(),
    loadPrediction(),
    loadNearbyStations()
  ])
  isRefreshing.value = false
}

// 加载电池数据
const loadBatteries = async () => {
  loadingBatteries.value = true
  try {
    const response = await userBatteryAPI.getBatteries()
    console.log('电池数据:', response)
    
    if (response.code === 200) {
      batteries.value = response.data || []
      
      // 计算平均电量
      if (batteries.value.length > 0) {
        const avgLevel = batteries.value.reduce((sum, b) => sum + (b.level || b.soc || 0), 0) / batteries.value.length
        currentBatteryLevel.value = Math.round(avgLevel)
        
        // 如果电量低，显示推荐
        if (avgLevel <= 30) {
          await loadNearbyStations()
        }
      }
    }
  } catch (error) {
    console.error('加载电池数据失败:', error)
  } finally {
    loadingBatteries.value = false
  }
}

// 加载附近换电站
const loadNearbyStations = async () => {
  try {
    const response = await userStationAPI.getStations()
    console.log('换电站数据:', response)
    
    if (response.code === 200) {
      const stations = response.data || []
      
      // 过滤出运营中的站点
      const activeStations = stations.filter(s => s.status === 'active')
      
      if (activeStations.length > 0) {
        // 简单排序：选择可用电池最多的站点
        const sorted = activeStations.sort((a, b) => 
          (b.availableBatteries || 0) - (a.availableBatteries || 0)
        )
        
        recommendedStation.value = {
          ...sorted[0],
          distance: (Math.random() * 5 + 1).toFixed(2) // 模拟距离
        }
        showRecommendation.value = true
      }
    }
  } catch (error) {
    console.error('加载换电站失败:', error)
  }
}

// 加载预测数据
const loadPrediction = async () => {
  loadingPrediction.value = true
  try {
    // 模拟 AI 预测数据
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const now = new Date()
    const currentLevel = currentBatteryLevel.value || 50
    
    // 生成预测数据（未来 7 小时）
    predictionData.value = []
    for (let i = 0; i < 7; i++) {
      const hour = new Date(now.getTime() + i * 60 * 60 * 1000)
      const predictedLevel = Math.max(0, currentLevel - (i * 8) - (Math.random() * 5))
      
      predictionData.value.push({
        time: hour.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        value: Math.round(predictedLevel)
      })
    }
    
    // 计算预测耗尽时间
    const hoursUntilEmpty = Math.floor(currentLevel / 8)
    const depletionTime = new Date(now.getTime() + hoursUntilEmpty * 60 * 60 * 1000)
    predictedDepletionTime.value = depletionTime.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
    
    // 建议换电时间（电量低于 20% 时）
    const hoursUntilLow = Math.floor((currentLevel - 20) / 8)
    const suggestedTime = new Date(now.getTime() + Math.max(0, hoursUntilLow) * 60 * 60 * 1000)
    suggestedSwapTime.value = suggestedTime.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
    
    // AI 分析文案
    generateAIAnalysis(currentLevel)
    
  } catch (error) {
    console.error('加载预测数据失败:', error)
  } finally {
    loadingPrediction.value = false
  }
}

// 生成 AI 分析
const generateAIAnalysis = (currentLevel) => {
  if (currentLevel <= 20) {
    aiAnalysis.value = '您的电池电量严重不足，预计将在短时间内耗尽。建议立即前往最近的换电站进行更换，以免影响行程。'
  } else if (currentLevel <= 40) {
    aiAnalysis.value = '电池电量偏低，根据您的用电习惯，预计在未来几小时内需要换电。建议提前规划换电行程。'
  } else if (currentLevel <= 60) {
    aiAnalysis.value = '电池电量适中，可支持正常使用。建议关注电量变化，适时安排换电。'
  } else {
    aiAnalysis.value = '电池电量充足，可支持长时间使用。AI 模型将持续监控您的用电趋势。'
  }
}

// 加载换电记录
const loadSwapHistory = async () => {
  loadingHistory.value = true
  try {
    // TODO: 调用后端 API 获取换电记录
    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 500))
    
    swapHistory.value = [
      {
        id: 1,
        swapTime: '2024-01-15 14:30:00',
        stationName: '市中心换电站',
        beforeLevel: 15,
        afterLevel: 95
      },
      {
        id: 2,
        swapTime: '2024-01-10 09:15:00',
        stationName: '科技园换电站',
        beforeLevel: 22,
        afterLevel: 88
      }
    ]
  } catch (error) {
    console.error('加载换电记录失败:', error)
  } finally {
    loadingHistory.value = false
  }
}

// 辅助函数
const getBatteryLevelClass = (level) => {
  if (level <= 20) return 'low'
  if (level <= 50) return 'medium'
  return 'high'
}

const getBatteryStatusText = (status) => {
  const statusMap = {
    'available': '可用',
    'in_use': '使用中',
    'charging': '充电中',
    'fault': '故障'
  }
  return statusMap[status] || status
}

const getStationStatusText = (status) => {
  const statusMap = {
    'active': '运营中',
    'offline': '已关闭',
    'maintenance': '维护中'
  }
  return statusMap[status] || status
}

const estimateRange = (level) => {
  // 假设满电续航 450km
  return Math.round(level * 4.5)
}

const navigateToStation = () => {
  if (recommendedStation.value) {
    alert(`开始导航到：${recommendedStation.value.name}`)
    // TODO: 集成地图导航
  }
}

const reserveBattery = () => {
  if (recommendedStation.value) {
    alert(`预约成功！将在 30 分钟内为您保留电池`)
    // TODO: 调用预约 API
  }
}

// 生命周期
onMounted(() => {
  loadBatteries()
  loadPrediction()
})
</script>

<style scoped>
.smart-swap-page {
  width: 100%;
  padding: 24px;
}

.page-header {
  margin-bottom: 32px;
  text-align: center;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.page-title {
  font-size: 32px;
  font-weight: bold;
  color: #1a1a1a;
  margin: 0;
}

.refresh-btn {
  padding: 8px 12px;
  background: white;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s;
}

.refresh-btn:hover {
  border-color: #667eea;
  background: #f0f5ff;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinning {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.page-subtitle {
  font-size: 16px;
  color: #666;
}

.smart-swap-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.battery-monitor-card,
.recommend-card,
.prediction-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.card-icon {
  font-size: 28px;
}

.card-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

.ai-badge {
  margin-left: auto;
  padding: 4px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.card-body {
  min-height: 200px;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}

.loading-spinner {
  font-size: 40px;
  margin-bottom: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 18px;
  color: #666;
  margin-bottom: 8px;
}

.empty-state p {
  color: #999;
  font-size: 14px;
}

/* 电池列表 */
.battery-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.battery-item {
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s;
}

.battery-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.battery-item.low {
  border-color: #ff4d4f;
  background: #fff1f0;
}

.battery-item.medium {
  border-color: #faad14;
  background: #fffbe6;
}

.battery-item.high {
  border-color: #52c41a;
  background: #f6ffed;
}

.battery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.battery-id {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.battery-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.battery-status.available {
  background: #f6ffed;
  color: #52c41a;
}

.battery-status.in_use {
  background: #e6f7ff;
  color: #1890ff;
}

.battery-status.charging {
  background: #fff7e6;
  color: #fa8c16;
}

.battery-status.fault {
  background: #fff1f0;
  color: #ff4d4f;
}

.level-bar {
  height: 12px;
  background: #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
}

.level-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.3s;
}

.level-fill.low {
  background: linear-gradient(90deg, #ff4d4f, #ff7875);
}

.level-fill.medium {
  background: linear-gradient(90deg, #faad14, #ffd666);
}

.level-fill.high {
  background: linear-gradient(90deg, #52c41a, #95de64);
}

.level-text {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.battery-details {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.detail-item {
  font-size: 13px;
  color: #666;
}

.detail-label {
  color: #999;
}

.detail-value {
  font-weight: 500;
  color: #1a1a1a;
}

.low-battery-warning {
  margin-top: 12px;
  padding: 8px;
  background: #fff1f0;
  border-left: 3px solid #ff4d4f;
  color: #ff4d4f;
  font-size: 13px;
  font-weight: 500;
}

/* 推荐换电站 */
.recommend-station {
  padding: 8px;
}

.station-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.station-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.recommend-badge {
  padding: 4px 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.station-name {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.station-address {
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
}

.station-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat {
  text-align: center;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.stat-value.active {
  color: #52c41a;
}

.station-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.action-btn.secondary {
  background: #f0f0f0;
  color: #1a1a1a;
}

.action-btn.secondary:hover {
  background: #e0e0e0;
}

/* 预测图表 */
.prediction-chart {
  margin-bottom: 20px;
}

.chart-container {
  width: 100%;
  height: 200px;
  background: #fafafa;
  border-radius: 8px;
  padding: 16px;
}

.prediction-svg {
  width: 100%;
  height: 100%;
}

.grid-line {
  stroke: #e8e8e8;
  stroke-width: 1;
}

.prediction-line {
  stroke: #667eea;
  stroke-width: 3;
  fill: none;
}

.data-point {
  fill: #667eea;
  r: 5;
}

.current-point {
  fill: #ff4d4f;
  r: 7;
}

.prediction-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.info-label {
  font-size: 14px;
  color: #666;
  min-width: 100px;
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.info-value.warning {
  color: #ff4d4f;
}

.info-value.success {
  color: #52c41a;
}

.ai-analysis {
  flex: 1;
  padding: 12px;
  background: #f0f5ff;
  border-left: 3px solid #667eea;
  border-radius: 4px;
  font-size: 13px;
  color: #1a1a1a;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .smart-swap-section {
    grid-template-columns: 1fr;
  }
  
  .station-stats {
    grid-template-columns: 1fr;
  }
  
  .station-actions {
    flex-direction: column;
  }
}

/* ==================== 深色模式适配 ==================== */
/* 注意：页面背景保持不变，只调整卡片和文字颜色 */

/* 页面标题文字 */
:root.dark-mode .page-title,
.dark-mode .page-title {
  color: #333333;
}

:root.dark-mode .page-subtitle,
.dark-mode .page-subtitle {
  color: #666666;
}
/* 卡片背景 */
html.dark-mode .battery-monitor-card,
html.dark-mode .recommend-card,
html.dark-mode .prediction-card {
  background: #2d2d2d;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

html.dark-mode .card-header h2 {
  color: #e0e0e0;
}

/* 刷新按钮 */
html.dark-mode .refresh-btn {
  background: #3d3d3d;
  border-color: #555555;
  color: #e0e0e0;
}

html.dark-mode .refresh-btn:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.15);
}

/* 电池卡片 */
html.dark-mode .battery-item {
  border-color: #555555;
}

html.dark-mode .battery-item.low {
  background: rgba(255, 77, 79, 0.15);
  border-color: #ff4d4f;
}

html.dark-mode .battery-item.medium {
  background: rgba(250, 173, 20, 0.15);
  border-color: #faad14;
}

html.dark-mode .battery-item.high {
  background: rgba(82, 196, 26, 0.15);
  border-color: #52c41a;
}

html.dark-mode .battery-id {
  color: #e0e0e0;
}

html.dark-mode .battery-status {
  opacity: 0.9;
}

html.dark-mode .level-bar {
  background: #3d3d3d;
}

html.dark-mode .level-text {
  color: #e0e0e0;
}

html.dark-mode .detail-label {
  color: #999999;
}

html.dark-mode .detail-value {
  color: #e0e0e0;
}

html.dark-mode .low-battery-warning {
  background: rgba(255, 77, 79, 0.1);
  border-left-color: #ff4d4f;
  color: #ff6b6b;
}

/* 推荐换电站 */
html.dark-mode .station-name {
  color: #e0e0e0;
}

html.dark-mode .station-address {
  color: #b0b0b0;
}

html.dark-mode .stat {
  background: #3d3d3d;
}

html.dark-mode .stat-label {
  color: #999999;
}

html.dark-mode .stat-value {
  color: #e0e0e0;
}

html.dark-mode .action-btn.secondary {
  background: #3d3d3d;
  color: #e0e0e0;
}

html.dark-mode .action-btn.secondary:hover {
  background: #555555;
}

/* 预测图表 */
html.dark-mode .grid-line {
  stroke: #555555;
}

html.dark-mode .info-label {
  color: #b0b0b0;
}

html.dark-mode .info-value {
  color: #e0e0e0;
}

html.dark-mode .ai-analysis {
  background: rgba(102, 126, 234, 0.15);
  border-left-color: #667eea;
  color: #e0e0e0;
}

/* 换电记录 */
html.dark-mode .history-section {
  background: #2d2d2d;
}

html.dark-mode .section-header h2 {
  color: #e0e0e0;
}

html.dark-mode .view-all-btn {
  background: #3d3d3d;
  color: #e0e0e0;
  border-color: #555555;
}

html.dark-mode .view-all-btn:hover {
  border-color: #667eea;
}

html.dark-mode .history-item {
  border-color: #555555;
  background: #3d3d3d;
}

html.dark-mode .history-date {
  color: #b0b0b0;
}

html.dark-mode .history-station {
  color: #e0e0e0;
}

html.dark-mode .history-details {
  color: #999999;
}

/* 加载和空状态 */
html.dark-mode .loading-state,
html.dark-mode .empty-state {
  color: #b0b0b0;
}

html.dark-mode .empty-state h3 {
  color: #b0b0b0;
}

html.dark-mode .empty-state p {
  color: #999999;
}
</style>
