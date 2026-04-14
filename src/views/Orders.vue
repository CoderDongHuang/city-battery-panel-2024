<template>
  <div class="orders-page">
    <div class="orders-container">
      <div class="page-header">
        <h1>订单中心</h1>
        <p>查看和管理您的换电订单记录</p>
      </div>

      <!-- 订单统计 -->
      <div class="order-stats">
        <div class="stat-card">
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">总订单数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.completed }}</div>
          <div class="stat-label">已完成</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.processing }}</div>
          <div class="stat-label">进行中</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.pending }}</div>
          <div class="stat-label">待支付</div>
        </div>
      </div>

      <!-- 筛选栏 -->
      <div class="filter-bar">
        <div class="filter-tabs">
          <button 
            :class="['filter-tab', { active: currentFilter === 'all' }]"
            @click="currentFilter = 'all'"
          >
            全部
          </button>
          <button 
            :class="['filter-tab', { active: currentFilter === 'processing' }]"
            @click="currentFilter = 'processing'"
          >
            进行中
          </button>
          <button 
            :class="['filter-tab', { active: currentFilter === 'completed' }]"
            @click="currentFilter = 'completed'"
          >
            已完成
          </button>
          <button 
            :class="['filter-tab', { active: currentFilter === 'pending' }]"
            @click="currentFilter = 'pending'"
          >
            待支付
          </button>
        </div>
        
        <!-- 时间筛选 -->
        <div class="time-filter">
          <input 
            v-model="startDate"
            type="date" 
            class="date-input"
            placeholder="开始日期"
          />
          <span class="date-separator">至</span>
          <input 
            v-model="endDate"
            type="date" 
            class="date-input"
            placeholder="结束日期"
          />
          <button @click="clearDateFilter" class="clear-date-btn">清除</button>
        </div>
        
        <div class="search-box">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="搜索订单号..."
            class="search-input"
          />
        </div>
      </div>

      <!-- 订单列表 -->
      <div class="order-list">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner">⏳</div>
          <p>正在加载订单...</p>
        </div>
        
        <!-- 订单列表 -->
        <div 
          v-for="order in filteredOrders" 
          :key="order.id"
          class="order-card"
        >
          <div class="order-header">
            <div class="order-info">
              <span class="order-id">订单号：{{ order.id }}</span>
              <span class="order-time">{{ formatDateTime(order.createTime) }}</span>
            </div>
            <span :class="['order-status', order.status]">
              {{ getStatusText(order.status) }}
            </span>
          </div>

          <div class="order-content">
            <div class="order-detail">
              <div class="detail-row">
                <span class="label">换电车辆：</span>
                <span class="value">{{ order.vehicleName }}</span>
              </div>
              <div class="detail-row">
                <span class="label">换电站：</span>
                <span class="value">{{ order.stationName }}</span>
              </div>
              <div class="detail-row">
                <span class="label">电池信息：</span>
                <span class="value">{{ order.batteryInfo }}</span>
              </div>
              <div class="detail-row">
                <span class="label">订单金额：</span>
                <span class="value price">¥{{ order.amount }}</span>
              </div>
            </div>
          </div>

          <div class="order-actions">
            <button 
              v-if="order.status === 'completed'" 
              class="btn-secondary"
              @click="viewDetail(order)"
            >
              查看详情
            </button>
            <button 
              v-if="order.status === 'pending'" 
              class="btn-primary"
              @click="payOrder(order)"
            >
              立即支付
            </button>
            <button 
              v-if="order.status === 'processing'" 
              class="btn-secondary"
              @click="trackOrder(order)"
            >
              追踪订单
            </button>
          </div>
        </div>

        <div v-if="filteredOrders.length === 0" class="empty-state">
          <div class="empty-icon">📦</div>
          <p>暂无订单</p>
        </div>
      </div>
      
      <!-- 页脚 -->
      <SiteFooter />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SiteFooter from '../components/SiteFooter.vue'
import { userOrderAPI } from '../services/userAPI'
import { ElMessage } from 'element-plus'

const currentFilter = ref('all')
const searchQuery = ref('')
const startDate = ref('')
const endDate = ref('')
const loading = ref(false)

const stats = ref({
  total: 0,
  completed: 0,
  processing: 0,
  pending: 0
})

const orders = ref([])

// 加载订单列表
const loadOrders = async () => {
  loading.value = true
  try {
    const res = await userOrderAPI.getOrders()
    if (res.code === 200) {
      orders.value = res.data || []
    } else {
      ElMessage.error(res.message || '加载订单列表失败')
    }
  } catch (error) {
    console.error('加载订单列表失败:', error)
    ElMessage.error('加载订单列表失败')
  } finally {
    loading.value = false
  }
}

// 加载订单统计
const loadStats = async () => {
  try {
    const res = await userOrderAPI.getStats()
    if (res.code === 200) {
      stats.value = res.data || { total: 0, completed: 0, processing: 0, pending: 0 }
    }
  } catch (error) {
    console.error('加载订单统计失败:', error)
  }
}

onMounted(() => {
  loadOrders()
  loadStats()
})

