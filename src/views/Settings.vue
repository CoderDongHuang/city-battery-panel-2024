<template>
  <div class="settings">
    <!-- 设置配置区域（大模块） -->
    <div class="settings-grid-section">
      <div class="section-header">
        <h2 class="section-title">系统设置</h2>
        <p class="section-description">配置系统参数、通信设置、地图配置和界面选项</p>
      </div>
      
      <div class="settings-grid">
      <div class="setting-section">
        <h3>系统参数配置</h3>
        <div class="setting-item">
          <label>最小电压 (Vmin):</label>
          <input v-model="systemConfig.vMin" type="number" step="0.1" />
        </div>
        <div class="setting-item">
          <label>最大电压 (Vmax):</label>
          <input v-model="systemConfig.vMax" type="number" step="0.1" />
        </div>
        <div class="setting-item">
          <label>低电量阈值 (%):</label>
          <input v-model="systemConfig.lowBatteryThreshold" type="number" min="0" max="100" />
        </div>
        <div class="setting-item">
          <label>充电提醒阈值 (%):</label>
          <input v-model="systemConfig.chargeReminderThreshold" type="number" min="0" max="100" />
        </div>
        <div class="setting-item">
          <label>高温报警阈值 (°C):</label>
          <input v-model="systemConfig.highTempThreshold" type="number" />
        </div>
        <div class="setting-item">
          <label>低温报警阈值 (°C):</label>
          <input v-model="systemConfig.lowTempThreshold" type="number" />
        </div>
      </div>
      
      <div class="setting-section">
        <h3>通信设置</h3>
        <div class="setting-item">
          <label>后端服务地址:</label>
          <input v-model="communicationConfig.serverUrl" type="text" />
        </div>
        <div class="setting-item">
          <label>WebSocket地址:</label>
          <input v-model="communicationConfig.websocketUrl" type="text" />
        </div>
        <div class="setting-item">
          <label>数据更新间隔 (秒):</label>
          <input v-model="communicationConfig.updateInterval" type="number" min="1" />
        </div>
        <div class="setting-item">
          <label>连接超时时间 (秒):</label>
          <input v-model="communicationConfig.timeout" type="number" min="5" />
        </div>
      </div>
      
      <div class="setting-section">
        <h3>地图设置</h3>
        <div class="setting-item">
          <label>地图文件路径:</label>
          <input v-model="mapConfig.mapFilePath" type="text" />
          <button class="btn btn-small" @click="browseMapFile">浏览</button>
        </div>
        <div class="setting-item">
          <label>地图网格大小:</label>
          <input v-model="mapConfig.gridSize" type="number" min="10" max="200" />
        </div>
        <div class="setting-item">
          <label>自动保存位置:</label>
          <input v-model="mapConfig.autoSave" type="checkbox" />
        </div>
      </div>
      
      <div class="setting-section">
        <h3>界面设置</h3>
        <div class="setting-item">
          <label>主题模式:</label>
          <select v-model="uiConfig.theme">
            <option value="light">浅色</option>
            <option value="dark">深色</option>
            <option value="auto">自动</option>
          </select>
        </div>
        <div class="setting-item">
          <label>语言:</label>
          <select v-model="uiConfig.language">
            <option value="zh-CN">中文</option>
            <option value="en-US">English</option>
          </select>
        </div>
        <div class="setting-item">
          <label>显示实时数据:</label>
          <input v-model="uiConfig.showRealTimeData" type="checkbox" />
        </div>
        <div class="setting-item">
          <label>显示动画效果:</label>
          <input v-model="uiConfig.showAnimations" type="checkbox" />
        </div>
      </div>
      </div>
      
      <div class="actions">
      <button class="btn btn-primary" @click="saveSettings">保存设置</button>
      <button class="btn btn-secondary" @click="resetSettings">恢复默认</button>
      <button class="btn btn-warning" @click="testConnection">测试连接</button>
      </div>
    </div>
    
    <!-- 系统信息区域（大模块） -->
    <div class="system-info-section">
      <div class="section-header">
        <h2 class="section-title">系统信息</h2>
        <p class="section-description">查看系统运行状态和连接信息</p>
      </div>
      
      <div class="system-info">
      <h3>系统信息</h3>
      <div class="info-grid">
        <div class="info-item">
          <label>前端版本:</label>
          <span>{{ systemInfo.frontendVersion }}</span>
        </div>
        <div class="info-item">
          <label>后端连接状态:</label>
          <span :class="systemInfo.backendStatus">{{ systemInfo.backendStatusText }}</span>
        </div>
        <div class="info-item">
          <label>WebSocket状态:</label>
          <span :class="systemInfo.websocketStatus">{{ systemInfo.websocketStatusText }}</span>
        </div>
        <div class="info-item">
          <label>在线车辆数:</label>
          <span>{{ systemInfo.onlineVehicles }}</span>
        </div>
        <div class="info-item">
          <label>总电池数:</label>
          <span>{{ systemInfo.totalBatteries }}</span>
        </div>
        <div class="info-item">
          <label>最后更新时间:</label>
          <span>{{ systemInfo.lastUpdate }}</span>
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

