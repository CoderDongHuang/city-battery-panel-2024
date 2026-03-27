<template>
  <div class="position-control">
    <div class="control-header">
      <h4>🗺️ 位置设置</h4>
      <span class="vehicle-id">车辆编号: {{ vehicle.vid }}</span>
    </div>
    
    <div class="vehicle-info">
      <span>状态: </span>
      <span class="status" :class="{ online: isOnline, offline: !isOnline }">
        {{ isOnline ? '🟢 在线' : '🔴 离线' }}
      </span>
    </div>
    
    <div v-if="currentPosition" class="current-position-info">
      <span>当前位置: x={{ currentPosition.x.toFixed(2) }}, y={{ currentPosition.y.toFixed(2) }}</span>
    </div>
    
    <div class="control-section">
      <div class="coordinate-inputs">
        <div class="coordinate-input">
          <label>X坐标:</label>
          <input 
            type="number" 
            v-model="targetX" 
            :min="-180" 
            :max="180" 
            step="0.1"
            :disabled="!isOnline"
            placeholder="-180 到 180"
          />
        </div>
        <div class="coordinate-input">
          <label>Y坐标:</label>
          <input 
            type="number" 
            v-model="targetY" 
            :min="-90" 
            :max="90" 
            step="0.1"
            :disabled="!isOnline"
            placeholder="-90 到 90"
          />
        </div>
      </div>
      
      <!-- 简化版地图预览 -->
      <div class="map-section">
        <label>地图预览:</label>
        <div class="map-container" @click="handleMapClick">
          <div class="map-background">
            <!-- 简化的网格背景 -->
            <div class="grid-lines"></div>
          </div>
          
          <!-- 当前位置标记 -->
          <div 
            v-if="currentPosition" 
            class="current-position-marker"
            :style="{ 
              left: mapX(currentPosition.x) + '%', 
              top: mapY(currentPosition.y) + '%' 
            }"
          >
            🚗
          </div>
          
          <!-- 目标位置标记 -->
          <div 
            class="target-position-marker"
            :style="{ 
              left: mapX(targetX) + '%', 
              top: mapY(targetY) + '%' 
            }"
          >
            📍
          </div>
        </div>
      </div>
      
      <div class="action-control">
        <button 
          class="btn-set-position" 
          @click="setPosition"
          :disabled="!isOnline || isSetting"
        >
          {{ isSetting ? '设置中...' : '🚀 发送位置设置指令' }}
        </button>
      </div>
    </div>
    
    <div v-if="!isOnline" class="offline-notice">
      ⚠️ 车辆不在线，无法进行位置设置
    </div>
    
    <div v-if="message" class="message" :class="{ success: messageType === 'success', error: messageType === 'error' }">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { vehicleAPI } from '../services/api'

const props = defineProps({
  vehicle: {
    type: Object,
    required: true
  }
})

// 响应式数据
const targetX = ref(20.0)
const targetY = ref(25.0)
const isSetting = ref(false)
const message = ref('')
const messageType = ref('')

// 从vehicle对象获取实际位置数据
const currentPosition = computed(() => {
  if (props.vehicle && props.vehicle.location) {
    return {
      x: props.vehicle.location.lng || 116.40,
      y: props.vehicle.location.lat || 39.90
    }
  }
  // 如果没有位置数据，使用默认值
  return { x: 116.40, y: 39.90 }
})

// 计算属性
const isOnline = computed(() => props.vehicle.online === true)

// 坐标映射函数（将经纬度映射到地图容器的百分比位置）
const mapX = (x) => {
  // 将经度(-180到180)映射到(0%到100%)
  return ((x + 180) / 360) * 100
}

const mapY = (y) => {
  // 将纬度(-90到90)映射到(100%到0%)（Y轴反转）
  return 100 - ((y + 90) / 180) * 100
}

// 地图点击事件
const handleMapClick = (event) => {
  if (!isOnline.value) return
  
  const rect = event.currentTarget.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const clickY = event.clientY - rect.top
  
  // 将点击位置转换为经纬度
  const width = rect.width
  const height = rect.height
  
  // 计算经纬度
  const x = (clickX / width) * 360 - 180
  const y = 90 - (clickY / height) * 180
  
  // 更新目标坐标
  targetX.value = parseFloat(x.toFixed(2))
  targetY.value = parseFloat(y.toFixed(2))
}

