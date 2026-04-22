<template>
  <div class="messages-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">消息中心</h1>
        <p class="page-subtitle">实时查看系统通知、换电提醒和重要公告</p>
      </div>
    </div>

    <!-- 顶部操作栏 -->
    <div class="top-bar">
      <div class="filter-tabs">
        <button 
          :class="['filter-tab', { active: currentTab === 'all' }]"
          @click="handleTabChange('all')"
        >
          全部
          <span class="badge" v-if="statistics.totalCount > 0">{{ statistics.totalCount }}</span>
        </button>
        <button 
          :class="['filter-tab', { active: currentTab === 'system' }]"
          @click="handleTabChange('system')"
        >
          系统通知
          <span class="badge" v-if="statistics.byCategory?.system?.unread > 0">
            {{ statistics.byCategory.system.unread }}
          </span>
        </button>
        <button 
          :class="['filter-tab', { active: currentTab === 'swap' }]"
          @click="handleTabChange('swap')"
        >
          换电提醒
          <span class="badge" v-if="statistics.byCategory?.swap?.unread > 0">
            {{ statistics.byCategory.swap.unread }}
          </span>
        </button>
        <button 
          :class="['filter-tab', { active: currentTab === 'alert' }]"
          @click="handleTabChange('alert')"
        >
          报警通知
          <span class="badge" v-if="statistics.byCategory?.alert?.unread > 0">
            {{ statistics.byCategory.alert.unread }}
          </span>
        </button>
        <button 
          :class="['filter-tab', { active: currentTab === 'activity' }]"
          @click="handleTabChange('activity')"
        >
          活动公告
          <span class="badge" v-if="statistics.byCategory?.activity?.unread > 0">
            {{ statistics.byCategory.activity.unread }}
          </span>
        </button>
      </div>

      <div class="sort-filters">
        <!-- 来源筛选 -->
        <select v-model="sourceFilter" class="filter-select" @change="loadMessages">
          <option value="all">全部来源</option>
          <option value="admin">管理端</option>
          <option value="hardware">硬件设备</option>
        </select>

        <!-- 已读/未读筛选 -->
        <select v-model="readFilter" class="filter-select" @change="loadMessages">
          <option value="all">全部消息</option>
          <option value="unread">未读</option>
          <option value="read">已读</option>
        </select>

        <!-- 排序方式 -->
        <select v-model="sortType" class="filter-select" @change="loadMessages">
          <option value="time">按时间排序</option>
          <option value="priority">按优先级</option>
        </select>
      </div>

      <div class="actions">
        <button class="btn-action" @click="markAllAsRead" :disabled="statistics.unreadCount === 0">
          <span class="btn-icon">✅</span>
          全部已读
        </button>
        <button class="btn-action danger" @click="deleteReadMessages">
          <span class="btn-icon">🗑️</span>
          删除已读
        </button>
      </div>
    </div>

    <div class="messages-container">
      <!-- 消息列表 -->
      <div class="message-list">
        <div 
          v-for="message in messages" 
          :key="message.id"
          :class="['message-card', { unread: !message.isRead }]"
        >
          <div class="message-card-header">
            <div class="message-left">
              <div class="message-icon">
                {{ getCategoryIcon(message.category) }}
              </div>
              <div class="message-info">
                <h3 class="message-title">{{ message.title }}</h3>
                <p class="message-time">{{ formatTime(message.createTime) }}</p>
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
            
            <!-- 高亮信息（如果有） -->
            <div v-if="message.displayData?.highlights" class="message-highlights">
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
          
          <div class="message-card-footer" @click="toggleRead(message)">
            <span class="read-status" :class="{ 'is-read': message.isRead }">
              {{ message.isRead ? '已读' : '未读' }}
            </span>
            <span class="click-hint">
              点击标记为{{ message.isRead ? '未读' : '已读' }}
            </span>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner">🔄</div>
          <p>加载中...</p>
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && messages.length === 0" class="empty-state">
          <div class="empty-icon">📭</div>
          <h3>暂无消息</h3>
          <p>这里空空如也，还没有任何消息</p>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="btn-page"
        >
          上一页
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button 
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
          class="btn-page"
        >
          下一页
        </button>
      </div>
    </div>
    
    <!-- 页脚 -->
    <SiteFooter />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import SiteFooter from '../components/SiteFooter.vue'
import { messageAPI } from '../services/messageAPI.js'

// 状态管理
const messages = ref([])
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)

// 筛选条件
const currentTab = ref('all')
const sourceFilter = ref('all')
const readFilter = ref('all')
const sortType = ref('time')

// 统计信息
const statistics = reactive({
  totalCount: 0,
  unreadCount: 0,
  byCategory: {
    system: { total: 0, unread: 0 },
    swap: { total: 0, unread: 0 },
    alert: { total: 0, unread: 0 },
    activity: { total: 0, unread: 0 }
  }
})

