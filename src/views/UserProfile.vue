<template>
  <div class="user-profile">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1>👤 个人中心</h1>
      <p>管理您的个人信息和账户设置</p>
    </div>
    
    <div class="profile-container">
      <!-- 左侧个人信息卡片 -->
      <div class="profile-sidebar">
        <div class="profile-card">
          <div class="profile-header">
            <div class="avatar-section">
              <div class="avatar-wrapper">
                <img 
                  v-if="userAvatar" 
                  :src="userAvatar" 
                  alt="Avatar" 
                  class="user-avatar"
                />
                <div v-else class="user-avatar-placeholder">
                  {{ username?.charAt(0).toUpperCase() }}
                </div>
                <label class="avatar-upload-btn" title="更换头像">
                  <input 
                    type="file" 
                    accept="image/*" 
                    @change="handleAvatarChange"
                    style="display: none;"
                  />
                  <svg class="camera-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M2 16h20" />
                    <path d="M5 16v-4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" />
                    <path d="M12 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                  </svg>
                </label>
              </div>
            </div>
            <div class="user-info">
              <h2>{{ username }}</h2>
              <p class="user-email">{{ userEmail || '未设置邮箱' }}</p>
              <span class="role-badge">{{ userRole === 'admin' ? '管理员' : '普通用户' }}</span>
            </div>
          </div>
          
          <!-- 统计信息 -->
          <div class="stats-section">
            <div class="stat-item">
              <div class="stat-value">{{ vehicleCount }}</div>
              <div class="stat-label">车辆</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ batteryCount }}</div>
              <div class="stat-label">电池</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ orderCount }}</div>
              <div class="stat-label">订单</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧设置表单 -->
      <div class="profile-main">
        <div class="settings-grid">
          <!-- 基本信息 -->
          <div class="settings-card">
            <div class="card-header">
              <h3>📝 基本信息</h3>
            </div>
            <div class="card-body">
              <div class="form-group">
                <label class="form-label">用户名</label>
                <input 
                  v-model="username"
                  type="text" 
                  class="form-input"
                  placeholder="请输入用户名"
                />
              </div>
              <div class="form-group">
                <label class="form-label">邮箱</label>
                <input 
                  v-model="userEmail"
                  type="email" 
                  class="form-input"
                  placeholder="请输入邮箱"
                />
              </div>
              <div class="form-actions">
                <button class="btn-save" @click="saveBasicInfo">
                  保存修改
                </button>
              </div>
            </div>
          </div>
          
          <!-- 账户安全 -->
          <div class="settings-card">
            <div class="card-header">
              <h3>🔒 账户安全</h3>
            </div>
            <div class="card-body">
              <form @submit.prevent="changePassword">
                <!-- 隐藏的用户名字段，用于无障碍辅助 -->
                <input 
                  type="text" 
                  class="sr-only" 
                  :value="username"
                  autocomplete="username"
                  aria-hidden="true"
                  tabindex="-1"
                  style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;"
                />
                
                <div class="form-group">
                  <label class="form-label">当前密码</label>
                  <input 
                    v-model="currentPassword"
                    type="password" 
                    class="form-input"
                    placeholder="请输入当前密码"
                    autocomplete="current-password"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">新密码</label>
                  <input 
                    v-model="newPassword"
                    type="password" 
                    class="form-input"
                    placeholder="请输入新密码"
                    autocomplete="new-password"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">确认新密码</label>
                  <input 
                    v-model="confirmPassword"
                    type="password" 
                    class="form-input"
                    placeholder="请再次输入新密码"
                    autocomplete="new-password"
                  />
                </div>
                <div class="form-actions">
                  <button type="submit" class="btn-save">
                    修改密码
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <!-- 系统设置 -->
          <div class="settings-card">
            <div class="card-header">
              <h3>⚙️ 系统设置</h3>
            </div>
            <div class="card-body">
              <div class="setting-item">
                <div class="setting-label">
                  <span>通知提醒</span>
                  <p class="setting-desc">接收订单状态变更通知</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="notificationsEnabled" />
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <div class="setting-item">
                <div class="setting-label">
                  <span>深色模式</span>
                  <p class="setting-desc">启用深色主题（开发中）</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" disabled />
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <SiteFooter />
    
    <!-- 头像裁剪对话框 -->
    <div v-if="showCropModal" class="crop-modal-overlay" @click="closeCropModal">
      <div class="crop-modal" @click.stop>
        <div class="crop-header">
          <h3>调整头像</h3>
          <button class="crop-close" @click="closeCropModal">×</button>
        </div>
        <div class="crop-body">
          <div class="crop-canvas-wrapper">
            <canvas ref="cropCanvas"></canvas>
          </div>
        </div>
        <div class="crop-footer">
          <button class="crop-cancel" @click="closeCropModal">取消</button>
          <button class="crop-confirm" @click="confirmCrop">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SiteFooter from '../components/SiteFooter.vue'
