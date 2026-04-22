<template>
  <div class="messages-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">消息中心</h1>
        <p class="page-subtitle">实时查看系统通知、换电提醒和重要公告</p>
      </div>
    </div>

    <div class="messages-container">
      <!-- 顶部操作栏 -->
      <div class="top-bar">
        <div class="filter-tabs">
          <button 
            :class="['filter-tab', { active: currentTab === 'all' }]"
            @click="currentTab = 'all'"
          >
            全部
            <span class="unread-dot" v-if="totalCount > 0">{{ totalCount }}</span>
          </button>
          <button 
            :class="['filter-tab', { active: currentTab === 'system' }]"
            @click="currentTab = 'system'"
          >
            系统通知
            <span class="unread-dot" v-if="systemCount > 0">{{ systemCount }}</span>
          </button>
          <button 
            :class="['filter-tab', { active: currentTab === 'swap' }]"
            @click="currentTab = 'swap'"
          >
            换电提醒
            <span class="unread-dot" v-if="swapCount > 0">{{ swapCount }}</span>
          </button>
          <button 
            :class="['filter-tab', { active: currentTab === 'alert' }]"
            @click="currentTab = 'alert'"
          >
            报警通知
            <span class="unread-dot" v-if="alertCount > 0">{{ alertCount }}</span>
          </button>
          <button 
            :class="['filter-tab', { active: currentTab === 'activity' }]"
            @click="currentTab = 'activity'"
          >
            活动公告
            <span class="unread-dot" v-if="activityCount > 0">{{ activityCount }}</span>
          </button>
        </div>

        <div class="actions">
          <button class="btn-action" @click="markAllAsRead">
            <span class="btn-icon">✅</span>
            全部已读
          </button>
          <button class="btn-action danger" @click="deleteRead">
            <span class="btn-icon">🗑️</span>
            删除已读
          </button>
        </div>
      </div>

      <!-- 消息列表 -->
      <div class="message-list">
        <div 
          v-for="message in filteredMessages" 
          :key="message.id"
          :class="['message-card', { unread: !message.read }]"
        >
          <div class="message-card-header">
            <div class="message-left">
              <div class="message-icon">
                {{ getCategoryIcon(message.category) }}
              </div>
              <div class="message-info">
                <h3 class="message-title">{{ message.title }}</h3>
                <p class="message-time">{{ message.time }}</p>
              </div>
            </div>
            <div class="message-right">
              <span :class="['category-tag', message.category]">
                {{ getCategoryText(message.category) }}
              </span>
              <button 
                class="btn-delete"
                @click="deleteMessage(message)"
              >
                删除
              </button>
            </div>
          </div>
          <div class="message-content" @click="toggleRead(message)">
            <p class="message-text">{{ message.content }}</p>
          </div>
          <div class="message-card-footer" @click="toggleRead(message)">
            <span class="read-status" :class="{ 'is-read': message.read }">
              {{ message.read ? '已读' : '未读' }}
            </span>
            <span class="click-hint">点击标记为{{ message.read ? '未读' : '已读' }}</span>
          </div>
        </div>

        <div v-if="filteredMessages.length === 0" class="empty-state">
          <div class="empty-icon">📭</div>
          <h3>暂无消息</h3>
          <p>这里空空如也，还没有任何消息</p>
        </div>
      </div>
    </div>
    
    <!-- 页脚 -->
    <SiteFooter />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SiteFooter from '../components/SiteFooter.vue'

const currentTab = ref('all')

