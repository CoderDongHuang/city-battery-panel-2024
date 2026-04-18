<template>
  <div class="contact-page">
    <div class="contact-container">
      <div class="contact-header">
        <h1>联系我们</h1>
        <p>如果您有任何问题或建议，请随时与我们联系</p>
      </div>

      <div class="contact-content">
        <!-- 联系方式 -->
        <div class="contact-methods">
          <div class="method-card">
            <div class="method-icon">📧</div>
            <h3>电子邮件</h3>
            <p>support@cityswap.com</p>
          </div>

          <div class="method-card">
            <div class="method-icon">📱</div>
            <h3>客服电话</h3>
            <p>400-888-8888</p>
          </div>

          <div class="method-card">
            <div class="method-icon">💬</div>
            <h3>在线客服</h3>
            <p>工作日 9:00-18:00</p>
            <p>点击帮助中心智能客服在线咨询</p>
          </div>

          <div class="method-card">
            <div class="method-icon">📍</div>
            <h3>公司地址</h3>
            <p>北京市朝阳区科技园区创新大厦 8 层</p>
          </div>
        </div>

        <!-- 联系表单 -->
        <div class="contact-form-section">
          <button @click="openHistoryModal" class="history-btn">
            📋 我的留言历史
          </button>
          <h2>在线留言</h2>
          <p class="form-description">感谢使用留言功能，留下您的反馈和宝贵的建议，我们会迅速采取行动</p>
          <form @submit.prevent="handleSubmit" class="contact-form">
            <div class="form-group">
              <label>姓名</label>
              <input 
                v-model="formData.name" 
                type="text" 
                placeholder="请输入您的姓名"
                required
              />
            </div>

            <div class="form-group">
              <label>邮箱</label>
              <input 
                v-model="formData.email" 
                type="email" 
                placeholder="请输入您的邮箱"
                required
              />
            </div>

            <div class="form-group">
              <label>主题</label>
              <input 
                v-model="formData.subject" 
                type="text" 
                placeholder="请输入主题"
                required
              />
            </div>

            <div class="form-group">
              <label>留言内容</label>
              <textarea 
                v-model="formData.message" 
                rows="6" 
                placeholder="请输入您的留言内容"
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              class="submit-btn"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? '提交中...' : '提交留言' }}
            </button>
          </form>
        </div>
      </div>
    </div>
    
    <!-- 留言历史弹窗 -->
    <div v-if="showHistoryModal" class="modal-overlay" @click="closeHistoryModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>我的留言历史</h2>
          <button @click="closeHistoryModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div v-if="loadingHistory" class="loading-state">加载中...</div>
          <div v-else-if="historyError" class="error-state">{{ historyError }}</div>
          <div v-else-if="!messageHistory || messageHistory.length === 0" class="empty-state">
            <p>暂无留言记录</p>
          </div>
          <div v-else class="history-list">
            <div 
              v-for="msg in messageHistory" 
              :key="msg.id" 
              class="history-item"
              @click="openMessageDetail(msg.id)"
            >
              <div class="history-header">
                <h4>{{ msg.subject || '无主题' }}</h4>
                <span class="status-badge" :class="'status-' + (msg.status || 'pending')">
                  {{ getStatusText(msg.status || 'pending') }}
                </span>
              </div>
              <p class="history-preview">{{ (msg.message || '暂无内容').substring(0, 50) }}...</p>
              <div class="history-footer">
                <span class="history-date">{{ formatDate(msg.createdAt) }}</span>
                <span class="view-detail">查看详情 →</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 留言详情弹窗 -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>留言详情</h2>
          <button @click="closeDetailModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div v-if="loadingDetail" class="loading-state">加载中...</div>
          <div v-else-if="detailError" class="error-state">{{ detailError }}</div>
          <div v-else-if="currentMessage" class="message-detail">
            <div class="detail-section">
              <h4>基本信息</h4>
              <div class="detail-row">
                <span class="label">主题：</span>
                <span class="value">{{ currentMessage.subject }}</span>
              </div>
              <div class="detail-row">
                <span class="label">状态：</span>
                <span class="status-badge" :class="'status-' + currentMessage.status">
                  {{ getStatusText(currentMessage.status) }}
                </span>
              </div>
              <div class="detail-row">
                <span class="label">提交时间：</span>
                <span class="value">{{ formatDate(currentMessage.createdAt) }}</span>
              </div>
              <div class="detail-row" v-if="currentMessage.repliedAt">
                <span class="label">回复时间：</span>
                <span class="value">{{ formatDate(currentMessage.repliedAt) }}</span>
              </div>
            </div>

            <div class="detail-section">
              <h4>留言内容</h4>
              <div class="detail-content">
                {{ currentMessage.message }}
              </div>
            </div>

            <div class="detail-section" v-if="currentMessage.reply">
              <h4>官方回复</h4>
              <div class="reply-content">
                {{ currentMessage.reply }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <SiteFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SiteFooter from '../components/SiteFooter.vue'
import { submitMessageAPI, getMessageHistoryAPI, getMessageDetailAPI } from '../services/contactAPI'

const router = useRouter()

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)

