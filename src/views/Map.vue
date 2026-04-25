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
          <button class="refresh-btn" @click="refreshMap">
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
              <option value="">请选择车辆</option>
              <option v-for="vehicle in vehicleStore.vehicles" :key="vehicle.vid" :value="vehicle.vid" :disabled="!vehicle.online">
                {{ vehicle.vid }} - {{ vehicle.online ? '在线' : '离线' }}
              </option>
            </select>
            <div v-if="vehicleStore.vehicles.length === 0" class="no-vehicles">
              暂无车辆数据
            </div>
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
            <div v-if="selectedVehicleId" class="position-control-container">
              <VehiclePositionControl :vehicle="getSelectedVehicle()" />
            </div>
            <div v-else class="no-vehicle-selected">
              <p>请先选择车辆</p>
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
            <span class="stat-value">{{ swapStationsCount }}</span>
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
            <div class="legend-color vehicle"></div>
            <div class="legend-content">
              <span class="legend-label">车辆</span>
              <span class="legend-desc">在线车辆位置</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 地图容器 -->
      <div class="map-container">
        <div id="amap-container" class="amap-container"></div>
        <div v-if="!mapLoaded" class="map-loading">
          <div class="loading-spinner">🔄</div>
          <p>地图加载中...</p>
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
              <span class="item-value">{{ recommendedRoute.stationName }}</span>
            </div>
            <div class="route-item">
              <span class="item-label">预计距离</span>
              <span class="item-value">{{ recommendedRoute.distance?.toFixed(2) || 0 }} km</span>
            </div>
            <div class="route-item" v-if="recommendedRoute.rescueNeeded">
              <span class="item-label">状态</span>
              <span class="item-value warning">⚠️ 需要救援支持</span>
            </div>
            <div class="route-actions">
              <button class="action-btn primary" @click="startNavigation">
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
    
    <!-- 页脚 -->
    <SiteFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, nextTick } from 'vue'
import { useMapStore } from '../store/modules/mapStore'
import { useApiVehicleStore } from '../store/modules/apiVehicleStore'
import { stationAPI } from '../services/api'
import VehiclePositionControl from '../components/VehiclePositionControl.vue'
import SiteFooter from '../components/SiteFooter.vue'

const mapStore = useMapStore()
const vehicleStore = useApiVehicleStore()

const selectedVehicleId = ref('')
const mapInstance = ref(null)
const recommendedRoute = ref(null)
const swapStationsCount = ref(0)
const vehicleMarkers = ref([])
const stationMarkers = ref([])
const mapLoaded = ref(false)

const onlineVehicles = computed(() => {
  return vehicleStore.vehicles.filter(v => v.online)
})

const offlineVehicles = computed(() => {
  return vehicleStore.vehicles.filter(v => !v.online)
})

