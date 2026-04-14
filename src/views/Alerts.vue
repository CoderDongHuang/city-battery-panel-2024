<template>
  <div class="alerts">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1>🔔 系统报警管理</h1>
        <p>监控和管理所有系统级别的报警信息</p>
      </div>
      <div class="header-actions">
        <button class="action-btn refresh-btn" @click="refreshAlerts" :disabled="loading">
          <span class="btn-icon">🔄</span>
          刷新数据
        </button>
        <button class="action-btn export-btn" @click="exportAlerts">
          <span class="btn-icon">📊</span>
          导出报表
        </button>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      <div class="error-icon">⚠️</div>
      <div class="error-text">{{ error }}</div>
    </div>

    <!-- 报警统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon" style="background: #fff2f0; color: #ff4d4f;">🔥</div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.active || 0 }}</div>
          <div class="stat-label">活跃报警</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon" style="background: #f6ffed; color: #52c41a;">✅</div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.resolved || 0 }}</div>
          <div class="stat-label">已处理</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon" style="background: #fff7e6; color: #faad14;">🚨</div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.urgent || 0 }}</div>
          <div class="stat-label">紧急报警</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon" style="background: #f0f5ff; color: #1890ff;">📊</div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.total || 0 }}</div>
          <div class="stat-label">总数</div>
        </div>
      </div>
    </div>

    <!-- 筛选工具栏 -->
    <div class="filter-toolbar">
      <div class="filter-group">
        <label>报警类型：</label>
        <select v-model="filters.type" @change="applyFilters">
          <option value="">全部类型</option>
          <option value="temperature">温度异常</option>
          <option value="lowBattery">电量不足</option>
          <option value="unreachable">设备离线</option>
          <option value="other">其他报警</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>报警级别：</label>
        <select v-model="filters.level" @change="applyFilters">
          <option value="">全部级别</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>处理状态：</label>
        <select v-model="filters.resolved">
          <option :value="null">全部状态</option>
          <option :value="false">未处理</option>
          <option :value="true">已处理</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>开始时间：</label>
        <input type="date" v-model="filters.startTime">
      </div>
      
      <div class="filter-group">
        <label>结束时间：</label>
        <input type="date" v-model="filters.endTime">
      </div>
      
      <div class="filter-actions">
        <button class="clear-btn" @click="clearFilters">清除筛选</button>
      </div>
    </div>

    <!-- 报警列表 -->
    <div class="alerts-table-container">
      <div class="table-header">
        <div class="table-title">
          <h3>报警列表</h3>
          <div class="table-info">
            共 {{ pagination.total }} 条记录，当前显示 {{ filteredAlerts.length }} 条
          </div>
        </div>
        <div v-if="selectedAlerts.length > 0" class="batch-actions">
          <span class="batch-info">已选择 {{ selectedAlerts.length }} 条未处理报警</span>
          <button 
            class="btn btn-primary" 
            @click="batchResolveAlerts"
            :disabled="batchProcessing"
          >
            {{ batchProcessing ? '处理中...' : '批量处理' }}
          </button>
        </div>
      </div>
      
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <span>加载中...</span>
      </div>
      
      <div v-else-if="filteredAlerts.length === 0" class="empty-state">
        <div class="empty-icon">📄</div>
        <div class="empty-text">暂无报警数据</div>
      </div>
      
      <div v-else class="table-wrapper">
        <table class="alerts-table">
          <thead>
            <tr>
              <th width="80">
                <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
              </th>
              <th width="100">ID</th>
              <th width="120">类型</th>
              <th width="100">级别</th>
              <th>标题</th>
              <th width="180">时间</th>
              <th width="100">状态</th>
              <th width="150">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alert in filteredAlerts" :key="alert.id" :class="{ 'resolved': alert.resolved }">
              <td>
                <input type="checkbox" v-model="selectedAlerts" :value="alert.id">
              </td>
              <td>{{ formatAlertId(alert.id) }}</td>
              <td>
                <span class="alert-type" :class="getAlertTypeClass(alert.type)">
                  {{ getAlertTypeText(alert.type) }}
                </span>
              </td>
              <td>
                <span class="alert-level" :class="getLevelClass(alert.level)">
                  {{ getLevelText(alert.level) }}
                </span>
              </td>
              <td class="alert-title">{{ alert.title }}</td>
              <td>{{ formatTime(alert.timestamp) }}</td>
              <td>
                <span class="status-badge" :class="{ resolved: alert.resolved }">
                  {{ alert.resolved ? '已处理' : '未处理' }}
                </span>
              </td>
              <td>
                <button 
                  v-if="!alert.resolved"
                  class="btn btn-small btn-primary"
                  @click="resolveAlert(alert.id)"
                  :disabled="processingAlert === alert.id"
                >
                  {{ processingAlert === alert.id ? '处理中...' : '处理' }}
                </button>
                <button 
                  class="btn btn-small btn-secondary"
                  @click="viewAlertDetails(alert)"
                >
                  详情
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 分页控件 -->
      <div v-if="filteredAlerts.length > 0" class="pagination">
        <div class="pagination-info">
          {{ pagination.current }} / {{ pagination.pages }}
        </div>
        <div class="pagination-controls">
          <button 
            class="pagination-btn"
            :disabled="pagination.current <= 1"
            @click="changePage(pagination.current - 1)"
          >
            上一页
          </button>
          <button 
            class="pagination-btn"
            :disabled="pagination.current >= pagination.pages"
            @click="changePage(pagination.current + 1)"
          >
            下一页
          </button>
        </div>
      </div>
    </div>

    <!-- 报警详情弹窗 -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>报警详情</h3>
          <button class="modal-close" @click="closeDetailModal">×</button>
        </div>
        
        <div v-if="currentAlertDetail" class="modal-body">
          <div class="detail-section">
            <h4>基本信息</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <label>报警ID：</label>
                <span>{{ currentAlertDetail.id }}</span>
              </div>
              <div class="detail-item">
                <label>报警类型：</label>
                <span class="alert-type" :class="getAlertTypeClass(currentAlertDetail.type)">
                  {{ getAlertTypeText(currentAlertDetail.type) }}
                </span>
              </div>
              <div class="detail-item">
                <label>报警级别：</label>
                <span class="alert-level" :class="getLevelClass(currentAlertDetail.level)">
                  {{ getLevelText(currentAlertDetail.level) }}
                </span>
              </div>
              <div class="detail-item">
                <label>报警时间：</label>
                <span>{{ formatTime(currentAlertDetail.timestamp) }}</span>
              </div>
              <div class="detail-item">
                <label>处理状态：</label>
                <span class="status-badge" :class="{ resolved: currentAlertDetail.resolved }">
                  {{ currentAlertDetail.resolved ? '已处理' : '未处理' }}
                </span>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h4>关联信息</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <label>车辆编号：</label>
                <span>{{ currentAlertDetail.vid || '无' }}</span>
              </div>
              <div class="detail-item">
                <label>电池编号：</label>
                <span>{{ currentAlertDetail.pid || '无' }}</span>
              </div>
              <div class="detail-item">
                <label>位置坐标：</label>
                <span>{{ currentAlertDetail.positionX && currentAlertDetail.positionY ? `(${currentAlertDetail.positionX}, ${currentAlertDetail.positionY})` : '无' }}</span>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h4>报警内容</h4>
            <div class="alert-message">
              {{ currentAlertDetail.message }}
            </div>
          </div>

          <div v-if="currentAlertDetail.triggerValue || currentAlertDetail.thresholdValue" class="detail-section">
            <h4>技术参数</h4>
            <div class="detail-grid">
              <div v-if="currentAlertDetail.triggerValue" class="detail-item">
                <label>触发值：</label>
                <span>{{ currentAlertDetail.triggerValue }}</span>
              </div>
              <div v-if="currentAlertDetail.thresholdValue" class="detail-item">
                <label>阈值：</label>
                <span>{{ currentAlertDetail.thresholdValue }}</span>
              </div>
            </div>
          </div>

          <div v-if="currentAlertDetail.resolved" class="detail-section">
            <h4>处理信息</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <label>处理人：</label>
                <span>{{ currentAlertDetail.resolvedBy || '系统' }}</span>
              </div>
              <div class="detail-item">
                <label>处理时间：</label>
                <span>{{ formatTime(currentAlertDetail.resolvedAt) }}</span>
              </div>
              <div v-if="currentAlertDetail.resolvedNote" class="detail-item full-width">
                <label>处理说明：</label>
                <span>{{ currentAlertDetail.resolvedNote }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button v-if="!currentAlertDetail?.resolved" class="btn btn-primary" @click="resolveAlert(currentAlertDetail?.id)">
            处理报警
          </button>
          <button class="btn btn-secondary" @click="closeDetailModal">关闭</button>
        </div>
      </div>
    </div>
    
    <!-- 页脚 -->
    <SiteFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { alertAPI } from '../services/api'
import SiteFooter from '../components/SiteFooter.vue'

// 响应式数据
const alerts = ref([])
const loading = ref(false)
const error = ref(null)
const statistics = ref({})
const filters = ref({
  type: null,
  level: null,
  resolved: null,
  startTime: null,
  endTime: null
})
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  pages: 0
})
const selectedAlerts = ref([])
const selectAll = ref(false)
const processingAlert = ref(null)
const showDetailModal = ref(false)
const currentAlertDetail = ref(null)
const batchProcessing = ref(false)