// 留言历史相关
const showHistoryModal = ref(false)
const showDetailModal = ref(false)
const messageHistory = ref([])
const currentMessage = ref(null)
const loadingHistory = ref(false)
const loadingDetail = ref(false)
const historyError = ref('')
const detailError = ref('')

// 打开历史留言弹窗
const openHistoryModal = async () => {
  showHistoryModal.value = true
  loadingHistory.value = true
  historyError.value = ''
  
  try {
    const history = await getMessageHistoryAPI()
    console.log('留言历史数据:', history)
    messageHistory.value = history || []
  } catch (error) {
    console.error('获取留言历史失败:', error)
    if (error.response?.status === 401) {
      historyError.value = '请先登录'
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } else {
      historyError.value = '加载失败，请稍后重试'
    }
  } finally {
    loadingHistory.value = false
  }
}

// 关闭历史留言弹窗
const closeHistoryModal = () => {
  showHistoryModal.value = false
  messageHistory.value = []
  historyError.value = ''
}

// 打开留言详情弹窗
const openMessageDetail = async (messageId) => {
  showDetailModal.value = true
  loadingDetail.value = true
  detailError.value = ''
  
  try {
    const detail = await getMessageDetailAPI(messageId)
    currentMessage.value = detail
  } catch (error) {
    console.error('获取留言详情失败:', error)
    detailError.value = '加载失败，请稍后重试'
  } finally {
    loadingDetail.value = false
  }
}

// 关闭留言详情弹窗
const closeDetailModal = () => {
  showDetailModal.value = false
  currentMessage.value = null
  detailError.value = ''
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'pending': '待处理',
    'processing': '处理中',
    'resolved': '已解决',
    'replied': '已回复',
    'closed': '已关闭'
  }
  return statusMap[status] || status
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleSubmit = async () => {
  // 防止重复提交
  if (isSubmitting.value) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    // 调用 API 提交留言
    await submitMessageAPI(formData.value)
    
    // 提交成功
    alert('感谢您的留言！我们会尽快与您联系。')
    
    // 重置表单
    formData.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  } catch (error) {
    console.error('提交留言失败:', error)
    
    // 根据错误类型给出提示
    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.message || error.response.data?.msg
      
      if (status === 401) {
        alert('请先登录')
        router.push('/login')
      } else if (status === 400) {
        alert(message || '提交失败，请检查输入信息')
      } else if (status === 500) {
        alert('服务器错误，请稍后重试')
      } else {
        alert(message || '提交失败，请稍后重试')
      }
    } else if (error.request) {
      alert('网络连接失败，请检查网络后重试')
    } else {
      alert('提交失败，请稍后重试')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  /* 使用控制台风格的渐变背景 */
  background: linear-gradient(180deg, 
    rgba(200, 240, 245, 0.8) 0%, 
    rgba(220, 230, 250, 0.7) 20%, 
    rgba(230, 220, 255, 0.6) 40%, 
    rgba(245, 245, 255, 0.5) 60%,
    rgba(250, 250, 255, 0.4) 80%,
    rgba(255, 255, 255, 0.3) 100%);
  background-attachment: fixed;
  padding: 20px 20px 40px;
  transition: background-color 0.3s ease;
}

