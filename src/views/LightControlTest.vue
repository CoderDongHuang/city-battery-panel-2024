<template>
  <div class="light-control-test">
    <div class="test-header">
      <h1>灯光控制功能测试</h1>
      <p class="test-description">测试车辆灯光控制功能，验证与后端API的集成</p>
    </div>

    <!-- 测试车辆选择 -->
    <div class="test-section">
      <h3>选择测试车辆</h3>
      <div class="vehicle-selector">
        <select v-model="selectedVehicleId" @change="onVehicleChange">
          <option value="">请选择车辆</option>
          <option v-for="vehicle in vehicles" :key="vehicle.vid" :value="vehicle.vid">
            {{ vehicle.vid }} - {{ vehicle.online ? '在线' : '离线' }}
          </option>
        </select>
        
        <button class="btn btn-primary" @click="refreshVehicles">
          <span class="btn-icon">🔄</span>
          刷新车辆列表
        </button>
      </div>
    </div>

    <!-- 灯光控制组件测试 -->
    <div v-if="selectedVehicle" class="test-section">
      <h3>灯光控制功能测试</h3>
      <div class="test-info">
        <p><strong>当前车辆:</strong> {{ selectedVehicle.vid }}</p>
        <p><strong>状态:</strong> <span :class="{ 'online': selectedVehicle.online, 'offline': !selectedVehicle.online }">
          {{ selectedVehicle.online ? '在线' : '离线' }}
        </span></p>
        <p><strong>电池电量:</strong> {{ selectedVehicle.batteryLevel || '--' }}%</p>
      </div>
      
      <VehicleLightControl :vehicle="selectedVehicle" />
    </div>

    <!-- API测试结果 -->
    <div class="test-section">
      <h3>API测试结果</h3>
      <div class="test-results">
        <div v-for="result in testResults" :key="result.id" class="test-result" :class="result.status">
          <span class="result-icon">{{ result.icon }}</span>
          <div class="result-content">
            <div class="result-title">{{ result.title }}</div>
            <div class="result-message">{{ result.message }}</div>
            <div v-if="result.details" class="result-details">{{ result.details }}</div>
          </div>
        </div>
        
        <div v-if="testResults.length === 0" class="no-results">
          暂无测试结果，请选择车辆进行测试
        </div>
      </div>
    </div>

    <!-- 快速测试按钮 -->
    <div class="test-section">
      <h3>快速测试</h3>
      <div class="quick-test-buttons">
        <button class="btn btn-success" @click="testAllFunctions" :disabled="!selectedVehicle">
          <span class="btn-icon">🧪</span>
          运行完整测试
        </button>
        
        <button class="btn btn-warning" @click="clearResults">
          <span class="btn-icon">🗑️</span>
          清除测试结果
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useApiVehicleStore } from '../store/modules/apiVehicleStore'
import { vehicleAPI } from '../services/api'
import VehicleLightControl from '../components/VehicleLightControl.vue'

const vehicleStore = useApiVehicleStore()
const selectedVehicleId = ref('')
const testResults = ref([])

// 计算属性
const vehicles = computed(() => vehicleStore.vehicles)
const selectedVehicle = computed(() => 
  vehicles.value.find(v => v.vid === selectedVehicleId.value)
)

// 方法
const onVehicleChange = () => {
  if (selectedVehicle.value) {
    addTestResult('车辆选择', 'success', '已选择车辆: ' + selectedVehicle.value.vid)
  }
}

const refreshVehicles = async () => {
  try {
    await vehicleStore.fetchVehicles()
    addTestResult('刷新车辆', 'success', '车辆列表已刷新，共 ' + vehicles.value.length + ' 辆车')
  } catch (error) {
    addTestResult('刷新车辆', 'error', '刷新失败: ' + error.message)
  }
}

const testAllFunctions = async () => {
  if (!selectedVehicle.value) return
  
  const vehicle = selectedVehicle.value
  
  // 测试API连接
  try {
    addTestResult('API连接', 'testing', '正在测试API连接...')
    
    // 测试灯光状态控制
    await testLightStatus(vehicle)
    
    // 测试闪烁控制
    await testFlashControl(vehicle)
    
  } catch (error) {
    addTestResult('API连接', 'error', 'API连接失败: ' + error.message)
  }
}

