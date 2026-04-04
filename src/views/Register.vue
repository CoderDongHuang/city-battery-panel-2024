<template>
  <div class="register-container">
    <div class="register-card">
      <!-- 语言切换按钮 -->
      <button class="lang-switch" @click="toggleLanguage">
        {{ isChinese ? 'EN' : '中文' }}
      </button>
      
      <!-- 左侧视觉区域 - 渐变背景 -->
      <div class="visual-side">
        <div class="visual-content">
          <!-- 动态盒子 Logo -->
          <div class="logo-container animate-in" style="animation-delay: 0.2s;">
            <div class="irregular-cube">
              <div class="cube-part part-1"></div>
              <div class="cube-part part-2"></div>
              <div class="cube-part part-3"></div>
              <div class="cube-part part-4"></div>
              <div class="cube-glow"></div>
              <div class="cube-shadow"></div>
            </div>
          </div>
          
          <!-- 欢迎文字 -->
          <div class="welcome-text animate-in" style="animation-delay: 0.4s;">
            <h1>欢迎使用 CitySwap</h1>
            <p class="subtitle">城市智能电车管理与换电系统</p>
          </div>
          
          <!-- 特性标签 -->
          <div class="features animate-in" style="animation-delay: 0.6s;">
            <div class="feature-item">
              <div class="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1v-1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
                  <circle cx="7.5" cy="14.5" r="1.5"/>
                  <circle cx="16.5" cy="14.5" r="1.5"/>
                </svg>
              </div>
              <span>智能</span>
            </div>
            <div class="feature-divider"></div>
            <div class="feature-item">
              <div class="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <span>高效</span>
            </div>
            <div class="feature-divider"></div>
            <div class="feature-item">
              <div class="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>
              <span>可靠</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧注册表单（白色背景） -->
      <div class="form-side">
        <div class="form-wrapper">
          <!-- 小车 Logo -->
          <div class="car-logo animate-from-top">
            <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M52 36H12C10.9 36 10 35.1 10 34V26C10 24.9 10.9 24 12 24H52C53.1 24 54 24.9 54 26V34C54 35.1 53.1 36 52 36Z" fill="#3b82f6" stroke="#2563eb" stroke-width="2"/>
              <rect x="16" y="28" width="8" height="6" fill="#1e293b" rx="1"/>
              <rect x="40" y="28" width="8" height="6" fill="#1e293b" rx="1"/>
              <circle cx="20" cy="42" r="6" fill="#1e293b" stroke="#cbd5e1" stroke-width="2"/>
              <circle cx="44" cy="42" r="6" fill="#1e293b" stroke="#cbd5e1" stroke-width="2"/>
              <circle cx="20" cy="42" r="3" fill="#cbd5e1"/>
              <circle cx="44" cy="42" r="3" fill="#cbd5e1"/>
              <path d="M54 34L58 34" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
              <path d="M10 34L6 34" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="header-text animate-from-top" style="animation-delay: 0.2s;">
            <h1>{{ t('createAccount') }}</h1>
            <p>{{ t('startJourney') }}</p>
          </div>

          <form @submit.prevent="handleRegister" class="animate-from-left" style="animation-delay: 0.3s;">
            <div class="input-group">
              <label for="username">{{ t('username') }}</label>
              <input 
                type="text" 
                id="username" 
                v-model="username" 
                :placeholder="t('enterUsername')"
                autocomplete="username"
                @focus="focusState = 'username'"
                @blur="focusState = 'idle'"
              />
            </div>

            <div class="input-group">
              <label for="email">{{ t('email') }}</label>
              <input 
                type="email" 
                id="email" 
                v-model="email" 
                :placeholder="t('enterEmail')"
                autocomplete="email"
                @focus="focusState = 'email'"
                @blur="focusState = 'idle'"
              />
            </div>

            <div class="input-group">
              <label for="password">{{ t('password') }}</label>
              <div class="password-wrapper">
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  id="password" 
                  v-model="password" 
                  :placeholder="t('enterPassword')"
                  autocomplete="new-password"
                  @focus="focusState = 'password'"
                  @blur="focusState = 'idle'"
                />
                <button 
                  type="button" 
                  class="toggle-password"
                  @click="showPassword = !showPassword"
                >
                  <span v-if="!showPassword">👁</span>
                  <span v-else>✕</span>
                </button>
              </div>
            </div>

            <div class="input-group">
              <label for="confirmPassword">{{ t('confirmPassword') }}</label>
              <div class="password-wrapper">
                <input 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  id="confirmPassword" 
                  v-model="confirmPassword" 
                  :placeholder="t('enterConfirmPassword')"
                  autocomplete="new-password"
                  @focus="focusState = 'confirmPassword'"
                  @blur="focusState = 'idle'"
                />
                <button 
                  type="button" 
                  class="toggle-password"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <span v-if="!showConfirmPassword">👁</span>
                  <span v-else>✕</span>
                </button>
              </div>
            </div>

            <div class="error-message" v-if="error">
              {{ error }}
            </div>

            <button type="submit" class="submit-btn" :disabled="isLoading">
              <span v-if="!isLoading">{{ t('createAccountBtn') }}</span>
              <span v-else>{{ t('creating') }}</span>
            </button>
          </form>

          <div class="divider animate-from-right" style="animation-delay: 0.5s;">
            <span>{{ t('or') }}</span>
          </div>

          <button class="github-btn animate-from-right" style="animation-delay: 0.6s;">
            <svg class="github-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-6.27 0-1.38.48-2.535 1.26-3.435-.405-1.26-.09-3.885 1.095-3.885 0 0 1.095-.015 3.375 1.245.96-.27 2.01-.405 3.045-.405 1.035 0 2.085.135 3.045.405 2.28-1.275 3.375-1.245 3.375-1.245 1.2 3.885 1.515 6.63 1.11 7.89.795.9 1.26 2.055 1.26 3.435 0 4.95-2.805 5.97-5.475 6.27.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            {{ t('signupWithGithub') }}
          </button>

          <p class="login-link animate-from-bottom" style="animation-delay: 0.7s;">
            {{ t('haveAccount') }} 
            <router-link to="/login">{{ t('signIn') }}</router-link>
          </p>
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
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const error = ref('')
const isLoading = ref(false)
const isChinese = ref(true)