import { ElMessage } from 'element-plus'
import { userStatsAPI, userOrderAPI } from '../services/userAPI'

const router = useRouter()

const username = ref(localStorage.getItem('username') || '用户')
const userEmail = ref(localStorage.getItem('userEmail') || '')
const userAvatar = ref(localStorage.getItem('userAvatar') || '')
const userRole = ref(localStorage.getItem('userRole') || 'user')

// 统计数据
const vehicleCount = ref(0)
const batteryCount = ref(0)
const orderCount = ref(0)

// 密码修改
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// 系统设置
const notificationsEnabled = ref(true)

// 头像上传相关
const showCropModal = ref(false)
const cropCanvas = ref(null)
const tempImage = ref(null)
let cropper = null

// 处理头像文件选择
const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    ElMessage.warning('请选择图片文件')
    return
  }
  
  // 验证文件大小（最大 5MB）
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.warning('图片大小不能超过 5MB')
    return
  }
  
  // 读取图片
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      tempImage.value = img
      showCropModal.value = true
      // 等待 DOM 更新后初始化裁剪
      setTimeout(() => {
        initCropper(img)
      }, 100)
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
  
  // 清空 input，允许重复选择同一文件
  event.target.value = ''
}

// 初始化裁剪器
const initCropper = (img) => {
  const canvas = cropCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  canvas.width = 300
  canvas.height = 300
  
  // 创建圆形裁剪区域
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // 保存上下文状态
  ctx.save()
  
  // 创建圆形路径
  ctx.beginPath()
  ctx.arc(150, 150, 150, 0, Math.PI * 2, true)
  ctx.closePath()
  
  // 设置圆形裁剪区域
  ctx.clip()
  
  // 计算缩放比例，让图片适应 canvas（保持宽高比）
  const scale = Math.max(canvas.width / img.width, canvas.height / img.height)
  const x = (canvas.width - img.width * scale) / 2
  const y = (canvas.height - img.height * scale) / 2
  
  // 绘制图片（只会在圆形区域内显示）
  ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
  
  // 恢复上下文状态
  ctx.restore()
  
  // 绘制圆形边框（在图片之上）
  ctx.beginPath()
  ctx.arc(150, 150, 150, 0, Math.PI * 2, true)
  ctx.strokeStyle = '#333'
  ctx.lineWidth = 2
  ctx.stroke()
}

// 关闭裁剪对话框
const closeCropModal = () => {
  showCropModal.value = false
  tempImage.value = null
}

// 确认裁剪
const confirmCrop = () => {
  const canvas = cropCanvas.value
  if (!canvas) return
  
  // 创建一个新 canvas 来处理圆形头像（带透明背景）
  const outputCanvas = document.createElement('canvas')
  outputCanvas.width = 300
  outputCanvas.height = 300
  const outputCtx = outputCanvas.getContext('2d')
  
  // 清空画布（透明背景）
  outputCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height)
  
  // 创建圆形路径
  outputCtx.beginPath()
  outputCtx.arc(150, 150, 150, 0, Math.PI * 2, true)
  outputCtx.closePath()
  
  // 设置圆形裁剪区域
  outputCtx.clip()
  
  // 绘制原 canvas 的内容到新 canvas
  outputCtx.drawImage(canvas, 0, 0)
  
  // 将 canvas 转为 base64（PNG 格式支持透明）
  const avatarDataUrl = outputCanvas.toDataURL('image/png', 1.0)
  
  // 更新头像
  userAvatar.value = avatarDataUrl
  localStorage.setItem('userAvatar', avatarDataUrl)
  
  ElMessage.success('头像更新成功')
  closeCropModal()
}

