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
        <div class="panel-header-actions">
          <span class="selected-vehicle">
            {{ selectedVehicle ? `已选择: ${selectedVehicle}` : '请选择车辆' }}
          </span>
          <button v-if="selectedVehicle" class="btn-clear-selection" @click="clearSelection">
            清除选择
          </button>
        </div>
      </div>
      
      <!-- 完整的灯光控制组件 -->
      <div v-if="selectedVehicle" class="light-control-section">
        <VehicleLightControl :vehicle="getSelectedVehicleObject()" />
      </div>
      
      <!-- 喇叭控制组件 -->
      <div v-if="selectedVehicle" class="horn-control-section">
        <VehicleHornControl :vehicle="getSelectedVehicleObject()" />
      </div>
      
      <!-- 位置控制组件 -->
      <div v-if="selectedVehicle" class="position-control-section">
        <VehiclePositionControl :vehicle="getSelectedVehicleObject()" />
      </div>
      
      <!-- 车辆选择提示 -->
      <div v-else class="no-vehicle-selected">
        <div class="no-vehicle-icon">🚗</div>
        <div class="no-vehicle-text">请先选择要控制的车辆</div>
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

      <!-- 车辆表格 -->
      <div class="vehicles-table">
        <div class="table-header">
          <div class="col-id">车辆编号</div>
          <div class="col-source">来源</div>
          <div class="col-status">状态</div>
          <div class="col-battery">电池编号</div>
          <div class="col-voltage">电压</div>
          <div class="col-temperature">温度</div>
          <div class="col-battery-level">电量</div>
          <div class="col-alerts">报警</div>
          <div class="col-actions">操作</div>
        </div>

        <div class="table-body">
          <div v-for="vehicle in filteredVehicles" :key="vehicle.vid" 
               class="table-row"
               :class="{ 
                 online: vehicle.online, 
                 offline: !vehicle.online,
                 'has-alerts': vehicle.alerts && vehicle.alerts.length > 0,
                 'selected': selectedVehicle === vehicle.vid
               }">
            
            <div class="col-id">
              <span class="vehicle-id">{{ vehicle.name || vehicle.vid }}</span>
            </div>
            
            <div class="col-source">
              <span class="source-badge" :class="vehicle.source">
                {{ vehicle.source === 'admin' ? '管理端' : '用户端' }}
              </span>
            </div>
            
            <div class="col-status">
              <span class="status-badge" :class="{ online: vehicle.online }">
                {{ vehicle.online ? '在线' : '离线' }}
              </span>
            </div>
            
            <div class="col-battery">
              <span class="battery-id">{{ vehicle.pid || '未安装' }}</span>
            </div>
            
            <div class="col-voltage">
              <span class="voltage-value">{{ vehicle.voltage ? vehicle.voltage + 'V' : '--' }}</span>
            </div>
            
            <div class="col-temperature">
              <span class="temperature-value">{{ vehicle.temperature ? vehicle.temperature + '°C' : '--' }}</span>
            </div>
            
            <div class="col-battery-level">
              <span class="battery-level" :class="getBatteryLevelClass(vehicle.batteryLevel)">
                {{ vehicle.batteryLevel ? vehicle.batteryLevel + '%' : '--' }}
              </span>
            </div>
            
            <div class="col-alerts">
              <span v-if="vehicle.alerts && vehicle.alerts.length > 0" class="alert-indicator">
                ⚠️ {{ vehicle.alerts.length }}
              </span>
              <span v-else class="no-alerts">--</span>
            </div>
            
            <div class="col-actions">
              <button class="btn btn-small btn-primary" @click="viewVehicleDetails(vehicle)">
                查看详情
              </button>
              <button class="btn btn-small btn-success" @click="selectVehicle(vehicle)" 
                      :disabled="!vehicle.online">
                选择控制
              </button>
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

    <!-- 车辆详情模态框 -->
    <div v-if="showVehicleDetails" class="modal-overlay" @click="showVehicleDetails = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>车辆详细信息</h3>
          <button class="modal-close" @click="showVehicleDetails = false">×</button>
        </div>
        
        <div class="modal-body">
          <div v-if="selectedVehicleDetails" class="details-container">
            <!-- 基本信息表格 -->
            <div class="details-section">
              <h4>基本信息</h4>
              <div class="details-table">
                <div class="detail-row">
                  <div class="detail-label">车辆编号</div>
                  <div class="detail-value">{{ selectedVehicleDetails.name || selectedVehicleDetails.vid }}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">状态</div>
                  <div class="detail-value">
                    <span class="status-badge" :class="{ online: selectedVehicleDetails.online }">
                      {{ selectedVehicleDetails.online ? '在线' : '离线' }}
                    </span>
                  </div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">电池编号</div>
                  <div class="detail-value">{{ selectedVehicleDetails.pid || '未安装' }}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">电压</div>
                  <div class="detail-value">{{ selectedVehicleDetails.voltage ? selectedVehicleDetails.voltage + 'V' : '--' }}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">温度</div>
                  <div class="detail-value">{{ selectedVehicleDetails.temperature ? selectedVehicleDetails.temperature + '°C' : '--' }}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">剩余电量</div>
                  <div class="detail-value">
                    <span class="battery-level" :class="getBatteryLevelClass(selectedVehicleDetails.batteryLevel)">
                      {{ selectedVehicleDetails.batteryLevel ? selectedVehicleDetails.batteryLevel + '%' : '--' }}
                    </span>
                  </div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">最后更新时间</div>
                  <div class="detail-value">{{ selectedVehicleDetails.lastUpdate || '--' }}</div>
                </div>
              </div>
            </div>

            <!-- 灯光控制 -->
            <div class="details-section">
              <h4>灯光控制</h4>
              <VehicleLightControl :vehicle="selectedVehicleDetails" />
            </div>

            <!-- 喇叭控制 -->
            <div class="details-section">
              <h4>喇叭控制</h4>
              <VehicleHornControl :vehicle="selectedVehicleDetails" />
            </div>

            <!-- 位置控制 -->
            <div class="details-section">
              <h4>位置控制</h4>
              <VehiclePositionControl :vehicle="selectedVehicleDetails" />
            </div>

            <!-- 报警信息表格 -->
            <div v-if="selectedVehicleDetails.alerts && selectedVehicleDetails.alerts.length > 0" class="details-section">
              <h4>报警信息 ({{ selectedVehicleDetails.alerts.length }}条)</h4>
              <div class="alerts-table">
                <div class="table-header">
                  <div class="col-id">ID</div>
                  <div class="col-type">类型</div>
                  <div class="col-time">时间</div>
                  <div class="col-message">描述</div>
                </div>
                <div class="table-body">
                  <div v-for="alert in selectedVehicleDetails.alerts" :key="alert.id" class="table-row">
                    <div class="col-id">{{ formatAlertId(alert.id) }}</div>
                    <div class="col-type">
                      <span class="alert-type" :class="getAlertTypeClass(alert.type)">
                        {{ getAlertTypeText(alert.type) }}
                      </span>
                    </div>
                    <div class="col-time">{{ formatTime(alert.timestamp) }}</div>
                    <div class="col-message">{{ alert.message || '无描述' }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="details-section">
              <h4>报警信息</h4>
              <div class="no-alerts">暂无报警信息</div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-primary" @click="showVehicleDetails = false">关闭</button>
        </div>
      </div>
    </div>
    
    <!-- 页脚 -->
    <SiteFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useApiVehicleStore } from '../store/modules/apiVehicleStore'