const messages = ref([
  {
    id: 1,
    category: 'system',
    title: '系统维护通知',
    content: '尊敬的用户，系统将于今晚 23:00-02:00 进行例行维护，期间部分功能可能无法正常使用。',
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
/* 页面整体 */
.messages-page {
  min-height: 100vh;
  background: linear-gradient(180deg, 
    rgba(200, 240, 245, 0.3) 0%, 
    rgba(220, 230, 250, 0.25) 20%, 
    rgba(230, 220, 255, 0.2) 40%, 
    rgba(245, 245, 255, 0.15) 60%,
    rgba(250, 250, 255, 0.1) 80%,
    rgba(255, 255, 255, 0.05) 100%) !important;
  background-attachment: fixed !important;
  padding: 0 20px 40px;
}

/* 页面头部 */
.page-header {
  padding: 50px 20px 30px;
  text-align: center;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: 48px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.page-subtitle {
  color: #666666;
  font-size: 16px;
  line-height: 1.6;
}

/* 主容器 */
.messages-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 顶部操作栏 */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filter-tabs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  position: relative;
}

.filter-tab:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.filter-tab.active {
  background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* 未读消息红点 */
.unread-dot {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  background: linear-gradient(135deg, #ff4444 0%, #ff6666 100%);
  color: white;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(255, 68, 68, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.9);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.actions {
  display: flex;
  gap: 10px;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #333333;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.btn-action:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.btn-action.danger:hover {
  color: #ff4444;
  border-color: rgba(255, 68, 68, 0.3);
  background: rgba(255, 68, 68, 0.08);
}

.btn-icon {
  font-size: 16px;
}

/* 消息列表 */
.message-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 消息卡片 */
.message-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.message-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 0, 0, 0.1);
}

.message-card.unread {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-left: 4px solid #1a1a1a;
}

.message-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.message-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.message-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.message-card.unread .message-icon {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

.message-info {
  flex: 1;
  min-width: 0;
}

.message-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.message-time {
  font-size: 13px;
  color: #999999;
}

.message-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.category-tag {
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.category-tag.system {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  color: #1976d2;
}

.category-tag.swap {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  color: #388e3c;
}

.category-tag.alert {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  color: #f57c00;
}

.category-tag.activity {
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%);
  color: #c2185b;
}

.btn-delete {
  padding: 6px 14px;
  background: transparent;
  color: #999999;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-delete:hover {
  color: #ff4444;
  background: rgba(255, 68, 68, 0.08);
  border-color: rgba(255, 68, 68, 0.2);
}

.message-content {
  padding: 16px 20px;
  cursor: pointer;
}

.message-text {
  font-size: 14px;
  color: #555555;
  line-height: 1.7;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.message-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.02);
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.3s ease;
}

.message-card-footer:hover {
  background: rgba(0, 0, 0, 0.03);
}

.read-status {
  font-size: 13px;
  color: #999999;
  font-weight: 500;
}

.read-status.is-read {
  color: #666666;
}

.click-hint {
  font-size: 12px;
  color: #bbbbbb;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.4;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 8px;
}

.empty-state p {
  color: #999999;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .top-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-tabs {
    justify-content: center;
  }
  
  .actions {
    justify-content: center;
  }
  
  .message-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .message-right {
    width: 100%;
    justify-content: space-between;
  }
}

/* 深色模式 */
html.dark-mode .page-title {
  color: #ffffff;
}

html.dark-mode .page-subtitle {
  color: #a0a0a0;
}

html.dark-mode .filter-tab {
  background: rgba(40, 40, 50, 0.8);
  border-color: rgba(255, 255, 255, 0.08);
  color: #e0e0e0;
}

html.dark-mode .filter-tab:hover {
  background: rgba(50, 50, 60, 0.9);
  border-color: rgba(255, 255, 255, 0.15);
}

html.dark-mode .filter-tab.active {
  background: linear-gradient(135deg, #4a4a5a 0%, #5a5a6a 100%);
}

html.dark-mode .unread-dot {
  border-color: rgba(30, 30, 40, 0.9);
}

html.dark-mode .btn-action {
  background: rgba(40, 40, 50, 0.8);
  border-color: rgba(255, 255, 255, 0.08);
  color: #e0e0e0;
}

html.dark-mode .btn-action:hover {
  background: rgba(50, 50, 60, 0.9);
  border-color: rgba(255, 255, 255, 0.15);
}

html.dark-mode .message-card {
  background: rgba(40, 40, 50, 0.8);
  border-color: rgba(255, 255, 255, 0.06);
}

html.dark-mode .message-card:hover {
  background: rgba(50, 50, 60, 0.9);
}

html.dark-mode .message-card.unread {
  background: linear-gradient(135deg, rgba(50, 50, 60, 0.8) 0%, rgba(40, 40, 50, 0.8) 100%);
  border-left-color: #6a6a7a;
}

html.dark-mode .message-icon {
  background: linear-gradient(135deg, #3a3a4a 0%, #4a4a5a 100%);
}

html.dark-mode .message-card.unread .message-icon {
  background: linear-gradient(135deg, rgba(60, 80, 100, 0.6) 0%, rgba(50, 70, 90, 0.6) 100%);
}

html.dark-mode .message-title {
  color: #e0e0e0;
}

html.dark-mode .message-time {
  color: #808080;
}

html.dark-mode .message-text {
  color: #a0a0a0;
}

html.dark-mode .message-card-header {
  border-bottom-color: rgba(255, 255, 255, 0.06);
}

html.dark-mode .message-card-footer {
  background: rgba(0, 0, 0, 0.15);
  border-top-color: rgba(255, 255, 255, 0.06);
}

html.dark-mode .message-card-footer:hover {
  background: rgba(0, 0, 0, 0.2);
}

html.dark-mode .read-status {
  color: #808080;
}

html.dark-mode .read-status.is-read {
  color: #a0a0a0;
}

html.dark-mode .click-hint {
  color: #666666;
}

html.dark-mode .empty-state {
  background: rgba(40, 40, 50, 0.8);
}

html.dark-mode .empty-state h3 {
  color: #e0e0e0;
}
</style>
