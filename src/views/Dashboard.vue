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
import { ref, onMounted } from 'vue'
import { useVehicleStore } from '../store/modules/vehicleStore'
import { useBatteryStore } from '../store/modules/batteryStore'
import { useMapStore } from '../store/modules/mapStore'

const vehicleStore = useVehicleStore()
const batteryStore = useBatteryStore()
const mapStore = useMapStore()

const onlineVehiclesCount = ref(0)
const totalBatteriesCount = ref(0)
const activeAlertsCount = ref(0)
const chargingStationsCount = ref(0)
const recentAlerts = ref([])
const lowBatteryVehicles = ref([])

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

const updateStats = () => {
  onlineVehiclesCount.value = vehicleStore.onlineVehicles.length
  totalBatteriesCount.value = batteryStore.batteries.length
  activeAlertsCount.value = batteryStore.getActiveAlerts.length
  chargingStationsCount.value = mapStore.chargingStations.length
  
  recentAlerts.value = batteryStore.batteryAlerts
    .slice(-5)
    .reverse()
    
  lowBatteryVehicles.value = vehicleStore.vehicles
    .filter(v => v.batteryLevel < 30)
    .slice(0, 5)
}

onMounted(() => {
  updateStats()
  // 模拟数据更新
  setInterval(updateStats, 5000)
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