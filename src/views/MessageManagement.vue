<template>
  <div class="message-management-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">消息管理</h1>
        <p class="page-subtitle">发送系统通知、活动公告，管理所有消息</p>
      </div>
    </div>

    <div class="page-content">
      <!-- 左侧：消息列表 -->
      <div class="message-list-panel">
        <div class="panel-header">
          <h2>已发送消息</h2>
          <button class="btn-primary" @click="showCreateModal = true">
            <span class="btn-icon">➕</span>
            发送消息
          </button>
        </div>

        <!-- 筛选栏 -->
        <div class="filter-bar">
          <select v-model="listFilter.category" class="filter-select" @change="loadMessages">
            <option value="">全部分类</option>
            <option value="system">系统通知</option>
            <option value="activity">活动公告</option>
          </select>

          <select v-model="listFilter.sendStatus" class="filter-select" @change="loadMessages">
            <option value="">全部状态</option>
            <option value="sent">已发送</option>
            <option value="scheduled">定时发送</option>
            <option value="cancelled">已取消</option>
          </select>

          <div class="search-box">
            <input 
              v-model="searchKeyword"
              type="text" 
              placeholder="搜索标题..."
              @keyup.enter="loadMessages"
            />
            <button class="btn-search" @click="loadMessages">🔍</button>
          </div>
        </div>

        <!-- 消息列表 -->
        <div class="message-list">
          <div 
            v-for="msg in messageList" 
            :key="msg.id"
            :class="['message-item', { active: selectedMessage?.id === msg.id }]"
            @click="selectMessage(msg)"
          >
            <div class="message-item-header">
              <span :class="['category-tag', msg.category]">
                {{ getCategoryText(msg.category) }}
              </span>
              <span :class="['status-tag', msg.sendStatus]">
                {{ getStatusText(msg.sendStatus) }}
              </span>
            </div>
            <h3 class="message-item-title">{{ msg.title }}</h3>
            <p class="message-item-preview">{{ msg.content }}</p>
            <div class="message-item-footer">
              <span class="message-item-info">
                <span v-if="msg.adminName">👤 {{ msg.adminName }}</span>
                <span>👥 {{ msg.recipientCount }}人</span>
              </span>
              <span class="message-item-time">{{ formatTime(msg.createTime) }}</span>
            </div>
          </div>

          <div v-if="messageList.length === 0" class="empty-state">
            <div class="empty-icon">📭</div>
            <h3>暂无消息</h3>
            <p>还没有发送过任何消息</p>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination" v-if="totalPages > 1">
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

      <!-- 右侧：消息详情 -->
      <div class="message-detail-panel">
        <div v-if="selectedMessage" class="detail-content">
          <div class="detail-header">
            <h2>{{ selectedMessage.title }}</h2>
            <div class="detail-actions">
              <button 
                v-if="selectedMessage.sendStatus === 'scheduled'"
                class="btn-warning"
                @click="cancelScheduledMessage"
              >
                ⏸️ 取消发送
              </button>
              <button 
                v-if="selectedMessage.sendStatus === 'cancelled'"
                class="btn-primary"
                @click="resendMessage"
              >
                🔄 重新发送
              </button>
              <button class="btn-default" @click="viewStatistics">
                📊 查看统计
              </button>
            </div>
          </div>

          <div class="detail-info">
            <div class="info-row">
              <span class="info-label">分类：</span>
              <span :class="['category-tag', selectedMessage.category]">
                {{ getCategoryText(selectedMessage.category) }}
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">来源：</span>
              <span>{{ selectedMessage.source === 'admin' ? '管理端' : '硬件端' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">优先级：</span>
              <span class="priority-stars">{{ '⭐'.repeat(selectedMessage.priority) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">发送对象：</span>
              <span>{{ getTargetTypeText(selectedMessage.targetType) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">接收人数：</span>
              <span class="highlight">{{ selectedMessage.recipientCount }} 人</span>
            </div>
            <div class="info-row">
              <span class="info-label">已读人数：</span>
              <span class="highlight">{{ selectedMessage.readCount || 0 }} 人</span>
            </div>
            <div class="info-row">
              <span class="info-label">发送时间：</span>
              <span>{{ selectedMessage.sentTime || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">创建时间：</span>
              <span>{{ formatTime(selectedMessage.createTime) }}</span>
            </div>
          </div>

          <div class="detail-content-text">
            <h3>消息内容</h3>
            <p>{{ selectedMessage.content }}</p>
          </div>

          <div v-if="selectedMessage.extraData && Object.keys(selectedMessage.extraData).length > 0" class="detail-extra">
            <h3>扩展数据</h3>
            <pre>{{ JSON.stringify(selectedMessage.extraData, null, 2) }}</pre>
          </div>
        </div>

        <div v-else class="empty-detail">
          <div class="empty-icon">👈</div>
          <h3>选择消息查看详情</h3>
          <p>点击左侧列表中的消息查看详细信息</p>
        </div>
      </div>
    </div>

    <!-- 发送消息弹窗 -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <div class="modal-dialog">
        <div class="modal-header">
          <h2>📤 发送消息</h2>
          <button class="btn-close" @click="showCreateModal = false">✕</button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="sendMessage" class="message-form">
            <!-- 消息分类 -->
            <div class="form-group">
              <label class="form-label">消息分类 <span class="required">*</span></label>
              <div class="category-selector">
                <button
                  type="button"
                  :class="['category-option', { active: formData.category === 'system' }]"
                  @click="formData.category = 'system'"
                >
                  <span class="category-icon">⚙️</span>
                  <span class="category-name">系统通知</span>
                </button>
                <button
                  type="button"
                  :class="['category-option', { active: formData.category === 'activity' }]"
                  @click="formData.category = 'activity'"
                >
                  <span class="category-icon">🎉</span>
                  <span class="category-name">活动公告</span>
                </button>
              </div>
            </div>

            <!-- 标题 -->
            <div class="form-group">
              <label class="form-label">标题 <span class="required">*</span></label>
              <input
                v-model="formData.title"
                type="text"
                class="form-input"
                placeholder="请输入消息标题（最多 200 字）"
                maxlength="200"
                required
              />
              <div class="char-count">{{ formData.title.length }}/200</div>
            </div>

            <!-- 内容 -->
            <div class="form-group">
              <label class="form-label">内容 <span class="required">*</span></label>
              <textarea
                v-model="formData.content"
                class="form-textarea"
                placeholder="请输入消息内容"
                rows="6"
                required
              ></textarea>
            </div>

            <!-- 发送对象 -->
            <div class="form-group">
              <label class="form-label">发送对象 <span class="required">*</span></label>
              <select v-model="formData.targetType" class="form-select">
                <option value="all">所有用户</option>
                <option value="user">指定用户</option>
                <option value="vehicle">指定车辆</option>
                <option value="battery">指定电池</option>
              </select>
            </div>

            <!-- 指定 ID（当不是发送给所有人时显示） -->
            <div v-if="formData.targetType !== 'all'" class="form-group">
              <label class="form-label">目标 ID 列表</label>
              <textarea
                v-model="formData.targetIdsText"
                class="form-textarea"
                placeholder="请输入 ID 列表，用逗号分隔（如：1,2,3）"
                rows="3"
              ></textarea>
            </div>

            <!-- 优先级 -->
            <div class="form-group">
              <label class="form-label">优先级</label>
              <div class="priority-selector">
                <button
                  type="button"
                  :class="['priority-option', { active: formData.priority === 1 }]"
                  @click="formData.priority = 1"
                >
                  ⭐ 低
                </button>
                <button
                  type="button"
                  :class="['priority-option', { active: formData.priority === 2 }]"
                  @click="formData.priority = 2"
                >
                  ⭐⭐ 中
                </button>
                <button
                  type="button"
                  :class="['priority-option', { active: formData.priority === 3 }]"
                  @click="formData.priority = 3"
                >
                  ⭐⭐⭐ 高
                </button>
                <button
                  type="button"
                  :class="['priority-option', { active: formData.priority === 4 }]"
                  @click="formData.priority = 4"
                >
                  ⭐⭐⭐⭐ 紧急
                </button>
              </div>
            </div>

            <!-- 定时发送 -->
            <div class="form-group">
              <label class="form-label">定时发送</label>
              <div class="datetime-picker">
                <input
                  v-model="formData.scheduledTime"
                  type="datetime-local"
                  class="form-input"
                />
                <button
                  type="button"
                  v-if="formData.scheduledTime"
                  class="btn-clear"
                  @click="formData.scheduledTime = ''"
                >
                  清除
                </button>
              </div>
              <p class="form-hint">留空表示立即发送</p>
            </div>

            <!-- 扩展数据 -->
            <div class="form-group">
              <label class="form-label">扩展数据（JSON 格式）</label>
              <textarea
                v-model="formData.extraDataText"
                class="form-textarea"
                placeholder='例如：{"activityId": 123, "discount": 0.8}'
                rows="4"
              ></textarea>
              <p class="form-hint">可选，用于存储消息的特有数据</p>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-default" @click="showCreateModal = false">
            取消
          </button>
          <button type="button" class="btn-primary" @click="sendMessage" :disabled="isSending">
            {{ isSending ? '发送中...' : '立即发送' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 统计弹窗 -->
    <div v-if="showStatsModal" class="modal-overlay" @click.self="showStatsModal = false">
      <div class="modal-dialog">
        <div class="modal-header">
          <h2>📊 消息统计</h2>
          <button class="btn-close" @click="showStatsModal = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="stats-content">
            <div class="stat-item">
              <div class="stat-label">发送总数</div>
              <div class="stat-value">{{ selectedMessage?.recipientCount || 0 }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">已读数量</div>
              <div class="stat-value">{{ selectedMessage?.readCount || 0 }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">未读数量</div>
              <div class="stat-value">{{ (selectedMessage?.recipientCount || 0) - (selectedMessage?.readCount || 0) }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">阅读率</div>
              <div class="stat-value">
                {{ calculateReadRate(selectedMessage) }}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { messageAPI } from '../services/messageAPI.js'

// 消息列表相关
const messageList = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const selectedMessage = ref(null)

// 筛选条件
const listFilter = reactive({
  category: '',
  sendStatus: ''
})
const searchKeyword = ref('')

// 弹窗控制
const showCreateModal = ref(false)
const showStatsModal = ref(false)
const isSending = ref(false)

// 表单数据
const formData = reactive({
  category: 'system',
  title: '',
  content: '',
  targetType: 'all',
  targetIdsText: '',
  priority: 2,
  scheduledTime: '',
  extraDataText: ''
})

// 加载消息列表
const loadMessages = async () => {
  try {
    const params = {
      page: currentPage.value,
      size: 10,
      ...listFilter
    }
    
    if (searchKeyword.value) {
      params.keyword = searchKeyword.value
    }

    const response = await messageAPI.getAdminMessages(params)
    messageList.value = response.data.content
    totalPages.value = response.data.pagination.totalPages
  } catch (error) {
    console.error('加载消息列表失败:', error)
    alert('加载消息列表失败')
  }
}

// 选择消息
const selectMessage = async (msg) => {
  selectedMessage.value = msg
  
  // 获取消息详情（包含完整内容）- 使用管理端 API
  try {
    const response = await messageAPI.getAdminMessageDetail(msg.id)
    selectedMessage.value = response.data
    console.log('消息详情:', response.data)
  } catch (error) {
    console.error('获取消息详情失败:', error)
  }
}

// 切换页码
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  loadMessages()
}

// 获取分类文本
const getCategoryText = (category) => {
  const texts = {
    system: '系统通知',
    swap: '换电提醒',
    alert: '报警通知',
    activity: '活动公告'
  }
  return texts[category] || category
}

// 获取状态文本
const getStatusText = (status) => {
  const texts = {
    sent: '已发送',
    scheduled: '定时发送',
    cancelled: '已取消',
    draft: '草稿'
  }
  return texts[status] || status
}

// 获取目标类型文本
const getTargetTypeText = (type) => {
  const texts = {
    all: '所有用户',
    user: '指定用户',
    vehicle: '指定车辆',
    battery: '指定电池'
  }
  return texts[type] || type
}

// 格式化时间
const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 计算阅读率
const calculateReadRate = (message) => {
  if (!message || !message.recipientCount) return 0
  const rate = ((message.readCount || 0) / message.recipientCount) * 100
  return rate.toFixed(1)
}

// 发送消息
const sendMessage = async () => {
  if (!formData.title || !formData.content) {
    alert('请填写标题和内容')
    return
  }

  isSending.value = true

  try {
    // 解析目标 ID
    let targetIds = []
    if (formData.targetType !== 'all' && formData.targetIdsText) {
      targetIds = formData.targetIdsText
        .split(/[,,\n]/)
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id))
    }

    // 解析扩展数据
    let extraData = {}
    if (formData.extraDataText) {
      try {
        extraData = JSON.parse(formData.extraDataText)
      } catch (e) {
        alert('扩展数据 JSON 格式错误')
        isSending.value = false
        return
      }
    }

    // 构建请求数据
    const requestData = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      targetType: formData.targetType,
      priority: formData.priority
    }
    
    // 只在必要时添加 targetIds
    if (formData.targetType !== 'all' && targetIds.length > 0) {
      requestData.targetIds = targetIds
    }
    
    // 只在必要时添加 scheduledTime
    if (formData.scheduledTime) {
      requestData.scheduledTime = formData.scheduledTime
    }
    
    // 只在必要时添加 extraData
    if (formData.extraDataText && Object.keys(extraData).length > 0) {
      requestData.extraData = extraData
    }

    console.log('发送消息请求数据:', requestData)

    const response = await messageAPI.sendMessage(requestData)
    
    console.log('发送成功响应:', response)
    alert(`消息发送成功！\n消息 ID: ${response.data.messageId}\n接收人数：${response.data.recipientCount}`)
    
    // 关闭弹窗
    showCreateModal.value = false
    
    // 重置表单
    resetForm()
    
    // 重新加载列表
    loadMessages()
  } catch (error) {
    console.error('发送消息失败:', error)
    console.error('错误响应:', error.response?.data)
    alert('发送失败：' + (error.response?.data?.message || error.message))
  } finally {
    isSending.value = false
  }
}

// 重置表单
const resetForm = () => {
  formData.category = 'system'
  formData.title = ''
  formData.content = ''
  formData.targetType = 'all'
  formData.targetIdsText = ''
  formData.priority = 2
  formData.scheduledTime = ''
  formData.extraDataText = ''
}

// 取消定时消息
const cancelScheduledMessage = async () => {
  if (!confirm('确定要取消发送这条定时消息吗？')) return

  try {
    await messageAPI.cancelMessage(selectedMessage.value.id)
    alert('已取消发送')
    loadMessages()
  } catch (error) {
    console.error('取消发送失败:', error)
    alert('操作失败')
  }
}

// 重新发送
const resendMessage = async () => {
  if (!confirm('确定要重新发送这条消息吗？')) return

  try {
    await messageAPI.resendMessage(selectedMessage.value.id)
    alert('重新发送成功')
    loadMessages()
  } catch (error) {
    console.error('重新发送失败:', error)
    alert('操作失败')
  }
}

// 查看统计
const viewStatistics = () => {
  showStatsModal.value = true
}

// 生命周期
onMounted(() => {
  loadMessages()
})
</script>

<style scoped>
.message-management-page {
  min-height: calc(100vh - 120px);
  background: linear-gradient(180deg, 
    rgba(200, 240, 245, 0.3) 0%, 
    rgba(220, 230, 250, 0.25) 20%, 
    rgba(230, 220, 255, 0.2) 40%, 
    rgba(245, 245, 255, 0.15) 60%,
    rgba(250, 250, 255, 0.1) 80%,
    rgba(255, 255, 255, 0.05) 100%);
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.page-content {
  display: grid;
  grid-template-columns: 450px 1fr;
  gap: 20px;
  max-width: 100%;
  margin: 0;
  padding: 0 20px;
}

/* 左侧面板 */
.message-list-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
  height: calc(100vh - 220px);
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.panel-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.btn-primary {
  background: #1a1a1a;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 13px;
  background: white;
  cursor: pointer;
  white-space: nowrap;
}

.search-box {
  flex: 1;
  min-width: 200px;
  display: flex;
  gap: 6px;
}

.search-box input {
  flex: 1;
  min-width: 0;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 13px;
}

.btn-search {
  padding: 8px 16px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.btn-search:hover {
  background: #e0e0e0;
}

/* 消息列表 */
.message-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message-item {
  padding: 15px;
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.message-item:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.message-item.active {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.message-item-header {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.category-tag {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.category-tag.system {
  background: #e6f7ff;
  color: #1890ff;
}

.category-tag.activity {
  background: #fff7e6;
  color: #fa8c16;
}

.category-tag.swap {
  background: #f6ffed;
  color: #52c41a;
}

.category-tag.alert {
  background: #fff1f0;
  color: #f5222d;
}

.status-tag {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-tag.sent {
  background: #e6f7ff;
  color: #1890ff;
}

.status-tag.scheduled {
  background: #fff7e6;
  color: #fa8c16;
}

.status-tag.cancelled {
  background: #f5f5f5;
  color: #999;
}

.message-item-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 6px 0;
}

.message-item-preview {
  font-size: 13px;
  color: #666;
  margin: 0 0 10px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-item-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
}

.message-item-info {
  display: flex;
  gap: 12px;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-top: 1px solid #f0f0f0;
  margin-top: 15px;
}

.btn-page {
  padding: 8px 16px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
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
}

/* 右侧详情面板 */
.message-detail-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
  height: calc(100vh - 220px);
  overflow-y: auto;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.detail-header h2 {
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  flex: 1;
}

.detail-actions {
  display: flex;
  gap: 10px;
}

.btn-default {
  padding: 10px 20px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-default:hover {
  background: #f5f5f5;
}

.btn-warning {
  padding: 10px 20px;
  background: #ff9800;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-warning:hover {
  background: #f57c00;
}

.detail-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 25px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.info-label {
  color: #666;
  font-weight: 500;
}

.priority-stars {
  color: #faad14;
}

.highlight {
  color: #1890ff;
  font-weight: 600;
}

.detail-content-text {
  margin-bottom: 25px;
}

.detail-content-text h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 10px 0;
}

.detail-content-text p {
  font-size: 14px;
  color: #333;
  line-height: 1.8;
  white-space: pre-wrap;
}

.detail-extra {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.detail-extra h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 10px 0;
}

.detail-extra pre {
  font-size: 13px;
  color: #333;
  overflow-x: auto;
  margin: 0;
}

.empty-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  padding: 80px 20px;
}

.empty-detail .empty-icon {
  font-size: 80px;
  margin-bottom: 30px;
}

.empty-detail h3 {
  font-size: 18px;
  margin: 0 0 10px 0;
}

.empty-detail p {
  font-size: 14px;
  margin: 0;
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-dialog {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  color: #333;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #e0e0e0;
}

/* 表单 */
.message-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.required {
  color: #f5222d;
}

.form-input,
.form-select,
.form-textarea {
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-textarea {
  resize: vertical;
}

.char-count {
  font-size: 12px;
  color: #999;
  text-align: right;
}

.form-hint {
  font-size: 12px;
  color: #999;
  margin: 0;
}

/* 分类选择器 */
.category-selector {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.category-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.category-option:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.category-option.active {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.category-icon {
  font-size: 32px;
}

.category-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

/* 优先级选择器 */
.priority-selector {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.priority-option {
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.priority-option:hover {
  border-color: #faad14;
}

.priority-option.active {
  border-color: #faad14;
  background: #fff7e6;
}

/* 日期时间选择器 */
.datetime-picker {
  display: flex;
  gap: 10px;
}

.btn-clear {
  padding: 10px 16px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.btn-clear:hover {
  background: #e0e0e0;
}

/* 统计内容 */
.stats-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 20px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 32px;
  font-weight: 600;
  color: #667eea;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #999;
}

.empty-state .empty-icon {
  font-size: 80px;
  margin-bottom: 30px;
}

.empty-state h3 {
  font-size: 18px;
  margin: 0 0 10px 0;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}

/* 滚动条样式 */
.message-list::-webkit-scrollbar,
.modal-body::-webkit-scrollbar,
.message-detail-panel::-webkit-scrollbar {
  width: 6px;
}

.message-list::-webkit-scrollbar-thumb,
.modal-body::-webkit-scrollbar-thumb,
.message-detail-panel::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 3px;
}

.message-list::-webkit-scrollbar-thumb:hover,
.modal-body::-webkit-scrollbar-thumb:hover,
.message-detail-panel::-webkit-scrollbar-thumb:hover {
  background: #b0b0b0;
}

/* 暗色模式 */
html.dark-mode .message-management-page {
  background: linear-gradient(180deg, 
    rgba(30, 30, 40, 0.8) 0%, 
    rgba(25, 25, 35, 0.85) 50%, 
    rgba(20, 20, 30, 0.9) 100%);
}

html.dark-mode .message-list-panel,
html.dark-mode .message-detail-panel,
html.dark-mode .modal-dialog {
  background: #1e1e2e;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

html.dark-mode .page-title {
  color: #e0e0e0;
}

html.dark-mode .page-subtitle {
  color: #999;
}

html.dark-mode .panel-header h2 {
  color: #e0e0e0;
}

html.dark-mode .filter-select,
html.dark-mode .search-box input,
html.dark-mode .form-input,
html.dark-mode .form-select,
html.dark-mode .form-textarea {
  background: #2a2a3e;
  border-color: #3a3a4e;
  color: #e0e0e0;
}

html.dark-mode .message-item {
  border-color: #3a3a4e;
}

html.dark-mode .message-item:hover,
html.dark-mode .message-item.active {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.15);
}

html.dark-mode .message-item-title {
  color: #e0e0e0;
}

html.dark-mode .message-item-preview {
  color: #999;
}

html.dark-mode .detail-header h2 {
  color: #e0e0e0;
}

html.dark-mode .info-label {
  color: #999;
}

html.dark-mode .detail-content-text p {
  color: #e0e0e0;
}

html.dark-mode .detail-extra {
  background: #2a2a3e;
}

html.dark-mode .detail-extra pre {
  color: #e0e0e0;
}

html.dark-mode .form-label {
  color: #e0e0e0;
}

html.dark-mode .category-option {
  background: #2a2a3e;
  border-color: #3a3a4e;
}

html.dark-mode .category-option:hover,
html.dark-mode .category-option.active {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.15);
}

html.dark-mode .category-name {
  color: #e0e0e0;
}

html.dark-mode .priority-option {
  background: #2a2a3e;
  border-color: #3a3a4e;
}

html.dark-mode .priority-option:hover,
html.dark-mode .priority-option.active {
  border-color: #faad14;
  background: rgba(250, 173, 20, 0.15);
}

html.dark-mode .stat-item {
  background: #2a2a3e;
}

html.dark-mode .btn-default {
  background: #2a2a3e;
  border-color: #3a3a4e;
  color: #e0e0e0;
}

html.dark-mode .btn-default:hover {
  background: #3a3a4e;
}
</style>
