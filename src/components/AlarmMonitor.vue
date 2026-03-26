<template>
  <div class="alarm-monitor">
    <!-- 报警通知区域 -->
    <div v-if="realtimeAlarms.length > 0" class="alarm-notifications">
      <div 
        v-for="alarm in recentAlarms" 
        :key="alarm.id"
        class="alarm-notification"
        :class="alarm.level"
      >
        <div class="notification-header">
          <div class="notification-icon">⚠️</div>
          <span class="notification-title">
            {{ getAlarmTypeText(alarm.alarmType) }}报警
          </span>
          <button class="close-btn" @click="removeNotification(alarm.id)">×</button>
        </div>
        
        <div class="notification-content">
          <p><strong>车辆:</strong> {{ alarm.vid || '未知' }}</p>
          <p><strong>级别:</strong> 
            <span class="level-badge" :style="{ backgroundColor: getLevelColor(alarm.level) }">
              {{ getLevelText(alarm.level) }}
            </span>
          </p>
          <p><strong>触发值:</strong> {{ alarm.triggerValue }}</p>
          <p><strong>时间:</strong> {{ formatTime(alarm.timestamp) }}</p>
        </div>
        
        <div class="notification-actions">
          <button class="action-btn" @click="viewAlarmDetail(alarm)">
            查看详情
          </button>
          <button class="action-btn secondary" @click="handleAlarm(alarm.id)">
            标记处理
          </button>
        </div>
      </div>
    </div>
    
    <!-- 报警统计卡片 -->
    <div class="alarm-stats-card">
      <div class="stats-header">
        <h3>📊 报警统计</h3>
        <div class="stats-refresh" @click="refreshStatistics">🔄</div>
      </div>
      
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value" style="color: #ff4d4f;">{{ statistics.today }}</div>
          <div class="stat-label">今日报警</div>
        </div>
        <div class="stat-item">
          <div class="stat-value" style="color: #faad14;">{{ statistics.week }}</div>
          <div class="stat-label">本周报警</div>
        </div>
        <div class="stat-item">
          <div class="stat-value" style="color: #52c41a;">{{ statistics.month }}</div>
          <div class="stat-label">本月报警</div>
        </div>
        <div class="stat-item">
          <div class="stat-value" style="color: #1890ff;">{{ unreadCount }}</div>
          <div class="stat-label">未处理</div>
        </div>
      </div>
    </div>
    
    <!-- WebSocket状态指示器 -->
    <div class="websocket-status" :class="wsStatus">
      <span class="status-dot"></span>
      {{ wsStatusText }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAlarmStore } from '../store/modules/alarmStore'

const alarmStore = useAlarmStore()

// 响应式数据
const wsStatus = ref('disconnected')
const showNotifications = ref(true)

// 计算属性
const realtimeAlarms = computed(() => alarmStore.realtimeAlarms)
const recentAlarms = computed(() => realtimeAlarms.value.slice(0, 3)) // 只显示最近3条
const statistics = computed(() => alarmStore.statistics)
const unreadCount = computed(() => alarmStore.unreadCount)

const wsStatusText = computed(() => {
  const texts = {
    connected: '实时连接',
    disconnected: '连接断开',
    connecting: '连接中',
    error: '连接错误'
  }
  return texts[wsStatus.value] || wsStatus.value
})

// 方法
const getAlarmTypeText = (type) => alarmStore.getAlarmTypeText(type)
const getLevelText = (level) => alarmStore.getLevelText(level)
const getLevelColor = (level) => alarmStore.getLevelColor(level)

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const removeNotification = (alarmId) => {
  alarmStore.realtimeAlarms = alarmStore.realtimeAlarms.filter(alarm => alarm.id !== alarmId)
}

const viewAlarmDetail = (alarm) => {
  alarmStore.setCurrentAlarm(alarm)
  // 触发自定义事件，让父组件显示详情
  emit('view-detail', alarm)
}

const handleAlarm = async (alarmId) => {
  try {
    await alarmStore.handleAlarm(alarmId)
    console.log('报警处理成功')
  } catch (error) {
    console.error('处理报警失败:', error)
  }
}

const refreshStatistics = () => {
  alarmStore.fetchStatistics('today')
}

// WebSocket状态监听
const updateWsStatus = (status) => {
  wsStatus.value = status
}

// 事件发射器
const emit = defineEmits(['view-detail'])

// 生命周期
onMounted(() => {
  // 初始化WebSocket连接
  alarmStore.initWebSocket()
  
  // 获取初始统计信息
  alarmStore.fetchStatistics('today')
  
  // 请求浏览器通知权限
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
})

onUnmounted(() => {
  // 清理WebSocket连接
  if (alarmStore.wsConnection) {
    alarmStore.wsConnection.close()
  }
})
</script>

<style scoped>
.alarm-monitor {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
}

.alarm-notifications {
  margin-bottom: 16px;
}

.alarm-notification {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 12px;
  border-left: 4px solid #d9d9d9;
  overflow: hidden;
}

.alarm-notification.high {
  border-left-color: #ff4d4f;
}

.alarm-notification.medium {
  border-left-color: #faad14;
}

.alarm-notification.low {
  border-left-color: #52c41a;
}

.notification-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.notification-icon {
  font-size: 18px;
  margin-right: 8px;
}

.notification-title {
  font-weight: 600;
  font-size: 14px;
  flex: 1;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #ff4d4f;
  background: #fff2f0;
  border-radius: 50%;
}

.notification-content {
  padding: 16px;
}

.notification-content p {
  margin: 4px 0;
  font-size: 13px;
  color: #666;
}

.level-badge {
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.notification-actions {
  display: flex;
  gap: 8px;
  padding: 0 16px 16px;
}

.action-btn {
  flex: 1;
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f0f0f0;
}

.action-btn.secondary {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.action-btn.secondary:hover {
  background: #40a9ff;
}

.alarm-stats-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.stats-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.stats-refresh {
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.stats-refresh:hover {
  background: #f0f0f0;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat-item {
  text-align: center;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.websocket-status {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  background: #f8f9fa;
}

.websocket-status.connected {
  background: #f6ffed;
  color: #52c41a;
}

.websocket-status.disconnected {
  background: #fff2f0;
  color: #ff4d4f;
}

.websocket-status.connecting {
  background: #fff7e6;
  color: #faad14;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 6px;
  background: currentColor;
}

@media (max-width: 768px) {
  .alarm-monitor {
    position: static;
    max-width: none;
    margin: 16px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>