<template>
  <div class="batteries">
    <h2>电池管理</h2>
    
    <div class="controls">
      <div class="filter-group">
        <label>筛选状态:</label>
        <select v-model="filterStatus" @change="filterBatteries">
          <option value="all">全部</option>
          <option value="inUse">使用中</option>
          <option value="available">可用</option>
          <option value="maintenance">维护中</option>
        </select>
      </div>
      <button class="btn btn-primary" @click="refreshBatteries">刷新数据</button>
    </div>
    
    <div class="batteries-grid">
      <div v-for="battery in filteredBatteries" :key="battery.pid" class="battery-card"
           :class="getBatteryStatusClass(battery)">
        <div class="battery-header">
          <span class="battery-id">{{ battery.pid }}</span>
          <span class="status-indicator" :class="battery.status">
            {{ getStatusText(battery.status) }}
          </span>
        </div>
        
        <div class="battery-info">
          <div class="info-item">
            <label>当前车辆:</label>
            <span>{{ battery.currentVehicle || '未使用' }}</span>
          </div>
          <div class="info-item">
            <label>电压:</label>
            <span>{{ battery.voltage ? battery.voltage + 'V' : '--' }}</span>
          </div>
          <div class="info-item">
            <label>温度:</label>
            <span>{{ battery.temperature ? battery.temperature + '°C' : '--' }}</span>
          </div>
          <div class="info-item">
            <label>剩余电量:</label>
            <span class="battery-level" :class="getBatteryLevelClass(battery.remainingCapacity)">
              {{ battery.remainingCapacity ? battery.remainingCapacity + '%' : '--' }}
            </span>
          </div>
          <div class="info-item">
            <label>健康状态:</label>
            <span>{{ battery.health ? battery.health + '%' : '--' }}</span>
          </div>
        </div>
        
        <div class="battery-history" v-if="battery.history && battery.history.length > 0">
          <h4>使用历史</h4>
          <div class="history-list">
            <div v-for="(record, index) in battery.history.slice(-3)" :key="index" class="history-item">
              <span class="time">{{ formatTime(record.timestamp) }}</span>
              <span class="vehicle">{{ record.vehicleId }}</span>
              <span class="capacity">{{ record.capacity }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="charts-section">
      <h3>电池数据趋势</h3>
      <div class="chart-container">
        <div class="chart-placeholder">
          <p>电池容量变化图表</p>
          <p>温度变化图表</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApiBatteryStore } from '../store/modules/apiBatteryStore'

const batteryStore = useApiBatteryStore()
const filterStatus = ref('all')

const filteredBatteries = computed(() => {
  if (filterStatus.value === 'all') {
    return batteryStore.batteries
  }
  return batteryStore.batteries.filter(battery => battery.status === filterStatus.value)
})

const getStatusText = (status) => {
  const statusMap = {
    inUse: '使用中',
    available: '可用',
    maintenance: '维护中'
  }
  return statusMap[status] || '未知'
}

const getBatteryStatusClass = (battery) => {
  return {
    'battery-in-use': battery.status === 'inUse',
    'battery-available': battery.status === 'available',
    'battery-maintenance': battery.status === 'maintenance'
  }
}

const getBatteryLevelClass = (level) => {
  if (!level) return 'unknown'
  if (level > 80) return 'high'
  if (level > 30) return 'medium'
  return 'low'
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN')
}

const filterBatteries = () => {
  const params = filterStatus.value === 'all' ? {} : { status: filterStatus.value }
  refreshBatteries(params)
}

const refreshBatteries = async (params = {}) => {
  try {
    await batteryStore.fetchBatteries(params)
  } catch (error) {
    console.error('刷新电池数据失败:', error)
  }
}

onMounted(async () => {
  await refreshBatteries()
})
</script>

<style scoped>
.batteries {
  padding: 20px;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-weight: 500;
}

.filter-group select {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn {
  padding: 8px 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.batteries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.battery-card {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-left: 4px solid #95a5a6;
}

.battery-in-use {
  border-left-color: #3498db;
}

.battery-available {
  border-left-color: #27ae60;
}

.battery-maintenance {
  border-left-color: #f39c12;
}

.battery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.battery-id {
  font-weight: bold;
  font-size: 16px;
}

.status-indicator {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: white;
}

.status-indicator.inUse {
  background: #3498db;
}

.status-indicator.available {
  background: #27ae60;
}

.status-indicator.maintenance {
  background: #f39c12;
}

.battery-info {
  margin-bottom: 15px;
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

.battery-history {
  border-top: 1px solid #ecf0f1;
  padding-top: 10px;
}

.battery-history h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #2c3e50;
}

.history-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 2px 0;
}

.history-item .time {
  color: #7f8c8d;
}

.history-item .vehicle {
  font-weight: 500;
}

.charts-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.chart-container {
  margin-top: 15px;
}

.chart-placeholder {
  height: 200px;
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #6c757d;
}
</style>