<template>
  <div class="map-view">
    <!-- 地图控制面板（大模块） -->
    <div class="map-controls-section">
      <div class="section-header">
        <div class="section-title-group">
          <h2 class="section-title">地图控制</h2>
          <p class="section-description">选择车辆并管理地图显示，支持智能路径规划</p>
        </div>
        <div class="section-controls">
          <button class="refresh-btn" @click="loadMapData">
            <span class="refresh-icon">🔄</span>
            刷新地图
          </button>
        </div>
      </div>
      
      <div class="controls-grid">
        <div class="control-card">
          <div class="control-header">
            <div class="control-icon">🚗</div>
            <div class="control-info">
              <h3>车辆选择</h3>
              <p>选择要监控的车辆</p>
            </div>
          </div>
          <div class="control-body">
            <select v-model="selectedVehicleId" @change="onVehicleSelect" class="vehicle-select">
              <option value="">全部车辆</option>
              <option v-for="vehicle in onlineVehicles" :key="vehicle.vid" :value="vehicle.vid">
                {{ vehicle.vid }} - {{ vehicle.online ? '在线' : '离线' }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="control-card">
          <div class="control-header">
            <div class="control-icon">📍</div>
            <div class="control-info">
              <h3>位置管理</h3>
              <p>车辆位置控制</p>
            </div>
          </div>
          <div class="control-body">
            <div class="position-actions">
              <button class="action-btn primary" @click="setRandomPosition" :disabled="!selectedVehicleId">
                <span class="action-icon">🎯</span>
                随机位置
              </button>
              <button class="action-btn secondary" @click="clearSelection">
                <span class="action-icon">🗑️</span>
                清除选择
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 地图显示区域（大模块） -->
    <div class="map-display-section">
      <div class="section-header">
        <div class="section-title-group">
          <h2 class="section-title">城市地图</h2>
          <p class="section-description">实时显示车辆分布和基础设施位置</p>
        </div>
        <div class="map-stats">
          <div class="stat-item">
            <span class="stat-label">在线车辆</span>
            <span class="stat-value">{{ onlineVehicles.length }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">换电站</span>
            <span class="stat-value">{{ chargingStationsCount }}</span>
          </div>
        </div>
      </div>
      
      <!-- 地图图例（放在地图上方） -->
      <div class="map-legend">
        <div class="legend-header">
          <h4>地图图例</h4>
          <span class="legend-badge">参考指南</span>
        </div>
        <div class="legend-items">
          <div class="legend-item">
            <div class="legend-color road"></div>
            <div class="legend-content">
              <span class="legend-label">道路</span>
              <span class="legend-desc">可通行区域</span>
            </div>
          </div>
          <div class="legend-item">
            <div class="legend-color station"></div>
            <div class="legend-content">
              <span class="legend-label">换电站</span>
              <span class="legend-desc">电池更换设施</span>
            </div>
          </div>
          <div class="legend-item">
            <div class="legend-color obstacle"></div>
            <div class="legend-content">
              <span class="legend-label">障碍物</span>
              <span class="legend-desc">不可通行区域</span>
            </div>
          </div>
          <div class="legend-item">
            <div class="legend-color vehicle"></div>
            <div class="legend-content">
              <span class="legend-label">车辆</span>
              <span class="legend-desc">在线车辆位置</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="map-container">
        <div class="map-grid" v-if="mapGrid">
          <div v-for="(row, y) in mapGrid" :key="y" class="map-row">
            <div v-for="(cell, x) in row" :key="x" 
                 class="map-cell" 
                 :class="getCellClass(cell, x, y)"
                 @click="setVehiclePosition(x, y)"
                 :title="getCellTitle(cell, x, y)">
              {{ getCellContent(cell, x, y) }}
            </div>
          </div>
        </div>
        
        <div v-else class="map-placeholder">
          <div class="placeholder-icon">🗺️</div>
          <h3>地图数据未加载</h3>
          <p>请点击下方按钮加载城市地图数据</p>
          <button class="load-map-btn" @click="loadMapData">
            <span class="btn-icon">📡</span>
            加载地图数据
          </button>
        </div>
      </div>
    </div>

    <!-- 信息面板区域（大模块） -->
    <div class="info-panels-section">
      <div class="panel-grid">
        <div class="info-panel">
          <div class="panel-header">
            <h3>车辆状态监控</h3>
            <div class="panel-badge">实时</div>
          </div>
          <div class="vehicle-status">
            <div class="status-item">
              <span class="status-label">在线车辆</span>
              <span class="status-value">{{ onlineVehicles.length }}</span>
            </div>
            <div class="status-item">
              <span class="status-label">离线车辆</span>
              <span class="status-value">{{ offlineVehicles.length }}</span>
            </div>
            <div class="status-item">
              <span class="status-label">报警车辆</span>
              <span class="status-value warning">{{ alertVehicles.length }}</span>
            </div>
          </div>
        </div>
        
        <div class="info-panel route-info" v-if="recommendedRoute">
          <div class="panel-header">
            <h3>智能路径规划</h3>
            <div class="panel-badge" :class="{ warning: recommendedRoute.rescueNeeded }">
              {{ recommendedRoute.rescueNeeded ? '紧急' : '正常' }}
            </div>
          </div>
          <div class="route-details">
            <div class="route-item">
              <span class="item-label">目标换电站</span>
              <span class="item-value">({{ recommendedRoute.station.x }}, {{ recommendedRoute.station.y }})</span>
            </div>
            <div class="route-item">
              <span class="item-label">预计距离</span>
              <span class="item-value">{{ recommendedRoute.distance }} 格</span>
            </div>
            <div class="route-item" v-if="recommendedRoute.rescueNeeded">
              <span class="item-label">状态</span>
              <span class="item-value warning">⚠️ 需要救援支持</span>
            </div>
            <div class="route-actions">
              <button class="action-btn primary">
                <span class="action-icon">🚀</span>
                开始导航
              </button>
            </div>
          </div>
        </div>
        
        <div class="info-panel" v-else>
          <div class="panel-header">
            <h3>路径信息</h3>
            <div class="panel-badge">待机</div>
          </div>
          <div class="route-placeholder">
            <div class="placeholder-icon">🧭</div>
            <p>请选择车辆以获取路径规划</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useMapStore } from '../store/modules/mapStore'
import { useVehicleStore } from '../store/modules/vehicleStore'

const mapStore = useMapStore()
const vehicleStore = useVehicleStore()

const selectedVehicleId = ref('')
const mapGrid = ref(null)
const recommendedRoute = ref(null)

// 计算属性
const onlineVehicles = computed(() => {
  return vehicleStore.vehicles.filter(v => v.online)
})

const offlineVehicles = computed(() => {
  return vehicleStore.vehicles.filter(v => !v.online)
})

const alertVehicles = computed(() => {
  return vehicleStore.vehicles.filter(v => v.alerts && v.alerts.length > 0)
})

const chargingStationsCount = computed(() => {
  if (!mapGrid.value) return 0
  let count = 0
  for (let y = 0; y < mapGrid.value.length; y++) {
    for (let x = 0; x < mapGrid.value[y].length; x++) {
      if (mapGrid.value[y][x] === 1) count++
    }
  }
  return count
})

const currentTime = computed(() => {
  return new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
})

const clearSelection = () => {
  selectedVehicleId.value = ''
  recommendedRoute.value = null
}

const getCellClass = (cell, x, y) => {
  const classes = []
  
  if (cell === 0) classes.push('road')
  else if (cell === 1) classes.push('station')
  else if (cell === 2) classes.push('obstacle')
  
  const vehicleAtPosition = Object.entries(mapStore.vehiclePositions).find(
    ([vid, pos]) => pos.x === x + 1 && pos.y === y + 1
  )
  
  if (vehicleAtPosition) {
    classes.push('vehicle')
    if (vehicleAtPosition[0] === selectedVehicleId.value) {
      classes.push('selected-vehicle')
    }
  }
  
  return classes
}

const getCellContent = (cell, x, y) => {
  const vehicleAtPosition = Object.entries(mapStore.vehiclePositions).find(
    ([vid, pos]) => pos.x === x + 1 && pos.y === y + 1
  )
  
  if (vehicleAtPosition) {
    const vehicle = vehicleStore.getVehicleById(vehicleAtPosition[0])
    return vehicle ? vehicle.vid.slice(-2) : 'V'
  }
  
  return ''
}

const getCellTitle = (cell, x, y) => {
  const position = `坐标: (${x + 1}, ${y + 1})`
  let type = ''
  
  if (cell === 0) type = '道路'
  else if (cell === 1) type = '换电站'
  else if (cell === 2) type = '障碍物'
  
  const vehicleAtPosition = Object.entries(mapStore.vehiclePositions).find(
    ([vid, pos]) => pos.x === x + 1 && pos.y === y + 1
  )
  
  if (vehicleAtPosition) {
    const vehicle = vehicleStore.getVehicleById(vehicleAtPosition[0])
    return `${position} | ${type} | 车辆: ${vehicle?.vid || '未知'}`
  }
  
  return `${position} | ${type}`
}

const loadMapData = async () => {
  // 模拟地图数据（实际应从文件读取）
  const mockMapData = Array(10).fill().map(() => 
    Array(10).fill().map(() => Math.floor(Math.random() * 3))
  ).map(row => row.join(' ')).join('\n')
  
  mapStore.mapData = mockMapData
  mapGrid.value = mapStore.getMapGrid
}

const setVehiclePosition = (x, y) => {
  if (selectedVehicleId.value) {
    const position = { x: x + 1, y: y + 1 }
    mapStore.setVehiclePosition(selectedVehicleId.value, position)
    
    const nearest = mapStore.findNearestChargingStation(position)
    if (nearest) {
      const vehicle = vehicleStore.getVehicleById(selectedVehicleId.value)
      const batteryLevel = vehicle?.batteryLevel || 0
      
      recommendedRoute.value = {
        station: nearest.station,
        distance: nearest.distance,
        rescueNeeded: batteryLevel < nearest.distance
      }
    }
  }
}

const setRandomPosition = () => {
  if (selectedVehicleId.value && mapGrid.value) {
    const roads = []
    for (let y = 0; y < mapGrid.value.length; y++) {
      for (let x = 0; x < mapGrid.value[y].length; x++) {
        if (mapGrid.value[y][x] === 0) {
          roads.push({ x: x + 1, y: y + 1 })
        }
      }
    }
    
    if (roads.length > 0) {
      const randomPos = roads[Math.floor(Math.random() * roads.length)]
      mapStore.setVehiclePosition(selectedVehicleId.value, randomPos)
      
      const nearest = mapStore.findNearestChargingStation(randomPos)
      if (nearest) {
        const vehicle = vehicleStore.getVehicleById(selectedVehicleId.value)
        const batteryLevel = vehicle?.batteryLevel || 0
        
        recommendedRoute.value = {
          station: nearest.station,
          distance: nearest.distance,
          rescueNeeded: batteryLevel < nearest.distance
        }
      }
    }
  }
}

const onVehicleSelect = () => {
  if (selectedVehicleId.value) {
    const position = mapStore.getVehiclePosition(selectedVehicleId.value)
    if (position) {
      const nearest = mapStore.findNearestChargingStation(position)
      if (nearest) {
        const vehicle = vehicleStore.getVehicleById(selectedVehicleId.value)
        const batteryLevel = vehicle?.batteryLevel || 0
        
        recommendedRoute.value = {
          station: nearest.station,
          distance: nearest.distance,
          rescueNeeded: batteryLevel < nearest.distance
        }
      }
    }
  } else {
    recommendedRoute.value = null
  }
}

onMounted(() => {
  loadMapData()
})
</script>

<style scoped>
.map-view {
  padding: 24px;   /* 与 Dashboard 统一内边距 */
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* 大模块间距设置 - 与系统概览页面保持一致 */
.map-controls-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 48px;          /* 大模块间距 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.map-display-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 48px;          /* 大模块间距 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.info-panels-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 0;             /* 最后一个模块不要下边距 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

/* 大模块悬停效果 */
.map-controls-section:hover,
.map-display-section:hover,
.info-panels-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

/* 移除外层card-section样式，避免重复 */

/* 头部样式（已移除，保留原有内部样式） */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
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

/* 控制卡片样式（保持原有） */
.controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.control-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #e9ecef;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.control-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.control-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.control-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.control-info {
  flex: 1;
}

.control-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.control-info p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.vehicle-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background: #f8f9fa;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.vehicle-select:focus {
  outline: none;
  border-color: #007bff;
}