const filteredAlerts = computed(() => {
  let result = alerts.value
  
  if (filters.value.resolved !== null) {
    result = result.filter(alert => alert.resolved === filters.value.resolved)
  }
  
  if (filters.value.startTime) {
    const startDate = new Date(filters.value.startTime)
    result = result.filter(alert => new Date(alert.timestamp) >= startDate)
  }
  
  if (filters.value.endTime) {
    const endDate = new Date(filters.value.endTime)
    endDate.setHours(23, 59, 59, 999)
    result = result.filter(alert => new Date(alert.timestamp) <= endDate)
  }
  
  return result
})

// 方法
const loadAlerts = async () => {
  loading.value = true
  error.value = null
  
  try {
    const params = {
      page: pagination.value.current - 1,
      size: pagination.value.pageSize,
      type: filters.value.type,
      level: filters.value.level
    }
    
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') {
        delete params[key]
      }
    })
    
    const response = await alertAPI.getAlerts(params)
    
    // 处理后端API响应格式: { code: 200, message: "成功", data: { content: [...], totalElements: N } }
    if (response && response.code === 200 && response.data) {
      alerts.value = response.data.content || []
      // 转换后端下划线字段为前端驼峰字段
      alerts.value = (response.data.content || []).map(alert => ({
        id: alert.id,
        type: alert.type,
        vid: alert.vid,
        pid: alert.pid,
        message: alert.message,
        title: alert.message,  // 前端使用 title，后端只有 message 字段
        level: alert.level,
        resolved: alert.resolved === 1 || alert.resolved === true,
        resolvedBy: alert.resolved_by,
        resolvedAt: alert.resolved_at,
        resolvedNote: alert.resolved_note,
        triggerValue: alert.trigger_value,
        thresholdValue: alert.threshold_value,
        positionX: alert.position_x,
        positionY: alert.position_y,
        timestamp: alert.timestamp,
        createdAt: alert.created_at,
        updatedAt: alert.updated_at
      }))
      
      pagination.value.total = response.data.totalElements || 0
      // 计算总页数，确保至少有 1 页
      pagination.value.pages = pagination.value.total > 0 
        ? Math.ceil(pagination.value.total / pagination.value.pageSize) 
        : 1
      
      // 加载统计信息
      await loadStatistics()
    } else {
      throw new Error(response?.message || '获取报警数据失败')
    }
  } catch (err) {
    // 如果API返回404，说明报警功能尚未实现
    if (err.response && err.response.status === 404) {
      console.warn('报警API尚未实现，使用空数据')
      alerts.value = []
      pagination.value.total = 0
      error.value = '报警功能正在开发中，敬请期待'
    } else {
      error.value = err.message
      console.error('获取报警数据失败:', err)
    }
  } finally {
    loading.value = false
  }
}

