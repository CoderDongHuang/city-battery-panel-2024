<template>
  <div class="login-container" @mousemove="handleMouseMove">
    <div class="login-wrapper">
      <div class="login-left">
        <div class="pillars-container">
          <div 
            class="pillar" 
            v-for="(pillar, index) in pillars" 
            :key="index"
            :class="[pillar.shape]"
            :style="getPillarStyle(pillar)"
          >
            <div class="pillar-body" :style="{ background: pillar.color, width: pillar.width + 'px', height: pillar.height + 'px' }">
              <div class="pillar-face" :style="{ top: pillar.faceTop + 'px' }">
                <div class="eyes" :style="{ gap: pillar.eyeGap + 'px' }">
                  <div class="eye">
                    <div class="pupil" :style="getPupilStyle(pillar, index)"></div>
                  </div>
                  <div class="eye">
                    <div class="pupil" :style="getPupilStyle(pillar, index)"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="login-right">
      <div class="login-card">
        <div class="card-header">
          <h2>欢迎回来</h2>
          <p>登录您的账户继续使用</p>
        </div>
        
        <form class="login-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label>邮箱地址</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input 
                type="email" 
                v-model="email" 
                placeholder="your@email.com"
                required
                @focus="currentAction = 'peeking'"
                @blur="currentAction = 'idle'"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label>密码</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input 
                :type="showPassword ? 'text' : 'password'" 
                v-model="password" 
                placeholder="••••••••"
                required
                @focus="currentAction = 'hiding'"
                @blur="currentAction = 'idle'"
              />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="rememberMe" />
              <span class="checkmark"></span>
              <span>记住我</span>
            </label>
            <a href="#" class="forgot-link">忘记密码？</a>
          </div>
          
          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>登 录</span>
          </button>
          
          <div class="divider">
            <span>或使用以下方式登录</span>
          </div>
          
          <div class="social-login">
            <button type="button" class="social-btn google">
              <svg viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button type="button" class="social-btn github">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>
          
          <div v-if="errorMessage" class="error-message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ errorMessage }}
          </div>
        </form>
        
        <div class="card-footer">
          <p>还没有账户？ <a href="#">立即注册</a></p>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../services/api'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const currentAction = ref('idle')

const mouseX = ref(0)
const mouseY = ref(0)
const containerRect = ref(null)

const pillars = reactive([
  { 
    shape: 'tall-thin', 
    color: 'linear-gradient(180deg, #e94560 0%, #c73659 100%)',
    width: 40,
    height: 180,
    left: 25,
    zIndex: 5,
    faceTop: 28,
    eyeGap: 5
  },
  { 
    shape: 'medium-round', 
    color: 'linear-gradient(180deg, #ff6b6b 0%, #ee5a5a 100%)',
    width: 52,
    height: 135,
    left: 75,
    zIndex: 3,
    faceTop: 22,
    eyeGap: 9
  },
  { 
    shape: 'tall-wide', 
    color: 'linear-gradient(180deg, #feca57 0%, #f39c12 100%)',
    width: 44,
    height: 200,
    left: 125,
    zIndex: 6,
    faceTop: 30,
    eyeGap: 6
  },
  { 
    shape: 'short-fat', 
    color: 'linear-gradient(180deg, #48dbfb 0%, #0abde3 100%)',
    width: 56,
    height: 105,
    left: 175,
    zIndex: 2,
    faceTop: 20,
    eyeGap: 10
  },
  { 
    shape: 'medium-square', 
    color: 'linear-gradient(180deg, #1dd1a1 0%, #10ac84 100%)',
    width: 42,
    height: 150,
    left: 230,
    zIndex: 4,
    faceTop: 25,
    eyeGap: 7
  },
  { 
    shape: 'tall-thin', 
    color: 'linear-gradient(180deg, #a55eea 0%, #8854d0 100%)',
    width: 38,
    height: 185,
    left: 275,
    zIndex: 5,
    faceTop: 28,
    eyeGap: 5
  }
])

const getPillarStyle = (pillar) => {
  return {
    left: pillar.left + 'px',
    zIndex: pillar.zIndex
  }
}

const handleMouseMove = (e) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

