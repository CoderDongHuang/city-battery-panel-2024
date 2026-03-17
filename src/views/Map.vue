<template>
  <div class="map-view">
    <h2>地图监控</h2>
    
    <div class="map-controls">
      <div class="control-group">
        <label>选择车辆:</label>
        <select v-model="selectedVehicleId" @change="onVehicleSelect">
          <option value="">全部车辆</option>
          <option v-for="vehicle in onlineVehicles" :key="vehicle.vid" :value="vehicle.vid">
            {{ vehicle.vid }}
          </option>
        </select>
      </div>
      
      <div class="control-group">
        <button class="btn btn-primary" @click="loadMapData">加载地图</button>
        <button class="btn btn-secondary" @click="setRandomPosition">随机位置</button>
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
        <p>请先加载地图数据</p>
        <button class="btn btn-primary" @click="loadMapData">加载地图</button>
      </div>
    </div>
    
    <div class="map-info">
      <div class="info-panel">
        <h3>地图图例</h3>
        <div class="legend">
          <div class="legend-item">
            <span class="legend-color road"></span>
            <span>道路 (0)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color station"></span>
            <span>换电站 (1)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color obstacle"></span>
            <span>障碍物 (2)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color vehicle"></span>
            <span>车辆位置</span>
          </div>
        </div>
      </div>
      
      <div class="route-info" v-if="recommendedRoute">
        <h3>推荐路线</h3>
        <div class="route-details">
          <p>目标换电站: ({{ recommendedRoute.station.x }}, {{ recommendedRoute.station.y }})</p>
          <p>预计距离: {{ recommendedRoute.distance }} 格</p>
          <p v-if="recommendedRoute.rescueNeeded" class="rescue-warning">
            ⚠️ 需要救援
          </p>
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

const onlineVehicles = computed(() => {
  return vehicleStore.getOnlineVehicles
})

const getCellClass = (cell, x, y) => {
  const classes = []
  
  // 基础单元格类型
  if (cell === 0) classes.push('road')
  else if (cell === 1) classes.push('station')
  else if (cell === 2) classes.push('obstacle')
  
  // 检查是否有车辆在此位置
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
  // 检查是否有车辆在此位置
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
  
  // 检查是否有车辆在此位置
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
  // 这里应该加载实际的地图文件，暂时使用模拟数据
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
    
    // 计算到最近换电站的路线
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
    
    // 找到所有道路位置
    for (let y = 0; y < mapGrid.value.length; y++) {
      for (let x = 0; x < mapGrid.value[y].length; x++) {
        if (mapGrid.value[y][x] === 0) { // 道路
          roads.push({ x: x + 1, y: y + 1 })
        }
      }
    }
    
    if (roads.length > 0) {
      const randomPos = roads[Math.floor(Math.random() * roads.length)]
      mapStore.setVehiclePosition(selectedVehicleId.value, randomPos)
      
      // 重新计算路线
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
  padding: 20px;
}

.map-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-group label {
  font-weight: 500;
}

.control-group select {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
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

.map-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 20px;
  margin-bottom: 20px;
  min-height: 400px;
}

.map-grid {
  display: inline-block;
  border: 2px solid #2c3e50;
}

.map-row {
  display: flex;
}

.map-cell {
  width: 30px;
  height: 30px;
  border: 1px solid #bdc3c7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.map-cell:hover {
  transform: scale(1.1);
  z-index: 1;
  position: relative;
}

.map-cell.road {
  background: #ecf0f1;
}

.map-cell.station {
  background: #e74c3c;
  color: white;
}

.map-cell.obstacle {
  background: #2c3e50;
  color: white;
}

.map-cell.vehicle {
  background: #3498db;
  color: white;
  border: 2px solid #2980b9;
}

.map-cell.selected-vehicle {
  background: #f39c12;
  border: 2px solid #e67e22;
}

.map-placeholder {
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #7f8c8d;
}

.map-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.info-panel, .route-info {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.legend {
  margin-top: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.legend-color {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border: 1px solid #bdc3c7;
}

.legend-color.road {
  background: #ecf0f1;
}

.legend-color.station {
  background: #e74c3c;
}

.legend-color.obstacle {
  background: #2c3e50;
}

.legend-color.vehicle {
  background: #3498db;
}

.route-details p {
  margin: 5px 0;
}

.rescue-warning {
  color: #e74c3c;
  font-weight: bold;
}
</style>