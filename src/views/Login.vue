<template>
  <div class="login-container" @mousemove="handleMouseMove">
    <div class="login-card">
      <!-- 语言切换按钮 -->
      <button class="lang-switch" @click="toggleLanguage">
        {{ isChinese ? 'EN' : '中文' }}
      </button>
      
      <!-- 左侧视觉区域（柱子群）- 黑色背景 -->
      <div class="visual-side">
        <!-- 紫色柱子（背景） -->
        <div class="character purple animate-in" :class="{ 'peeking': focusState === 'email' }" style="animation-delay: 0.1s;">
          <div class="pillar-foot"></div>
          <div class="pillar-body">
            <div class="pillar-neck"></div>
            <div class="pillar-head">
              <div class="eyes">
                <div class="eye"><div class="pupil" :style="getPupilStyle(0)"></div></div>
                <div class="eye"><div class="pupil" :style="getPupilStyle(0)"></div></div>
              </div>
            </div>
          </div>
        </div>
        <!-- 黑色柱子（中间） -->
        <div class="character black animate-in" :class="{ 'peeking': focusState === 'email' }" style="animation-delay: 0.2s;">
          <div class="pillar-foot"></div>
          <div class="pillar-body">
            <div class="pillar-neck"></div>
            <div class="pillar-head">
              <div class="eyes">
                <div class="eye"><div class="pupil" :style="getPupilStyle(1)"></div></div>
                <div class="eye"><div class="pupil" :style="getPupilStyle(1)"></div></div>
              </div>
            </div>
          </div>
        </div>
        <!-- 黄色柱子（背景右侧） -->
        <div class="character yellow animate-in" :class="{ 'peeking': focusState === 'email' }" style="animation-delay: 0.3s;">
          <div class="pillar-foot"></div>
          <div class="pillar-body">
            <div class="pillar-neck"></div>
            <div class="pillar-head">
              <div class="eyes">
                <div class="eye"><div class="pupil" :style="getPupilStyle(2)"></div></div>
                <div class="eye"><div class="pupil" :style="getPupilStyle(2)"></div></div>
              </div>
            </div>
          </div>
        </div>
        <!-- 橙色半圆（最前面） -->
        <div class="character orange animate-in" :class="{ 'peeking': focusState === 'email' }" style="animation-delay: 0.4s;">
          <div class="pillar-foot"></div>
          <div class="pillar-body orange-body">
            <div class="pillar-neck orange-neck"></div>
            <div class="pillar-head orange-head">
              <div class="eyes">
                <div class="eye"><div class="pupil" :style="getPupilStyle(3)"></div></div>
                <div class="eye"><div class="pupil" :style="getPupilStyle(3)"></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单（白色背景） -->
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
            <h1>{{ t('welcomeBack') }}</h1>
            <p>{{ t('enterDetails') }}</p>
          </div>

          <form @submit.prevent="handleLogin" class="animate-from-left" style="animation-delay: 0.3s;">
            <div class="input-group">
              <label for="email">{{ t('usernameOrEmail') }}</label>
              <input 
                type="text" 
                id="email" 
                v-model="email" 
                :placeholder="t('enterUsername')"
                autocomplete="username"
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
                  autocomplete="current-password"
                  @focus="focusState = 'password'"
                  @blur="focusState = 'idle'"
                />
                <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                  <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="options animate-from-right" style="animation-delay: 0.4s;">
              <label class="remember-label">
                <input type="checkbox" v-model="rememberMe"> {{ t('rememberMe') }}
              </label>
              <a href="#" class="forgot-link">{{ t('forgotPassword') }}</a>
            </div>

            <button type="submit" class="btn btn-primary animate-from-bottom" style="animation-delay: 0.5s;" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              <span v-else>{{ t('login') }}</span>
            </button>
            
            <button type="button" class="btn btn-secondary animate-from-bottom" style="animation-delay: 0.6s;" @click="handleGithubLogin">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              {{ t('loginWithGithub') }}
            </button>
          </form>

          <div class="signup-link animate-from-bottom" style="animation-delay: 0.7s;">
            {{ t('noAccount') }} <router-link to="/register">{{ t('signUp') }}</router-link>
          </div>
          
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../services/api'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const focusState = ref('idle')
const isChinese = ref(true)

