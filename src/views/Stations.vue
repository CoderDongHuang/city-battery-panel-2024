<template>
  <div class="stations-page">
    <div class="stations-container">
      <div class="page-header">
        <h1>服务网点</h1>
        <p>查找附近的换电站和服务网点</p>
      </div>

      <!-- 搜索筛选 -->
      <div class="search-section">
        <div class="search-box">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="搜索换电站名称或位置..."
            class="search-input"
          />
        </div>
        <div class="filter-group">
          <select v-model="filterType" class="filter-select">
            <option value="all">全部类型</option>
            <option value="swap">换电站</option>
            <option value="service">服务中心</option>
            <option value="charging">充电站</option>
          </select>
          <select v-model="filterStatus" class="filter-select">
            <option value="all">全部状态</option>
            <option value="available">可用</option>
            <option value="busy">繁忙</option>
            <option value="offline">离线</option>
          </select>
        </div>
      </div>

      <!-- 网点列表 -->
      <div class="stations-list">
        <div 
          v-for="station in filteredStations" 
          :key="station.id"
          class="station-card"
        >
          <div class="station-image">
            <img :src="station.image" :alt="station.name" />
            <span :class="['status-badge', station.status]">
              {{ getStatusText(station.status) }}
            </span>
          </div>

          <div class="station-info">
            <div class="station-header">
              <h3>{{ station.name }}</h3>
              <span class="station-type">{{ getTypeText(station.type) }}</span>
            </div>

            <div class="station-details">
              <div class="detail-item">
                <span class="icon">📍</span>
                <span>{{ station.address }}</span>
              </div>
              <div class="detail-item">
                <span class="icon">⏰</span>
                <span>{{ station.hours }}</span>
              </div>
              <div class="detail-item">
                <span class="icon">🔋</span>
                <span>可用电池：{{ station.availableBatteries }}</span>
              </div>
              <div class="detail-item">
                <span class="icon">🚗</span>
                <span>空闲车位：{{ station.availableSpots }}</span>
              </div>
            </div>

            <div class="station-stats">
              <div class="stat">
                <div class="stat-value">{{ station.distance }}</div>
                <div class="stat-label">距离</div>
              </div>
              <div class="stat">
                <div class="stat-value">{{ station.rating }}</div>
                <div class="stat-label">评分</div>
              </div>
              <div class="stat">
                <div class="stat-value">{{ station.totalSwaps }}</div>
                <div class="stat-label">累计换电</div>
              </div>
            </div>

            <div class="station-actions">
              <button class="btn-primary" @click="navigateToStation(station)">
                导航到这里
              </button>
              <button class="btn-secondary" @click="bookService(station)">
                预约服务
              </button>
              <button class="btn-outline" @click="viewDetail(station)">
                查看详情
              </button>
            </div>
          </div>
        </div>

        <div v-if="filteredStations.length === 0" class="empty-state">
          <div class="empty-icon">🗺️</div>
          <p>暂无服务网点</p>
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

const searchQuery = ref('')
const filterType = ref('all')
const filterStatus = ref('all')

const stations = ref([
  {
    id: 1,
    name: '朝阳科技园换电站',
    type: 'swap',
    status: 'available',
    address: '北京市朝阳区科技园路 88 号',
    hours: '24 小时营业',
    availableBatteries: 12,
    availableSpots: 3,
    distance: '1.2km',
    rating: 4.8,
    totalSwaps: 2340,
    image: '/images/station1.jpg'
  },
  {
    id: 2,
    name: '海淀中关村服务中心',
    type: 'service',
    status: 'busy',
    address: '北京市海淀区中关村大街 1 号',
    hours: '09:00-18:00',
    availableBatteries: 8,
    availableSpots: 1,
    distance: '3.5km',
    rating: 4.6,
    totalSwaps: 1890,
    image: '/images/station2.jpg'
  },
  {
    id: 3,
    name: '望京 SOHO 换电站',
    type: 'swap',
    status: 'available',
    address: '北京市朝阳区望京东园四区',
    hours: '24 小时营业',
    availableBatteries: 15,
    availableSpots: 5,
    distance: '2.8km',
    rating: 4.9,
    totalSwaps: 3120,
    image: '/images/station3.jpg'
  }
])

const filteredStations = computed(() => {
  let result = stations.value

  if (filterType.value !== 'all') {
    result = result.filter(station => station.type === filterType.value)
  }

  if (filterStatus.value !== 'all') {
    result = result.filter(station => station.status === filterStatus.value)
  }

  if (searchQuery.value) {
    result = result.filter(station => 
      station.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      station.address.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  return result
})

const getStatusText = (status) => {
  const statusMap = {
    available: '可用',
    busy: '繁忙',
    offline: '离线'
  }
  return statusMap[status] || status
}

const getTypeText = (type) => {
  const typeMap = {
    swap: '换电站',
    service: '服务中心',
    charging: '充电站'
  }
  return typeMap[type] || type
}

const navigateToStation = (station) => {
  alert('导航到：' + station.name)
}

const bookService = (station) => {
  alert('预约服务：' + station.name)
}

const viewDetail = (station) => {
  alert('查看详情：' + station.name)
}
</script>

<style scoped>
.stations-page {
  min-height: calc(100vh - 80px);
  background: #f5f7fa;
  padding: 40px 20px;
}

.stations-container {
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

.search-section {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.search-box {
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 12px 20px;
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

.filter-group {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 12px 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  background: white;
  transition: all 0.3s;
}

.filter-select:focus {
  outline: none;
  border-color: #0066cc;
}

.stations-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.station-card {
  display: grid;
  grid-template-columns: 320px 1fr;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.station-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.station-image {
  position: relative;
  height: 100%;
  min-height: 280px;
  background: #f0f0f0;
}

.station-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: white;
}

.status-badge.available {
  background: #4caf50;
}

.status-badge.busy {
  background: #ff9800;
}

.status-badge.offline {
  background: #9e9e9e;
}

.station-info {
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.station-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.station-header h3 {
  font-size: 20px;
  color: #333;
  margin: 0;
}

.station-type {
  padding: 4px 12px;
  background: #f0f7ff;
  color: #0066cc;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}

.station-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.detail-item .icon {
  font-size: 18px;
}

.station-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 20px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 20px;
}

.station-stats .stat {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #0066cc 0%, #00cc99 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.station-actions {
  display: flex;
  gap: 12px;
}

.btn-primary {
  flex: 1;
  padding: 12px;
  background: linear-gradient(135deg, #0066cc 0%, #00cc99 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.4);
}

.btn-secondary {
  flex: 1;
  padding: 12px;
  background: #f5f7fa;
  color: #333;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: #e8ecf1;
}

.btn-outline {
  flex: 1;
  padding: 12px;
  background: white;
  color: #0066cc;
  border: 1px solid #0066cc;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-outline:hover {
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

@media (max-width: 968px) {
  .station-card {
    grid-template-columns: 1fr;
  }

  .station-image {
    min-height: 200px;
  }

  .search-section {
    flex-direction: column;
  }

  .filter-group {
    flex-direction: column;
  }
}
</style>