const loadStatistics = async () => {
  try {
    const response = await alertAPI.getAlertStatistics()
    if (response && response.code === 200 && response.data) {
      statistics.value = response.data
    } else {
      // 如果统计API不可用，使用本地计算
      updateLocalStatistics()
    }
  } catch (err) {
    console.warn('获取统计信息失败，使用本地计算:', err)
    updateLocalStatistics()
  }
}

const updateLocalStatistics = () => {
  const alertsData = alerts.value
  statistics.value = {
    total: alertsData.length,
    active: alertsData.filter(a => !a.resolved).length,
    resolved: alertsData.filter(a => a.resolved).length,
    urgent: alertsData.filter(a => a.level === 'critical' && !a.resolved).length,
    critical: alertsData.filter(a => a.level === 'critical' && !a.resolved).length,
    high: alertsData.filter(a => a.level === 'high' && !a.resolved).length,
    medium: alertsData.filter(a => a.level === 'medium' && !a.resolved).length,
    low: alertsData.filter(a => a.level === 'low' && !a.resolved).length
  }
}

const refreshAlerts = () => {
  pagination.value.current = 1
  loadAlerts()
}

const applyFilters = () => {
  pagination.value.current = 1
  loadAlerts()
}

const clearFilters = () => {
  filters.value = {
    type: null,
    level: null,
    resolved: null,
    startTime: null,
    endTime: null
  }
  pagination.value.current = 1
  loadAlerts()
}