/* 深色模式下，背景保持不变，内容卡片变深色 */
html.dark-mode .contact-page {
  background: linear-gradient(180deg, 
    rgba(200, 240, 245, 0.8) 0%, 
    rgba(220, 230, 250, 0.7) 20%, 
    rgba(230, 220, 255, 0.6) 40%, 
    rgba(245, 245, 255, 0.5) 60%,
    rgba(250, 250, 255, 0.4) 80%,
    rgba(255, 255, 255, 0.3) 100%);
}

.contact-container {
  max-width: 1200px;
  margin: 0 auto;
}

.contact-header {
  text-align: center;
  margin-bottom: 40px;
}

.contact-header h1 {
  font-size: 36px;
  color: #333;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #0066cc 0%, #00cc99 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: color 0.3s ease;
  line-height: 1.4;
}

/* 深色模式下，标题保持深色（在渐变背景上） */
html.dark-mode .contact-header h1 {
  color: #333 !important;
  background: linear-gradient(135deg, #0066cc 0%, #00cc99 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.contact-header p {
  font-size: 16px;
  color: #666;
  transition: color 0.3s ease;
  line-height: 1.6;
}

/* 深色模式下，描述文字保持深色（在渐变背景上） */
html.dark-mode .contact-header p {
  color: #666 !important;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.contact-methods {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.method-card {
  background: white;
  padding: 30px 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

/* 深色模式下，卡片变深色（纯黑色） */
html.dark-mode .method-card {
  background: #000000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.method-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

/* 深色模式下，hover 效果 */
html.dark-mode .method-card:hover {
  box-shadow: 0 8px 16px rgba(255, 255, 255, 0.1);
}

.method-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.method-card h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
  transition: color 0.3s ease;
}

/* 深色模式下，卡片标题变白色 */
html.dark-mode .method-card h3 {
  color: #ffffff !important;
}

.method-card p {
  font-size: 14px;
  color: #666;
  transition: color 0.3s ease;
}

/* 深色模式下，卡片描述变白色 */
html.dark-mode .method-card p {
  color: #ffffff !important;
}

.contact-form-section {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  position: relative;
}

.history-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  background: #f5f5f5;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  z-index: 10;
}

.history-btn:hover {
  background: #e8e8e8;
  border-color: #ccc;
  transform: translateY(-2px);
}

/* 深色模式下，历史按钮样式 */
html.dark-mode .history-btn {
  background: #2a2a3e;
  border-color: #444;
  color: #ffffff;
}

html.dark-mode .history-btn:hover {
  background: #3a3a4e;
  border-color: #666;
}

.form-description {
  margin: 0 0 30px 0;
  font-size: 14px;
  color: #666;
}

/* 深色模式下，说明文字变灰色 */
html.dark-mode .form-description {
  color: #ccc;
}

/* 深色模式下，表单区域变深色 */
html.dark-mode .contact-form-section {
  background: #000000;
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.1);
  border: 2px solid #ffffff;
}

.contact-form-section h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 30px;
  transition: color 0.3s ease;
}

/* 深色模式下，表单标题变白色 */
html.dark-mode .contact-form-section h2 {
  color: #ffffff !important;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
  transition: color 0.3s ease;
}

/* 深色模式下，标签变白色 */
html.dark-mode .form-group label {
  color: #ffffff !important;
}

.form-group input,
.form-group textarea {
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  font-family: inherit;
  background: white;
  color: #333;
}