// 语言包
const lang = {
  zh: {
    welcomeBack: '欢迎回来',
    enterDetails: '请输入您的账号信息',
    usernameOrEmail: '用户名或邮箱',
    enterUsername: '请输入用户名或邮箱',
    password: '密码',
    enterPassword: '请输入密码',
    rememberMe: '记住我',
    forgotPassword: '忘记密码？',
    login: '登录',
    loggingIn: '登录中...',
    or: '或者',
    loginWithGithub: '使用 GitHub 登录',
    noAccount: '没有账号？',
    signUp: '注册',
    pleaseFillLoginInfo: '请填写完整的登录信息',
    loginFailed: '登录失败，请重试',
    wrongCredentials: '邮箱或密码错误'
  },
  en: {
    welcomeBack: 'Welcome back',
    enterDetails: 'Please enter your details',
    usernameOrEmail: 'Username or Email',
    enterUsername: 'Enter username or email',
    password: 'Password',
    enterPassword: 'Enter your password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    login: 'Log In',
    loggingIn: 'Logging in...',
    or: 'OR',
    loginWithGithub: 'Log in with GitHub',
    noAccount: "Don't have an account?",
    signUp: 'Sign Up',
    pleaseFillLoginInfo: 'Please fill in login information',
    loginFailed: 'Login failed, please try again',
    wrongCredentials: 'Wrong email or password'
  }
}

const t = (key) => {
  return lang[isChinese.value ? 'zh' : 'en'][key] || key
}

const toggleLanguage = () => {
  isChinese.value = !isChinese.value
}

const getPupilStyle = (index) => {
  let moveX = 0
  let moveY = 0
  
  if (focusState.value === 'email') {
    moveX = 5
    moveY = -2
  } else if (focusState.value === 'password') {
    moveX = -4
    moveY = 0
  }
  
  return { 
    transform: `translate(-50%, -50%) translate(${moveX}px, ${moveY}px)`,
    transition: 'transform 0.2s ease-out'
  }
}

const handleMouseMove = (e) => {
  if (focusState.value !== 'idle') return
  
  const pupils = document.querySelectorAll('.pupil')
  pupils.forEach(pupil => {
    const rect = pupil.getBoundingClientRect()
    const pupilX = rect.left + rect.width / 2
    const pupilY = rect.top + rect.height / 2
    const radX = (e.clientX - pupilX) / 20
    const radY = (e.clientY - pupilY) / 20
    const limit = 3
    const moveX = Math.max(-limit, Math.min(limit, radX))
    const moveY = Math.max(-limit, Math.min(limit, radY))
    pupil.style.transform = `translate(-50%, -50%) translate(${moveX}px, ${moveY}px)`
  })
}

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
})

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = t('pleaseFillLoginInfo')
    return
  }
  
  loading.value = true
  
  try {
    // 后端可能期望 username 而不是 email
    const response = await authAPI.login({
      username: email.value,  // 使用 username 字段
      password: password.value
    })
    
    if (response.code === 200 || response.code === 0) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('username', response.data.user.username)
      router.push('/dashboard')
    } else {
      errorMessage.value = response.message || t('loginFailed')
    }
  } catch (err) {
    console.error('登录错误:', err)
    errorMessage.value = err.response?.data?.message || t('loginFailed')
  } finally {
    loading.value = false
  }
}