const changePage = (page) => {
  pagination.value.current = page
  loadAlerts()
}

const resolveAlert = async (alertId) => {
  processingAlert.value = alertId
  try {
    const resolveData = {
      resolved_by: 'admin',
      resolved_note: '系统处理'
    }
    await alertAPI.resolveAlert(alertId, resolveData)
    await loadAlerts()
  } catch (err) {
    console.error('处理报警失败:', err)
    if (err.response?.status === 404) {
      alert('报警API尚未实现，请稍后再试')
    } else {
      alert('处理报警失败: ' + err.message)
    }
  } finally {
    processingAlert.value = null
  }
}

const viewAlertDetails = async (alert) => {
  try {
    const response = await alertAPI.getAlertDetail(alert.id)
    if (response && response.code === 200 && response.data) {
      const detail = response.data
      currentAlertDetail.value = {
        id: detail.id,
        type: detail.type,
        vid: detail.vid,
        pid: detail.pid,
        message: detail.message,
        title: detail.message,
        level: detail.level,
        resolved: detail.resolved === 1 || detail.resolved === true,
        resolvedBy: detail.resolved_by,
        resolvedAt: detail.resolved_at,
        resolvedNote: detail.resolved_note,
        triggerValue: detail.trigger_value,
        thresholdValue: detail.threshold_value,
        positionX: detail.position_x,
        positionY: detail.position_y,
        timestamp: detail.timestamp,
        createdAt: detail.created_at,
        updatedAt: detail.updated_at
      }
      showDetailModal.value = true
    } else {
      currentAlertDetail.value = alert
      showDetailModal.value = true
    }
  } catch (err) {
    console.warn('获取报警详情失败，使用基础信息:', err)
    currentAlertDetail.value = alert
    showDetailModal.value = true
  }
}

const closeDetailModal = () => {
  showDetailModal.value = false
  currentAlertDetail.value = null
}

const batchResolveAlerts = async () => {
  if (selectedAlerts.value.length === 0) return
  
  if (!confirm(`确定要批量处理 ${selectedAlerts.value.length} 条未处理报警吗？`)) {
    return
  }
  
  batchProcessing.value = true
  try {
    const resolveData = {
      resolved_by: 'admin',
      resolved_note: '批量处理'
    }
    
    await alertAPI.batchResolveAlerts(selectedAlerts.value, resolveData)
    
    await loadAlerts()
    
    const processedCount = selectedAlerts.value.length
    
    selectedAlerts.value = []
    selectAll.value = false
    
    alert(`成功批量处理 ${processedCount} 条报警`)
  } catch (err) {
    console.error('批量处理报警失败:', err)
    if (err.response?.status === 404) {
      alert('批量处理API尚未实现，请稍后再试')
    } else {
      alert('批量处理报警失败: ' + err.message)
    }
  } finally {
    batchProcessing.value = false
  }
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    const unresolvedAlerts = filteredAlerts.value.filter(alert => !alert.resolved)
    selectedAlerts.value = unresolvedAlerts.map(alert => alert.id)
    
    if (unresolvedAlerts.length === 0) {
      selectAll.value = false
    }
  } else {
    selectedAlerts.value = []
  }
}