// 参数验证
const validateParams = () => {
  if (typeof targetX.value !== 'number' || typeof targetY.value !== 'number') {
    return '坐标参数必须是数字'
  }
  
  if (targetX.value < -180 || targetX.value > 180) {
    return 'X坐标必须在-180到180之间'
  }
  
  if (targetY.value < -90 || targetY.value > 90) {
    return 'Y坐标必须在-90到90之间'
  }
  
  if (isNaN(targetX.value) || isNaN(targetY.value)) {
    return '坐标参数不能为空'
  }
  
  return null
}

// 设置位置
const setPosition = async () => {
  // 清除之前的消息
  message.value = ''
  messageType.value = ''
  
  // 参数验证
  const validationError = validateParams()
  if (validationError) {
    message.value = validationError
    messageType.value = 'error'
    return
  }
  
  // 检查车辆在线状态
  if (!isOnline.value) {
    message.value = '车辆不在线，无法设置位置'
    messageType.value = 'error'
    return
  }
  
  try {
    isSetting.value = true
    
    // 构建控制命令
    const command = {
      x: targetX.value,
      y: targetY.value
    }
    
    console.log('发送位置设置指令:', command)
    
    // 调用API
    const response = await vehicleAPI.setPosition(props.vehicle.vid, command)
    
    // 处理后端API响应格式: { code: 200, message: "位置设置指令发送成功", data: null }
    if (response && response.code === 200) {
      message.value = response.message || '位置设置指令发送成功'
      messageType.value = 'success'
      console.log('位置设置成功:', response.message)
    } else {
      message.value = response?.message || '位置设置失败'
      messageType.value = 'error'
      console.error('位置设置失败:', response)
    }
    
  } catch (error) {
    console.error('位置设置网络错误:', error)
    
    if (error.response) {
      const status = error.response.status
      if (status === 400) {
        message.value = '参数错误或车辆不在线'
        messageType.value = 'error'
      } else if (status === 404) {
        message.value = '车辆不存在'
        messageType.value = 'error'
      } else if (status === 500) {
        message.value = '服务器内部错误'
        messageType.value = 'error'
      } else {
        message.value = `请求失败: ${status}`
        messageType.value = 'error'
      }
    } else if (error.request) {
      message.value = '网络连接失败，请检查网络连接'
      messageType.value = 'error'
    } else {
      message.value = error.message || '未知错误'
      messageType.value = 'error'
    }
  } finally {
    isSetting.value = false
    
    // 5秒后清除消息
    setTimeout(() => {
      message.value = ''
      messageType.value = ''
    }, 5000)
  }
}

// 监听车辆变化
watch(() => props.vehicle, (newVehicle) => {
  console.log('车辆信息更新:', newVehicle)
  // 清除之前的消息
  message.value = ''
  messageType.value = ''
})
</script>

<style scoped>
.position-control {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
  margin-top: 16px;
}

.control-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}

.control-header h4 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.vehicle-id {
  font-size: 12px;
  color: #666;
  background: #e8f4fd;
  padding: 4px 8px;
  border-radius: 4px;
}

.vehicle-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
}

.status.online {
  color: #52c41a;
  font-weight: 500;
}

.status.offline {
  color: #f5222d;
  font-weight: 500;
}

.current-position-info {
  font-size: 12px;
  color: #666;
  margin-bottom: 16px;
  background: #f0f2f5;
  padding: 6px 10px;
  border-radius: 4px;
}

.control-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.coordinate-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.coordinate-input label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.coordinate-input input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.coordinate-input input:focus {
  border-color: #1890ff;
  outline: none;
}

.coordinate-input input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.map-section label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.map-container {
  position: relative;
  width: 100%;
  height: 150px;
  background: #f0f2f5;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: crosshair;
  overflow: hidden;
}

.map-background {
  width: 100%;
  height: 100%;
  position: relative;
}

.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(to right, #e8e8e8 1px, transparent 1px),
    linear-gradient(to bottom, #e8e8e8 1px, transparent 1px);
  background-size: 20px 20px;
}

.current-position-marker,
.target-position-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  font-size: 18px;
  z-index: 10;
  pointer-events: none;
}

.target-position-marker {
  font-size: 16px;
  z-index: 5;
}

.action-control {
  text-align: center;
}

.btn-set-position {
  background: #1890ff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 160px;
}

.btn-set-position:hover:not(:disabled) {
  background: #40a9ff;
}

.btn-set-position:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
}

.offline-notice {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  padding: 8px 12px;
  color: #856404;
  font-size: 12px;
  text-align: center;
  margin-top: 12px;
}

.message {
  margin-top: 12px;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  text-align: center;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>