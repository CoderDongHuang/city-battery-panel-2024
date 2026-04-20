<template>
  <div class="profile-container">
    <div class="profile-card">
      <div class="profile-header">
        <div class="avatar">
          <span>👨‍💼</span>
        </div>
        <h1 class="username">{{ username }}</h1>
        <p class="email">admin</p>
      </div>
      
      <div class="profile-body">
        <div class="info-section">
          <h2>账户信息</h2>
          <div class="info-item">
            <span class="label">用户名</span>
            <span class="value">{{ username }}</span>
          </div>
          <div class="info-item">
            <span class="label">邮箱</span>
            <span class="value">admin</span>
          </div>
          <div class="info-item">
            <span class="label">角色</span>
            <span class="value">管理员</span>
          </div>
        </div>
        
        <div class="actions">
          <button class="btn btn-primary" @click="handleLogout">
            <span class="btn-icon">🚪</span>
            退出登录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')

onMounted(() => {
  const storedUsername = localStorage.getItem('adminUsername')
  if (storedUsername) {
    username.value = storedUsername
  } else {
    router.push('/login')
  }
})

const handleLogout = () => {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUsername')
  router.push('/login')
}
</script>

<style scoped>
.profile-container {
  min-height: calc(100vh - 140px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%);
}

.profile-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  overflow: hidden;
}

.profile-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  text-align: center;
  color: white;
}

.avatar {
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 48px;
  backdrop-filter: blur(10px);
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.username {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
}

.email {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

.profile-body {
  padding: 30px;
}

.info-section {
  margin-bottom: 30px;
}

.info-section h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e7eb;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item .label {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
}

.info-item .value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.actions {
  display: flex;
  justify-content: center;
}

.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  border-radius: 100px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-icon {
  font-size: 18px;
}
</style>
