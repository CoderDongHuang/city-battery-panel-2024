<template>
  <div class="user-profile">
    <div class="page-header">
      <h1>👤 个人中心</h1>
      <p>管理您的个人信息</p>
    </div>
    
    <div class="profile-card">
      <div class="profile-header">
        <div class="avatar-section">
          <img 
            v-if="userAvatar" 
            :src="userAvatar" 
            alt="Avatar" 
            class="user-avatar"
          />
          <div v-else class="user-avatar-placeholder">
            {{ username?.charAt(0).toUpperCase() }}
          </div>
        </div>
        <div class="user-info">
          <h2>{{ username }}</h2>
          <p class="user-email">{{ userEmail }}</p>
        </div>
      </div>
      
      <div class="profile-sections">
        <div class="profile-section">
          <h3>基本信息</h3>
          <div class="info-item">
            <label>用户名：</label>
            <span>{{ username }}</span>
          </div>
          <div class="info-item">
            <label>邮箱：</label>
            <span>{{ userEmail }}</span>
          </div>
          <div class="info-item">
            <label>角色：</label>
            <span class="role-badge">{{ userRole }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <SiteFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SiteFooter from '../components/SiteFooter.vue'

const username = ref(localStorage.getItem('username') || '用户')
const userEmail = ref(localStorage.getItem('userEmail') || '')
const userAvatar = ref(localStorage.getItem('userAvatar') || '')
const userRole = ref(localStorage.getItem('userRole') || 'user')
</script>

<style scoped>
.user-profile {
  padding: 24px;
  min-height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
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

.profile-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  flex: 1;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
  padding-bottom: 32px;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 32px;
}

.avatar-section {
  flex-shrink: 0;
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid #667eea;
  object-fit: cover;
}

.user-avatar-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 700;
  color: white;
  border: 4px solid #667eea;
}

.user-info h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
  color: #333;
}

.user-email {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.profile-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-section h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
  font-weight: 600;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.info-item label {
  font-weight: 600;
  color: #666;
  font-size: 14px;
}

.info-item span {
  color: #333;
  font-size: 14px;
}

.role-badge {
  display: inline-block;
  padding: 4px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

/* 页脚样式 */
.user-profile :deep(.site-footer) {
  margin-top: 80px;
}
</style>