// 语言包
const lang = {
  zh: {
    createAccount: '创建账户',
    startJourney: '开始您的使用之旅',
    username: '用户名',
    enterUsername: '请输入用户名',
    email: '邮箱',
    enterEmail: '请输入邮箱',
    password: '密码',
    enterPassword: '请输入密码',
    confirmPassword: '确认密码',
    enterConfirmPassword: '请再次输入密码',
    createAccountBtn: '创建账户',
    creating: '创建中...',
    or: '或者',
    signupWithGithub: '使用 GitHub 注册',
    haveAccount: '已有账号？',
    signIn: '登录',
    pleaseEnterUsername: '请输入用户名',
    pleaseEnterEmail: '请输入邮箱',
    pleaseEnterPassword: '请输入密码',
    passwordNotMatch: '两次输入的密码不一致',
    registerFailed: '注册失败，请重试'
  },
  en: {
    createAccount: 'Create Account',
    startJourney: 'Start your journey with us',
    username: 'Username',
    enterUsername: 'Enter your username',
    email: 'Email',
    enterEmail: 'Enter your email',
    password: 'Password',
    enterPassword: 'Enter your password',
    confirmPassword: 'Confirm Password',
    enterConfirmPassword: 'Confirm your password',
    createAccountBtn: 'Create Account',
    creating: 'Creating Account...',
    or: 'OR',
    signupWithGithub: 'Sign up with GitHub',
    haveAccount: 'Already have an account?',
    signIn: 'Sign in',
    pleaseEnterUsername: 'Please enter a username',
    pleaseEnterEmail: 'Please enter an email',
    pleaseEnterPassword: 'Please enter a password',
    passwordNotMatch: 'Passwords do not match',
    registerFailed: 'Registration failed, please try again'
  }
}

const t = (key) => {
  return lang[isChinese.value ? 'zh' : 'en'][key] || key
}

const toggleLanguage = () => {
  isChinese.value = !isChinese.value
}

const handleRegister = async () => {
  error.value = ''
  
  if (!username.value.trim()) {
    error.value = t('pleaseEnterUsername')
    return
  }
  
  if (!email.value.trim()) {
    error.value = t('pleaseEnterEmail')
    return
  }
  
  if (!password.value) {
    error.value = t('pleaseEnterPassword')
    return
  }
  
  if (password.value !== confirmPassword.value) {
    error.value = t('passwordNotMatch')
    return
  }
  
  isLoading.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    localStorage.setItem('token', 'mock-token-' + Date.now())
    localStorage.setItem('username', username.value)
    
    router.push('/dashboard')
  } catch (err) {
    error.value = t('registerFailed')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  // 页面加载完成
})
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-image: url('/images/623.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.register-card {
  display: flex;
  width: 100%;
  max-width: 1000px;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
}

/* 语言切换按钮 */
.lang-switch {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 100;
  padding: 0;
  background: transparent;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 2px;
}

.lang-switch:hover {
  color: #667eea;
  transform: translateY(-1px);
}

.lang-arrow {
  font-size: 10px;
  line-height: 1;
  transition: transform 0.3s ease;
}

.lang-switch:hover .lang-arrow {
  transform: translateY(1px);
}

