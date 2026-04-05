<template>
  <div class="messages-page">
    <div class="messages-container">
      <div class="page-header">
        <h1>消息中心</h1>
        <p>查看系统通知、换电提醒和重要公告</p>
      </div>

      <!-- 消息分类 -->
      <div class="message-tabs">
        <button 
          :class="['message-tab', { active: currentTab === 'all' }]"
          @click="currentTab = 'all'"
        >
          全部消息
          <span class="badge" v-if="totalCount > 0">{{ totalCount }}</span>
        </button>
        <button 
          :class="['message-tab', { active: currentTab === 'system' }]"
          @click="currentTab = 'system'"
        >
          系统通知
          <span class="badge" v-if="systemCount > 0">{{ systemCount }}</span>
        </button>
        <button 
          :class="['message-tab', { active: currentTab === 'swap' }]"
          @click="currentTab = 'swap'"
        >
          换电提醒
          <span class="badge" v-if="swapCount > 0">{{ swapCount }}</span>
        </button>
        <button 
          :class="['message-tab', { active: currentTab === 'alert' }]"
          @click="currentTab = 'alert'"
        >
          报警通知
          <span class="badge" v-if="alertCount > 0">{{ alertCount }}</span>
        </button>
        <button 
          :class="['message-tab', { active: currentTab === 'activity' }]"
          @click="currentTab = 'activity'"
        >
          活动公告
          <span class="badge" v-if="activityCount > 0">{{ activityCount }}</span>
        </button>
      </div>

      <!-- 操作栏 -->
      <div class="action-bar">
        <button class="btn-action" @click="markAllAsRead">
          全部已读
        </button>
        <button class="btn-action" @click="deleteRead">
          删除已读
        </button>
      </div>

      <!-- 消息列表 -->
      <div class="message-list">
        <div 
          v-for="message in filteredMessages" 
          :key="message.id"
          :class="['message-card', { unread: !message.read }]"
          @click="toggleRead(message)"
        >
          <div class="message-icon">
            {{ getCategoryIcon(message.category) }}
          </div>

          <div class="message-content">
            <div class="message-header">
              <h3>{{ message.title }}</h3>
              <span class="message-time">{{ message.time }}</span>
            </div>
            <p class="message-text">{{ message.content }}</p>
            <div class="message-footer">
              <span :class="['message-category', message.category]">
                {{ getCategoryText(message.category) }}
              </span>
              <button 
                class="btn-delete"
                @click.stop="deleteMessage(message)"
              >
                删除
              </button>
            </div>
          </div>
        </div>

        <div v-if="filteredMessages.length === 0" class="empty-state">
          <div class="empty-icon">📬</div>
          <p>暂无消息</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentTab = ref('all')

const messages = ref([
  {
    id: 1,
    category: 'system',
    title: '系统维护通知',
    content: '尊敬的用戶，系统将于今晚 23:00-02:00 进行例行维护，期间部分功能可能无法正常使用。',
    time: '2024-01-15 10:30',
    read: false
  },
  {
    id: 2,
    category: 'swap',
    title: '换电完成提醒',
    content: '您的车辆（京 A·12345）已在朝阳科技园站完成换电，新电池电量 95%，续航约 450km。',
    time: '2024-01-15 09:15',
    read: false
  },
  {
    id: 3,
    category: 'alert',
    title: '电池低电量警告',
    content: '您的车辆（京 A·67890）电池电量已低于 20%，请尽快前往附近换电站进行更换。',
    time: '2024-01-14 16:20',
    read: true
  },
  {
    id: 4,
    category: 'activity',
    title: '新春优惠活动',
    content: '新春期间换电享受 8 折优惠，活动时间：2 月 1 日 -2 月 15 日，欢迎广大用户积极参与！',
    time: '2024-01-14 08:00',
    read: false
  },
  {
    id: 5,
    category: 'swap',
    title: '换电预约成功',
    content: '您已成功预约望京 SOHO 站的换电服务，预约时间：2024-01-16 14:00，请准时到达。',
    time: '2024-01-13 15:45',
    read: true
  }
])

const filteredMessages = computed(() => {
  if (currentTab.value === 'all') {
    return messages.value
  }
  return messages.value.filter(msg => msg.category === currentTab.value)
})

const totalCount = computed(() => messages.value.filter(m => !m.read).length)
const systemCount = computed(() => messages.value.filter(m => m.category === 'system' && !m.read).length)
const swapCount = computed(() => messages.value.filter(m => m.category === 'swap' && !m.read).length)
const alertCount = computed(() => messages.value.filter(m => m.category === 'alert' && !m.read).length)
const activityCount = computed(() => messages.value.filter(m => m.category === 'activity' && !m.read).length)

const getCategoryIcon = (category) => {
  const icons = {
    system: '⚙️',
    swap: '🔋',
    alert: '⚠️',
    activity: '🎉'
  }
  return icons[category] || '📧'
}

const getCategoryText = (category) => {
  const texts = {
    system: '系统通知',
    swap: '换电提醒',
    alert: '报警通知',
    activity: '活动公告'
  }
  return texts[category] || '消息'
}

const toggleRead = (message) => {
  message.read = !message.read
}

const markAllAsRead = () => {
  messages.value.forEach(msg => msg.read = true)
}

const deleteRead = () => {
  messages.value = messages.value.filter(msg => !msg.read)
}

const deleteMessage = (message) => {
  const index = messages.value.findIndex(m => m.id === message.id)
  if (index > -1) {
    messages.value.splice(index, 1)
  }
}
</script>

<style scoped>
.messages-page {
  min-height: calc(100vh - 80px);
  background: #f5f7fa;
  padding: 40px 20px;
}

.messages-container {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #0066cc 0%, #00cc99 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-header p {
  color: #666;
  font-size: 14px;
}

.message-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.message-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 24px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.message-tab:hover {
  border-color: #0066cc;
  color: #0066cc;
}

.message-tab.active {
  background: linear-gradient(135deg, #0066cc 0%, #00cc99 100%);
  color: white;
  border-color: transparent;
}

.badge {
  padding: 2px 8px;
  background: #ff4444;
  color: white;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}

.action-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.btn-action {
  padding: 8px 16px;
  background: white;
  color: #666;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-action:hover {
  background: #f5f7fa;
  color: #333;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s;
  border-left: 4px solid transparent;
}

.message-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.message-card.unread {
  border-left-color: #0066cc;
  background: #f0f7ff;
}

.message-icon {
  font-size: 40px;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.message-header h3 {
  font-size: 16px;
  color: #333;
  margin: 0;
}

.message-time {
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
  margin-left: 12px;
}

.message-text {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
}

.message-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-category {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.message-category.system {
  background: #e3f2fd;
  color: #1976d2;
}

.message-category.swap {
  background: #e8f5e9;
  color: #388e3c;
}

.message-category.alert {
  background: #fff3e0;
  color: #f57c00;
}

.message-category.activity {
  background: #fce4ec;
  color: #c2185b;
}

.btn-delete {
  padding: 4px 12px;
  background: transparent;
  color: #999;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-delete:hover {
  color: #ff4444;
  background: #ffebee;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  color: #999;
  font-size: 16px;
}

@media (max-width: 640px) {
  .message-tabs {
    flex-direction: column;
  }

  .message-tab {
    justify-content: center;
  }
}
</style>