const testLightStatus = async (vehicle) => {
  try {
    addTestResult('灯光状态控制', 'testing', '正在测试灯光状态控制...')
    
    // 测试关闭灯光
    await vehicleAPI.controlLights(vehicle.vid, {
      type: 'status',
      status: 'off'
    })
    addTestResult('关闭灯光', 'success', '关闭灯光指令发送成功')
    
    // 测试近光灯
    await vehicleAPI.controlLights(vehicle.vid, {
      type: 'status',
      status: 'lowBeam'
    })
    addTestResult('近光灯控制', 'success', '近光灯指令发送成功')
    
    // 测试远光灯
    await vehicleAPI.controlLights(vehicle.vid, {
      type: 'status',
      status: 'highBeam'
    })
    addTestResult('远光灯控制', 'success', '远光灯指令发送成功')
    
  } catch (error) {
    addTestResult('灯光状态控制', 'error', '灯光状态控制失败: ' + error.message)
  }
}

const testFlashControl = async (vehicle) => {
  try {
    addTestResult('闪烁控制', 'testing', '正在测试闪烁控制...')
    
    // 测试持续闪烁
    await vehicleAPI.controlLights(vehicle.vid, {
      type: 'flash',
      pattern: 'continuous',
      duration: 3000
    })
    addTestResult('持续闪烁', 'success', '持续闪烁指令发送成功')
    
    // 测试间隔闪烁
    await vehicleAPI.controlLights(vehicle.vid, {
      type: 'flash',
      pattern: 'interval',
      duration: 3000
    })
    addTestResult('间隔闪烁', 'success', '间隔闪烁指令发送成功')
    
    // 测试快速闪烁
    await vehicleAPI.controlLights(vehicle.vid, {
      type: 'flash',
      pattern: 'fast',
      duration: 2000
    })
    addTestResult('快速闪烁', 'success', '快速闪烁指令发送成功')
    
  } catch (error) {
    addTestResult('闪烁控制', 'error', '闪烁控制失败: ' + error.message)
  }
}

const addTestResult = (title, status, message, details = '') => {
  const icons = {
    success: '✅',
    error: '❌',
    testing: '⏳',
    info: 'ℹ️'
  }
  
  testResults.value.unshift({
    id: Date.now() + Math.random(),
    title,
    status,
    message,
    details,
    icon: icons[status] || 'ℹ️',
    timestamp: new Date().toLocaleTimeString()
  })
  
  // 限制结果数量
  if (testResults.value.length > 10) {
    testResults.value = testResults.value.slice(0, 10)
  }
}

const clearResults = () => {
  testResults.value = []
}

// 初始化
onMounted(async () => {
  addTestResult('页面加载', 'info', '灯光控制测试页面已加载')
  
  // 加载车辆数据
  try {
    await vehicleStore.fetchVehicles()
    addTestResult('数据加载', 'success', '车辆数据加载成功，共 ' + vehicles.value.length + ' 辆车')
  } catch (error) {
    addTestResult('数据加载', 'error', '车辆数据加载失败: ' + error.message)
  }
})
</script>

<style scoped>
.light-control-test {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.test-header {
  text-align: center;
  margin-bottom: 32px;
}

.test-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.test-description {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.test-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.test-section h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
}

.vehicle-selector {
  display: flex;
  gap: 16px;
  align-items: center;
}

.vehicle-selector select {
  padding: 10px 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 14px;
  min-width: 200px;
}

.test-info {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.test-info p {
  margin: 8px 0;
  font-size: 14px;
}

.online {
  color: #28a745;
  font-weight: 600;
}

.offline {
  color: #dc3545;
  font-weight: 600;
}

.test-results {
  max-height: 400px;
  overflow-y: auto;
}

.test-result {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  border-left: 4px solid #dee2e6;
}

.test-result.success {
  background: #d4edda;
  border-left-color: #28a745;
}

.test-result.error {
  background: #f8d7da;
  border-left-color: #dc3545;
}

.test-result.testing {
  background: #fff3cd;
  border-left-color: #ffc107;
}

.test-result.info {
  background: #d1ecf1;
  border-left-color: #17a2b8;
}

.result-icon {
  font-size: 18px;
  margin-top: 2px;
}

.result-content {
  flex: 1;
}

.result-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}

.result-message {
  font-size: 13px;
  color: #495057;
}

.result-details {
  font-size: 12px;
  color: #6c757d;
  margin-top: 4px;
}

.no-results {
  text-align: center;
  color: #6c757d;
  font-style: italic;
  padding: 20px;
}

.quick-test-buttons {
  display: flex;
  gap: 12px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #1e7e34;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-warning:hover:not(:disabled) {
  background: #e0a800;
}

.btn-icon {
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .light-control-test {
    padding: 16px;
  }
  
  .vehicle-selector {
    flex-direction: column;
    align-items: stretch;
  }
  
  .vehicle-selector select {
    min-width: auto;
  }
  
  .quick-test-buttons {
    flex-direction: column;
  }
}
</style>