const alertVehicles = computed(() => {
  return vehicleStore.vehicles.filter(v => v.alerts && v.alerts.length > 0)
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

const getSelectedVehicle = () => {
  if (!selectedVehicleId.value) return null
  return vehicleStore.getVehicleById(selectedVehicleId.value)
}

// 初始化高德地图
const initMap = async () => {
  try {
    // 等待 DOM 渲染完成
    await nextTick()
    
    // 确保容器存在
    const container = document.getElementById('amap-container')
    if (!container) {
      console.error('地图容器不存在')
      return
    }
    
    // 确保 AMap 已加载
    if (!window.AMap) {
      console.error('AMap 未加载')
      return
    }
    
    console.log('开始初始化地图...')
    console.log('容器:', container)
    console.log('容器高度:', window.getComputedStyle(container).height)
    
    // 直接创建地图实例
    mapInstance.value = new window.AMap.Map('amap-container', {
      center: [116.397428, 39.90923], // 北京市中心
      zoom: 12,
      mapStyle: 'amap://styles/normal',
      features: ['bg', 'road', 'building', 'point']
    })
    
    console.log('地图初始化成功:', mapInstance.value)
    
    mapLoaded.value = true
    
    // 添加缩放控件（高德地图 2.0 默认已包含基础控件）
    // 如果需要自定义控件，可以使用 mapInstance.value.addControl()
    
    // 加载车辆和换电站数据
    await loadMapData()
    
    // 监听地图事件
    mapInstance.value.on('click', (e) => {
      console.log('地图点击事件:', e.lnglat)
    })
  } catch (error) {
    console.error('初始化地图失败:', error)
    alert('地图加载失败，请检查网络或高德地图 Key 配置')
  }
}

// 刷新地图
const refreshMap = async () => {
  await loadMapData()
}

// 加载地图数据（车辆和换电站）
const loadMapData = async () => {
  try {
    // 加载车辆数据
    await vehicleStore.loadVehicles()
    updateVehicleMarkers()
    
    // 加载换电站数据
    const response = await stationAPI.getStationStatistics()
    if (response.code === 200 && response.data) {
      swapStationsCount.value = response.data.total || 0
      await loadStationMarkers()
    }
  } catch (error) {
    console.error('加载地图数据失败:', error)
  }
}

// 更新车辆标记
const updateVehicleMarkers = () => {
  if (!mapInstance.value) return
  
  // 清除旧标记
  clearMarkers(mapInstance.value, vehicleMarkers.value)
  vehicleMarkers.value = []
  
  // 创建新标记
  const vehicles = vehicleStore.vehicles
  const markers = vehicles.map(vehicle => {
    const position = [vehicle.longitude || 116.397428, vehicle.latitude || 39.90923]
    
    const marker = createMarker(mapInstance.value, position, {
      title: `${vehicle.vid} - ${vehicle.online ? '在线' : '离线'}`,
      label: vehicle.vid
    })
    
    // 添加点击事件
    marker.on('click', () => {
      selectedVehicleId.value = vehicle.vid
      showVehicleInfo(vehicle)
    })
    
    return marker
  })
  
  vehicleMarkers.value = markers
}

// 创建换电站标记
const loadStationMarkers = async () => {
  if (!mapInstance.value) return
  
  try {
    // TODO: 调用后端 API 获取换电站列表
    // 这里使用模拟数据
    const stations = [
      { id: 1, name: '市中心换电站', longitude: 116.407428, latitude: 39.91923, availableBatteries: 15 },
      { id: 2, name: '科技园换电站', longitude: 116.387428, latitude: 39.89923, availableBatteries: 8 }
    ]
    
    // 清除旧标记
    clearMarkers(mapInstance.value, stationMarkers.value)
    stationMarkers.value = []
    
    // 创建新标记
    const markers = stations.map(station => {
      const position = [station.longitude, station.latitude]
      
      const marker = createMarker(mapInstance.value, position, {
        title: `${station.name} - 可用电池：${station.availableBatteries}`,
        label: station.name
      })
      
      // 添加点击事件
      marker.on('click', () => {
        showStationInfo(station)
      })
      
      return marker
    })
    
    stationMarkers.value = markers
  } catch (error) {
    console.error('加载换电站标记失败:', error)
  }
}

// 显示车辆信息
const showVehicleInfo = (vehicle) => {
  if (!mapInstance.value) return
  
  const content = `
    <div class="info-window">
      <h4>${vehicle.vid}</h4>
      <p>状态：${vehicle.online ? '🟢 在线' : '🔴 离线'}</p>
      <p>电量：${vehicle.batteryLevel || 0}%</p>
      <p>速度：${vehicle.speed || 0} km/h</p>
    </div>
  `
  
  const position = [vehicle.longitude || 116.397428, vehicle.latitude || 39.90923]
  createInfoWindow(mapInstance.value, position, content)
}

// 显示换电站信息
const showStationInfo = (station) => {
  if (!mapInstance.value) return
  
  const content = `
    <div class="info-window">
      <h4>${station.name}</h4>
      <p>可用电池：${station.availableBatteries}</p>
      <p>地址：${station.address || '未知'}</p>
    </div>
  `
  
  const position = [station.longitude, station.latitude]
  createInfoWindow(mapInstance.value, position, content)
}

// 车辆选择事件
const onVehicleSelect = () => {
  if (selectedVehicleId.value) {
    const vehicle = getSelectedVehicle()
    if (vehicle && mapInstance.value) {
      const position = [vehicle.longitude || 116.397428, vehicle.latitude || 39.90923]
      mapInstance.value.panTo(position)
      mapInstance.value.setZoom(15)
      
      // 计算路径规划
      calculateRoute(vehicle)
    }
  } else {
    recommendedRoute.value = null
  }
}

// 计算路径规划
const calculateRoute = async (vehicle) => {
  // TODO: 实现路径规划逻辑
  // 这里使用模拟数据
  recommendedRoute.value = {
    stationName: '市中心换电站',
    distance: 3.5,
    rescueNeeded: (vehicle.batteryLevel || 0) < 20
  }
}

// 开始导航
const startNavigation = () => {
  if (recommendedRoute.value) {
    alert(`开始导航到：${recommendedRoute.value.stationName}`)
    // TODO: 集成导航功能
  }
}

// 生命周期
onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (mapInstance.value) {
    mapInstance.value.destroy()
  }
})
</script>

