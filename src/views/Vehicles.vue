<template>
  <div class="vehicles">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">车辆管理</h1>
        <p class="page-subtitle">实时监控和管理所有电动车辆状态</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" @click="refreshVehicles">
          <span class="btn-icon">🔄</span>
          刷新数据
        </button>
        <button class="btn btn-secondary" @click="showControlPanel = !showControlPanel">
          <span class="btn-icon">⚙️</span>
          {{ showControlPanel ? '隐藏控制' : '显示控制' }}
        </button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon">🚗</div>
        <div class="stat-content">
          <div class="stat-value">{{ totalVehicles }}</div>
          <div class="stat-label">总车辆数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🟢</div>
        <div class="stat-content">
          <div class="stat-value">{{ onlineVehicles }}</div>
          <div class="stat-label">在线车辆</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🔴</div>
        <div class="stat-content">
          <div class="stat-value">{{ offlineVehicles }}</div>
          <div class="stat-label">离线车辆</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⚠️</div>
        <div class="stat-content">
          <div class="stat-value">{{ alertVehicles }}</div>
          <div class="stat-label">报警车辆</div>
        </div>
      </div>
    </div>

    <!-- 控制面板 -->
    <div v-if="showControlPanel" class="control-panel">
      <div class="panel-header">
        <h3>车辆控制面板</h3>
        <span class="selected-vehicle">
          {{ selectedVehicle ? `已选择: ${selectedVehicle}` : '请选择车辆' }}
        </span>
      </div>
      <div class="control-actions">
        <button class="btn btn-warning" @click="controlLights(selectedVehicle)" :disabled="!selectedVehicle">
          <span class="btn-icon">💡</span>
          闪灯控制
        </button>
        <button class="btn btn-danger" @click="controlHorn(selectedVehicle)" :disabled="!selectedVehicle">
          <span class="btn-icon">📢</span>
          鸣笛控制
        </button>
      </div>
    </div>

    <!-- 车辆列表 -->
    <div class="vehicles-container">
      <div class="section-header">
        <h3>车辆列表</h3>
        <div class="filter-controls">
          <button class="filter-btn" :class="{ active: filterStatus === 'all' }" @click="filterStatus = 'all'">
            全部 ({{ totalVehicles }})
          </button>
          <button class="filter-btn" :class="{ active: filterStatus === 'online' }" @click="filterStatus = 'online'">
            在线 ({{ onlineVehicles }})
          </button>
          <button class="filter-btn" :class="{ active: filterStatus === 'offline' }" @click="filterStatus = 'offline'">
            离线 ({{ offlineVehicles }})
          </button>
        </div>
      </div>

      <div class="vehicles-grid">
        <div v-for="vehicle in filteredVehicles" :key="vehicle.vid" 
             class="vehicle-card"
             :class="{ 
               online: vehicle.online, 
               offline: !vehicle.online,
               selected: selectedVehicle === vehicle.vid,
               'has-alerts': vehicle.alerts && vehicle.alerts.length > 0
             }"
             @click="selectVehicle(vehicle.vid)">
          
          <!-- 车辆头部 -->
          <div class="card-header">
            <div class="vehicle-info">
              <span class="vehicle-id">{{ vehicle.vid }}</span>
              <span class="status-badge" :class="{ online: vehicle.online }">
                {{ vehicle.online ? '在线' : '离线' }}
              </span>
            </div>
            <div class="vehicle-actions">
              <span v-if="vehicle.alerts && vehicle.alerts.length > 0" class="alert-indicator">
                ⚠️ {{ vehicle.alerts.length }}
              </span>
            </div>
          </div>

          <!-- 车辆详情 -->
          <div class="card-body">
            <div class="info-grid">
              <div class="info-item">
                <label>电池编号</label>
                <span class="info-value">{{ vehicle.pid || '未安装' }}</span>
              </div>
              <div class="info-item">
                <label>电池电压</label>
                <span class="info-value">{{ vehicle.voltage ? vehicle.voltage + 'V' : '--' }}</span>
              </div>
              <div class="info-item">
                <label>电池温度</label>
                <span class="info-value">{{ vehicle.temperature ? vehicle.temperature + '°C' : '--' }}</span>
              </div>
              <div class="info-item">
                <label>剩余电量</label>
                <span class="battery-level" :class="getBatteryLevelClass(vehicle.batteryLevel)">
                  {{ vehicle.batteryLevel ? vehicle.batteryLevel + '%' : '--' }}
                </span>
              </div>
            </div>
          </div>

          <!-- 报警信息 -->
          <div v-if="vehicle.alerts && vehicle.alerts.length > 0" class="card-footer">
            <div class="alerts-list">
              <div v-for="alert in vehicle.alerts.slice(0, 2)" :key="alert.id" class="alert-item">
                <span class="alert-icon">⚠️</span>
                <span class="alert-text">{{ getAlertText(alert) }}</span>
              </div>
              <div v-if="vehicle.alerts.length > 2" class="alert-more">
                还有 {{ vehicle.alerts.length - 2 }} 条报警
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredVehicles.length === 0" class="empty-state">
        <div class="empty-icon">🚗</div>
        <div class="empty-text">暂无车辆数据</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useApiVehicleStore } from '../store/modules/apiVehicleStore'
import { vehicleAPI, alertAPI, createWebSocket } from '../services/api'

const vehicleStore = useApiVehicleStore()
const showControlPanel = ref(false)
const selectedVehicle = ref(null)
const alerts = ref([])
const filterStatus = ref('all')

