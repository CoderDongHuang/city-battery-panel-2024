<template>
  <div class="vehicle-light-control">
    <div class="control-header">
      <h3>车辆灯光控制</h3>
      <span class="vehicle-info">车辆编号: {{ vehicle.vid }}</span>
    </div>

    <!-- 灯光状态控制 -->
    <div class="light-section">
      <h4>灯光状态控制</h4>
      <div class="status-controls">
        <button 
          class="status-btn"
          :class="{ active: currentStatus === 'off' }"
          @click="setLightStatus('off')"
          :disabled="!isOnline"
        >
          <span class="status-icon">🔴</span>
          关闭灯光
        </button>
        
        <button 
          class="status-btn"
          :class="{ active: currentStatus === 'lowBeam' }"
          @click="setLightStatus('lowBeam')"
          :disabled="!isOnline"
        >
          <span class="status-icon">🟡</span>
          近光灯
        </button>
        
        <button 
          class="status-btn"
          :class="{ active: currentStatus === 'highBeam' }"
          @click="setLightStatus('highBeam')"
          :disabled="!isOnline"
        >
          <span class="status-icon">🟢</span>
          远光灯
        </button>
      </div>
    </div>

    <!-- 闪烁控制 -->
    <div class="flash-section">
      <h4>闪烁控制</h4>
      <div class="flash-controls">
        <div class="flash-option">
          <label>闪烁模式:</label>
          <select v-model="flashPattern" :disabled="!isOnline">
            <option value="continuous">持续闪烁</option>
            <option value="interval">间隔闪烁</option>
            <option value="fast">快速闪烁</option>
            <option value="emergency">紧急闪烁</option>
          </select>
        </div>
        
        <div class="flash-option">
          <label>持续时间(ms):</label>
          <input 
            type="number" 
            v-model.number="flashDuration" 
            :disabled="!isOnline"
            min="1000" 
            max="10000"
            placeholder="3000"
          >
        </div>
        
        <button 
          class="flash-btn"
          @click="flashLights"
          :disabled="!isOnline"
        >
          <span class="flash-icon">💡</span>
          执行闪烁
        </button>
      </div>
    </div>

    <!-- 状态反馈 -->
    <div class="feedback-section" v-if="feedbackMessage">
      <div class="feedback" :class="feedbackClass">
        <span class="feedback-icon">{{ feedbackIcon }}</span>
        {{ feedbackMessage }}
      </div>
    </div>

    <!-- 车辆状态提示 -->
    <div v-if="!isOnline" class="offline-warning">
      <span class="warning-icon">⚠️</span>
      该车辆当前离线，无法进行远程控制
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { vehicleAPI } from '../services/api.js'

const props = defineProps({
  vehicle: {
    type: Object,
    required: true
  }
})

// 响应式数据
const currentStatus = ref('off')
const flashPattern = ref('continuous')
const flashDuration = ref(3000)
const feedbackMessage = ref('')
const feedbackClass = ref('')

// 计算属性
const isOnline = computed(() => props.vehicle.online === true)
const feedbackIcon = computed(() => {
  if (feedbackClass.value === 'success') return '✅'
  if (feedbackClass.value === 'error') return '❌'
  return 'ℹ️'
})

// 方法
const setLightStatus = async (status) => {
  if (!isOnline.value) return
  
  try {
    await vehicleAPI.controlLights(props.vehicle.vid, {
      status: status
    })
    
    currentStatus.value = status
    showFeedback(`灯光状态设置为: ${getStatusText(status)}`, 'success')
  } catch (error) {
    console.error('灯光控制失败:', error)
    showFeedback('灯光控制失败: ' + (error.response?.data?.message || error.message), 'error')
  }
}

const flashLights = async () => {
  if (!isOnline.value) return
  
  try {
    await vehicleAPI.flashLights(props.vehicle.vid, {
      pattern: flashPattern.value,
      duration: flashDuration.value
    })
    
    showFeedback(`闪烁指令发送成功 (模式: ${flashPattern.value}, 时长: ${flashDuration.value}ms)`, 'success')
  } catch (error) {
    console.error('闪烁控制失败:', error)
    showFeedback('闪烁控制失败: ' + (error.response?.data?.message || error.message), 'error')
  }
}

const getStatusText = (status) => {
  const statusMap = {
    off: '关闭',
    lowBeam: '近光灯',
    highBeam: '远光灯'
  }
  return statusMap[status] || '未知'
}

const showFeedback = (message, type) => {
  feedbackMessage.value = message
  feedbackClass.value = type
  
  // 3秒后清除反馈
  setTimeout(() => {
    feedbackMessage.value = ''
    feedbackClass.value = ''
  }, 3000)
}

// 初始化
onMounted(() => {
  // 可以在这里获取车辆的当前灯光状态
  console.log('灯光控制组件已加载，车辆:', props.vehicle.vid)
})
</script>

<style scoped>
.vehicle-light-control {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 24px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.control-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e9ecef;
}

.control-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.vehicle-info {
  font-size: 14px;
  color: #666;
  background: #f8f9fa;
  padding: 4px 12px;
  border-radius: 16px;
}

.light-section, .flash-section {
  margin-bottom: 24px;
}

.light-section h4, .flash-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
}

.status-controls {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.status-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background: #f8f9fa;
  color: #495057;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 120px;
  justify-content: center;
}

.status-btn:hover:not(:disabled) {
  background: #e9ecef;
  transform: translateY(-1px);
}

.status-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.status-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.status-icon {
  font-size: 16px;
}

.flash-controls {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.flash-option {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 150px;
}

.flash-option label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.flash-option select,
.flash-option input {
  padding: 10px 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 14px;
  background: white;
}

.flash-option select:disabled,
.flash-option input:disabled {
  background: #f8f9fa;
  opacity: 0.6;
}

.flash-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 1px solid #007bff;
  border-radius: 6px;
  background: #007bff;
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  height: fit-content;
}

.flash-btn:hover:not(:disabled) {
  background: #0056b3;
  border-color: #0056b3;
  transform: translateY(-1px);
}

.flash-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.flash-icon {
  font-size: 16px;
}

.feedback-section {
  margin-top: 16px;
}

.feedback {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
}

.feedback.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.feedback.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.feedback-icon {
  font-size: 16px;
}

.offline-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
  border-radius: 6px;
  font-size: 14px;
  margin-top: 16px;
}

.warning-icon {
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .status-controls {
    flex-direction: column;
  }
  
  .flash-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .flash-option {
    min-width: auto;
  }
}
</style>