// 加载统计数据
const loadStats = async () => {
  try {
    // 获取用户综合统计（车辆和电池数量）
    const statsRes = await userStatsAPI.getSummary()
    if (statsRes.code === 200) {
      vehicleCount.value = statsRes.data.vehicles || 0
      batteryCount.value = statsRes.data.batteries || 0
    }
    
    // 获取订单统计
    const orderRes = await userOrderAPI.getStats()
    if (orderRes.code === 200) {
      orderCount.value = orderRes.data.total || 0
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
    // 如果 API 调用失败，使用 localStorage 作为备用方案
    const vehicles = JSON.parse(localStorage.getItem('userVehicles') || '[]')
    const batteries = JSON.parse(localStorage.getItem('userBatteries') || '[]')
    const orders = JSON.parse(localStorage.getItem('userOrders') || '[]')
    
    vehicleCount.value = vehicles.length
    batteryCount.value = batteries.length
    orderCount.value = orders.length
  }
}

onMounted(() => {
  loadStats()
})

// 保存基本信息
const saveBasicInfo = () => {
  localStorage.setItem('username', username.value)
  localStorage.setItem('userEmail', userEmail.value)
  ElMessage.success('基本信息保存成功')
}

// 修改密码
const changePassword = () => {
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    ElMessage.warning('请填写所有密码字段')
    return
  }
  
  if (newPassword.value !== confirmPassword.value) {
    ElMessage.error('两次输入的新密码不一致')
    return
  }
  
  if (newPassword.value.length < 6) {
    ElMessage.warning('密码长度至少为 6 位')
    return
  }
  
  // TODO: 调用后端 API 修改密码
  ElMessage.success('密码修改成功，请重新登录')
  localStorage.clear()
  router.push('/login')
}
</script>

<style scoped>
.user-profile {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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

.profile-container {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  background: transparent;
}

@media (max-width: 1200px) {
  .profile-container {
    grid-template-columns: 1fr;
  }
}

.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: transparent;
}

.profile-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  height: 100%;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e9ecef;
  margin-bottom: 20px;
}

.avatar-section {
  flex-shrink: 0;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #333;
  object-fit: cover;
}

.user-avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #333 0%, #000 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  color: white;
  border: 3px solid #333;
}

.avatar-upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  background: #333;
  border: 2px solid #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.avatar-upload-btn:hover {
  background: #000;
  transform: scale(1.1);
}

.camera-icon {
  width: 16px;
  height: 16px;
  color: white;
}

/* 头像裁剪对话框 */
.crop-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.crop-modal {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 90%;
  overflow: hidden;
}

.crop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
}

.crop-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
  font-weight: 600;
}

.crop-close {
  background: none;
  border: none;
  font-size: 28px;
  color: #999;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.crop-close:hover {
  background: #f0f0f0;
  color: #333;
}

.crop-body {
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.crop-canvas-wrapper {
  position: relative;
  border: 2px dashed #e0e0e0;
  border-radius: 50%;
  overflow: hidden;
  background: #f8f9fa;
  width: 300px;
  height: 300px;
}

.crop-canvas-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid #333;
  border-radius: 50%;
  z-index: 10;
  pointer-events: none;
  box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.5);
}

.crop-canvas-wrapper canvas {
  display: block;
  width: 300px;
  height: 300px;
  border-radius: 50%;
}

.crop-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e9ecef;
}

.crop-cancel,
.crop-confirm {
  padding: 8px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.crop-cancel {
  background: #f0f0f0;
  color: #666;
}

.crop-cancel:hover {
  background: #e0e0e0;
}

.crop-confirm {
  background: #333;
  color: white;
}

.crop-confirm:hover {
  background: #000;
}

.user-info h2 {
  font-size: 20px;
  color: #333;
  margin: 0 0 6px 0;
  font-weight: 600;
}

.user-email {
  font-size: 13px;
  color: #999;
  margin: 0 0 8px 0;
}

.role-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #333;
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 20px;
}

.stat-item {
  text-align: center;
  padding: 12px 8px;
  background: #f8f9fa;
  border-radius: 10px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 11px;
  color: #999;
}

.profile-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: transparent;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 1200px) {
  .settings-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}

.settings-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-header {
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.card-body {
  padding: 16px;
  flex: 1;
}

.form-group {
  margin-bottom: 12px;
}

.form-label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 13px;
  transition: all 0.3s;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #333;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.form-actions {
  margin-top: 16px;
}

.btn-save {
  padding: 8px 24px;
  background: #333333;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
}

.btn-save:hover {
  background: #000000;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  flex: 1;
}

.setting-label span {
  display: block;
  font-size: 13px;
  color: #333;
  font-weight: 500;
  margin-bottom: 3px;
}

.setting-desc {
  font-size: 11px;
  color: #999;
  margin: 0;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
  margin-left: 12px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e0e0e0;
  transition: 0.3s;
  border-radius: 26px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.toggle-switch input:checked + .toggle-slider {
  background: #333333;
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

.toggle-switch input:disabled + .toggle-slider {
  opacity: 0.5;
  cursor: not-allowed;
}

.user-profile :deep(.site-footer) {
  margin-top: 80px;
}
</style>
