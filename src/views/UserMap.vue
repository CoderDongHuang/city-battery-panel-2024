<template>
  <div class="user-map">
    <div class="page-header">
      <h1>换电地图</h1>
      <p>查找附近的换电站点</p>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <div class="filter-tabs">
        <button 
          :class="['filter-tab', { active: filterStatus === 'all' }]"
          @click="filterStatus = 'all'"
        >
          全部
        </button>
        <button 
          :class="['filter-tab', { active: filterStatus === 'active' }]"
          @click="filterStatus = 'active'"
        >
          营业中
        </button>
        <button 
          :class="['filter-tab', { active: filterStatus === 'maintenance' }]"
          @click="filterStatus = 'maintenance'"
        >
          维护中
        </button>
      </div>
      <div class="search-box">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="搜索站点名称..."
          class="search-input"
        />
      </div>
      <div class="sort-box">
        <select v-model="sortBy" class="sort-select">
          <option value="default">默认排序</option>
          <option value="available-desc">可用电池 ↓ 多到少</option>
          <option value="available-asc">可用电池 ↑ 少到多</option>
        </select>
      </div>
    </div>

    <!-- 站点列表 -->
    <div class="station-list">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner">⏳</div>
        <p>正在加载站点...</p>
      </div>

      <!-- 站点卡片 -->
      <div 
        v-for="station in filteredStations" 
        :key="station.id"
        class="station-card"
      >
        <div class="station-header">
          <h3 class="station-name">{{ station.name }}</h3>
          <span :class="['status-badge', station.status]">
            {{ getStatusText(station.status) }}
          </span>
        </div>

        <div class="station-info">
          <div class="info-row">
            <span class="info-label">📍 站点编号：</span>
            <span class="info-value">{{ station.stationId }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">🏠 地址：</span>
            <span class="info-value">{{ station.address }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">🔋 电池容量：</span>
            <span class="info-value">{{ station.batteryCapacity }} 块</span>
          </div>
          <div class="info-row">
            <span class="info-label">⚡ 可用电池：</span>
            <span class="info-value available">{{ station.availableBatteries }} 块</span>
          </div>
          <div class="info-row">
            <span class="info-label">🕒 营业时间：</span>
            <span class="info-value">{{ station.operatingHours }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">📞 联系电话：</span>
            <span class="info-value">{{ station.contactPhone }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">👤 负责人：</span>
            <span class="info-value">{{ station.manager }}</span>
          </div>
        </div>

        <div class="station-actions">
          <button class="btn-primary" @click="viewDetail(station)">
            查看详情
          </button>
          <button class="btn-secondary" @click="navigateToStation(station)">
            导航到此
          </button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="!loading && filteredStations.length === 0" class="empty-state">
        <div class="empty-icon">📍</div>
        <p>暂无站点信息</p>
      </div>
    </div>

    <!-- 页脚 -->
    <SiteFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SiteFooter from '../components/SiteFooter.vue'
import { userStationAPI } from '../services/userAPI'
import { ElMessage } from 'element-plus'

const filterStatus = ref('all')
const searchQuery = ref('')
const sortBy = ref('default')
const loading = ref(false)
const stations = ref([])

// 加载站点列表
const loadStations = async () => {
  loading.value = true
  try {
    const res = await userStationAPI.getStations()
    if (res.code === 200) {
      stations.value = res.data || []
    } else {
      ElMessage.error(res.message || '加载站点列表失败')
    }
  } catch (error) {
    console.error('加载站点列表失败:', error)
    ElMessage.error('加载站点列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStations()
})

// 筛选站点
const filteredStations = computed(() => {
  let result = stations.value

  // 按状态筛选
  if (filterStatus.value !== 'all') {
    result = result.filter(station => station.status === filterStatus.value)
  }

  // 按名称搜索
  if (searchQuery.value) {
    result = result.filter(station => 
      station.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      station.stationId.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // 按可用电池数量排序
  if (sortBy.value === 'available-desc') {
    // 多到少
    result.sort((a, b) => b.availableBatteries - a.availableBatteries)
  } else if (sortBy.value === 'available-asc') {
    // 少到多
    result.sort((a, b) => a.availableBatteries - b.availableBatteries)
  }

  return result
})

const getStatusText = (status) => {
  const statusMap = {
    active: '营业中',
    maintenance: '维护中',
    closed: '已关闭'
  }
  return statusMap[status] || status
}

const viewDetail = (station) => {
  ElMessage.success(`查看站点详情：${station.name}`)
  console.log('站点详情:', station)
  // TODO: 打开站点详情弹窗
}

const navigateToStation = (station) => {
  ElMessage.info(`导航到：${station.name}`)
  console.log('导航到站点:', station)
  // TODO: 调用地图导航
}
</script>

<style scoped>
.user-map {
  padding: 24px;
  min-height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  color: #333;
}

.page-header p {
  margin: 0;
  color: #666;
}

/* 筛选栏 */
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

.sort-box {
  margin-left: 16px;
}

.sort-select {
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  color: #333;
  cursor: pointer;
  transition: all 0.3s;
}

.sort-select:hover {
  border-color: #0066cc;
}

.sort-select:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

/* 站点列表 */
.station-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.station-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.station-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.station-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.station-name {
  font-size: 20px;
  color: #333;
  margin: 0;
  font-weight: 600;
}

.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.status-badge.active {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-badge.maintenance {
  background: #fff3e0;
  color: #f57c00;
}

.status-badge.closed {
  background: #ffebee;
  color: #c62828;
}

.station-info {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  gap: 8px;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  color: #666;
  font-size: 14px;
  white-space: nowrap;
  flex-shrink: 0;
}

.info-value {
  color: #333;
  font-size: 14px;
  flex: 1;
}

.info-value.available {
  color: #2e7d32;
  font-weight: 600;
}

.station-actions {
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

/* 加载状态 */
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

/* 空状态 */
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

/* 页脚样式 */
.user-map :deep(.site-footer) {
  margin-top: 80px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    gap: 16px;
  }

  .filter-tabs {
    width: 100%;
    justify-content: space-between;
  }

  .filter-tab {
    flex: 1;
    text-align: center;
    padding: 8px 12px;
    font-size: 13px;
  }

  .search-box {
    width: 100%;
    max-width: none;
    margin-left: 0;
  }

  .station-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .station-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>
