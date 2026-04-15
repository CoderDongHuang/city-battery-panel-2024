<template>
  <div class="my-vehicles">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1>我的车辆</h1>
        <p>管理您的车辆信息，随时掌握车辆状态</p>
      </div>
    </div>
    
    <!-- 装饰线（带小车动画） -->
    <div class="decorative-line-wrapper">
      <div class="decorative-line">
        <div class="line"></div>
        <div class="moving-car">🚗</div>
      </div>
      <!-- 添加车辆按钮（独立一行） -->
      <div class="add-btn-container">
        <button class="add-vehicle-btn" @click="showAddModal = true">
          <span class="plus-icon">+</span>
          <span>添加车辆</span>
        </button>
      </div>
    </div>

    <!-- 车辆列表 -->
    <div class="vehicles-grid">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <!-- 空状态 -->
      <div v-else-if="vehicles.length === 0" class="empty-state">
        <div class="empty-icon">🚗</div>
        <h2>暂无车辆</h2>
        <p>添加您的第一辆车，开始便捷的换电体验</p>
        <button class="add-btn" @click="showAddModal = true">
          <span class="plus-icon">+</span>
          <span>添加车辆</span>
        </button>
      </div>

      <!-- 车辆卡片列表 -->
      <div v-else class="vehicle-cards">
        <div 
          v-for="vehicle in vehicles" 
          :key="vehicle.id"
          class="vehicle-card"
          :class="{ 'vehicle-offline': vehicle.status === 'offline' }"
        >
          <div class="vehicle-card-header">
            <div class="vehicle-avatar">🚗</div>
            <div class="vehicle-basic-info">
              <h3 class="vehicle-name">{{ vehicle.name }}</h3>
              <p class="vehicle-brand">{{ vehicle.brand }}</p>
            </div>
          </div>
          
          <div class="vehicle-status-badge" :class="vehicle.status">
            {{ vehicle.status === 'online' ? '🟢 在线' : '🔴 离线' }}
          </div>

          <div class="vehicle-card-body">
            <div class="vehicle-detail-row">
              <span class="detail-label">📋 车架号</span>
              <span class="detail-value">{{ vehicle.vin || '未登记' }}</span>
            </div>
            <div class="vehicle-detail-row">
              <span class="detail-label">🚘 车牌号</span>
              <span class="detail-value">{{ vehicle.plateNumber || '未登记' }}</span>
            </div>
            <div class="vehicle-detail-row">
              <span class="detail-label">📅 购买日期</span>
              <span class="detail-value">{{ vehicle.purchaseDate || '未知' }}</span>
            </div>
            <div v-if="vehicle.notes" class="vehicle-detail-row">
              <span class="detail-label">📝 备注</span>
              <span class="detail-value notes">{{ vehicle.notes }}</span>
            </div>
          </div>

          <div class="vehicle-card-footer">
            <button class="action-btn view" @click="viewVehicleDetail(vehicle)">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <span>详情</span>
            </button>
            <button class="action-btn edit" @click="editVehicle(vehicle)">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <span>编辑</span>
            </button>
            <button class="action-btn delete" @click="confirmDelete(vehicle)">
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

    <!-- 添加/编辑车辆弹窗 -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2>{{ isEditing ? '编辑车辆' : '添加车辆' }}</h2>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="handleSubmit" class="vehicle-form">
            <div class="form-group">
              <label class="form-label">
                <span class="required">*</span> 车辆名称
              </label>
              <input
                v-model="formData.name"
                type="text"
                class="form-input"
                placeholder="例如：我的第一辆车"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                <span class="required">*</span> 品牌型号
              </label>
              <div class="brand-selector">
                <div class="search-box">
                  <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input
                    v-model="brandSearch"
                    type="text"
                    class="form-input"
                    placeholder="搜索品牌或型号（如：特斯拉、Model 3）"
                    @input="filterBrands"
                  />
                </div>
                
                <div v-if="showBrandDropdown" class="brand-dropdown">
                  <div 
                    v-for="brand in filteredBrands" 
                    :key="brand"
                    class="brand-option"
                    @click="selectBrand(brand)"
                  >
                    {{ brand }}
                  </div>
                  <div v-if="filteredBrands.length === 0" class="no-results">
                    没有找到匹配的品牌
                  </div>
                </div>
                
                <input
                  v-model="formData.brand"
                  type="text"
                  class="form-input"
                  placeholder="或手动输入品牌型号"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <span class="required">*</span> 车架号 (VIN)
              </label>
              <input
                v-model="formData.vin"
                type="text"
                class="form-input"
                placeholder="17 位车架号"
                maxlength="17"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">车牌号</label>
              <input
                v-model="formData.plateNumber"
                type="text"
                class="form-input"
                placeholder="例如：京 A12345"
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
                {{ submitting ? '提交中...' : (isEditing ? '保存修改' : '添加车辆') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 车辆详情弹窗 -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-container detail-modal" @click.stop>
        <div class="modal-header">
          <h2>🚗 车辆详情</h2>
          <button class="modal-close" @click="closeDetailModal">✕</button>
        </div>

        <div class="modal-body">
          <div class="detail-content">
            <div class="detail-row">
              <span class="detail-label">车辆名称</span>
              <span class="detail-value">{{ selectedVehicle?.name }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">品牌型号</span>
              <span class="detail-value">{{ selectedVehicle?.brand }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">车架号 (VIN)</span>
              <span class="detail-value">{{ selectedVehicle?.vin || '未登记' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">车牌号</span>
              <span class="detail-value">{{ selectedVehicle?.plateNumber || '未登记' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">购买日期</span>
              <span class="detail-value">{{ selectedVehicle?.purchaseDate || '未知' }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">状态</span>
              <span class="detail-value">
                <span class="status-badge" :class="selectedVehicle?.status">
                  {{ selectedVehicle?.status === 'online' ? '🟢 在线' : '🔴 离线' }}
                </span>
              </span>
            </div>
            <div v-if="selectedVehicle?.notes" class="detail-row">
              <span class="detail-label">备注</span>
              <span class="detail-value notes">{{ selectedVehicle?.notes }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">创建时间</span>
              <span class="detail-value">{{ formatDate(selectedVehicle?.createdAt) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">更新时间</span>
              <span class="detail-value">{{ formatDate(selectedVehicle?.updatedAt) }}</span>
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
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { userVehicleAPI } from '../services/userAPI'
import SiteFooter from '../components/SiteFooter.vue'

// 状态
const loading = ref(false)
const submitting = ref(false)
const vehicles = ref([])
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDetailModal = ref(false)
const isEditing = ref(false)
const editingVehicleId = ref(null)
const selectedVehicle = ref(null)

// 品牌选择相关
const brandSearch = ref('')
const showBrandDropdown = ref(false)
const filteredBrands = ref([])

// 从 JSON 文件加载车辆品牌和型号数据
import vehicleBrandsData from '../data/vehicle-brands.json'
const vehicleBrands = vehicleBrandsData.brands || []

// 表单数据
const formData = reactive({
  name: '',
  brand: '',
  vin: '',
  plateNumber: '',
  purchaseDate: '',
  notes: ''
})

// 获取车辆列表
const fetchVehicles = async () => {
  loading.value = true
  try {
    const res = await userVehicleAPI.getVehicles()
    if (res.code === 200) {
      vehicles.value = res.data || []
    } else {
      ElMessage.error(res.message || '加载车辆列表失败')
    }
  } catch (error) {
    console.error('获取车辆列表失败:', error)
    ElMessage.error('加载车辆列表失败，请稍后重试')
    vehicles.value = []
  } finally {
    loading.value = false
  }
}

// 添加车辆
const handleAddVehicle = async () => {
  submitting.value = true
  try {
    const res = await userVehicleAPI.addVehicle(formData)
    if (res.code === 200) {
      ElMessage.success('车辆添加成功')
      closeAddModal()
      await fetchVehicles()
    } else {
      ElMessage.error(res.message || '添加车辆失败')
    }
  } catch (error) {
    console.error('添加车辆失败:', error)
    ElMessage.error('添加车辆失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

// 更新车辆
const handleUpdateVehicle = async () => {
  submitting.value = true
  try {
    const res = await userVehicleAPI.updateVehicle(editingVehicleId.value, formData)
    if (res.code === 200) {
      ElMessage.success('车辆信息更新成功')
      closeEditModal()
      await fetchVehicles()
    } else {
      ElMessage.error(res.message || '更新车辆失败')
    }
  } catch (error) {
    console.error('更新车辆失败:', error)
    ElMessage.error(error.response?.data?.message || '更新车辆失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

// 提交表单
const handleSubmit = () => {
  if (isEditing.value) {
    handleUpdateVehicle()
  } else {
    handleAddVehicle()
  }
}

// 编辑车辆
const editVehicle = (vehicle) => {
  editingVehicleId.value = vehicle.id
  formData.name = vehicle.name
  formData.brand = vehicle.brand
  formData.vin = vehicle.vin
  formData.plateNumber = vehicle.plateNumber || ''
  formData.purchaseDate = vehicle.purchaseDate || ''
  formData.notes = vehicle.notes || ''
  isEditing.value = true
  showEditModal.value = true
}

// 确认删除
const confirmDelete = (vehicle) => {
  ElMessageBox.confirm(
    `确定要删除车辆"${vehicle.name}"吗？此操作不可恢复。`,
    '删除确认',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const res = await userVehicleAPI.deleteVehicle(vehicle.id)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        await fetchVehicles()
      } else {
        ElMessage.error(res.message || '删除失败')
      }
    } catch (error) {
      console.error('删除车辆失败:', error)
      ElMessage.error('删除失败，请稍后重试')
    }
  }).catch(() => {
    // 用户取消
  })
}

// 关闭弹窗
const closeAddModal = () => {
  showAddModal.value = false
  resetForm()
}

const closeEditModal = () => {
  showEditModal.value = false
  isEditing.value = false
  editingVehicleId.value = null
  resetForm()
}

const closeModal = () => {
  closeAddModal()
  closeEditModal()
}

// 重置表单
const resetForm = () => {
  formData.name = ''
  formData.brand = ''
  formData.vin = ''
  formData.plateNumber = ''
  formData.purchaseDate = ''
  formData.notes = ''
  brandSearch.value = ''
  filteredBrands.value = []
  showBrandDropdown.value = false
}

// 过滤品牌
const filterBrands = () => {
  const search = brandSearch.value.trim().toLowerCase()
  if (search) {
    filteredBrands.value = vehicleBrands.filter(brand => 
      brand.toLowerCase().includes(search)
    )
    showBrandDropdown.value = true
  } else {
    filteredBrands.value = []
    showBrandDropdown.value = false
  }
}

// 选择品牌
const selectBrand = (brand) => {
  formData.brand = brand
  brandSearch.value = ''
  filteredBrands.value = []
  showBrandDropdown.value = false
}

// 点击外部关闭下拉框
const handleClickOutside = (event) => {
  const selector = document.querySelector('.brand-selector')
  if (selector && !selector.contains(event.target)) {
    showBrandDropdown.value = false
  }
}

// 查看车辆详情
const viewVehicleDetail = (vehicle) => {
  selectedVehicle.value = vehicle
  showDetailModal.value = true
}

// 关闭详情弹窗
const closeDetailModal = () => {
  showDetailModal.value = false
  selectedVehicle.value = null
}

// 从详情页编辑
const editFromDetail = () => {
  if (selectedVehicle.value) {
    // 直接填充表单数据并打开编辑弹窗，不关闭详情弹窗
    editingVehicleId.value = selectedVehicle.value.id
    formData.name = selectedVehicle.value.name
    formData.brand = selectedVehicle.value.brand
    formData.vin = selectedVehicle.value.vin
    formData.plateNumber = selectedVehicle.value.plateNumber || ''
    formData.purchaseDate = selectedVehicle.value.purchaseDate || ''
    formData.notes = selectedVehicle.value.notes || ''
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

// 生命周期
onMounted(() => {
  fetchVehicles()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.my-vehicles {
  padding: 24px;
  min-height: calc(100vh - 200px);
  background: var(--bg-primary);
  transition: background-color 0.3s ease;
}

/* 页面头部 */
.page-header {
  text-align: center;
  margin-bottom: 24px;
}

.header-content h1 {
  margin: 0 0 14px 0;
  font-size: 28px;
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

/* 添加车辆按钮容器 */
.add-btn-container {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

/* 装饰线（带小车动画） */
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

.line {
  position: absolute;
  top: 20px; /* 上移，连接按钮的中间部分 */
  left: 0;
  right: 100px;
  height: 2px;
  background: linear-gradient(to right, #333 0%, #666 100%);
}

.moving-car {
  position: absolute;
  top: 0px; /* 小车上移，与线对齐 */
  left: 100%;
  font-size: 20px;
  animation: moveCar 6s linear infinite;
}

@keyframes moveCar {
  0% {
    left: 100%;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    left: 0;
    opacity: 0;
  }
}

.add-vehicle-btn {
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
  transition: all 0.3s;
}

.add-vehicle-btn:hover {
  background: #000;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.plus-icon {
  font-size: 20px;
  font-weight: bold;
}

/* 车辆网格 */
.vehicles-grid {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: 80px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #999;
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
  margin: 0 0 16px 0;
  font-size: 24px;
  color: var(--text-secondary);
}

.empty-state p {
  margin: 0 0 32px 0;
  color: var(--text-tertiary);
  font-size: 16px;
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

/* 车辆卡片 */
.vehicle-cards {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 24px;
  width: 100%;
}

.vehicle-card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px var(--shadow-color);
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
  width: 100%;
  max-width: 400px;
  position: relative;
}

.vehicle-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px var(--shadow-color);
  border-color: var(--text-primary);
}

.vehicle-card.vehicle-offline {
  opacity: 0.7;
}

/* 深色模式下，车辆卡片文字保持白色 */
html.dark-mode .vehicle-name {
  color: #ffffff !important;
}

html.dark-mode .vehicle-brand {
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

.vehicle-card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
  transition: border-color 0.3s ease;
}

.vehicle-avatar {
  font-size: 48px;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border-radius: 12px;
  transition: background-color 0.3s ease;
}

.vehicle-basic-info {
  flex: 1;
}

.vehicle-name {
  margin: 0 0 4px 0;
  font-size: 20px;
  color: var(--text-primary);
  font-weight: 600;
  transition: color 0.3s ease;
}

.vehicle-brand {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.vehicle-status-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.vehicle-status-badge.online {
  background: #e8f5e9;
  color: #2e7d32;
}

.vehicle-status-badge.offline {
  background: #ffebee;
  color: #c62828;
}

.vehicle-card-body {
  margin-bottom: 20px;
}

.vehicle-detail-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 14px;
}

.detail-label {
  color: var(--text-secondary);
  font-weight: 500;
  transition: color 0.3s ease;
}

.detail-value {
  color: var(--text-primary);
  text-align: right;
  max-width: 60%;
  transition: color 0.3s ease;
}

.detail-value.notes {
  color: var(--text-secondary);
  font-style: italic;
  transition: color 0.3s ease;
}

.vehicle-card-footer {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
  transition: border-color 0.3s ease;
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

/* 弹窗样式 */
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
  z-index: 9999;
  padding: 20px;
}

.modal-container {
  background: var(--card-bg);
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px var(--shadow-color);
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
  font-size: 24px;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.modal-close {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  font-size: 24px;
  color: var(--text-secondary);
  cursor: pointer;
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
.form-textarea {
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
.form-textarea:focus {
  border-color: var(--border-color);
  outline: none;
  box-shadow: 0 0 0 2px rgba(153, 153, 153, 0.2);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* 品牌选择器样式 */
.brand-selector {
  position: relative;
}

.search-box {
  position: relative;
  margin-bottom: 8px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--text-tertiary);
  pointer-events: none;
}

.search-box .form-input {
  padding-left: 40px;
}

.brand-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 4px;
}

.brand-option {
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f5f5f5;
}

.brand-option:last-child {
  border-bottom: none;
}

.brand-option:hover {
  background: #f5f5f5;
}

.no-results {
  padding: 16px;
  text-align: center;
  color: var(--text-tertiary);
  font-size: 14px;
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
  background: var(--hover-bg);
  color: var(--text-secondary);
}

.btn-cancel:hover {
  background: var(--bg-tertiary);
}

.btn-submit {
  background: var(--hover-bg);
  color: var(--text-primary);
  min-width: 120px;
  border: 1px solid var(--border-color);
}

.btn-submit:hover:not(:disabled) {
  background: var(--card-bg);
  border-color: var(--border-color);
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
  color: var(--text-secondary);
  font-weight: 500;
  min-width: 100px;
}

.detail-value {
  font-size: 14px;
  color: var(--text-primary);
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
  border-top: 1px solid var(--border-color);
}

.detail-actions .btn-primary {
  background: var(--hover-bg);
  color: var(--text-primary);
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--border-color);
}

.detail-actions .btn-primary:hover {
  background: var(--card-bg);
  border-color: var(--border-color);
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .add-vehicle-btn {
    width: 100%;
    justify-content: center;
  }

  .vehicles-grid {
    grid-template-columns: 1fr;
  }

  .vehicle-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .vehicle-status-badge {
    align-self: flex-start;
  }

  .vehicle-detail-row {
    flex-direction: column;
    gap: 4px;
  }

  .vehicle-detail-row.notes-row {
    align-items: flex-start;
  }

  .detail-value {
    text-align: left;
    max-width: 100%;
  }

  .vehicle-card-footer {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