<style scoped>
.map-view {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 24px;
}

.map-controls-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title-group {
  flex: 1;
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.section-description {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.section-controls {
  display: flex;
  gap: 12px;
}

.refresh-btn {
  padding: 10px 20px;
  background: white;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.refresh-btn:hover {
  border-color: #667eea;
  background: #f0f5ff;
}

.refresh-icon {
  font-size: 16px;
}

.controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.control-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
}

.control-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.control-icon {
  font-size: 32px;
}

.control-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.control-info p {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.control-body {
  min-height: 80px;
}

.vehicle-select {
  width: 100%;
  padding: 10px;
  border: 2px solid #e8e8e8;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.vehicle-select:focus {
  border-color: #667eea;
  outline: none;
}

.no-vehicles,
.no-vehicle-selected {
  padding: 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.position-control-container {
  min-height: 80px;
}

.map-display-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.map-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 13px;
  color: #999;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
}

.map-legend {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.legend-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.legend-header h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.legend-badge {
  padding: 2px 8px;
  background: #667eea;
  color: white;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.legend-items {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.legend-color.road {
  background: #e0e0e0;
}

.legend-color.station {
  background: #667eea;
}

.legend-color.vehicle {
  background: #52c41a;
}

.legend-content {
  display: flex;
  flex-direction: column;
}

.legend-label {
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
}

.legend-desc {
  font-size: 12px;
  color: #666;
}

.map-container {
  position: relative;
  height: 600px;
  border-radius: 8px;
  overflow: hidden;
}

.amap-container {
  width: 100%;
  height: 100%;
}

.map-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 1000;
}

.loading-spinner {
  font-size: 48px;
  margin-bottom: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.map-loading p {
  font-size: 16px;
  color: #666;
}

.info-panels-section {
  margin-bottom: 24px;
}

.panel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.info-panel {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.panel-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.panel-badge {
  padding: 4px 12px;
  background: #52c41a;
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.panel-badge.warning {
  background: #ff4d4f;
}

.vehicle-status {
  display: flex;
  gap: 24px;
}

.status-item {
  flex: 1;
  text-align: center;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.status-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.status-value {
  display: block;
  font-size: 28px;
  font-weight: bold;
  color: #1a1a1a;
}

.status-value.warning {
  color: #ff4d4f;
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
  padding: 12px;
  background: #f5f7fa;
  border-radius: 6px;
}

.item-label {
  font-size: 14px;
  color: #666;
}

.item-value {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.item-value.warning {
  color: #ff4d4f;
}

.route-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.action-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.route-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}

.placeholder-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.route-placeholder p {
  font-size: 14px;
  color: #999;
}

/* 深色模式适配 */
html.dark-mode .map-view {
  background: #1a1a1a;
}

html.dark-mode .map-controls-section,
html.dark-mode .map-display-section,
html.dark-mode .info-panel {
  background: #242424;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

html.dark-mode .section-title,
html.dark-mode .control-info h3,
html.dark-mode .panel-header h3 {
  color: #e0e0e0;
}

html.dark-mode .section-description,
html.dark-mode .control-info p,
html.dark-mode .legend-label {
  color: #b0b0b0;
}

html.dark-mode .refresh-btn {
  background: #3d3d3d;
  border-color: #555555;
  color: #e0e0e0;
}

html.dark-mode .refresh-btn:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.15);
}

html.dark-mode .control-card {
  background: #2d2d2d;
}

html.dark-mode .vehicle-select {
  background: #3d3d3d;
  border-color: #555555;
  color: #e0e0e0;
}

html.dark-mode .no-vehicles,
html.dark-mode .no-vehicle-selected {
  color: #999999;
}

html.dark-mode .map-legend {
  background: #2d2d2d;
}

html.dark-mode .legend-color.road {
  background: #555555;
}

html.dark-mode .status-item {
  background: #2d2d2d;
}

html.dark-mode .status-label {
  color: #999999;
}

html.dark-mode .status-value {
  color: #e0e0e0;
}

html.dark-mode .route-item {
  background: #2d2d2d;
}

html.dark-mode .item-label {
  color: #999999;
}

html.dark-mode .item-value {
  color: #e0e0e0;
}

html.dark-mode .route-placeholder p {
  color: #999999;
}

html.dark-mode .map-loading {
  background: rgba(26, 26, 26, 0.9);
}

html.dark-mode .map-loading p {
  color: #b0b0b0;
}
</style>