import { vehicleAPI, alertAPI, createWebSocket } from '../services/api'
import { getUserVehicles } from '../services/adminUserDataService'
import VehicleLightControl from '../components/VehicleLightControl.vue'
import VehicleHornControl from '../components/VehicleHornControl.vue'
import VehiclePositionControl from '../components/VehiclePositionControl.vue'
import SiteFooter from '../components/SiteFooter.vue'

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

const getAlertTypeClass = (type) => {
  const typeMap = {
    'low_battery': 'warning',
    'high_temperature': 'danger',
    'low_voltage': 'warning',
    'offline': 'info',
    'error': 'danger'
  }
  return typeMap[type] || 'info'
}

const getAlertTypeText = (type) => {
  const typeMap = {
    'low_battery': '电量不足',
    'high_temperature': '温度过高',
    'low_voltage': '电压过低',
    'offline': '设备离线',
    'error': '系统错误'
  }
  return typeMap[type] || type
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString('zh-CN')
}

const formatAlertId = (id) => {
  // 将ID缩短为4位数字，例如：0001, 0002, 0003...
  if (!id) return '0000'
  // 如果是字符串，提取数字部分；如果是数字，直接使用
  const num = typeof id === 'string' ? parseInt(id.replace(/\D/g, '')) || 0 : id
  // 确保是4位数字，不足补零
  return String(num % 10000).padStart(4, '0')
}

