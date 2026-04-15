<template>
  <div class="my-batteries">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1>我的电池</h1>
        <p>管理您的电池信息，随时掌握电池状态</p>
      </div>
    </div>
    
    <!-- 装饰线（波浪线） -->
    <div class="decorative-line-wrapper">
      <div class="decorative-line">
        <svg class="wave-line" viewBox="0 0 1200 60" preserveAspectRatio="none">
          <path d="M0,30 Q30,0 60,30 T120,30 T180,30 T240,30 T300,30 T360,30 T420,30 T480,30 T540,30 T600,30 T660,30 T720,30 T780,30 T840,30 T900,30 T960,30 T1020,30 T1080,30 T1200,30" 
                stroke="#333" 
                stroke-width="2" 
                fill="none"/>
        </svg>
      </div>
      <!-- 添加电池按钮（独立一行） -->
      <div class="add-btn-container">
        <button class="add-battery-btn" @click="showAddModal = true">
          <span class="plus-icon">+</span>
          <span>添加电池</span>
        </button>
      </div>
    </div>

    <!-- 电池列表 -->
    <div class="batteries-grid">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <!-- 空状态 -->
      <div v-else-if="batteries.length === 0" class="empty-state">
        <div class="empty-icon">🔋</div>
        <h2>暂无电池</h2>
        <p>添加您的第一块电池，开始便捷的换电体验</p>
        <button class="add-btn" @click="showAddModal = true">
          <span class="plus-icon">+</span>
          <span>添加电池</span>
        </button>
      </div>

      <!-- 电池卡片列表 -->
      <div v-else class="battery-cards">
        <div 
          v-for="battery in batteries" 
          :key="battery.id"
          class="battery-card"
          :class="{ 'battery-offline': battery.status === 'offline' }"
        >
          <div class="battery-card-header">
            <div class="battery-avatar">🔋</div>
            <div class="battery-basic-info">
              <h3 class="battery-name">{{ battery.name }}</h3>
              <p class="battery-model">{{ battery.model }}</p>
            </div>
          </div>
          
          <div class="battery-status-badge" :class="battery.status">
            {{ battery.status === 'online' ? '🟢 在线' : '🔴 离线' }}
          </div>

          <div class="battery-card-body">
            <div class="battery-detail-row">
              <span class="detail-label">📋 电池编码</span>
              <span class="detail-value">{{ battery.code || '未登记' }}</span>
            </div>
            <div class="battery-detail-row">
              <span class="detail-label">⚡ 电池容量</span>
              <span class="detail-value">{{ battery.capacity ? battery.capacity + ' Ah' : '未知' }}</span>
            </div>
            <div class="battery-detail-row">
              <span class="detail-label">📅 购买日期</span>
              <span class="detail-value">{{ battery.purchaseDate || '未知' }}</span>
            </div>
            <div v-if="battery.notes" class="battery-detail-row">
              <span class="detail-label">📝 备注</span>
              <span class="detail-value notes">{{ battery.notes }}</span>
            </div>
          </div>

          <div class="battery-card-footer">
            <button class="action-btn view" @click="viewBatteryDetail(battery)">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <span>详情</span>
            </button>
            <button class="action-btn edit" @click="editBattery(battery)">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <span>编辑</span>
            </button>
            <button class="action-btn delete" @click="confirmDelete(battery)">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
              <span>删除</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑电池弹窗 -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2>{{ isEditing ? '编辑电池' : '添加电池' }}</h2>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="handleSubmit" class="battery-form">
            <div class="form-group">
              <label class="form-label">
                <span class="required">*</span> 电池名称
              </label>
              <input
                v-model="formData.name"
                type="text"
                class="form-input"
                placeholder="例如：我的第一块电池"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                <span class="required">*</span> 电池型号
              </label>
              <input
                v-model="formData.model"
                type="text"
                class="form-input"
                placeholder="例如：CATL-100Ah"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                <span class="required">*</span> 电池编码
              </label>
              <input
                v-model="formData.code"
                type="text"
                class="form-input"
                placeholder="电池唯一编码"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">电池容量 (Ah)</label>
              <input
                v-model="formData.capacity"
                type="number"
                step="0.1"
                class="form-input"
                placeholder="例如：100"
              />
            </div>

            <div class="form-group">
              <label class="form-label">购买日期</label>
              <input
                v-model="formData.purchaseDate"
                type="date"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label class="form-label">备注</label>
              <textarea
                v-model="formData.notes"
                class="form-textarea"
                placeholder="其他需要说明的信息..."
                rows="3"
              ></textarea>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-cancel" @click="closeModal">
                取消
              </button>
              <button type="submit" class="btn-submit" :disabled="submitting">
                {{ submitting ? '提交中...' : (isEditing ? '保存修改' : '添加电池') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 电池详情弹窗 -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-container detail-modal" @click.stop>
        <div class="modal-header">
          <h2>🔋 电池详情</h2>
          <button class="modal-close" @click="closeDetailModal">✕</button>
        </div>

        <div class="modal-body">
          <div class="detail-content">
            <div class="detail-row">
              <span class="detail-label">电池名称</span>
              <span class="detail-value">{{ selectedBattery?.name }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">电池型号</span>
              <span class="detail-value">{{ selectedBattery?.model }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">电池编码</span>
              <span class="detail-value">{{ selectedBattery?.code || '未登记' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">电池容量</span>
              <span class="detail-value">{{ selectedBattery?.capacity ? selectedBattery.capacity + ' Ah' : '未知' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">购买日期</span>
              <span class="detail-value">{{ selectedBattery?.purchaseDate || '未知' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">状态</span>
              <span class="detail-value">
                <span class="status-badge" :class="selectedBattery?.status">
                  {{ selectedBattery?.status === 'online' ? '🟢 在线' : '🔴 离线' }}
                </span>
              </span>
            </div>
            <div v-if="selectedBattery?.notes" class="detail-row">
              <span class="detail-label">备注</span>
              <span class="detail-value notes">{{ selectedBattery?.notes }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">创建时间</span>
              <span class="detail-value">{{ formatDate(selectedBattery?.createdAt) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">更新时间</span>
              <span class="detail-value">{{ formatDate(selectedBattery?.updatedAt) }}</span>
            </div>
          </div>

          <div class="detail-actions">
            <button class="btn-cancel" @click="closeDetailModal">
              关闭
            </button>
            <button class="btn-primary" @click="editFromDetail">
              编辑
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <SiteFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SiteFooter from '../components/SiteFooter.vue'
import { userBatteryAPI } from '../services/userAPI'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const batteries = ref([])
const loading = ref(false)
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDetailModal = ref(false)
const submitting = ref(false)
const selectedBattery = ref(null)

const formData = ref({
  name: '',
  model: '',
  code: '',
  capacity: '',
  purchaseDate: '',
  notes: ''
})

const isEditing = ref(false)
const currentBattery = ref(null)

// 加载电池列表
const loadBatteries = async () => {
  loading.value = true
  try {
    const res = await userBatteryAPI.getBatteries()
    if (res.code === 200) {
      batteries.value = res.data || []
    } else {
      ElMessage.error(res.message || '加载电池列表失败')
    }
  } catch (error) {
    console.error('加载电池列表失败:', error)
    ElMessage.error('加载失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 打开添加弹窗
const showAddModalHandler = () => {
  formData.value = {
    name: '',
    model: '',
    code: '',
    capacity: '',
    purchaseDate: '',
    notes: ''
  }
  showAddModal.value = true
}

// 编辑电池
const editBattery = (battery) => {
  currentBattery.value = battery
  formData.value = {
    name: battery.name,
    model: battery.model,
    code: battery.code,
    capacity: battery.capacity,
    purchaseDate: battery.purchaseDate,
    notes: battery.notes || ''
  }
  showEditModal.value = true
}

// 关闭弹窗
const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  currentBattery.value = null
}

// 确认删除
const confirmDelete = async (battery) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除电池"${battery.name}"吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const res = await userBatteryAPI.deleteBattery(battery.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      loadBatteries()
    } else {
      ElMessage.error(res.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败，请稍后重试')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  submitting.value = true
  try {
    if (isEditing.value && currentBattery.value) {
      // 调用更新 API
      const res = await userBatteryAPI.updateBattery(currentBattery.value.id, formData.value)
      if (res.code === 200) {
        ElMessage.success('更新成功')
        closeModal()
        loadBatteries()
      } else {
        ElMessage.error(res.message || '更新失败')
      }
    } else {
      // 调用添加 API
      const res = await userBatteryAPI.addBattery(formData.value)
      if (res.code === 200) {
        ElMessage.success('添加成功')
        closeModal()
        loadBatteries()
      } else {
        ElMessage.error(res.message || '添加失败')
      }
    }
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error(isEditing.value ? '更新失败' : '添加失败')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadBatteries()
})

// 查看电池详情
const viewBatteryDetail = (battery) => {
  selectedBattery.value = battery
  showDetailModal.value = true
}

// 关闭详情弹窗
const closeDetailModal = () => {
  showDetailModal.value = false
  selectedBattery.value = null
}

// 从详情页编辑
const editFromDetail = () => {
  if (selectedBattery.value) {
    // 直接填充表单数据并打开编辑弹窗，不关闭详情弹窗
    currentBattery.value = selectedBattery.value
    formData.value = {
      name: selectedBattery.value.name,
      model: selectedBattery.value.model,
      code: selectedBattery.value.code,
      capacity: selectedBattery.value.capacity,
      purchaseDate: selectedBattery.value.purchaseDate,
      notes: selectedBattery.value.notes || ''
    }
    isEditing.value = true
    showDetailModal.value = false
    showEditModal.value = true
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.my-batteries {
  min-height: 100vh;
  padding: 24px;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  transition: background-color 0.3s ease;
}

/* 页面头部 */
.page-header {
  text-align: center;
  margin-bottom: 24px;
}

.header-content h1 {
  margin: 0 0 16px 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

/* 深色模式下，页面标题保持深色（因为在浅色背景上） */
html.dark-mode .header-content h1 {
  color: #333333;
}

html.dark-mode .header-content p {
  color: #666666;
}

.header-content p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
  transition: color 0.3s ease;
}

/* 装饰线（波浪线） */
.decorative-line-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  position: relative;
}

.decorative-line {
  position: relative;
  flex: 1;
  height: 40px;
  margin-right: -100px;
}

.wave-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 添加电池按钮容器 */
.add-btn-container {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.add-battery-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #333;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-battery-btn:hover {
  background: #000;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* 深色模式下的添加按钮样式 */
html.dark-mode .add-battery-btn {
  background: #ffffff;
  color: #000000;
}

html.dark-mode .add-battery-btn:hover {
  background: #e0e0e0;
}

.plus-icon {
  font-size: 20px;
  font-weight: bold;
}

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-tertiary);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--bg-tertiary);
  border-top: 4px solid var(--text-tertiary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 40px;
  opacity: 0.5;
}

.empty-state h2 {
  margin: 0 0 12px 0;
  font-size: 24px;
  color: var(--text-secondary);
}

.empty-state p {
  margin: 0 0 32px 0;
  font-size: 16px;
  color: var(--text-tertiary);
  transition: color 0.3s ease;
}

.add-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  background: var(--card-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-btn:hover {
  background: var(--hover-bg);
  border-color: var(--border-color);
  transform: translateY(-2px);
}

/* 电池卡片容器 */
.battery-cards {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 24px;
  width: 100%;
}

.battery-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px var(--shadow-color);
  width: 100%;
  max-width: 400px;
  position: relative;
}

.battery-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px var(--shadow-color);
  border-color: var(--border-color);
}

.battery-card.battery-offline {
  opacity: 0.7;
}

/* 深色模式下，电池卡片文字保持白色 */
html.dark-mode .battery-name {
  color: #ffffff !important;
}

html.dark-mode .battery-model {
  color: #e0e0e0 !important;
}

html.dark-mode .detail-label {
  color: #e0e0e0 !important;
}

html.dark-mode .detail-value {
  color: #ffffff !important;
}

html.dark-mode .detail-value.notes {
  color: #e0e0e0 !important;
}

.battery-card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
  transition: border-color 0.3s ease;
}

.battery-avatar {
  font-size: 48px;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 12px;
}

.battery-basic-info {
  flex: 1;
}

.battery-name {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.battery-model {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
}

.battery-status-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: var(--hover-bg);
  color: var(--text-secondary);
}

.battery-status-badge.online {
  background: #e8f5e9;
  color: #2e7d32;
}

html.dark-mode .battery-status-badge.online {
  background: rgba(76, 175, 80, 0.2);
  color: #81c784;
}

.battery-status-badge.offline {
  background: #ffebee;
  color: #c62828;
}

html.dark-mode .battery-status-badge.offline {
  background: rgba(244, 67, 54, 0.2);
  color: #e57373;
}

.battery-card-body {
  margin-bottom: 16px;
}

.battery-detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color);
  transition: border-color 0.3s ease;
}

.battery-detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.detail-value {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}

.detail-value.notes {
  color: var(--text-tertiary);
  font-style: italic;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: right;
}

.battery-card-footer {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-icon {
  width: 18px;
  height: 18px;
  stroke: currentColor;
}

.action-btn.view {
  background: #e8f5e9;
  color: #2e7d32;
}

.action-btn.view:hover {
  background: #c8e6c9;
}

.action-btn.edit {
  background: #e3f2fd;
  color: #1976d2;
}

.action-btn.edit:hover {
  background: #bbdefb;
}

.action-btn.delete {
  background: #ffebee;
  color: #c62828;
}

.action-btn.delete:hover {
  background: #ffcdd2;
}

/* 深色模式下的按钮样式 */
html.dark-mode .action-btn.view {
  background: rgba(76, 175, 80, 0.2);
  color: #81c784;
}

html.dark-mode .action-btn.view:hover {
  background: rgba(76, 175, 80, 0.3);
}

html.dark-mode .action-btn.edit {
  background: rgba(33, 150, 243, 0.2);
  color: #64b5f6;
}

html.dark-mode .action-btn.edit:hover {
  background: rgba(33, 150, 243, 0.3);
}

html.dark-mode .action-btn.delete {
  background: rgba(244, 67, 54, 0.2);
  color: #e57373;
}

html.dark-mode .action-btn.delete:hover {
  background: rgba(244, 67, 54, 0.3);
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
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: var(--card-bg);
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px var(--shadow-color);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid var(--border-color);
  transition: border-color 0.3s ease;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 24px;
  color: var(--text-tertiary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--hover-bg);
  color: var(--text-primary);
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.form-input,
.form-textarea,
.form-select {
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  font-family: inherit;
  background: var(--input-bg);
  color: var(--text-primary);
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  border-color: var(--border-color);
  outline: none;
  box-shadow: 0 0 0 2px rgba(153, 153, 153, 0.2);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.btn-cancel,
.btn-submit {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-cancel:hover {
  background: #e8e8e8;
}

.btn-submit {
  background: #f5f5f5;
  color: #333;
  min-width: 120px;
  border: 1px solid #d9d9d9;
}

.btn-submit:hover:not(:disabled) {
  background: #ffffff;
  border-color: #d9d9d9;
  transform: translateY(-2px);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 详情弹窗样式 */
.detail-modal .detail-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  min-width: 100px;
}

.detail-value {
  font-size: 14px;
  color: #333;
  text-align: right;
  flex: 1;
  margin-left: 16px;
}

.detail-value.notes {
  white-space: pre-wrap;
  word-break: break-all;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
}

.status-badge.online {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-badge.offline {
  background: #ffebee;
  color: #c62828;
}

.detail-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e8e8e8;
}

.detail-actions .btn-primary {
  background: #f5f5f5;
  color: #333;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #d9d9d9;
}

.detail-actions .btn-primary:hover {
  background: #ffffff;
  border-color: #d9d9d9;
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .add-battery-btn {
    width: 100%;
    justify-content: center;
  }

  .battery-cards {
    grid-template-columns: 1fr;
  }

  .battery-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .battery-status-badge {
    align-self: flex-start;
  }

  .battery-detail-row {
    flex-direction: column;
    gap: 4px;
  }

  .detail-value {
    text-align: left;
    max-width: 100%;
  }

  .modal-container {
    max-height: 95vh;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
  }
}
</style>