const vehicleStore = useVehicleStore()
const batteryStore = useBatteryStore()

// 系统配置
const systemConfig = ref({
  vMin: 3.0,
  vMax: 4.2,
  lowBatteryThreshold: 20,
  chargeReminderThreshold: 30,
  highTempThreshold: 60,
  lowTempThreshold: 0
})

// 通信配置
const communicationConfig = ref({
  serverUrl: 'http://localhost:8080/api',
  websocketUrl: 'ws://localhost:8080/ws',
  updateInterval: 5,
  timeout: 30
})

// 地图配置
const mapConfig = ref({
  mapFilePath: './map.txt',
  gridSize: 100,
  autoSave: true
})

// 界面配置
const uiConfig = ref({
  theme: 'light',
  language: 'zh-CN',
  showRealTimeData: true,
  showAnimations: true
})

// 系统信息
const systemInfo = ref({
  frontendVersion: '1.0.0',
  backendStatus: 'disconnected',
  backendStatusText: '未连接',
  websocketStatus: 'disconnected',
  websocketStatusText: '未连接',
  onlineVehicles: 0,
  totalBatteries: 0,
  lastUpdate: '--'
})

const browseMapFile = () => {
  // 模拟文件浏览对话框
  console.log('打开文件浏览器')
}

const saveSettings = () => {
  const settings = {
    system: systemConfig.value,
    communication: communicationConfig.value,
    map: mapConfig.value,
    ui: uiConfig.value
  }
  
  localStorage.setItem('city-battery-settings', JSON.stringify(settings))
  alert('设置已保存')
}

const resetSettings = () => {
  if (confirm('确定要恢复默认设置吗？')) {
    systemConfig.value = {
      vMin: 3.0,
      vMax: 4.2,
      lowBatteryThreshold: 20,
      chargeReminderThreshold: 30,
      highTempThreshold: 60,
      lowTempThreshold: 0
    }
    
    communicationConfig.value = {
      serverUrl: 'http://localhost:8080/api',
      websocketUrl: 'ws://localhost:8080/ws',
      updateInterval: 5,
      timeout: 30
    }
    
    mapConfig.value = {
      mapFilePath: './map.txt',
      gridSize: 100,
      autoSave: true
    }
    
    uiConfig.value = {
      theme: 'light',
      language: 'zh-CN',
      showRealTimeData: true,
      showAnimations: true
    }
    
    alert('设置已恢复默认值')
  }
}

const testConnection = async () => {
  systemInfo.value.backendStatus = 'testing'
  systemInfo.value.backendStatusText = '测试中...'
  
  // 模拟连接测试
  setTimeout(() => {
    systemInfo.value.backendStatus = 'connected'
    systemInfo.value.backendStatusText = '连接正常'
    alert('后端服务连接测试成功')
  }, 2000)
}

const updateSystemInfo = () => {
  systemInfo.value.onlineVehicles = vehicleStore.onlineVehicles.length
  systemInfo.value.totalBatteries = batteryStore.batteries.length
  systemInfo.value.lastUpdate = new Date().toLocaleString('zh-CN')
}

const loadSettings = () => {
  const saved = localStorage.getItem('city-battery-settings')
  if (saved) {
    try {
      const settings = JSON.parse(saved)
      Object.assign(systemConfig.value, settings.system)
      Object.assign(communicationConfig.value, settings.communication)
      Object.assign(mapConfig.value, settings.map)
      Object.assign(uiConfig.value, settings.ui)
    } catch (error) {
      console.error('加载设置失败:', error)
    }
  }
}

onMounted(() => {
  loadSettings()
  updateSystemInfo()
  
  // 定期更新系统信息
  setInterval(updateSystemInfo, 5000)
})
</script>

<style scoped>
.settings {
  padding: 24px;   /* 与 Dashboard 统一内边距 */
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* 大模块间距设置 - 与系统概览页面保持一致 */
.settings-grid-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 48px;          /* 大模块间距 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.system-info-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 0;             /* 最后一个模块不要下边距 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

/* 大模块悬停效果 */
.settings-grid-section:hover,
.system-info-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

/* 头部样式（与 Dashboard 保持一致） */
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

.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.setting-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.setting-section h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  border-bottom: 1px solid #ecf0f1;
  padding-bottom: 10px;
}

.setting-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.setting-item label {
  width: 150px;
  font-weight: 500;
  color: #2c3e50;
}

.setting-item input, .setting-item select {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.setting-item input[type="checkbox"] {
  flex: none;
  width: auto;
}

.btn-small {
  padding: 4px 8px;
  font-size: 12px;
  margin-left: 10px;
}

.actions {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.btn {
  padding: 10px 20px;
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

.system-info {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.system-info h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #ecf0f1;
}

.info-item label {
  font-weight: 500;
  color: #7f8c8d;
}

.info-item span.connected {
  color: #27ae60;
  font-weight: bold;
}

.info-item span.disconnected {
  color: #e74c3c;
  font-weight: bold;
}

.info-item span.testing {
  color: #f39c12;
  font-weight: bold;
}
</style>