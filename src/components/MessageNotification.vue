<template>
  <div class="message-notification" v-if="visible">
    <div class="notification-content" :class="message?.category">
      <div class="notification-header">
        <div class="notification-icon">
          {{ getCategoryIcon(message?.category) }}
        </div>
        <div class="notification-title">
          <h4>{{ message?.title }}</h4>
          <span class="notification-time">{{ formatTime(message?.createTime) }}</span>
        </div>
        <button class="notification-close" @click="close">
          ✕
        </button>
      </div>
      <div class="notification-body">
        <p>{{ message?.content }}</p>
        
        <!-- 高亮信息（如果有） -->
        <div v-if="message?.displayData?.highlights" class="notification-highlights">
          <div 
            v-for="(highlight, index) in message.displayData.highlights" 
            :key="index"
            class="highlight-item"
            :style="{ color: highlight.color }"
          >
            <span class="highlight-label">{{ highlight.label }}:</span>
            <span class="highlight-value">{{ highlight.value }}</span>
          </div>
        </div>
      </div>
      <div class="notification-footer">
        <button class="btn-view" @click="viewMessage">
          查看详情
        </button>
        <button class="btn-close-notification" @click="close">
          知道了
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { messageAPI } from '../services/messageAPI.js'

// 使用 router
const router = useRouter()

// 状态
const visible = ref(false)
const message = ref(null)
const checkInterval = ref(null)

// 获取分类图标
const getCategoryIcon = (category) => {
  const icons = {
    system: '⚙️',
    swap: '🔋',
    alert: '⚠️',
    activity: '🎉'
  }
  return icons[category] || '📧'
}

// 格式化时间
const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// 关闭通知
const close = () => {
  visible.value = false
  message.value = null
}

// 查看消息
const viewMessage = () => {
  if (message.value) {
    // 标记为已读
    messageAPI.markAsRead(message.value.id).catch(() => {})
    
    // 跳转到消息中心
    router.push('/messages')
    close()
  }
}

// 检查新消息
const checkNewMessages = async () => {
  try {
    // 获取未读消息数量
    const response = await messageAPI.getUnreadCount()
    const unreadCount = response.data.count
    
    if (unreadCount > 0 && !visible.value) {
      // 获取最新的未读消息
      const messagesResponse = await messageAPI.getUserMessages({
        page: 1,
        size: 1,
        isRead: false
      })
      
      if (messagesResponse.data.content && messagesResponse.data.content.length > 0) {
        message.value = messagesResponse.data.content[0]
        visible.value = true
        
        // 播放提示音（可选）
        playNotificationSound()
      }
    }
  } catch (error) {
    console.error('检查新消息失败:', error)
  }
}

// 播放提示音
const playNotificationSound = () => {
  // 创建提示音（使用浏览器自带的提示音）
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.frequency.value = 800
  oscillator.type = 'sine'
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.5)
}

// 请求通知权限
const requestNotificationPermission = () => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
}

// 显示浏览器通知
const showBrowserNotification = (msg) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(msg.title, {
      body: msg.content,
      icon: '/notification-icon.png', // 可以自定义图标
      tag: msg.id,
      requireInteraction: false
    })
  }
}

// 生命周期
onMounted(() => {
  // 请求通知权限
  requestNotificationPermission()
  
  // 立即检查一次
  checkNewMessages()
  
  // 每 30 秒检查一次新消息
  checkInterval.value = setInterval(checkNewMessages, 30000)
  
  // 监听页面可见性变化
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      checkNewMessages()
    }
  })
})

onUnmounted(() => {
  if (checkInterval.value) {
    clearInterval(checkInterval.value)
  }
})
</script>

<style scoped>
.message-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.notification-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  min-width: 350px;
  max-width: 400px;
  overflow: hidden;
  border-left: 4px solid #667eea;
}

.notification-content.system {
  border-left-color: #1890ff;
}

.notification-content.swap {
  border-left-color: #52c41a;
}

.notification-content.alert {
  border-left-color: #fa8c16;
}

.notification-content.activity {
  border-left-color: #f5222d;
}

.notification-header {
  display: flex;
  align-items: flex-start;
  padding: 16px 16px 12px;
  gap: 12px;
}

.notification-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.notification-title {
  flex: 1;
  min-width: 0;
}

.notification-title h4 {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.notification-time {
  font-size: 12px;
  color: #999;
}

.notification-close {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #999;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.3s;
  flex-shrink: 0;
}

.notification-close:hover {
  background: #f5f5f5;
  color: #333;
}

.notification-body {
  padding: 0 16px 16px;
}

.notification-body p {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  margin: 0;
  max-height: 100px;
  overflow-y: auto;
}

.notification-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.highlight-item {
  display: flex;
  gap: 6px;
  font-size: 13px;
}

.highlight-label {
  font-weight: 500;
}

.highlight-value {
  font-weight: 600;
}

.notification-footer {
  display: flex;
  gap: 10px;
  padding: 12px 16px 16px;
  border-top: 1px solid #f0f0f0;
}

.btn-view {
  flex: 1;
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-view:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-close-notification {
  flex: 1;
  padding: 8px 16px;
  background: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-close-notification:hover {
  background: #e8e8e8;
}

/* 暗色模式 */
html.dark-mode .notification-content {
  background: #1e1e2e;
  border-left-color: #667eea;
}

html.dark-mode .notification-title h4 {
  color: #e0e0e0;
}

html.dark-mode .notification-body p {
  color: #e0e0e0;
}

html.dark-mode .notification-footer {
  border-top-color: #3a3a4e;
}

html.dark-mode .btn-close-notification {
  background: #2a2a3e;
  color: #999;
}

html.dark-mode .btn-close-notification:hover {
  background: #3a3a4e;
}
</style>
