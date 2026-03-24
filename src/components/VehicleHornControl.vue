<template>
  <div class="horn-control">
    <div class="control-header">
      <h4>📢 鸣笛控制</h4>
      <span class="vehicle-id">车辆编号: {{ vehicle.vid }}</span>
    </div>
    
    <div class="control-section">
      <div class="pattern-control">
        <label>鸣笛模式:</label>
        <div class="pattern-buttons">
          <button 
            v-for="pattern in hornPatterns" 
            :key="pattern.value"
            class="pattern-btn"
            :class="{ active: selectedPattern === pattern.value }"
            @click="selectPattern(pattern.value)"
            :disabled="!isOnline"
          >
            {{ pattern.label }}
          </button>
        </div>
      </div>
      
      <div class="interval-control">
        <label>间隔时间: {{ interval }}ms</label>
        <input 
          type="range" 
          v-model="interval" 
          min="100" 
          max="5000" 
          step="100"
          :disabled="!isOnline"
        />
        <div class="interval-labels">
          <span>100ms</span>
          <span>5000ms</span>
        </div>
      </div>
      
      <div class="action-control">
        <button 
          class="btn-beep" 
          @click="beepHorn"
          :disabled="!isOnline || isBeeping"
        >
          {{ isBeeping ? '鸣笛中...' : '🔊 执行鸣笛' }}
        </button>
      </div>
    </div>
    
    <div v-if="!isOnline" class="offline-notice">
      ⚠️ 车辆不在线，无法进行鸣笛控制
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

// 鸣笛模式配置
const hornPatterns = [
  { value: 'single', label: '单次鸣笛' },
  { value: 'double', label: '双次鸣笛' },
  { value: 'triple', label: '三次鸣笛' },
  { value: 'continuous', label: '持续鸣笛' }
]

// 响应式数据
const selectedPattern = ref('single')
const interval = ref(500)
const isBeeping = ref(false)
const message = ref('')
const messageType = ref('')

// 计算属性
const isOnline = computed(() => props.vehicle.online === true)

// 选择鸣笛模式
const selectPattern = (pattern) => {
  selectedPattern.value = pattern
}

// 验证参数
const validateParams = () => {
  const validPatterns = ['single', 'double', 'triple', 'continuous']
  if (!validPatterns.includes(selectedPattern.value)) {
    return '无效的鸣笛模式'
  }
  
  if (interval.value < 100 || interval.value > 5000) {
    return '间隔时间必须在100-5000ms之间'
  }
  
  return null
}

// 执行鸣笛控制
const beepHorn = async () => {
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
    message.value = '车辆不在线，无法发送控制指令'
    messageType.value = 'error'
    return
  }
  
  try {
    isBeeping.value = true
    
    // 构建控制命令
    const command = {
      pattern: selectedPattern.value,
      interval: interval.value
    }
    
    console.log('发送鸣笛控制指令:', command)
    
    // 调用API
    const response = await vehicleAPI.controlHorn(props.vehicle.vid, command)
    
    // 处理响应
    // 检查响应是否为字符串（可能后端直接返回'success'字符串）
    if (typeof response === 'string') {
      if (response.toLowerCase().includes('success')) {
        message.value = '鸣笛控制指令发送成功'
        messageType.value = 'success'
        console.log('鸣笛控制成功')
      } else {
        message.value = response || '鸣笛控制失败'
        messageType.value = 'error'
        console.error('鸣笛控制失败:', response)
      }
    } else if (response && (response.success === true || response.success === 'true')) {
      // 处理布尔值或字符串'true'
      message.value = response.message || '鸣笛控制指令发送成功'
      messageType.value = 'success'
      console.log('鸣笛控制成功:', response.message)
    } else if (response && response.code === 200) {
      // 检查code字段
      message.value = response.message || '鸣笛控制指令发送成功'
      messageType.value = 'success'
      console.log('鸣笛控制成功:', response.message)
    } else {
      message.value = response?.message || '鸣笛控制失败'
      messageType.value = 'error'
      console.error('鸣笛控制失败:', response)
    }
    
  } catch (error) {
    console.error('鸣笛控制网络错误:', error)
    
    if (error.response) {
      // HTTP错误
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
      // 网络错误
      message.value = '网络连接失败，请检查网络连接'
      messageType.value = 'error'
    } else {
      // 其他错误
      message.value = error.message || '未知错误'
      messageType.value = 'error'
    }
  } finally {
    isBeeping.value = false
    
    // 3秒后清除消息
    setTimeout(() => {
      message.value = ''
      messageType.value = ''
    }, 3000)
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
.horn-control {
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
  margin-bottom: 16px;
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

.control-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pattern-control label,
.interval-control label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.pattern-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.pattern-btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
}

.pattern-btn:hover:not(:disabled) {
  border-color: #007bff;
  background: #f8f9fa;
}

.pattern-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.pattern-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.interval-control input[type="range"] {
  width: 100%;
  margin: 8px 0;
}

.interval-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}

.action-control {
  text-align: center;
}

.btn-beep {
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 120px;
}

.btn-beep:hover:not(:disabled) {
  background: #218838;
}

.btn-beep:disabled {
  background: #6c757d;
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