const filteredOrders = computed(() => {
  let result = orders.value

  // 状态筛选
  if (currentFilter.value !== 'all') {
    result = result.filter(order => order.status === currentFilter.value)
  }

  // 时间筛选
  if (startDate.value) {
    const start = new Date(startDate.value)
    result = result.filter(order => {
      const orderDate = new Date(order.createTime.replace('T', ' '))
      return orderDate >= start
    })
  }
  
  if (endDate.value) {
    const end = new Date(endDate.value)
    end.setHours(23, 59, 59, 999) // 包含结束日期的整天
    result = result.filter(order => {
      const orderDate = new Date(order.createTime.replace('T', ' '))
      return orderDate <= end
    })
  }

  // 搜索筛选
  if (searchQuery.value) {
    result = result.filter(order => 
      order.id.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  return result
})

// 清除日期筛选
const clearDateFilter = () => {
  startDate.value = ''
  endDate.value = ''
}

const getStatusText = (status) => {
  const statusMap = {
    completed: '已完成',
    processing: '进行中',
    pending: '待支付',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

// 格式化日期时间，将 T 替换为空格
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return ''
  return dateTimeString.replace('T', ' ')
}

const viewDetail = async (order) => {
  try {
    const res = await userOrderAPI.getOrder(order.id)
    if (res.code === 200) {
      ElMessage.success('获取订单详情成功')
      // TODO: 打开订单详情弹窗
      console.log('订单详情:', res.data)
    } else {
      ElMessage.error(res.message || '获取订单详情失败')
    }
  } catch (error) {
    console.error('获取订单详情失败:', error)
    ElMessage.error('获取订单详情失败')
  }
}

const payOrder = async (order) => {
  try {
    const res = await userOrderAPI.payOrder(order.id)
    if (res.code === 200) {
      ElMessage.success('支付成功')
      // 重新加载订单列表和统计
      await loadOrders()
      await loadStats()
    } else {
      ElMessage.error(res.message || '支付失败')
    }
  } catch (error) {
    console.error('支付失败:', error)
    ElMessage.error('支付失败')
  }
}

const trackOrder = (order) => {
  ElMessage.info('订单追踪功能开发中')
  console.log('追踪订单:', order)
}
</script>

<style scoped>
.orders-page {
  min-height: calc(100vh - 80px);
  background: linear-gradient(180deg, 
    rgba(200, 240, 245, 0.8) 0%, 
    rgba(220, 230, 250, 0.7) 20%, 
    rgba(230, 220, 255, 0.6) 40%, 
    rgba(245, 245, 255, 0.5) 60%,
    rgba(250, 250, 255, 0.4) 80%,
    rgba(255, 255, 255, 0.3) 100%);
  background-attachment: fixed;
  padding: 40px 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 32px;
  color: #333;
  margin: 0 0 16px 0;
  font-weight: 600;
}

.page-header p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.order-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: white;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  gap: 16px;
  flex-wrap: wrap;
}

.filter-tabs {
  display: flex;
  gap: 12px;
}

.time-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-input {
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.date-input:focus {
  outline: none;
  border-color: #333;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.date-separator {
  color: #999;
  font-size: 14px;
}

.clear-date-btn {
  padding: 10px 16px;
  background: white;
  color: #666;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.clear-date-btn:hover {
  background: #f5f5f5;
  border-color: #999;
  color: #333;
}

.filter-tab {
  padding: 8px 20px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-tab:hover {
  border-color: #333;
  color: #333;
}

.filter-tab.active {
  background: #333;
  color: white;
  border-color: #333;
}

.search-box {
  flex: 1;
  max-width: 300px;
  margin-left: auto;
}

.search-input {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #333;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.order-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-id {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.order-time {
  font-size: 12px;
  color: #999;
}

.order-status {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.order-status.completed {
  background: #e8f5e9;
  color: #2e7d32;
}

.order-status.processing {
  background: #e3f2fd;
  color: #1976d2;
}

.order-status.pending {
  background: #fff3e0;
  color: #f57c00;
}

.order-content {
  margin-bottom: 20px;
}

.order-detail {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media (max-width: 768px) {
  .order-detail {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

.detail-row {
  display: flex;
  gap: 6px;
  align-items: flex-start;
  line-height: 1.5;
}

.detail-row .label {
  color: #666;
  font-size: 14px;
  white-space: nowrap;
  flex-shrink: 0;
}

.detail-row .value {
  color: #333;
  font-size: 14px;
  flex: 1;
  word-break: break-word;
  overflow-wrap: break-word;
}

.detail-row .value.price {
  color: #f57c00;
  font-weight: 600;
  font-size: 16px;
}

.order-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-primary {
  padding: 8px 24px;
  background: #333;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #000;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn-secondary {
  padding: 8px 24px;
  background: white;
  color: #333;
  border: 1px solid #333;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: #f5f5f5;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
}

.loading-spinner {
  font-size: 48px;
  margin-bottom: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: #666;
  font-size: 16px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state p {
  color: #999;
  font-size: 16px;
}

@media (max-width: 768px) {
  .order-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .filter-bar {
    flex-direction: column;
    gap: 16px;
  }

  .search-box {
    max-width: 100%;
    margin-left: 0;
  }

  .order-detail {
    grid-template-columns: 1fr;
  }
}
</style>