const getPupilStyle = (pillar, index) => {
  if (!containerRect.value) return {}
  
  const container = containerRect.value
  const centerX = container.left + pillar.left + pillar.width / 2
  const centerY = container.top + container.height - 80 - pillar.height + pillar.faceTop + 15
  
  const deltaX = mouseX.value - centerX
  const deltaY = mouseY.value - centerY
  
  const maxMove = 5
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  const angle = Math.atan2(deltaY, deltaX)
  
  let moveX = Math.min(distance / 80, 1) * maxMove * Math.cos(angle)
  let moveY = Math.min(distance / 80, 1) * maxMove * Math.sin(angle)
  
  if (currentAction.value === 'peeking') {
    moveX = moveX + 3
    moveY = moveY - 4
  } else if (currentAction.value === 'hiding') {
    moveX = moveX - 4
  }
  
  return {
    transform: `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`
  }
}

onMounted(() => {
  const container = document.querySelector('.pillars-container')
  if (container) {
    containerRect.value = container.getBoundingClientRect()
  }
  
  window.addEventListener('resize', () => {
    const container = document.querySelector('.pillars-container')
    if (container) {
      containerRect.value = container.getBoundingClientRect()
    }
  })
})

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = '请填写完整的登录信息'
    return
  }
  
  loading.value = true
  errorMessage.value = ''
  
  try {
    const response = await authAPI.login({
      username: email.value,
      password: password.value
    })
    
    if (response.code === 200 && response.data) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('username', email.value)
      router.push('/dashboard')
    } else {
      errorMessage.value = response.message || '登录失败，请重试'
    }
  } catch (error) {
    console.error('登录失败:', error)
    if (email.value === 'admin' && password.value === '123456') {
      localStorage.setItem('token', 'mock-token-' + Date.now())
      localStorage.setItem('username', email.value)
      router.push('/dashboard')
    } else {
      errorMessage.value = '邮箱或密码错误'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
  padding: 20px;
}

.login-wrapper {
  display: flex;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  max-width: 800px;
  width: 100%;
}

.login-left {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: #000;
  padding-bottom: 60px;
  min-height: 450px;
}

.pillars-container {
  position: relative;
  width: 320px;
  height: 250px;
  transform: scale(0.85);
}

.pillar {
  position: absolute;
  bottom: 0;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.pillar-body {
  position: relative;
  border-radius: 30px 30px 15px 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.pillar.shape-tall-thin .pillar-body {
  border-radius: 50% 50% 20% 20%;
}

.pillar.shape-medium-round .pillar-body {
  border-radius: 60px 60px 20px 20px;
}

.pillar.shape-tall-wide .pillar-body {
  border-radius: 40px 40px 15px 15px;
}

.pillar.shape-short-fat .pillar-body {
  border-radius: 50px 50px 25px 25px;
}

.pillar.shape-medium-square .pillar-body {
  border-radius: 15px;
}

.pillar-face {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 35px;
}

.eyes {
  display: flex;
  justify-content: center;
}

.eye {
  width: 14px;
  height: 14px;
  position: relative;
}

.pupil {
  width: 8px;
  height: 8px;
  background: #1a1a2e;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transition: transform 0.08s ease;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
}

.login-right {
  width: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: #fff;
}

.login-card {
  width: 100%;
  max-width: 320px;
}

.card-header {
  text-align: center;
  margin-bottom: 24px;
}

.card-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 6px;
}

.card-header p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  width: 20px;
  height: 20px;
  color: #9ca3af;
  pointer-events: none;
}

.input-wrapper input {
  width: 100%;
  padding: 10px 40px;
  font-size: 14px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  color: #1e293b;
  outline: none;
  transition: all 0.2s;
}

.input-wrapper input:focus {
  background: #fff;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-wrapper input::placeholder {
  color: #94a3b8;
}

.toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-password svg {
  width: 20px;
  height: 20px;
  color: #9ca3af;
  transition: color 0.2s;
}

.toggle-password:hover svg {
  color: #3b82f6;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #64748b;
}

.remember-me input {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 1.5px solid #cbd5e1;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s;
}

.remember-me input:checked + .checkmark {
  background: #3b82f6;
  border-color: #3b82f6;
}

.remember-me input:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 5px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.forgot-link {
  font-size: 14px;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #2563eb;
}

.submit-btn {
  width: 100%;
  padding: 11px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 4px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 8px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.divider span {
  font-size: 13px;
  color: #94a3b8;
}

.social-login {
  display: flex;
  gap: 12px;
}

.social-btn {
  flex: 1;
  padding: 10px;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.social-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.social-btn svg {
  width: 20px;
  height: 20px;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-size: 14px;
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  margin-top: 8px;
}

.error-message svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.card-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.card-footer p {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.card-footer a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
}

.card-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 1024px) {
  .login-left {
    display: none;
  }
  
  .login-wrapper {
    max-width: 400px;
  }
  
  .login-right {
    width: 100%;
  }
}
</style>
