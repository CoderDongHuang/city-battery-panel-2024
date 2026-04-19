<template>
  <div class="admin-stations-page">
    <div class="page-header">
      <h1>换电站服务中心管理</h1>
      <button @click="showAddModal = true" class="btn-add">+ 新增站点</button>
    </div>

    <!-- 筛选区 -->
    <div class="filter-section">
      <div class="filter-cards">
        <div class="filter-card">
          <label class="filter-label">类型筛选</label>
          <select v-model="filterType" class="filter-select">
            <option value="">全部类型</option>
            <option value="battery">换电站</option>
            <option value="service">服务中心</option>
            <option value="all">综合站</option>
          </select>
        </div>
        
        <div class="filter-card">
          <label class="filter-label">状态筛选</label>
          <select v-model="filterStatus" class="filter-select">
            <option value="all">全部状态</option>
            <option value="active">活跃</option>
            <option value="online">在线</option>
            <option value="offline">离线</option>
            <option value="maintenance">维护中</option>
            <option value="closed">已关闭</option>
          </select>
        </div>
        
        <div class="filter-card">
          <label class="filter-label">搜索站点</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="输入站点名称..."
            class="search-input"
          />
        </div>
      </div>
    </div>

      <!-- 高级筛选 - 四个独立卡片 -->
      <div class="advanced-filters">
        <div class="filter-card">
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

        <div class="filter-card">
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

        <div class="filter-card">
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

        <div class="filter-card">
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
      </div>

      <!-- 站点列表 -->
    <div class="stations-table-container">
      <table class="stations-table">
        <thead>
          <tr>
            <th>站点 ID</th>
            <th>站点名称</th>
            <th>类型</th>
            <th>状态</th>
            <th>地址</th>
            <th>可用电池</th>
            <th>空闲车位</th>
            <th>评分</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="station in filteredStations" :key="station.id">
            <td>{{ station.stationId || station.id }}</td>
            <td>{{ station.name }}</td>
            <td>
              <span :class="['type-badge', station.type]">
                {{ getTypeText(station.type) }}
              </span>
            </td>
            <td>
              <span :class="['status-badge', station.status]">
                {{ getStatusText(station.status) }}
              </span>
            </td>
            <td>{{ station.address }}</td>
            <td>{{ station.availableBatteries }}</td>
            <td>{{ station.availableSlots }}</td>
            <td>⭐ {{ station.rating }}</td>
            <td>
              <div class="action-buttons">
                <button @click="editStation(station)" class="action-btn edit-btn" title="编辑">✏️</button>
                <button @click="deleteStation(station)" class="action-btn delete-btn" title="删除">🗑️</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredStations.length === 0 && !loading" class="empty-state">
        <p>暂无站点数据</p>
      </div>

      <div v-if="loading" class="loading-state">
        <p>加载中...</p>
      </div>
    </div>

    <!-- 新增/编辑弹窗 -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ showEditModal ? '编辑站点' : '新增站点' }}</h2>
          <button @click="closeModal" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit" class="station-form">
            <div class="form-group">
              <label>站点名称</label>
              <input v-model="formData.name" type="text" required class="form-input" />
            </div>
            <div class="form-group">
              <label>站点类型</label>
              <select v-model="formData.type" class="form-input">
                <option value="battery">换电站</option>
                <option value="service">服务中心</option>
                <option value="all">综合站</option>
              </select>
            </div>
            <div class="form-group">
              <label>地址</label>
              <input v-model="formData.address" type="text" required class="form-input" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>纬度</label>
                <input v-model="formData.latitude" type="number" step="0.000001" class="form-input" />
              </div>
              <div class="form-group">
                <label>经度</label>
                <input v-model="formData.longitude" type="number" step="0.000001" class="form-input" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>联系电话</label>
                <input v-model="formData.contactPhone" type="text" class="form-input" />
              </div>
              <div class="form-group">
                <label>服务时间</label>
                <input v-model="formData.serviceTime" type="text" placeholder="例如：24 小时营业" class="form-input" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>可用电池数</label>
                <input v-model="formData.availableBatteries" type="number" class="form-input" />
              </div>
              <div class="form-group">
                <label>空闲车位数</label>
                <input v-model="formData.availableSlots" type="number" class="form-input" />
              </div>
            </div>
            <div class="form-group">
              <label>状态</label>
              <select v-model="formData.status" class="form-input">
                <option value="active">正常运营</option>
                <option value="offline">离线</option>
                <option value="maintenance">维护中</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" class="btn-cancel">取消</button>
          <button @click="handleSubmit" class="btn-submit">{{ showEditModal ? '保存' : '添加' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const stations = ref([])
const loading = ref(false)
const searchQuery = ref('')
const filterType = ref('all')
const filterStatus = ref('all')

// 高级筛选
const sortByDistance = ref('')
const sortByRating = ref('')
const filterBatteries = ref([])
const filterSpots = ref([])

const showAddModal = ref(false)
const showEditModal = ref(false)
const currentStation = ref(null)

const formData = ref({
  name: '',
  type: 'battery',
  address: '',
  latitude: '',
  longitude: '',
  contactPhone: '',
  serviceTime: '',
  availableBatteries: 0,
  availableSlots: 0,
  status: 'active'
})

// 加载站点列表
const loadStations = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/stations')
    if (response.data && response.data.data) {
      const data = response.data.data
      if (data.content) {
        stations.value = data.content
      } else if (Array.isArray(data)) {
        stations.value = data
      }
    }
  } catch (error) {
    console.error('加载站点列表失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStations()
})

const filteredStations = computed(() => {
  let result = stations.value

  // 类型筛选
  if (filterType.value) {
    result = result.filter(station => station.type === filterType.value)
  }

  // 状态筛选
  if (filterStatus.value !== 'all') {
    result = result.filter(station => station.status === filterStatus.value)
  }

  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(station =>
      station.name.toLowerCase().includes(query) ||
      (station.address && station.address.toLowerCase().includes(query))
    )
  }

  // 高级筛选 - 可用电池
  if (filterBatteries.value.length > 0) {
    result = result.filter(station => {
      const batteries = station.availableBatteries || 0
      if (filterBatteries.value.includes('sufficient') && batteries > 10) return true
      if (filterBatteries.value.includes('limited') && batteries >= 5 && batteries <= 10) return true
      if (filterBatteries.value.includes('scarce') && batteries < 5) return true
      return false
    })
  }

  // 高级筛选 - 可用车位
  if (filterSpots.value.length > 0) {
    result = result.filter(station => {
      const spots = station.availableSlots || 0
      if (filterSpots.value.includes('sufficient') && spots > 5) return true
      if (filterSpots.value.includes('limited') && spots >= 2 && spots <= 5) return true
      if (filterSpots.value.includes('scarce') && spots < 2) return true
      return false
    })
  }

  // 评分排序
  if (sortByRating.value === 'high') {
    result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0))
  } else if (sortByRating.value === 'low') {
    result = [...result].sort((a, b) => (a.rating || 0) - (b.rating || 0))
  }

  // 距离排序
  if (sortByDistance.value === 'asc') {
    result = [...result].sort((a, b) => {
      const distA = parseFloat(a.distance) || 0
      const distB = parseFloat(b.distance) || 0
      return distA - distB
    })
  } else if (sortByDistance.value === 'desc') {
    result = [...result].sort((a, b) => {
      const distA = parseFloat(a.distance) || 0
      const distB = parseFloat(b.distance) || 0
      return distB - distA
    })
  }

  return result
})