// 加载消息列表
const loadMessages = async () => {
  loading.value = true
  
  try {
    const params = {
      page: currentPage.value,
      size: 10
    }
    
    // 只在有值时添加参数
    if (currentTab.value !== 'all') {
      params.category = currentTab.value
    }
    if (sourceFilter.value !== 'all') {
      params.source = sourceFilter.value
    }
    if (readFilter.value !== 'all') {
      params.isRead = readFilter.value === 'read'
    }
    if (sortType.value) {
      params.sort = sortType.value
    }

    const response = await messageAPI.getUserMessages(params)
    
    messages.value = response.data.content
    currentPage.value = response.data.pagination.currentPage
    totalPages.value = response.data.pagination.totalPages
    
    // 更新统计信息
    if (response.data.statistics) {
      statistics.totalCount = response.data.statistics.totalCount
      statistics.unreadCount = response.data.statistics.unreadCount
      statistics.byCategory = response.data.statistics.byCategory
    }
  } catch (error) {
    console.error('加载消息列表失败:', error)
    alert('加载消息失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 切换标签
const handleTabChange = (tab) => {
  currentTab.value = tab
  currentPage.value = 1
  loadMessages()
}

// 切换页码
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  loadMessages()
}

// 格式化时间
const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now - date
  
  // 今天
  if (diff < 24 * 60 * 60 * 1000) {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }
  
  // 最近 7 天
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return days[date.getDay()]
  }
  
  // 其他日期
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

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

// 获取分类文本
const getCategoryText = (category) => {
  const texts = {
    system: '系统通知',
    swap: '换电提醒',
    alert: '报警通知',
    activity: '活动公告'
  }
  return texts[category] || '消息'
}

// 标记为已读/未读
const toggleRead = async (message) => {
  // 如果是已读状态，点击后变为未读（只更新本地状态，不调用 API）
  if (message.isRead) {
    message.isRead = false
    message.readTime = null
    updateStatistics(1, message.category) // 未读数 +1，指定分类
    
    // 如果当前筛选的是已读消息，需要从列表中移除这条消息
    if (readFilter.value === 'read') {
      setTimeout(() => loadMessages(), 300)
    }
    return
  }
  
  // 如果是未读状态，点击后标记为已读（调用 API）
  try {
    await messageAPI.markAsRead(message.id)
    message.isRead = true
    message.readTime = new Date().toISOString()
    
    // 更新统计：未读数 -1，指定分类
    updateStatistics(-1, message.category)
    
    // 如果当前筛选的是未读消息，需要从列表中移除这条消息
    if (readFilter.value === 'unread') {
      setTimeout(() => loadMessages(), 300)
    }
  } catch (error) {
    console.error('操作失败:', error)
    alert('操作失败，请稍后重试')
  }
}

// 全部标记为已读
const markAllAsRead = async () => {
  if (!confirm('确定要将所有消息标记为已读吗？')) return
  
  try {
    const unreadIds = messages.value.filter(m => !m.isRead).map(m => m.id)
    await messageAPI.markBatchAsRead(unreadIds)
    
    // 更新本地状态
    messages.value.forEach(msg => {
      if (!msg.isRead) {
        msg.isRead = true
        msg.readTime = new Date().toISOString()
      }
    })
    
    // 更新统计
    statistics.unreadCount = 0
    Object.keys(statistics.byCategory).forEach(key => {
      statistics.byCategory[key].unread = 0
    })
    
    alert('已全部标记为已读')
  } catch (error) {
    console.error('操作失败:', error)
    alert('操作失败，请稍后重试')
  }
}

// 删除已读消息
const deleteReadMessages = async () => {
  if (!confirm('确定要删除所有已读消息吗？此操作不可恢复！')) return
  
  try {
    const readIds = messages.value.filter(m => m.isRead).map(m => m.id)
    await messageAPI.deleteBatchMessages(readIds)
    
    // 更新本地状态
    messages.value = messages.value.filter(m => !m.isRead)
    
    // 重新加载
    loadMessages()
    
    alert('删除成功')
  } catch (error) {
    console.error('删除失败:', error)
    alert('删除失败，请稍后重试')
  }
}

// 删除单条消息
const deleteMessage = async (message) => {
  if (!confirm('确定要删除这条消息吗？')) return
  
  try {
    await messageAPI.deleteMessage(message.id)
    
    // 更新本地状态
    const index = messages.value.findIndex(m => m.id === message.id)
    if (index > -1) {
      messages.value.splice(index, 1)
    }
    
    // 更新统计：如果删除的是未读消息
    if (!message.isRead) {
      updateStatistics(-1, message.category)
    }
    
    alert('删除成功')
  } catch (error) {
    console.error('删除失败:', error)
    alert('删除失败，请稍后重试')
  }
}

// 更新统计信息
const updateStatistics = (delta, category) => {
  // 更新总未读数
  statistics.unreadCount = Math.max(0, statistics.unreadCount + delta)
  
  // 更新分类统计
  if (category && statistics.byCategory[category]) {
    statistics.byCategory[category].unread = Math.max(
      0,
      statistics.byCategory[category].unread + delta
    )
  } else if (currentTab.value !== 'all') {
    // 如果没有指定分类，使用当前 tab 的分类
    statistics.byCategory[currentTab.value].unread = Math.max(
      0,
      statistics.byCategory[currentTab.value].unread + delta
    )
  }
}

// 生命周期
onMounted(() => {
  loadMessages()
})
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
  font-size: 32px;
  font-weight: bold;
  color: #1a1a1a;
  margin: 0 0 10px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 顶部操作栏 */
.top-bar {
  max-width: 1200px;
  margin: 0 auto 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.filter-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.filter-tab {
  position: relative;
  padding: 8px 14px;
  background: #f5f5f5;
  border: 2px solid transparent;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-tab:hover {
  background: #e8e8e8;
}

.filter-tab.active {
  background: #1a1a1a;
  color: white;
}

.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ff4d4f;
  color: white;
  border-radius: 8px;
  padding: 1px 6px;
  font-size: 10px;
  font-weight: 600;
  min-width: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.3);
}

.sort-filters {
  display: flex;
  gap: 8px;
}

.filter-select {
  padding: 8px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 13px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-select:hover {
  border-color: #667eea;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

.actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.btn-action {
  padding: 8px 14px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s;
}

.btn-action:hover {
  border-color: #667eea;
  color: #667eea;
}

.btn-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-action.danger:hover {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.btn-icon {
  font-size: 16px;
}

/* 消息容器 */
.messages-container {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

/* 消息列表 */
.message-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message-card {
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  padding: 18px;
  transition: all 0.3s;
}

.message-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

.message-card.unread {
  border-left: 4px solid #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.message-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.message-left {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.message-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.message-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.message-time {
  font-size: 13px;
  color: #999;
  margin: 0;
}

.message-right {
  display: flex;
  gap: 10px;
  align-items: center;
}

.category-tag {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.category-tag.system {
  background: #e6f7ff;
  color: #1890ff;
}

.category-tag.swap {
  background: #f6ffed;
  color: #52c41a;
}

.category-tag.alert {
  background: #fff7e6;
  color: #fa8c16;
}

.category-tag.activity {
  background: #fff1f0;
  color: #f5222d;
}

.btn-delete {
  padding: 4px 12px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-delete:hover {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.message-content {
  margin-bottom: 12px;
  cursor: pointer;
}

.message-text {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  margin: 0;
}

.message-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
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

.message-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  cursor: pointer;
}

.read-status {
  font-size: 13px;
  color: #999;
  padding: 4px 12px;
  background: #f5f5f5;
  border-radius: 6px;
  transition: all 0.3s;
}

.read-status.is-read {
  background: #e6f7ff;
  color: #1890ff;
}

.click-hint {
  font-size: 12px;
  color: #999;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #999;
}

.loading-spinner {
  font-size: 48px;
  margin-bottom: 15px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  color: #999;
}

.empty-state .empty-icon {
  font-size: 100px;
  margin-bottom: 50px;
}

.empty-state h3 {
  font-size: 20px;
  margin: 0 0 15px 0;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 20px 0;
  margin-top: 20px;
  border-top: 2px solid #f0f0f0;
}

.btn-page {
  padding: 10px 20px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-page:hover:not(:disabled) {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.btn-page:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

/* 暗色模式 */
html.dark-mode .messages-page {
  background: linear-gradient(180deg, 
    rgba(30, 30, 40, 0.8) 0%, 
    rgba(25, 25, 35, 0.85) 50%, 
    rgba(20, 20, 30, 0.9) 100%) !important;
}

html.dark-mode .messages-container {
  background: rgba(30, 30, 40, 0.95);
}

html.dark-mode .page-title {
  color: #e0e0e0;
}

html.dark-mode .page-subtitle {
  color: #999;
}

html.dark-mode .filter-tab {
  background: #2a2a3e;
  color: #999;
}

html.dark-mode .filter-tab:hover {
  background: #3a3a4e;
}

html.dark-mode .filter-select {
  background: #2a2a3e;
  border-color: #3a3a4e;
  color: #e0e0e0;
}

html.dark-mode .message-card {
  background: #1e1e2e;
  border-color: #3a3a4e;
}

html.dark-mode .message-card.unread {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
}

html.dark-mode .message-title {
  color: #e0e0e0;
}

html.dark-mode .message-text {
  color: #e0e0e0;
}

html.dark-mode .btn-action {
  background: #2a2a3e;
  border-color: #3a3a4e;
  color: #e0e0e0;
}

html.dark-mode .btn-action:hover {
  border-color: #667eea;
  color: #667eea;
}

html.dark-mode .btn-delete {
  background: #2a2a3e;
  border-color: #3a3a4e;
  color: #999;
}

html.dark-mode .btn-delete:hover {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

html.dark-mode .read-status {
  background: #2a2a3e;
  color: #999;
}

html.dark-mode .read-status.is-read {
  background: rgba(24, 144, 255, 0.2);
  color: #1890ff;
}

html.dark-mode .page-info {
  color: #999;
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
  
  .sort-filters {
    justify-content: center;
  }
  
  .actions {
    justify-content: center;
    margin-left: 0;
  }
  
  .message-card-header {
    flex-direction: column;
    gap: 10px;
  }
  
  .message-right {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
