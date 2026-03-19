<template>
  <div class="dashboard">
    <h2>系统概览</h2>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">🚗</div>
        <div class="stat-content">
          <div class="stat-value">{{ onlineVehiclesCount }}</div>
          <div class="stat-label">在线车辆</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🔋</div>
        <div class="stat-content">
          <div class="stat-value">{{ totalBatteriesCount }}</div>
          <div class="stat-label">电池总数</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">⚠️</div>
        <div class="stat-content">
          <div class="stat-value">{{ activeAlertsCount }}</div>
          <div class="stat-label">异常报警</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">⚡</div>
        <div class="stat-content">
          <div class="stat-value">{{ chargingStationsCount }}</div>
          <div class="stat-label">换电站</div>
        </div>
      </div>
    </div>
    
    <div class="content-grid">
      <div class="recent-alerts">
        <h3>最近报警</h3>
        <div class="alert-list">
          <div v-for="alert in recentAlerts" :key="alert.id" class="alert-item">
            <span class="alert-type">{{ getAlertTypeText(alert.type) }}</span>
            <span class="alert-time">{{ formatTime(alert.timestamp) }}</span>
            <span class="alert-vehicle">{{ alert.vid }}</span>
          </div>
        </div>
      </div>
      
      <div class="low-battery-vehicles">
        <h3>低电量车辆</h3>
        <div class="vehicle-list">
          <div v-for="vehicle in lowBatteryVehicles" :key="vehicle.vid" class="vehicle-item">
            <span class="vehicle-id">{{ vehicle.vid }}</span>
            <span class="battery-level">{{ vehicle.batteryLevel }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useApiVehicleStore } from '../store/modules/apiVehicleStore'
import { useApiBatteryStore } from '../store/modules/apiBatteryStore'
import { dashboardAPI, alertAPI } from '../services/api'

const vehicleStore = useApiVehicleStore()
const batteryStore = useApiBatteryStore()

const overviewData = ref({
  onlineVehicles: 0,
  totalBatteries: 0,
  activeAlerts: 0,
  chargingStations: 0,
  recentAlerts: [],
  lowBatteryVehicles: []
})

const onlineVehiclesCount = computed(() => overviewData.value.onlineVehicles)
const totalBatteriesCount = computed(() => overviewData.value.totalBatteries)
const activeAlertsCount = computed(() => overviewData.value.activeAlerts)
const chargingStationsCount = computed(() => overviewData.value.chargingStations)
const recentAlerts = computed(() => overviewData.value.recentAlerts)
const lowBatteryVehicles = computed(() => overviewData.value.lowBatteryVehicles)

const getAlertTypeText = (type) => {
  const types = {
    temperature: '温度异常',
    lowBattery: '电量过低',
    unreachable: '无法到达换电站'
  }
  return types[type] || '未知报警'
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN')
}

const fetchOverview = async () => {
  try {
    const response = await dashboardAPI.getOverview()
    if (response.code === 200) {
      overviewData.value = response.data
    }
  } catch (error) {
    console.error('获取系统概览失败:', error)
    // 如果API不可用，使用本地数据作为fallback
    updateLocalStats()
  }
}

const updateLocalStats = () => {
  overviewData.value = {
    onlineVehicles: vehicleStore.getOnlineVehicles.length,
    totalBatteries: batteryStore.batteries.length,
    activeAlerts: batteryStore.getActiveAlerts.length,
    chargingStations: 5, // 默认值
    recentAlerts: batteryStore.batteryAlerts.slice(-5).reverse(),
    lowBatteryVehicles: vehicleStore.getLowBatteryVehicles.slice(0, 5)
  }
}

onMounted(async () => {
  // 先加载车辆和电池数据
  await vehicleStore.fetchVehicles()
  await batteryStore.fetchBatteries()
  
  // 然后获取系统概览
  await fetchOverview()
  
  // 启动实时数据更新
  vehicleStore.startRealTimeUpdates()
  
  // 定期刷新概览数据
  setInterval(fetchOverview, 10000)
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
}

.stat-icon {
  font-size: 40px;
  margin-right: 15px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
}

.stat-label {
  font-size: 14px;
  color: #7f8c8d;
  margin-top: 5px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.recent-alerts, .low-battery-vehicles {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.alert-list, .vehicle-list {
  margin-top: 15px;
}

.alert-item, .vehicle-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #ecf0f1;
}

.alert-item:last-child, .vehicle-item:last-child {
  border-bottom: none;
}

.alert-type {
  color: #e74c3c;
  font-weight: 500;
}

.alert-time {
  color: #7f8c8d;
  font-size: 12px;
}

.vehicle-id {
  font-weight: 500;
}

.battery-level {
  color: #e74c3c;
  font-weight: bold;
}
</style>