const getTypeText = (type) => {
  const typeMap = {
    battery: '换电站',
    service: '服务中心',
    all: '综合站'
  }
  return typeMap[type] || type
}

const getStatusText = (status) => {
  const statusMap = {
    active: '活跃',
    online: '在线',
    offline: '离线',
    maintenance: '维护中',
    closed: '已关闭'
  }
  return statusMap[status] || status
}

// 清除所有筛选
const clearFilters = () => {
  sortByDistance.value = ''
  sortByRating.value = ''
  filterBatteries.value = []
  filterSpots.value = []
  filterType.value = ''
  filterStatus.value = 'all'
  searchQuery.value = ''
}
const viewDetail = (station) => {
  alert('查看详情：' + station.name)
}

const editStation = (station) => {
  currentStation.value = station
  formData.value = {
    name: station.name,
    type: station.type,
    address: station.address,
    latitude: station.latitude,
    longitude: station.longitude,
    contactPhone: station.contactPhone,
    serviceTime: station.serviceTime,
    availableBatteries: station.availableBatteries,
    availableSlots: station.availableSlots,
    status: station.status
  }
  showEditModal.value = true
}

const deleteStation = async (station) => {
  if (!confirm(`确定要删除站点 "${station.name}" 吗？`)) {
    return
  }
  
  try {
    await axios.delete(`/api/stations/${station.stationId || station.id}`)
    alert('删除成功')
    loadStations()
  } catch (error) {
    console.error('删除失败:', error)
    alert('删除失败：' + (error.response?.data?.message || error.message))
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  currentStation.value = null
  formData.value = {
    name: '',
    type: 'battery',
    address: '',
    latitude: '',
    longitude: '',
    contactPhone: '',
    serviceTime: '',
    availableBatteries: 0,
    availableSlots: 0,
    status: 'active'
  }
}

const handleSubmit = async () => {
  try {
    if (showEditModal.value && currentStation.value) {
      // 更新站点
      await axios.put(`/api/stations/${currentStation.value.stationId || currentStation.value.id}`, formData.value)
      alert('更新成功')
    } else {
      // 新增站点
      await axios.post('/api/stations', formData.value)
      alert('添加成功')
    }
    closeModal()
    loadStations()
  } catch (error) {
    console.error('操作失败:', error)
    alert('操作失败：' + (error.response?.data?.message || error.message))
  }
}
</script>

<style scoped>
.admin-stations-page {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.btn-add {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.search-section {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.search-box {
  flex: 1;
}

.search-btn {
  width: 100%;
  padding: 10px 20px;
  background: #333;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.search-btn:hover {
  background: #555;
}

.filter-group {
  display: flex;
  gap: 12px;
}

.filter-select,
.search-input {
  padding: 10px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  transition: all 0.3s;
  width: 100%;
  box-sizing: border-box;
}

.filter-select:focus,
.search-input:focus {
  outline: none;
  border-color: #333;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

/* 筛选区样式 */
.filter-section {
  margin-bottom: 20px;
}

.filter-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
}

.filter-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  font-weight: 600;
  color: #666;
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
}

.radio-option input[type="radio"],
.checkbox-option input[type="checkbox"] {
  cursor: pointer;
  width: 14px;
  height: 14px;
}

.radio-option span,
.checkbox-option span {
  font-size: 13px;
  color: #666;
}

/* 高级筛选 - 四个独立卡片 */
.advanced-filters {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
  width: 100%;
  /* 删除背景、边框、阴影 */
}
  
  .advanced-filters .filter-card {
    background: white;
    border-radius: 8px;
    padding: 20px 16px;
    border: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .advanced-filters .filter-label {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
  }
  
  .advanced-filters .filter-options {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .advanced-filters .radio-option,
  .advanced-filters .checkbox-option {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }
  
  .advanced-filters .radio-option input[type="radio"],
  .advanced-filters .checkbox-option input[type="checkbox"] {
    cursor: pointer;
    width: 14px;
    height: 14px;
  }
  
  .advanced-filters .radio-option span,
  .advanced-filters .checkbox-option span {
    font-size: 13px;
    color: #666;
  }

.stations-table-container {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
  
  .stations-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .stations-table thead {
    background: #f5f7fa;
  }
  
  .stations-table th {
    padding: 14px 16px;
    text-align: left;
    font-size: 13px;
    font-weight: 600;
    color: #666;
    border-bottom: 2px solid #e0e0e0;
    white-space: nowrap;
  }
  
  .stations-table td {
    padding: 14px 16px;
    border-bottom: 1px solid #f0f0f0;
    font-size: 14px;
    color: #333;
  }
  
  .stations-table tbody tr:hover {
    background: #fafafa;
  }

.type-badge {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-align: left;
}

.type-badge.battery {
  background: #e3f2fd;
  color: #1976d2;
}

.type-badge.service {
  background: #f3e5f5;
  color: #7b1fa2;
}

.type-badge.all {
    background: #e8f5e9;
    color: #388e3c;
  }

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
  text-align: left;
}

.status-badge.active {
  background: #e8f5e9;
  color: #388e3c;
}

.status-badge.online {
  background: #e3f2fd;
  color: #1976d2;
}

.status-badge.offline {
  background: #ffebee;
  color: #d32f2f;
}

.status-badge.maintenance {
  background: #fff3e0;
  color: #f57c00;
}

.status-badge.closed {
  background: #f5f5f5;
  color: #757575;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-buttons button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-view {
  background: #e3f2fd;
}

.btn-view:hover {
  background: #bbdefb;
}

.action-btn {
  padding: 6px 12px;
  border: 1px solid #333;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  background: white;
  color: #333;
}

.action-btn:hover {
  background: #333;
  color: white;
}

.edit-btn {
  border-color: #333;
}

.delete-btn {
  border-color: #333;
}

.empty-state,
.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
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
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
}

.modal-body {
  padding: 24px;
}

.station-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.form-input {
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e0e0e0;
}

.btn-cancel,
.btn-submit {
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  color: #666;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

</style>