// 获取选中车辆的对象
const getSelectedVehicleObject = () => {
  if (!selectedVehicle.value) return null
  return vehicles.value.find(v => v.vid === selectedVehicle.value)
}

const showVehicleDetails = ref(false)
const selectedVehicleDetails = ref(null)

const viewVehicleDetails = (vehicle) => {
  console.log('查看车辆详情:', vehicle)
  selectedVehicleDetails.value = vehicle
  showVehicleDetails.value = true
}

const selectVehicle = (vehicle) => {
  console.log('选择车辆:', vehicle.vid)
  selectedVehicle.value = vehicle.vid
  // 如果控制面板未显示，自动显示
  if (!showControlPanel.value) {
    showControlPanel.value = true
  }
}

const clearSelection = () => {
  selectedVehicle.value = null
}

const refreshVehicles = async () => {
  try {
    // 获取管理端车辆
    await vehicleStore.fetchVehicles()
    const adminVehicles = vehicleStore.vehicles.map(v => ({
      ...v,
      source: 'admin',
      vid: v.vid,
      name: v.vid,
      brand: '管理端',
      plateNumber: v.vid,
      // 电池编号可能是中文或英文，直接使用
      pid: v.pid || null
    }))
    
    // 获取用户端车辆
    try {
      const userRes = await getUserVehicles({ page: 1, size: 1000 })
      if (userRes.code === 200 && userRes.data) {
        const userVehiclesData = userRes.data.content || userRes.data || []
        const userVehicles = userVehiclesData.map(v => ({
          ...v,
          source: 'user',
          vid: `U${v.id}`,
          // 车辆编号使用 name 字段（如："特斯拉 Model 3"）
          name: v.name || v.brand || '未命名车辆',
          brand: v.brand || '未知品牌',
          plateNumber: v.plateNumber || '--',
          vin: v.vin || '',
          status: v.status || 'offline',
          online: v.online !== undefined ? v.online : true,
          voltage: v.voltage || 3.7,
          temperature: v.temperature || 25,
          batteryLevel: v.batteryLevel || 0,
          // 电池编号使用 batteryName 字段（如："主电池包"）
          pid: v.batteryName || null,
          lightStatus: 'off',
          position: { x: 0, y: 0 },
          lastUpdate: v.lastUpdateTime || new Date().toISOString()
        }))
        
        // 合并管理端和用户端车辆
        vehicleStore.vehicles = [...adminVehicles, ...userVehicles]
      }
    } catch (userError) {
      console.error('获取用户端车辆失败:', userError)
      // 如果获取用户端失败，至少显示管理端数据
      vehicleStore.vehicles = adminVehicles
    }
    
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

// 喇叭控制功能已集成到VehicleHornControl组件中

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
  background: #4a4a4a;
  color: white;
}

.btn-primary:hover {
  background: #5a5a5a;
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

.panel-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-clear-selection {
  background: #6c757d;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-clear-selection:hover {
  background: #5a6268;
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

/* 灯光控制区域 */
.light-control-section {
  margin-bottom: 20px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.light-control-section .vehicle-light-control {
  border: none;
  border-radius: 0;
  box-shadow: none;
  margin-bottom: 0;
  padding: 16px;
}

.light-control-section .control-header {
  padding-bottom: 0;
  margin-bottom: 12px;
  border-bottom: none;
}

.light-control-section .control-header h3 {
  font-size: 16px;
}

/* 喇叭控制区域 */
.horn-control-section {
  margin-bottom: 20px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.horn-control-section .vehicle-horn-control {
  border: none;
  border-radius: 0;
  box-shadow: none;
  margin-bottom: 0;
  padding: 16px;
}

.horn-control-section .control-header {
  padding-bottom: 0;
  margin-bottom: 12px;
  border-bottom: none;
}

.horn-control-section .control-header h3 {
  font-size: 16px;
}

/* 位置控制区域 */
.position-control-section {
  margin-bottom: 20px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
}

.position-control-section .vehicle-position-control {
  border: none;
  border-radius: 0;
  box-shadow: none;
  margin-bottom: 0;
  padding: 16px;
}

.position-control-section .control-header {
  padding-bottom: 0;
  margin-bottom: 12px;
  border-bottom: none;
}

.position-control-section .control-header h3 {
  font-size: 16px;
}

/* 无车辆选择提示 */
.no-vehicle-selected {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: #666;
}

.no-vehicle-icon {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.no-vehicle-text {
  font-size: 16px;
  font-weight: 500;
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

/* 车辆表格 */
.vehicles-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: grid;
  grid-template-columns: 120px 100px 100px 120px 100px 100px 100px 80px 120px;
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
  grid-template-columns: 120px 100px 100px 120px 100px 100px 100px 80px 120px;
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

.table-row.selected {
  background-color: #e8f4fd;
  border-left: 4px solid #007bff;
  box-shadow: 0 0 0 2px #007bff inset;
}

.table-row.selected:hover {
  background-color: #d1ecf1;
  box-shadow: 0 0 0 2px #007bff inset, 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-row.online {
  border-left: 4px solid #28a745;
}

.table-row.offline {
  border-left: 4px solid #dc3545;
}

.table-row.has-alerts {
  border-left: 4px solid #ffc107;
}

/* 表格列样式 */
.col-id .vehicle-id {
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

.col-status .status-badge.online {
  background: #d4edda;
  color: #155724;
}

.col-status .status-badge:not(.online) {
  background: #f8d7da;
  color: #721c24;
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

.col-battery .battery-id {
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

.col-battery-level .battery-level {
  font-size: 14px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
}

.col-battery-level .battery-level.high {
  background: #d4edda;
  color: #155724;
}

.col-battery-level .battery-level.medium {
  background: #fff3cd;
  color: #856404;
}

.col-battery-level .battery-level.low {
  background: #f8d7da;
  color: #721c24;
}

.col-battery-level .battery-level.unknown {
  background: #f8f9fa;
  color: #6c757d;
}

.col-alerts .alert-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: #fff3cd;
  color: #856404;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.col-alerts .no-alerts {
  color: #6c757d;
  font-size: 14px;
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

/* 报警表格样式 */
.alerts-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.alerts-table .table-header {
  display: grid;
  grid-template-columns: 80px 120px 180px 1fr;
  padding: 16px 20px;
  background: #f8f9fa;
  font-weight: 600;
  color: #666;
  border-bottom: 1px solid #e9ecef;
  gap: 16px;
  text-align: center;
}

.alerts-table .table-body {
  max-height: 200px;
  overflow-y: auto;
}

.alerts-table .table-row {
  display: grid;
  grid-template-columns: 80px 120px 180px 1fr;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.alerts-table .table-row:last-child {
  border-bottom: none;
}

.alert-type {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.alert-type.warning {
  background: #fff3cd;
  color: #856404;
}

.alert-type.danger {
  background: #f8d7da;
  color: #721c24;
}

.alert-type.info {
  background: #d1ecf1;
  color: #0c5460;
}

.no-alerts {
  text-align: center;
  padding: 32px;
  color: #6c757d;
  font-style: italic;
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