const exportAlerts = () => {
  const headers = ['报警ID', '类型', '级别', '标题', '时间', '状态']
  const csvData = filteredAlerts.value.map(alert => [
    alert.id,
    getAlertTypeText(alert.type),
    getLevelText(alert.level),
    alert.title,
    new Date(alert.timestamp).toLocaleString('zh-CN'),
    alert.resolved ? '已处理' : '未处理'
  ])
  
  const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `系统报警数据_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

// 工具方法
const getAlertTypeClass = (type) => {
  const typeMap = {
    'temperature': 'danger',
    'lowBattery': 'warning',
    'unreachable': 'info',
    'other': 'info'
  }
  return typeMap[type] || 'info'
}

const getAlertTypeText = (type) => {
  const typeMap = {
    'temperature': '温度异常',
    'lowBattery': '电量不足',
    'unreachable': '设备离线',
    'other': '其他报警'
  }
  return typeMap[type] || type
}

const getLevelClass = (level) => {
  const levelMap = {
    'critical': 'critical',
    'high': 'high',
    'medium': 'medium',
    'low': 'low'
  }
  return levelMap[level] || 'low'
}

const getLevelText = (level) => {
  if (!level) return '未知'
  
  const levelMap = {
    'critical': '紧急',
    'high': '高',
    'medium': '中',
    'low': '低'
  }
  
  const text = levelMap[level]
  if (!text) {
    console.warn(`未知的报警级别: ${level}`)
    return '未知'
  }
  
  return text
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString('zh-CN')
}

const formatAlertId = (id) => {
  if (!id) return '0000'
  const num = typeof id === 'string' ? parseInt(id.replace(/\D/g, '')) || 0 : id
  return String(num % 10000).padStart(4, '0')
}

// 生命周期
onMounted(() => {
  loadAlerts()
})
</script>

<style scoped>
.alerts {
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(180deg, 
    rgba(200, 240, 245, 0.8) 0%, 
    rgba(220, 230, 250, 0.7) 20%, 
    rgba(230, 220, 255, 0.6) 40%, 
    rgba(245, 245, 255, 0.5) 60%,
    rgba(250, 250, 255, 0.4) 80%,
    rgba(255, 255, 255, 0.3) 100%);
  background-attachment: fixed;
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #1f2937;
}

.header-content p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn {
  background: #1890ff;
  color: white;
}

.refresh-btn:hover:not(:disabled) {
  background: #40a9ff;
}

.refresh-btn:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
}

.export-btn {
  background: #52c41a;
  color: white;
}

.export-btn:hover {
  background: #73d13d;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  margin-bottom: 24px;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 6px;
  color: #a8071a;
}

.error-icon {
  font-size: 18px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

.filter-toolbar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.filter-group select,
.filter-group input {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.clear-btn {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.clear-btn:hover {
  background: #f5f5f5;
}

.alerts-table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.table-title h3 {
  margin: 0;
  color: #1f2937;
}

.table-info {
  color: #6b7280;
  font-size: 14px;
  margin-top: 4px;
}

.batch-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.batch-info {
  color: #1890ff;
  font-size: 14px;
  font-weight: 500;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  color: #6b7280;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.table-wrapper {
  overflow-x: auto;
}

.alerts-table {
  width: 100%;
  border-collapse: collapse;
}

.alerts-table th,
.alerts-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.alerts-table th {
  background: #fafafa;
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
}

.alerts-table tr:hover {
  background: #fafafa;
}

.alerts-table tr.resolved {
  opacity: 0.6;
}

.alert-type {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.alert-type.danger {
  background: #fff2f0;
  color: #ff4d4f;
}

.alert-type.warning {
  background: #fff7e6;
  color: #faad14;
}

.alert-type.info {
  background: #f0f5ff;
  color: #1890ff;
}

.alert-level {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.alert-level.high {
  background: #fff2f0;
  color: #ff4d4f;
}

.alert-level.medium {
  background: #fff7e6;
  color: #faad14;
}

.alert-level.low {
  background: #f6ffed;
  color: #52c41a;
}

.alert-title {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-badge {
  padding: 4px 8px;
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

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-small {
  padding: 4px 8px;
  font-size: 12px;
}

.btn-primary {
  background: #1890ff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #40a9ff;
}

.btn-primary:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #d9d9d9;
}

.btn-secondary:hover {
  background: #e6f7ff;
  border-color: #40a9ff;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
}

.pagination-info {
  color: #6b7280;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  gap: 8px;
}

.pagination-btn {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.pagination-btn:hover:not(:disabled) {
  background: #f5f5f5;
}

.pagination-btn:disabled {
  color: #d9d9d9;
  cursor: not-allowed;
}

/* 详情弹窗样式 */
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

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 18px;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.modal-close:hover {
  background: #f5f5f5;
  color: #1f2937;
}

.modal-body {
  padding: 24px;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h4 {
  margin: 0 0 16px 0;
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-item label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.detail-item span {
  font-size: 14px;
  color: #1f2937;
}

.alert-message {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 6px;
  border-left: 4px solid #1890ff;
  font-size: 14px;
  line-height: 1.5;
  color: #1f2937;
}

.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.alert-level.critical {
  background: #ff4d4f;
  color: white;
}
</style>