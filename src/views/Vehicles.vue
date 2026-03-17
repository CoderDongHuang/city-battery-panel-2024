<template>
  <div class="vehicles">
    <h2>车辆管理</h2>
    
    <div class="controls">
      <button class="btn btn-primary" @click="refreshVehicles">刷新数据</button>
      <button class="btn btn-secondary" @click="showControlPanel = !showControlPanel">
        {{ showControlPanel ? '隐藏' : '显示' }}控制面板
      </button>
    </div>
    
    <div v-if="showControlPanel" class="control-panel">
      <h3>车辆控制</h3>
      <div class="control-actions">
        <button class="btn btn-warning" @click="controlLights(selectedVehicle)">闪灯</button>
        <button class="btn btn-danger" @click="controlHorn(selectedVehicle)">鸣笛</button>
      </div>
    </div>
    
    <div class="vehicles-grid">
      <div v-for="vehicle in vehicles" :key="vehicle.vid" class="vehicle-card"
           :class="{ online: vehicle.online, selected: selectedVehicle === vehicle.vid }"
           @click="selectVehicle(vehicle.vid)">
        <div class="vehicle-header">
          <span class="vehicle-id">{{ vehicle.vid }}</span>
          <span class="status-indicator" :class="{ online: vehicle.online }">
            {{ vehicle.online ? '在线' : '离线' }}
          </span>
        </div>
        
        <div class="vehicle-info">
          <div class="info-item">
            <label>电池编号:</label>
            <span>{{ vehicle.pid || '未安装' }}</span>
          </div>
          <div class="info-item">
            <label>电池电压:</label>
            <span>{{ vehicle.voltage ? vehicle.voltage + 'V' : '--' }}</span>
          </div>
          <div class="info-item">
            <label>电池温度:</label>
            <span>{{ vehicle.temperature ? vehicle.temperature + '°C' : '--' }}</span>
          </div>
          <div class="info-item">
            <label>剩余电量:</label>
            <span class="battery-level" :class="getBatteryLevelClass(vehicle.batteryLevel)">
              {{ vehicle.batteryLevel ? vehicle.batteryLevel + '%' : '--' }}
            </span>
          </div>
          <div class="info-item">
            <label>灯光状态:</label>
            <span>{{ getLightStatusText(vehicle.lightStatus) }}</span>
          </div>
        </div>
        
        <div v-if="vehicle.alerts && vehicle.alerts.length > 0" class="alerts">
          <div v-for="alert in vehicle.alerts" :key="alert.id" class="alert">
            ⚠️ {{ getAlertText(alert) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useVehicleStore } from '../store/modules/vehicleStore'

const vehicleStore = useVehicleStore()
const showControlPanel = ref(false)
const selectedVehicle = ref(null)

const vehicles = ref([])

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
  return alertMap[alert.type] || '未知报警'
}

const selectVehicle = (vid) => {
  selectedVehicle.value = vid
}

const refreshVehicles = () => {
  // 模拟从后端获取数据
  vehicles.value = vehicleStore.vehicles.map(v => ({
    ...v,
    online: vehicleStore.onlineVehicles.includes(v.vid)
  }))
}

const controlLights = (vid) => {
  if (vid) {
    vehicleStore.controlVehicleLights(vid, 'flash')
  }
}

const controlHorn = (vid) => {
  if (vid) {
    vehicleStore.controlVehicleHorn(vid, 'beep')
  }
}

onMounted(() => {
  refreshVehicles()
  // 模拟实时数据更新
  setInterval(refreshVehicles, 3000)
})
</script>

<style scoped>
.vehicles {
  padding: 20px;
}

.controls {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-warning {
  background: #f39c12;
  color: white;
}

.btn-danger {
  background: #e74c3c;
  color: white;
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