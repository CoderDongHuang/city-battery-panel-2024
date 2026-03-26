<template>
  <div class="alarm-detail-modal" v-if="visible">
    <div class="modal-overlay" @click="closeModal"></div>
    
    <div class="modal-content">
      <!-- 模态框头部 -->
      <div class="modal-header">
        <h2>🔍 报警详情</h2>
        <button class="close-btn" @click="closeModal">×</button>
      </div>
      
      <!-- 报警基本信息 -->
      <div class="detail-section">
        <h3>基本信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <label>报警ID:</label>
            <span>{{ alarm.id || 'N/A' }}</span>
          </div>
          <div class="info-item">
            <label>车辆编号:</label>
            <span>{{ alarm.vid || '未知' }}</span>
          </div>
          <div class="info-item">
            <label>电池编号:</label>
            <span>{{ alarm.pid || 'N/A' }}</span>
          </div>
          <div class="info-item">
            <label>报警类型:</label>
            <span>{{ getAlarmTypeText(alarm.alarmType) }}</span>
          </div>
          <div class="info-item">
            <label>报警级别:</label>
            <span 
              class="level-badge" 
              :style="{ backgroundColor: getLevelColor(alarm.level) }"
            >
              {{ getLevelText(alarm.level) }}
            </span>
          </div>
          <div class="info-item">
            <label>发生时间:</label>
            <span>{{ formatTime(alarm.timestamp) }}</span>
          </div>
        </div>
      </div>
      
      <!-- 数值信息 -->
      <div class="detail-section">
        <h3>数值信息</h3>
        <div class="value-grid">
          <div class="value-item">
            <div class="value-label">触发值</div>
            <div class="value-number">{{ alarm.triggerValue || 'N/A' }}</div>
            <div class="value-unit">{{ getValueUnit(alarm.alarmType) }}</div>
          </div>
          <div class="value-item">
            <div class="value-label">阈值</div>
            <div class="value-number">{{ alarm.thresholdValue || 'N/A' }}</div>
            <div class="value-unit">{{ getValueUnit(alarm.alarmType) }}</div>
          </div>
          <div class="value-item">
            <div class="value-label">差值</div>
            <div class="value-number" :class="{ positive: getDifference(alarm) > 0 }">
              {{ getDifference(alarm) || 'N/A' }}
            </div>
            <div class="value-unit">{{ getValueUnit(alarm.alarmType) }}</div>
          </div>
        </div>
      </div>
      
      <!-- 报警描述 -->
      <div class="detail-section" v-if="alarm.message">
        <h3>报警描述</h3>
        <div class="message-content">
          {{ alarm.message }}
        </div>
      </div>
      
      <!-- 处理记录 -->
      <div class="detail-section">
        <h3>处理状态</h3>
        <div class="status-info">
          <div class="status-item">
            <label>当前状态:</label>
            <span class="status-badge" :class="{ resolved: alarm.resolved }">
              {{ alarm.resolved ? '已处理' : '未处理' }}
            </span>
          </div>
          <div class="status-item" v-if="alarm.resolved">
            <label>处理时间:</label>
            <span>{{ alarm.resolvedTime ? formatTime(alarm.resolvedTime) : 'N/A' }}</span>
          </div>
          <div class="status-item" v-if="alarm.resolvedBy">
            <label>处理人员:</label>
            <span>{{ alarm.resolvedBy }}</span>
          </div>
        </div>
      </div>
      
      <!-- 相关设备信息 -->
      <div class="detail-section" v-if="relatedVehicle">
        <h3>相关设备信息</h3>
        <div class="device-info">
          <div class="device-item">
            <label>车辆状态:</label>
            <span :class="{ online: relatedVehicle.online, offline: !relatedVehicle.online }">
              {{ relatedVehicle.online ? '在线' : '离线' }}
            </span>
          </div>
          <div class="device-item">
            <label>电池电量:</label>
            <span>{{ relatedVehicle.batteryLevel || 'N/A' }}%</span>
          </div>
          <div class="device-item">
            <label>当前位置:</label>
            <span v-if="relatedVehicle.position">
              X: {{ relatedVehicle.position.x }}, Y: {{ relatedVehicle.position.y }}
            </span>
            <span v-else>未知</span>
          </div>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button 
          v-if="!alarm.resolved" 
          class="btn-primary" 
          @click="handleAlarm"
          :disabled="handling"
        >
          {{ handling ? '处理中...' : '标记为已处理' }}
        </button>
        <button class="btn-secondary" @click="exportReport">导出报告</button>
        <button class="btn-secondary" @click="closeModal">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAlarmStore } from '../store/modules/alarmStore'