.position-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: white;
  color: #495057;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  flex: 1;
}

.action-btn.primary {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.action-btn.secondary {
  background: #6c757d;
  color: white;
  border-color: #6c757d;
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-icon {
  font-size: 16px;
}

/* 地图区域 */
.map-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
}

/* 地图图例样式 */
.map-legend {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid #e9ecef;
}

.legend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.legend-header h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.legend-badge {
  background: #007bff;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.legend-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: white;
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.legend-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.legend-color {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  flex-shrink: 0;
}

.legend-color.road {
  background: linear-gradient(135deg, #ecf0f1, #d5dbdb);
  border: 1px solid #bdc3c7;
}

.legend-color.station {
  background: linear-gradient(135deg, #28a745, #20c997);
}

.legend-color.obstacle {
  background: linear-gradient(135deg, #dc3545, #e83e8c);
}

.legend-color.vehicle {
  background: linear-gradient(135deg, #ffc107, #fd7e14);
}

.legend-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.legend-label {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.legend-desc {
  font-size: 12px;
  color: #666;
}

.map-container {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 32px;
  margin-top: 24px;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-x: auto;
}

.map-grid {
  display: inline-block;
  border: 3px solid #2c3e50;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.map-row {
  display: flex;
}

.map-cell {
  width: 40px;
  height: 40px;
  border: 1px solid #bdc3c7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.map-cell:hover {
  transform: scale(1.2);
  z-index: 2;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.map-cell.road {
  background: linear-gradient(135deg, #ecf0f1, #d5dbdb);
  color: #2c3e50;
}

.map-cell.station {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  font-weight: 800;
}

.map-cell.obstacle {
  background: linear-gradient(135deg, #2c3e50, #1a252f);
  color: white;
}

.map-cell.vehicle {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: 2px solid #2980b9;
  font-weight: 800;
}

.map-cell.selected-vehicle {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  border: 2px solid #e67e22;
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0% { box-shadow: 0 0 0 0 rgba(243, 156, 18, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(243, 156, 18, 0); }
  100% { box-shadow: 0 0 0 0 rgba(243, 156, 18, 0); }
}

.map-placeholder {
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #6c757d;
  text-align: center;
}

.placeholder-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.7;
}

.map-placeholder h3 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #495057;
}

.map-placeholder p {
  font-size: 16px;
  margin: 0 0 24px 0;
  color: #6c757d;
}

.load-map-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: #007bff;
  color: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.load-map-btn:hover {
  background: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.btn-icon {
  font-size: 18px;
}

/* 信息面板区域 */
.panel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.info-panel {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #e9ecef;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.info-panel:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.panel-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.panel-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: #28a745;
  color: white;
}

.panel-badge.warning {
  background: #dc3545;
}

.legend-grid {
  display: grid;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 8px;
  background: #f8f9fa;
  transition: background-color 0.3s ease;
}

.legend-item:hover {
  background: #e9ecef;
}

.legend-color {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  flex-shrink: 0;
}

.legend-color.road {
  background: linear-gradient(135deg, #ecf0f1, #d5dbdb);
}

.legend-color.station {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.legend-color.obstacle {
  background: linear-gradient(135deg, #2c3e50, #1a252f);
}

.legend-color.vehicle {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.legend-content {
  flex: 1;
}

.legend-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 2px;
}

.legend-desc {
  display: block;
  font-size: 12px;
  color: #6c757d;
}

.route-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.route-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f8f9fa;
}

.route-item:last-child {
  border-bottom: none;
}

.item-label {
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
}

.item-value {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.item-value.warning {
  color: #dc3545;
}

.route-actions {
  margin-top: 16px;
}

.route-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;
  color: #6c757d;
  text-align: center;
}

.route-placeholder .placeholder-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .controls-grid {
    grid-template-columns: 1fr;
  }
  .panel-grid {
    grid-template-columns: 1fr;
  }
  .map-cell {
    width: 35px;
    height: 35px;
  }
}

@media (max-width: 768px) {
  .map-view {
    padding: 16px;
  }
  .card-section {
    padding: 20px;
  }
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .map-stats {
    justify-content: space-between;
  }
  .map-cell {
    width: 30px;
    height: 30px;
    font-size: 12px;
  }
  .position-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .map-cell {
    width: 25px;
    height: 25px;
    font-size: 10px;
  }
}
</style>