// GitHub 登录
const handleGithubLogin = () => {
  // 从环境变量获取 Client ID（优先使用 .env.local 中的配置）
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || 'Iv23liBrOUx33Pvn52dS'
  const redirectUri = 'http://localhost:8080/auth/github/callback'  // 后端回调地址
  const state = Math.random().toString(36).substring(2)
  
  // 保存 state 用于验证
  localStorage.setItem('github_oauth_state', state)
  
  // 构建 GitHub 授权 URL
  const githubAuthUrl = `https://github.com/login/oauth/authorize?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=user:email&` +
    `state=${state}`
  
  // 跳转到 GitHub 授权页面
  window.location.href = githubAuthUrl
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.login-container {
  background-image: url('/images/623.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-card {
  display: flex;
  width: 950px;
  height: 640px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  overflow: hidden;
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

/* 入场动画 - 使用包裹元素 */
.animate-in {
  position: absolute;
  bottom: 0;
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

/* 柱子位置样式 - 不使用 transform */
.purple {
  left: 50%;
  margin-left: -70px;
  z-index: 1;
}

.black {
  left: 50%;
  margin-left: 10px;
  z-index: 2;
}

.yellow {
  left: 50%;
  margin-left: 75px;
  z-index: 1;
}

.orange {
  left: 50%;
  margin-left: -150px;
  z-index: 10;
}

/* 左侧浅黑色背景 */
.visual-side {
  flex: 1;
  background-color: #8591ad !important;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 50px;
  overflow: visible;
}

/* 柱子容器 */
.character {
  position: absolute;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 脚部（固定不动，保持宽度一致） */
.pillar-foot {
  width: 100%;
  height: 8px;
  background: transparent;
}

/* 柱身主体 */
.pillar-body {
  width: 90px;
  border-radius: 15px 15px 0 0;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: visible;
}

/* 脖子（负责拉伸和弯曲，底部固定） */
.pillar-neck {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 70%;
  border-radius: 15px 15px 0 0;
  transition: all 0.4s cubic-bezier(0.34, 1.2, 0.64, 1);
  transform-origin: bottom center;
}

/* 头部 */
.pillar-head {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 35%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 12px;
  transition: all 0.4s cubic-bezier(0.34, 1.2, 0.64, 1);
  transform-origin: bottom center;
  border-radius: 15px 15px 0 0;
}

/* 邮箱聚焦时：脖子拉长并向右侧弯曲 */
.character.peeking .pillar-neck {
  transform: scaleY(1.6) translateY(-6px) skewX(-14deg);
}

/* 头部跟随脖子，并额外向右偏转 */
.character.peeking .pillar-head {
  transform: translateY(-32px) translateX(10px) rotate(8deg);
}

/* 颜色配置 */
.purple .pillar-body,
.purple .pillar-neck,
.purple .pillar-head {
  background-color: #8b5cf6;
}
.purple .pillar-body {
  height: 260px;
}

.black .pillar-body,
.black .pillar-neck,
.black .pillar-head {
  background-color: #1f2937;
}
.black .pillar-body {
  height: 180px;
}

.yellow .pillar-body,
.yellow .pillar-neck,
.yellow .pillar-head {
  background-color: #fbbf24;
}
.yellow .pillar-body {
  height: 160px;
}

/* 橙色半圆特殊处理 */
.orange .pillar-body {
  width: 110px;
  height: 100px;
  border-radius: 100px 100px 0 0;
}
.orange .pillar-neck {
  height: 60%;
  border-radius: 100px 100px 0 0;
}
.orange .pillar-head {
  height: 40%;
  border-radius: 100px 100px 0 0;
  padding-top: 18px;
}
.orange .pillar-body,
.orange .pillar-neck,
.orange .pillar-head {
  background-color: #f97316;
}

/* 橙色半圆聚焦时 */
.character.orange.peeking .pillar-neck {
  transform: scaleY(1.5) translateY(-5px) skewX(-12deg);
}
.character.orange.peeking .pillar-head {
  transform: translateY(-25px) translateX(8px) rotate(6deg);
}

/* 眼睛样式 */
.eyes {
  display: flex;
  gap: 15px;
  z-index: 20;
}

.eye {
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.pupil {
  width: 6px;
  height: 6px;
  background: #1f2937;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: transform 0.15s ease-out;
}

/* 右侧表单白色背景 */
.form-side {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 40px;
}

.form-wrapper {
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.car-logo {
  text-align: center;
  margin-bottom: 20px;
}

.header-text {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  font-size: 28px;
  margin-bottom: 8px;
  color: #111;
}

p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.input-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #8b5cf6;
}

.password-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  margin-bottom: 24px;
}

.remember-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
}

.remember-label input {
  width: auto;
  margin: 0;
  cursor: pointer;
}

.forgot-link {
  color: #666;
  text-decoration: none;
  font-size: 13px;
}

.forgot-link:hover {
  text-decoration: underline;
}

.btn {
  padding: 14px;
  border-radius: 100px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
}

.btn-primary {
  background: #111;
  color: white;
  margin-bottom: 12px;
}

.btn-primary:hover:not(:disabled) {
  background: #333;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #111;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 12px;
}

.btn-secondary:hover {
  background: #f9f9f9;
}

.signup-link {
  margin-top: 28px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.signup-link a {
  color: #111;
  font-weight: bold;
  text-decoration: none;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  margin-top: 16px;
  padding: 10px;
  font-size: 13px;
  color: #dc2626;
  background: #fef2f2;
  border-radius: 12px;
  text-align: center;
}

@media (max-width: 950px) {
  .login-card {
    flex-direction: column;
    width: 95%;
    height: auto;
  }
  .visual-side {
    min-height: 320px;
    padding-bottom: 30px;
    overflow: hidden;
  }
  .form-side {
    padding: 30px 20px;
  }
}
</style>