import { useApiVehicleStore } from '../store/modules/apiVehicleStore'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  alarm: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'alarm-handled'])

const alarmStore = useAlarmStore()
const vehicleStore = useApiVehicleStore()

const handling = ref(false)

// 计算属性
const relatedVehicle = computed(() => {
  if (props.alarm.vid) {
    return vehicleStore.getVehicleById(props.alarm.vid)
  }
  return null
})

// 方法
const getAlarmTypeText = (type) => alarmStore.getAlarmTypeText(type)
const getLevelText = (level) => alarmStore.getLevelText(level)
const getLevelColor = (level) => alarmStore.getLevelColor(level)

const formatTime = (timestamp) => {
  if (!timestamp) return 'N/A'
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const getValueUnit = (alarmType) => {
  const units = {
    temperature: '°C',
    voltage: 'V',
    current: 'A',
    soc: '%',
    connection: ''
  }
  return units[alarmType] || ''
}

const getDifference = (alarm) => {
  if (alarm.triggerValue && alarm.thresholdValue) {
    return (alarm.triggerValue - alarm.thresholdValue).toFixed(2)
  }
  return 'N/A'
}

const handleAlarm = async () => {
  if (!props.alarm.id) return
  
  handling.value = true
  try {
    await alarmStore.handleAlarm(props.alarm.id)
    emit('alarm-handled', props.alarm.id)
    console.log('报警处理成功')
  } catch (error) {
    console.error('处理报警失败:', error)
  } finally {
    handling.value = false
  }
}

const exportReport = () => {
  // 导出报警报告的逻辑
  console.log('导出报警报告:', props.alarm)
  
  // 简单的导出实现
  const reportData = {
    alarmId: props.alarm.id,
    vehicleId: props.alarm.vid,
    alarmType: getAlarmTypeText(props.alarm.alarmType),
    level: getLevelText(props.alarm.level),
    triggerValue: props.alarm.triggerValue,
    thresholdValue: props.alarm.thresholdValue,
    timestamp: formatTime(props.alarm.timestamp),
    message: props.alarm.message
  }
  
  const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
    type: 'application/json' 
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `alarm-report-${props.alarm.id}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const closeModal = () => {
  emit('close')
}

// 监听可见性变化
watch(() => props.visible, (newVal) => {
  if (newVal && props.alarm.vid) {
    // 加载相关车辆信息
    if (vehicleStore.vehicles.length === 0) {
      vehicleStore.refreshVehicles()
    }
  }
})
</script>

<style scoped>
.alarm-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e8e8e8;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-btn:hover {
  background: #f0f0f0;
  color: #333;
}

.detail-section {
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-section:last-child {
  border-bottom: none;
}

.detail-section h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.info-item label {
  font-weight: 500;
  color: #666;
  font-size: 14px;
}

.info-item span {
  font-size: 14px;
  color: #333;
}

.level-badge {
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.value-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.value-item {
  text-align: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.value-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.value-number {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.value-number.positive {
  color: #ff4d4f;
}

.value-unit {
  font-size: 12px;
  color: #999;
}

.message-content {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}

.status-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: #fff2f0;
  color: #ff4d4f;
}

.status-badge.resolved {
  background: #f6ffed;
  color: #52c41a;
}

.device-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.device-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.device-item .online {
  color: #52c41a;
  font-weight: 500;
}

.device-item .offline {
  color: #ff4d4f;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 24px;
  border-top: 1px solid #f0f0f0;
}

.btn-primary,
.btn-secondary {
  padding: 10px 20px;
  border: 1px solid;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.btn-primary:hover:not(:disabled) {
  background: #40a9ff;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #666;
  border-color: #d9d9d9;
}

.btn-secondary:hover {
  background: #f0f0f0;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .info-grid,
  .value-grid,
  .status-info,
  .device-info {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>