/* 深色模式下，输入框变深色 */
html.dark-mode .form-group input,
html.dark-mode .form-group textarea {
  background: #1a1a2e;
  border-color: #444;
  color: #ffffff;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

/* 深色模式下，focus 效果 */
html.dark-mode .form-group input:focus,
html.dark-mode .form-group textarea:focus {
  border-color: #4facfe;
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.2);
}

.form-group textarea {
  resize: vertical;
}

.submit-btn {
  padding: 14px 32px;
  background: #000000;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}

/* 禁用状态 */
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 深色模式下，按钮变白色背景 + 黑色文字 */
html.dark-mode .submit-btn {
  background: #ffffff;
  color: #000000;
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.3);
}

html.dark-mode .submit-btn:hover {
  box-shadow: 0 6px 12px rgba(255, 255, 255, 0.4);
}

/* 响应式 */
@media (max-width: 968px) {
  .contact-content {
    grid-template-columns: 1fr;
  }

  .contact-methods {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .contact-methods {
    grid-template-columns: 1fr;
  }

  .contact-form-section {
    padding: 20px;
  }
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.modal-header .close-btn {
  background: none;
  border: none;
  font-size: 32px;
  color: #999;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.modal-header .close-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.modal-body {
  padding: 32px;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 16px;
}

.error-state {
  color: #ff4444;
}

/* 历史列表 */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.history-item {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.history-item:hover {
  background: #f0f0f0;
  border-color: #0066cc;
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.15);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.history-header h4 {
  margin: 0;
  font-size: 16px;
  color: #333;
  flex: 1;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  margin-left: 12px;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-processing {
  background: #cce5ff;
  color: #004085;
}

.status-resolved,
.status-replied {
  background: #d4edda;
  color: #155724;
}

.status-closed {
  background: #e2e3e5;
  color: #383d41;
}

.history-preview {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

.history-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #999;
}

.view-detail {
  color: #0066cc;
  font-weight: 500;
}

/* 留言详情 */
.message-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-section {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

.detail-section h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #333;
  padding-bottom: 12px;
  border-bottom: 2px solid #0066cc;
}

.detail-row {
  display: flex;
  margin-bottom: 12px;
  font-size: 14px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-row .label {
  font-weight: 500;
  color: #666;
  min-width: 100px;
}

.detail-row .value {
  color: #333;
  flex: 1;
}

.detail-content,
.reply-content {
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap;
  word-break: break-word;
}

.reply-content {
  padding: 16px;
  background: #e8f4e8;
  border-radius: 8px;
  border-left: 4px solid #28a745;
}

/* 深色模式下的弹窗 */
html.dark-mode .modal-content {
  background: #1a1a2e;
}

html.dark-mode .modal-header {
  border-bottom-color: #444;
}

html.dark-mode .modal-header h2 {
  color: #ffffff;
}

html.dark-mode .modal-header .close-btn {
  color: #999;
}

html.dark-mode .modal-header .close-btn:hover {
  background: #2a2a3e;
  color: #ffffff;
}

html.dark-mode .history-item {
  background: #2a2a3e;
  border-color: #444;
}

html.dark-mode .history-item:hover {
  background: #3a3a4e;
  border-color: #4facfe;
}

html.dark-mode .history-header h4 {
  color: #ffffff;
}

html.dark-mode .history-preview {
  color: #ccc;
}

html.dark-mode .detail-section {
  background: #2a2a3e;
  border-color: #444;
}

html.dark-mode .detail-section h4 {
  color: #ffffff;
  border-bottom-color: #4facfe;
}

html.dark-mode .detail-row .label {
  color: #aaa;
}

html.dark-mode .detail-row .value {
  color: #ffffff;
}

html.dark-mode .detail-content,
html.dark-mode .reply-content {
  color: #ffffff;
}

html.dark-mode .reply-content {
  background: #1a3a1a;
  border-left-color: #28a745;
}
</style>
