<template>
  <div class="my-vehicles">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1>🚗 我的车辆</h1>
        <p>管理您的车辆信息，随时掌握车辆状态</p>
      </div>
      <button class="add-vehicle-btn" @click="showAddModal = true">
        <span class="plus-icon">+</span>
        <span>添加车辆</span>
      </button>
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
            <div class="vehicle-status-badge" :class="vehicle.status">
              {{ vehicle.status === 'online' ? '🟢 在线' : '🔴 离线' }}
            </div>
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
            <button class="action-btn edit" @click="editVehicle(vehicle)">
              <span>✏️</span>
              <span>编辑</span>
            </button>
            <button class="action-btn delete" @click="confirmDelete(vehicle)">
              <span>🗑️</span>
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
              <input
                v-model="formData.brand"
                type="text"
                class="form-input"
                placeholder="例如：特斯拉 Model 3"
                required
              />
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

    <!-- 页脚 -->
    <SiteFooter />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import vehicleService from '../services/vehicleService'
import SiteFooter from '../components/SiteFooter.vue'

// 状态
const loading = ref(false)
const submitting = ref(false)
const vehicles = ref([])
const showAddModal = ref(false)
const showEditModal = ref(false)
const isEditing = ref(false)
const editingVehicleId = ref(null)

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
    const data = await vehicleService.getVehicles()
    vehicles.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('获取车辆列表失败:', error)
    ElMessage.error('加载车辆列表失败，请稍后重试')
    // 开发环境使用模拟数据
    vehicles.value = []
  } finally {
    loading.value = false
  }
}

// 添加车辆
const handleAddVehicle = async () => {
  submitting.value = true
  try {
    await vehicleService.addVehicle(formData)
    ElMessage.success('车辆添加成功')
    closeAddModal()
    await fetchVehicles()
  } catch (error) {
    console.error('添加车辆失败:', error)
    ElMessage.error(error.response?.data?.message || '添加车辆失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

// 更新车辆
const handleUpdateVehicle = async () => {
  submitting.value = true
  try {
    await vehicleService.updateVehicle(editingVehicleId.value, formData)
    ElMessage.success('车辆信息更新成功')
    closeEditModal()
    await fetchVehicles()
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
      await vehicleService.deleteVehicle(vehicle.id)
      ElMessage.success('删除成功')
      await fetchVehicles()
    } catch (error) {
      console.error('删除车辆失败:', error)
      ElMessage.error(error.response?.data?.message || '删除失败，请稍后重试')
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
}

// 生命周期
onMounted(() => {
  fetchVehicles()
})
</script>

<style scoped>
.my-vehicles {
  padding: 24px;
  min-height: calc(100vh - 200px);
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.header-content h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  color: #333;
}

.header-content p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.add-vehicle-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #f5f5f5;
  color: #333;
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-vehicle-btn:hover {
  background: #ffffff;
  border-color: #d9d9d9;
  transform: translateY(-2px);
}

.plus-icon {
  font-size: 20px;
  font-weight: bold;
}

/* 车辆网格 */
.vehicles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
}

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
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
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 24px;
  opacity: 0.5;
}

.empty-state h2 {
  margin: 0 0 16px 0;
  font-size: 24px;
  color: #333;
}

.empty-state p {
  margin: 0 0 24px 0;
  color: #666;
  font-size: 16px;
}

.add-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  background: #f5f5f5;
  color: #333;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-btn:hover {
  background: #ffffff;
  border-color: #d9d9d9;
  transform: translateY(-2px);
}

/* 车辆卡片 */
.vehicle-cards {
  display: contents;
}

.vehicle-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.vehicle-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: rgba(102, 126, 234, 0.2);
}

.vehicle-card.vehicle-offline {
  opacity: 0.7;
}

.vehicle-card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.vehicle-avatar {
  font-size: 48px;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 12px;
}

.vehicle-basic-info {
  flex: 1;
}

.vehicle-name {
  margin: 0 0 4px 0;
  font-size: 20px;
  color: #333;
  font-weight: 600;
}

.vehicle-brand {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.vehicle-status-badge {
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
  color: #666;
  font-weight: 500;
}

.detail-value {
  color: #333;
  text-align: right;
  max-width: 60%;
}

.detail-value.notes {
  color: #666;
  font-style: italic;
}

.vehicle-card-footer {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
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
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e8e8e8;
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.modal-close {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #f5f5f5;
  color: #333;
}

.modal-body {
  padding: 24px;
}

/* 表单样式 */
.vehicle-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.required {
  color: #ff4444;
  margin-right: 4px;
}

.form-input,
.form-textarea {
  padding: 12px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #999;
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
