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
          </select>
          <select v-model="filterStatus" class="filter-select">
            <option value="all">全部状态</option>
            <option value="available">可用</option>
            <option value="busy">繁忙</option>
            <option value="offline">离线</option>
          </select>
        </div>
      </div>

      <!-- 高级筛选 -->
      <div class="advanced-filters">
        <div class="filter-section">
          <div class="filter-label">📍 距离排序</div>
          <div class="filter-options">
            <label class="radio-option">
              <input type="radio" v-model="sortByDistance" value="asc" />
              <span>从近到远</span>
            </label>
            <label class="radio-option">
              <input type="radio" v-model="sortByDistance" value="desc" />
              <span>从远到近</span>
            </label>
          </div>
        </div>

        <div class="filter-section">
          <div class="filter-label">🔋 可用电池</div>
          <div class="filter-options">
            <label class="checkbox-option">
              <input type="checkbox" v-model="filterBatteries" value="sufficient" />
              <span>充足 (>10)</span>
            </label>
            <label class="checkbox-option">
              <input type="checkbox" v-model="filterBatteries" value="limited" />
              <span>紧张 (5-10)</span>
            </label>
            <label class="checkbox-option">
              <input type="checkbox" v-model="filterBatteries" value="scarce" />
              <span>不足 (<5)</span>
            </label>
          </div>
        </div>

        <div class="filter-section">
          <div class="filter-label">🚗 可用车位</div>
          <div class="filter-options">
            <label class="checkbox-option">
              <input type="checkbox" v-model="filterSpots" value="sufficient" />
              <span>充足 (>5)</span>
            </label>
            <label class="checkbox-option">
              <input type="checkbox" v-model="filterSpots" value="limited" />
              <span>紧张 (2-5)</span>
            </label>
            <label class="checkbox-option">
              <input type="checkbox" v-model="filterSpots" value="scarce" />
              <span>不足 (<2)</span>
            </label>
          </div>
        </div>

        <div class="filter-section">
          <div class="filter-label">⭐ 评分排序</div>
          <div class="filter-options">
            <label class="radio-option">
              <input type="radio" v-model="sortByRating" value="high" />
              <span>高到低</span>
            </label>
            <label class="radio-option">
              <input type="radio" v-model="sortByRating" value="low" />
              <span>低到高</span>
            </label>
          </div>
        </div>

        <button @click="clearFilters" class="clear-filters-btn">
          清除筛选
        </button>
      </div>

      <!-- 网点列表 -->
      <div class="stations-list">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-state">
          <div class="loading-icon">⏳</div>
          <p>正在加载服务网点...</p>
        </div>

        <!-- 站点列表 -->
        <div 
          v-else
          v-for="station in filteredStations" 
          :key="station.id"
          class="station-card"
        >
          <div class="station-image">
            <img :src="station.image || (station.photos && station.photos[0] ? station.photos[0].url : '/images/default-station.jpg')" :alt="station.name" />
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
                <span class="icon">🕐</span>
                <span>{{ station.hours || station.serviceTime }}</span>
              </div>
              <div class="detail-item">
                <span>🔋 可用电池：{{ station.availableBatteries }}</span>
              </div>
              <div class="detail-item">
                <span>🚗 空闲车位：{{ station.availableSpots || station.availableSlots }}</span>
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

        <div v-if="filteredStations.length === 0 && !loading" class="empty-state">
          <p>附近暂无换电站和服务网点</p>
        </div>
      </div>
    </div>
    
    <!-- 详情弹窗 -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-content detail-modal" @click.stop>
        <div class="modal-header">
          <h2>{{ currentStation?.name }}</h2>
          <button @click="closeDetailModal" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <!-- 照片轮播 -->
          <div class="photo-gallery" v-if="currentStation?.photos && currentStation.photos.length > 0">
            <img :src="currentStation.photos[0].url" :alt="currentStation.name" class="main-photo" />
            <div class="photo-thumbnails">
              <img 
                v-for="(photo, index) in currentStation.photos" 
                :key="photo.id"
                :src="photo.url" 
                :alt="photo.description || '照片' + (index + 1)"
                :class="['thumbnail', { active: currentPhotoIndex === index }]"
                @click="currentPhotoIndex = index"
              />
            </div>
          </div>
          
          <div class="detail-info">
            <div class="detail-row">
              <span class="label">站点类型：</span>
              <span class="value">{{ getTypeText(currentStation?.type) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">地址：</span>
              <span class="value">{{ currentStation?.address }}</span>
            </div>
            <div class="detail-row">
              <span class="label">服务时间：</span>
              <span class="value">{{ currentStation?.hours || currentStation?.serviceTime }}</span>
            </div>
            <div class="detail-row">
              <span class="label">联系电话：</span>
              <span class="value">{{ currentStation?.phone || '400-888-8888' }}</span>
            </div>
            <div class="detail-row">
              <span class="label">可用电池：</span>
              <span class="value">{{ currentStation?.availableBatteries }} 块</span>
            </div>
            <div class="detail-row">
              <span class="label">空闲车位：</span>
              <span class="value">{{ currentStation?.availableSpots || currentStation?.availableSlots }} 个</span>
            </div>
            <div class="detail-row">
              <span class="label">评分：</span>
              <span class="value">⭐ {{ currentStation?.rating }}</span>
            </div>
            <div class="detail-row">
              <span class="label">累计换电：</span>
              <span class="value">{{ currentStation?.totalSwaps }} 次</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="navigateToStation(currentStation)" class="btn-primary">
            导航到这里
          </button>
          <button @click="bookService(currentStation)" class="btn-secondary">
            预约服务
          </button>
        </div>
      </div>
    </div>
    
    <!-- 页脚 -->
    <SiteFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SiteFooter from '../components/SiteFooter.vue'
import { getStationsListAPI, getStationPhotosAPI } from '../services/stationsAPI'

const searchQuery = ref('')
const filterType = ref('all')
const filterStatus = ref('all')

// 高级筛选
const sortByDistance = ref('')
const sortByRating = ref('')
const filterBatteries = ref([])
const filterSpots = ref([])

const stations = ref([])
const loading = ref(false)
const error = ref(null)

// 加载站点列表
const loadStations = async () => {
  loading.value = true
  error.value = null
  try {
    const data = await getStationsListAPI({
      page: 1,
      pageSize: 20,
      type: filterType.value === 'all' ? undefined : filterType.value
    })
    stations.value = data
  } catch (err) {
    console.error('加载站点列表失败:', err)
    error.value = '加载失败，请稍后重试'
    stations.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStations()
})

const filteredStations = computed(() => {
  let result = stations.value

  // 基础筛选
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

  // 高级筛选 - 可用电池
  if (filterBatteries.value.length > 0) {
    result = result.filter(station => {
      const batteries = station.availableBatteries
      if (filterBatteries.value.includes('sufficient') && batteries > 10) return true
      if (filterBatteries.value.includes('limited') && batteries >= 5 && batteries <= 10) return true
      if (filterBatteries.value.includes('scarce') && batteries < 5) return true
      return false
    })
  }

  // 高级筛选 - 可用车位
  if (filterSpots.value.length > 0) {
    result = result.filter(station => {
      const spots = station.availableSpots
      if (filterSpots.value.includes('sufficient') && spots > 5) return true
      if (filterSpots.value.includes('limited') && spots >= 2 && spots <= 5) return true
      if (filterSpots.value.includes('scarce') && spots < 2) return true
      return false
    })
  }

  // 排序 - 距离
  if (sortByDistance.value === 'asc') {
    result = [...result].sort((a, b) => {
      const distA = parseFloat(a.distance)
      const distB = parseFloat(b.distance)
      return distA - distB
    })
  } else if (sortByDistance.value === 'desc') {
    result = [...result].sort((a, b) => {
      const distA = parseFloat(a.distance)
      const distB = parseFloat(b.distance)
      return distB - distA
    })
  }

  // 排序 - 评分（只在没有距离排序时生效）
  if (sortByRating.value && !sortByDistance.value) {
    if (sortByRating.value === 'high') {
      result = [...result].sort((a, b) => b.rating - a.rating)
    } else if (sortByRating.value === 'low') {
      result = [...result].sort((a, b) => a.rating - b.rating)
    }
  }

  return result
})

// 清除所有筛选
const clearFilters = () => {
  sortByDistance.value = ''
  sortByRating.value = ''
  filterBatteries.value = []
  filterSpots.value = []
  filterType.value = 'all'
  filterStatus.value = 'all'
  searchQuery.value = ''
}

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

// 详情弹窗相关
const showDetailModal = ref(false)
const currentStation = ref(null)
const currentPhotoIndex = ref(0)

const viewDetail = async (station) => {
  currentStation.value = station
  currentPhotoIndex.value = 0
  showDetailModal.value = true
  
  // 如果有照片，可以加载更多照片
  if (station.id) {
    try {
      const photos = await getStationPhotosAPI(station.id)
      if (photos && photos.length > 0) {
        currentStation.value.photos = photos
      }
    } catch (err) {
      console.error('加载照片失败:', err)
    }
  }
}

const closeDetailModal = () => {
  showDetailModal.value = false
  currentStation.value = null
  currentPhotoIndex.value = 0
}
</script>

<style scoped>
.stations-page {
  min-height: calc(100vh - 80px);
  /* 使用控制台风格的浅色渐变背景 */
  background: linear-gradient(180deg, 
    rgba(200, 240, 245, 0.8) 0%, 
    rgba(220, 230, 250, 0.7) 20%, 
    rgba(230, 220, 255, 0.6) 40%, 
    rgba(245, 245, 255, 0.5) 60%,
    rgba(250, 250, 255, 0.4) 80%,
    rgba(255, 255, 255, 0.3) 100%);
  background-attachment: fixed;
  padding: 40px 0;
  transition: background-color 0.3s ease;
}

/* 深色模式下，背景保持不变，内容卡片变深色 */
html.dark-mode .stations-page {
  background: linear-gradient(180deg, 
    rgba(200, 240, 245, 0.8) 0%, 
    rgba(220, 230, 250, 0.7) 20%, 
    rgba(230, 220, 255, 0.6) 40%, 
    rgba(245, 245, 255, 0.5) 60%,
    rgba(250, 250, 255, 0.4) 80%,
    rgba(255, 255, 255, 0.3) 100%);
}

.stations-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

.page-header {
  margin-bottom: 30px;
  text-align: center;
}

.page-header h1 {
  font-size: 32px;
  color: #000000;
  margin-bottom: 8px;
}

.page-header p {
  color: #000000;
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

/* 高级筛选 */
.advanced-filters {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
}

.filter-section {
  flex: 1;
  min-width: 200px;
}

.filter-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-option,
.checkbox-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  transition: all 0.3s;
}

.radio-option:hover,
.checkbox-option:hover {
  color: #0066cc;
}

.radio-option input[type="radio"],
.checkbox-option input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #0066cc;
}

.clear-filters-btn {
  padding: 10px 24px;
  background: #f5f7fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  align-self: flex-end;
  font-weight: 500;
}

.clear-filters-btn:hover {
  background: #e8ecf1;
  border-color: #ccc;
}

/* 深色模式下的高级筛选 */
html.dark-mode .advanced-filters {
  background: #000000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

html.dark-mode .filter-label {
  color: #ffffff;
}

html.dark-mode .radio-option,
html.dark-mode .checkbox-option {
  color: #cccccc;
}

html.dark-mode .radio-option:hover,
html.dark-mode .checkbox-option:hover {
  color: #4facfe;
}

html.dark-mode .clear-filters-btn {
  background: #000000;
  border-color: #444;
  color: #cccccc;
}

html.dark-mode .clear-filters-btn:hover {
  background: #1a1a1a;
  border-color: #666;
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
  font-size: 16px;
  color: #000000;
  margin: 0;
}

.station-type {
  padding: 4px 12px;
  background: #f0f7ff;
  color: #0066cc;
  border-radius: 4px;
  font-size: 14px;
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
  color: #000000;
}

.detail-item .icon {
  font-size: 16px;
}

.station-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 20px;
}

.station-stats .stat {
  text-align: center;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #666;
}

.station-actions {
  display: flex;
  gap: 12px;
}

.btn-primary {
  flex: 1;
  padding: 12px;
  background: #ffffff;
  color: #000000;
  border: 1px solid #000000;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
}

.loading-icon {
  font-size: 64px;
  margin-bottom: 16px;
  animation: pulse 1.5s ease-in-out infinite;
}

.loading-state p {
  color: #666;
  font-size: 16px;
}

/* 错误状态 */
.error-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
}