.visual-side {
  flex: 1;
  background: linear-gradient(135deg, #8b91ad 0%);
  position: relative;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.visual-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

/* 动态盒子 Logo */
.logo-container {
  margin-bottom: 40px;
  perspective: 1000px;
}

.irregular-cube {
  position: relative;
  width: 140px;
  height: 140px;
  animation: floatAndRotate 6s ease-in-out infinite;
}

.cube-part {
  position: absolute;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%);
  border: 2px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

/* 第一部分 - 左上 */
.part-1 {
  width: 60px;
  height: 60px;
  top: 10px;
  left: 10px;
  transform: rotate(-5deg);
  animation: part1Float 4s ease-in-out infinite;
}

/* 第二部分 - 右上 */
.part-2 {
  width: 70px;
  height: 50px;
  top: 15px;
  right: 10px;
  transform: rotate(8deg);
  animation: part2Float 4.5s ease-in-out infinite;
}

/* 第三部分 - 左下 */
.part-3 {
  width: 55px;
  height: 65px;
  bottom: 15px;
  left: 15px;
  transform: rotate(-3deg);
  animation: part3Float 5s ease-in-out infinite;
}

/* 第四部分 - 右下 */
.part-4 {
  width: 65px;
  height: 55px;
  bottom: 10px;
  right: 15px;
  transform: rotate(5deg);
  animation: part4Float 4.2s ease-in-out infinite;
}

/* 发光效果 */
.cube-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  animation: glowPulse 3s ease-in-out infinite;
}

/* 阴影 */
.cube-shadow {
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 15px;
  background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 70%);
  animation: shadowScale 6s ease-in-out infinite;
}

@keyframes floatAndRotate {
  0%, 100% {
    transform: translateY(0) rotateY(0deg);
  }
  50% {
    transform: translateY(-15px) rotateY(180deg);
  }
}

@keyframes part1Float {
  0%, 100% {
    transform: rotate(-5deg) translate(0, 0);
  }
  50% {
    transform: rotate(-5deg) translate(-3px, -5px);
  }
}

@keyframes part2Float {
  0%, 100% {
    transform: rotate(8deg) translate(0, 0);
  }
  50% {
    transform: rotate(8deg) translate(3px, -4px);
  }
}

@keyframes part3Float {
  0%, 100% {
    transform: rotate(-3deg) translate(0, 0);
  }
  50% {
    transform: rotate(-3deg) translate(-2px, 4px);
  }
}

@keyframes part4Float {
  0%, 100% {
    transform: rotate(5deg) translate(0, 0);
  }
  50% {
    transform: rotate(5deg) translate(2px, 3px);
  }
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes shadowScale {
  0%, 100% {
    opacity: 0.3;
    transform: translateX(-50%) scale(1);
  }
  50% {
    opacity: 0.5;
    transform: translateX(-50%) scale(0.9);
  }
}

/* 欢迎文字 */
.welcome-text {
  text-align: center;
  margin-bottom: 40px;
  color: white;
}

.welcome-text h1 {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 12px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
}

.subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
  font-weight: 300;
}

/* 特性标签 */
.features {
  display: flex;
  align-items: center;
  gap: 20px;
  color: white;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.feature-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.feature-icon svg {
  stroke: white;
}

.feature-item span {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
}

.feature-divider {
  width: 2px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.form-side {
  flex: 1;
  background: white;
  padding: 60px 40px;
  display: flex;
  align-items: center;
}

.form-wrapper {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.car-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.header-text {
  text-align: center;
  margin-bottom: 32px;
}

.header-text h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.header-text p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.input-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  color: #1f2937;
  background: #f9fafb;
  transition: all 0.3s ease;
}

.input-group input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  flex: 1;
  padding-right: 44px;
}

.toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.toggle-password:hover {
  opacity: 1;
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 20px;
  border: 1px solid #fecaca;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: #000000;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 24px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 24px;
  color: #9ca3af;
  font-size: 13px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e5e7eb;
}

.divider span {
  padding: 0 12px;
}

.github-btn {
  width: 100%;
  padding: 14px;
  background: white;
  color: #1f2937;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 24px;
}

.github-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-2px);
}

.github-icon {
  color: #1f2937;
}

.login-link {
  text-align: center;
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.login-link a {
  color: #3b82f6;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.login-link a:hover {
  color: #2563eb;
  text-decoration: underline;
}

/* 入场动画 */
.animate-in {
  opacity: 0;
  animation: slideInFromBottom 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-from-top {
  opacity: 0;
  animation: slideInFromTop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-from-left {
  opacity: 0;
  animation: slideInFromLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-from-right {
  opacity: 0;
  animation: slideInFromRight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-from-bottom {
  opacity: 0;
  animation: slideInFromBottom 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(80px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInFromTop {
  from {
    opacity: 0;
    transform: translateY(-80px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-80px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(80px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .visual-side {
    display: none;
  }
  
  .register-card {
    max-width: 450px;
  }
  
  .form-side {
    padding: 40px 30px;
  }
}
</style>
