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
        <div 
          v-for="order in filteredOrders" 
          :key="order.id"
          class="order-card"
        >
          <div class="order-header">
            <div class="order-info">
              <span class="order-id">订单号：{{ order.id }}</span>
              <span class="order-time">{{ order.createTime }}</span>
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
    </div>
    
    <!-- 页脚 -->
    <SiteFooter />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SiteFooter from '../components/SiteFooter.vue'

const currentFilter = ref('all')
const searchQuery = ref('')

const stats = ref({
  total: 28,
  completed: 22,
  processing: 3,
  pending: 3
})

const orders = ref([
  {
    id: 'ORD20240115001',
    createTime: '2024-01-15 14:30:22',
    status: 'completed',
    vehicleName: '特斯拉 Model 3',
    stationName: '朝阳科技园站',
    batteryInfo: '60kWh - 95%',
    amount: 89.00
  },
  {
    id: 'ORD20240114002',
    createTime: '2024-01-14 09:15:10',
    status: 'processing',
    vehicleName: '比亚迪 汉 EV',
    stationName: '海淀中关村站',
    batteryInfo: '75kWh - 换电中',
    amount: 120.00
  },
  {
    id: 'ORD20240113003',
    createTime: '2024-01-13 16:45:33',
    status: 'pending',
    vehicleName: '蔚来 ES8',
    stationName: '望京 SOHO 站',
    batteryInfo: '100kWh - 待支付',
    amount: 150.00
  }
])

const filteredOrders = computed(() => {
  let result = orders.value

  if (currentFilter.value !== 'all') {
    result = result.filter(order => order.status === currentFilter.value)
  }

  if (searchQuery.value) {
    result = result.filter(order => 
      order.id.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  return result
})

const getStatusText = (status) => {
  const statusMap = {
    completed: '已完成',
    processing: '进行中',
    pending: '待支付',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

const viewDetail = (order) => {
  alert('查看订单详情：' + order.id)
}

const payOrder = (order) => {
  alert('支付订单：' + order.id)
}

const trackOrder = (order) => {
  alert('追踪订单：' + order.id)
}
</script>

<style scoped>
.orders-page {
  min-height: calc(100vh - 80px);
  background: #f5f7fa;
  padding: 40px 20px;
}

.orders-container {
  max-width: 1200px;
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
  background: linear-gradient(135deg, #0066cc 0%, #00cc99 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
}

.filter-tabs {
  display: flex;
  gap: 12px;
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
  border-color: #0066cc;
  color: #0066cc;
}

.filter-tab.active {
  background: linear-gradient(135deg, #0066cc 0%, #00cc99 100%);
  color: white;
  border-color: transparent;
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
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
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
  gap: 16px;
}

.detail-row {
  display: flex;
  gap: 8px;
}

.detail-row .label {
  color: #666;
  font-size: 14px;
  min-width: 80px;
}

.detail-row .value {
  color: #333;
  font-size: 14px;
  font-weight: 500;
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
  background: linear-gradient(135deg, #0066cc 0%, #00cc99 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.4);
}

.btn-secondary {
  padding: 8px 24px;
  background: white;
  color: #0066cc;
  border: 1px solid #0066cc;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: #f0f7ff;
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