.error-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.error-state p {
  color: #f44336;
  font-size: 16px;
  margin-bottom: 16px;
}

.retry-btn {
  padding: 10px 24px;
  background: linear-gradient(135deg, #0066cc 0%, #00cc99 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.4);
}

/* 照片数量标识 */
.photo-count {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  backdrop-filter: blur(4px);
}

/* 详情弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.detail-modal {
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
  color: #000000;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.modal-body {
  padding: 24px;
}

/* 照片画廊 */
.photo-gallery {
  margin-bottom: 24px;
}

.main-photo {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 12px;
}

.photo-thumbnails {
  display: flex;
  gap: 8px;
  overflow-x: auto;
}

.thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s;
  flex-shrink: 0;
}

.thumbnail:hover {
  border-color: #0066cc;
  transform: scale(1.05);
}

.thumbnail.active {
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.2);
}

/* 详情信息 */
.detail-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.detail-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-row .label {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.detail-row .value {
  font-size: 15px;
  color: #000000;
  font-weight: 500;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #f0f0f0;
}

.modal-footer .btn-primary,
.modal-footer .btn-secondary {
  flex: 1;
}

@media (max-width: 768px) {
  .detail-info {
    grid-template-columns: 1fr;
  }
  
  .main-photo {
    height: 250px;
  }
  
  .modal-footer {
    flex-direction: column;
  }
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

/* 深色模式下，卡片和文字样式 */
html.dark-mode .page-header h1 {
  color: #000000;
}

html.dark-mode .page-header p {
  color: #000000;
}

html.dark-mode .search-input {
  background: #1a1a2e;
  border-color: #444;
  color: #ffffff;
}

html.dark-mode .search-input:focus {
  border-color: #4facfe;
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.2);
}

html.dark-mode .filter-select {
  background: #1a1a2e;
  border-color: #444;
  color: #ffffff;
}

html.dark-mode .filter-select:focus {
  border-color: #4facfe;
}

html.dark-mode .station-card {
  background: #000000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

html.dark-mode .station-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

html.dark-mode .station-image {
  background: #2a2a3e;
}

html.dark-mode .station-header h3 {
  color: #ffffff;
}

html.dark-mode .station-type {
  background: #2a2a3e;
  color: #4facfe;
}

html.dark-mode .detail-item {
  color: #cccccc;
}

html.dark-mode .station-stats {
  border-top-color: #444;
  border-bottom-color: #444;
}

html.dark-mode .stat-value {
  color: #ffffff;
}

html.dark-mode .stat-label {
  color: #999;
}

html.dark-mode .btn-secondary {
  background: #000000;
  color: #ffffff;
  border-color: #444;
}

html.dark-mode .btn-secondary:hover {
  background: #1a1a1a;
}

html.dark-mode .btn-outline {
  background: #000000;
  color: #4facfe;
  border-color: #4facfe;
}

html.dark-mode .btn-outline:hover {
  background: #1a1a1a;
}

html.dark-mode .empty-state {
  background: #000000;
}

html.dark-mode .empty-state p {
  color: #999;
}
</style>