const vehicles = computed(() => {
  return vehicleStore.vehicles.map(vehicle => ({
    ...vehicle,
    alerts: alerts.value.filter(alert => alert.vid === vehicle.vid && !alert.resolved)
  }))
})

// 计算属性
const totalVehicles = computed(() => vehicles.value.length)
const onlineVehicles = computed(() => vehicles.value.filter(v => v.online).length)
const offlineVehicles = computed(() => vehicles.value.filter(v => !v.online).length)
const alertVehicles = computed(() => vehicles.value.filter(v => v.alerts && v.alerts.length > 0).length)

const filteredVehicles = computed(() => {
  switch (filterStatus.value) {
    case 'online':
      return vehicles.value.filter(v => v.online)
    case 'offline':
      return vehicles.value.filter(v => !v.online)
    default:
      return vehicles.value
  }
})

const getBatteryLevelClass = (level) => {
  if (!level) return 'unknown'
  if (level > 50) return 'high'
  if (level > 20) return 'medium'
  return 'low'
}

const getLightStatusText = (status) => {
  const statusMap = {
    off: '关闭',
    lowBeam: '近光灯',
    highBeam: '远光灯'
  }
  return statusMap[status] || '未知'
}

const getAlertText = (alert) => {
  const alertMap = {
    temperature: '电池温度异常',
    lowBattery: '电池电量过低',
    unreachable: '无法到达换电站'
  }
  return alertMap[alert.type] || alert.message || '未知报警'
}

const selectVehicle = (vid) => {
  selectedVehicle.value = vid
}

const refreshVehicles = async () => {
  try {
    await vehicleStore.fetchVehicles()
    await fetchAlerts()
  } catch (error) {
    console.error('刷新数据失败:', error)
  }
}

const fetchAlerts = async () => {
  try {
    const response = await alertAPI.getAlerts({ resolved: false })
    if (response.code === 200) {
      alerts.value = response.data
    }
  } catch (error) {
    console.error('获取报警数据失败:', error)
  }
}

const controlLights = async (vid) => {
  if (vid) {
    try {
      await vehicleStore.controlVehicleLights(vid, 'flash')
      alert('闪灯指令发送成功')
    } catch (error) {
      alert('指令发送失败: ' + error.message)
    }
  }
}

const controlHorn = async (vid) => {
  if (vid) {
    try {
      await vehicleStore.controlVehicleHorn(vid, 'beep')
      alert('鸣笛指令发送成功')
    } catch (error) {
      alert('指令发送失败: ' + error.message)
    }
  }
}

onMounted(async () => {
  await refreshVehicles()
  // 启动实时数据更新
  vehicleStore.startRealTimeUpdates()
})
</script>

<style scoped>
.vehicles {
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

.btn-secondary {
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
}

.btn-warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.btn-danger {
  background: linear-gradient(135deg, #f78ca0 0%, #f9748f 100%);
  color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-icon {
  font-size: 16px;
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

/* 控制面板 */
.control-panel {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.panel-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.selected-vehicle {
  color: #666;
  font-size: 14px;
}

.control-actions {
  display: flex;
  gap: 12px;
}

/* 车辆容器 */
.vehicles-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
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

.filter-controls {
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

/* 车辆网格 */
.vehicles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.vehicle-card {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.vehicle-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.vehicle-card.selected {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.vehicle-card.online {
  border-left: 4px solid #28a745;
}

.vehicle-card.offline {
  border-left: 4px solid #dc3545;
}

.vehicle-card.has-alerts {
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

.vehicle-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.vehicle-id {
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

.status-badge.online {
  background: #d4edda;
  color: #155724;
}

.status-badge:not(.online) {
  background: #f8d7da;
  color: #721c24;
}

.alert-indicator {
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

/* 卡片底部 */
.card-footer {
  padding: 16px 20px;
  background: #fff3cd;
  border-top: 1px solid #ffeaa7;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.alert-icon {
  font-size: 14px;
}

.alert-text {
  color: #856404;
  flex: 1;
}

.alert-more {
  font-size: 11px;
  color: #666;
  text-align: center;
  margin-top: 4px;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .vehicles {
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
  
  .vehicles-grid {
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
  
  .control-actions {
    flex-direction: column;
  }
}

.control-panel {
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.control-actions {
  display: flex;
  gap: 10px;
}

.vehicles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.vehicle-card {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.vehicle-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.vehicle-card.selected {
  border-color: #3498db;
}

.vehicle-card.online {
  border-left: 4px solid #27ae60;
}

.vehicle-card:not(.online) {
  border-left: 4px solid #95a5a6;
  opacity: 0.7;
}

.vehicle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.vehicle-id {
  font-weight: bold;
  font-size: 16px;
}

.status-indicator {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: white;
}

.status-indicator.online {
  background: #27ae60;
}

.status-indicator:not(.online) {
  background: #95a5a6;
}

.vehicle-info {
  margin-bottom: 10px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 14px;
}

.info-item label {
  color: #7f8c8d;
}

.battery-level.high {
  color: #27ae60;
}

.battery-level.medium {
  color: #f39c12;
}

.battery-level.low {
  color: #e74c3c;
  font-weight: bold;
}

.battery-level.unknown {
  color: #95a5a6;
}

.alerts {
  border-top: 1px solid #ecf0f1;
  padding-top: 10px;
}

.alert {
  background: #fff3cd;
  color: #856404;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 5px;
}
</style>