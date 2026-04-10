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
        <div class="character purple animate-in" :class="{ 'peeking': focusState === 'email', 'surprised': isSurprised, 'singing': isSinging, 'password-focus': isPasswordFocus }" style="animation-delay: 0.1s;">
          <div class="character-inner">
            <div class="pillar-foot"></div>
            <div class="pillar-body">
              <div class="pillar-head">
                <div class="eyes">
                  <div class="eye"><div class="pupil" :style="getPupilStyle(0)"></div></div>
                  <div class="eye"><div class="pupil" :style="getPupilStyle(0)"></div></div>
                </div>
                <div class="mouth"></div>
              </div>
            </div>
          </div>
        </div>
        <!-- 黑色柱子（中间） -->
        <div class="character black animate-in" :class="{ 'peeking': focusState === 'email', 'surprised': isSurprised, 'singing': isSinging, 'password-focus': isPasswordFocus }" style="animation-delay: 0.2s;">
          <div class="character-inner">
            <div class="pillar-foot"></div>
            <div class="pillar-body">
              <div class="pillar-head">
                <div class="eyes">
                  <div class="eye"><div class="pupil" :style="getPupilStyle(1)"></div></div>
                  <div class="eye"><div class="pupil" :style="getPupilStyle(1)"></div></div>
                </div>
                <div class="mouth"></div>
              </div>
            </div>
          </div>
        </div>
        <!-- 黄色柱子（背景右侧） -->
        <div class="character yellow animate-in" :class="{ 'peeking': focusState === 'email', 'surprised': isSurprised, 'singing': isSinging, 'password-focus': isPasswordFocus }" style="animation-delay: 0.3s;">
          <div class="character-inner">
            <div class="pillar-foot"></div>
            <div class="pillar-body">
              <div class="pillar-head">
                <div class="eyes">
                  <div class="eye"><div class="pupil" :style="getPupilStyle(2)"></div></div>
                  <div class="eye"><div class="pupil" :style="getPupilStyle(2)"></div></div>
                </div>
                <div class="mouth"></div>
              </div>
            </div>
          </div>
        </div>
        <!-- 橙色半圆（最前面） -->
        <div class="character orange animate-in" :class="{ 'peeking': focusState === 'email', 'surprised': isSurprised, 'singing': isSinging, 'password-focus': isPasswordFocus }" style="animation-delay: 0.4s;">
          <div class="character-inner">
            <div class="pillar-foot"></div>
            <div class="pillar-body">
              <div class="pillar-head">
                <div class="eyes">
                  <div class="eye"><div class="pupil" :style="getPupilStyle(3)"></div></div>
                  <div class="eye"><div class="pupil" :style="getPupilStyle(3)"></div></div>
                </div>
                <div class="mouth"></div>
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
                @blur="email ? null : focusState = 'idle'"
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../services/api'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const focusState = ref('idle') // 'idle' | 'email' | 'password' | 'submit'
const isChinese = ref(true)

// 计算表情状态
const isSurprised = computed(() => {
  return email.value && password.value && !loading.value && focusState.value !== 'email' && focusState.value !== 'password'
})

const isSinging = computed(() => {
  return loading.value // 登录时：唱歌表情（眯眼）
})

const isPasswordFocus = computed(() => {
  return focusState.value === 'password' && !loading.value // 输入密码时：不同表情
})

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
  
  // 惊讶或唱歌时，眼睛看向前方
  if (isSurprised.value || isSinging.value) {
    return { 
      transform: 'translate(-50%, -50%)',
      transition: 'transform 0.2s ease-out'
    }
  }
  
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
  
  // 使用 requestAnimationFrame 优化渲染
  requestAnimationFrame(() => {
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
    const response = await authAPI.login({
      username: email.value,
      password: password.value
    })
    
    console.log('[登录响应] 完整数据:', response)
    console.log('[登录响应] data:', response.data)
    console.log('[登录响应] user:', response.data?.user)
    
    if (response.code === 200 || response.code === 0) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userId', response.data.user?.id || response.data.user?.userId || response.data.user?.uid)
      localStorage.setItem('username', response.data.user.username)
      localStorage.setItem('userRole', response.data.user.role || 'user')
      
      console.log('[登录] 保存的 userId:', localStorage.getItem('userId'))
      
      // 根据角色跳转到不同的界面
      if (response.data.user.role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/dashboard')
      }
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

/* CitySwap Logo */
.cityswap-logo {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  width: 300px;
  height: auto;
  /* 去除原色，转为灰度 */
  filter: grayscale(100%) brightness(0.8) sepia(100%) hue-rotate(180deg) saturate(150%);
  animation: logoFloat 3s ease-in-out infinite;
}

@keyframes logoFloat {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-5px);
  }
}

/* 柱子容器 */
.character {
  position: absolute;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 柱子内部容器（负责倾斜） */
.character-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
  transform-origin: bottom center;
  position: relative;
  bottom: -15px;
}

/* 输入邮箱时：所有柱子向后倾斜，高度越高倾斜越大 */
.character.purple.peeking .character-inner {
  transform: rotate(-15deg);
}

.character.black.peeking .character-inner {
  transform: rotate(-10deg);
}

.character.yellow.peeking .character-inner {
  transform: rotate(-8deg);
}

.character.orange.peeking .character-inner {
  transform: rotate(-5deg);
}

/* 惊讶表情：所有柱子眼睛变大，嘴巴成 O 型 */
.character.surprised .eye {
  width: 18px;
  height: 18px;
}

.character.surprised .mouth {
  width: 12px;
  height: 14px;
  background: #1f2937;
  border-radius: 50%;
  animation: mouthOpen 0.3s ease-out;
}

/* 不同柱子的惊讶嘴巴位置 */
.character.surprised.purple .mouth {
  bottom: 4px;
}
.character.surprised.black .mouth {
  bottom: 2px;
}
.character.surprised.yellow .mouth {
  bottom: 2px;
}
.character.surprised.orange .mouth {
  bottom: 0;
}

@keyframes mouthOpen {
  from {
    height: 0;
  }
  to {
    height: 14px;
  }
}

/* 唱歌表情：眯眼 + O 型嘴 + 音符（登录时） */
.character.singing .eye {
  height: 4px;
  border-radius: 2px;
}

.character.singing .mouth {
  width: 14px;
  height: 16px;
  background: #1f2937;
  border-radius: 50%;
}

/* 不同柱子的唱歌嘴巴位置 */
.character.singing.purple .mouth {
  bottom: 2px;
}
.character.singing.black .mouth {
  bottom: 0;
}
.character.singing.yellow .mouth {
  bottom: 0;
}
.character.singing.orange .mouth {
  bottom: -2px;
}

/* 输入密码表情：眼睛看右 + 小嘴 + 音符 */
.character.password-focus .eye {
  width: 12px;
  height: 12px;
}

.character.password-focus .mouth {
  width: 8px;
  height: 8px;
  background: #1f2937;
  border-radius: 50%;
}

/* 不同柱子的密码嘴巴位置 */
.character.password-focus.purple .mouth {
  bottom: 8px;
}
.character.password-focus.black .mouth {
  bottom: 6px;
}
.character.password-focus.yellow .mouth {
  bottom: 6px;
}
.character.password-focus.orange .mouth {
  bottom: 4px;
}

/* 音符动画 - 输入密码时 */
.character.password-focus .pillar-head::before {
  content: '♪';
  position: absolute;
  top: -25px;
  right: -15px;
  font-size: 24px;
  color: white;
  text-shadow: 0 0 10px rgba(139, 92, 246, 0.8);
  animation: floatNote 1s ease-in-out infinite;
  z-index: 100;
}

/* 音符动画 - 登录时（更大） */
.character.singing .pillar-head::before {
  content: '♪';
  position: absolute;
  top: -25px;
  right: -15px;
  font-size: 28px;
  color: white;
  text-shadow: 0 0 10px rgba(139, 92, 246, 0.8);
  animation: floatNote 1s ease-in-out infinite;
  z-index: 100;
}

@keyframes floatNote {
  0%, 100% {
    transform: translateY(0) rotate(-15deg) scale(0.8);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  50% {
    transform: translateY(-20px) rotate(-15deg) scale(1);
  }
  70% {
    opacity: 1;
  }
}
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

/* 脖子外层（负责拉伸） */
.pillar-neck {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 70%;
  transform-origin: bottom center;
  will-change: height;
  backface-visibility: hidden;
}

/* 脖子内层（负责弯曲） */
.pillar-neck-inner {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 15px 15px 0 0;
  transform-origin: bottom center;
  will-change: transform;
  backface-visibility: hidden;
}

/* 头部 */
.pillar-head {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 12px;
  transform-origin: bottom center;
  border-radius: 15px 15px 0 0;
  will-change: transform;
  backface-visibility: hidden;
  position: relative;
  overflow: visible;
}

/* 紫色柱子头部（最高 260px） */
.purple .pillar-head {
  height: 40%;
}
.purple .eyes {
  top: 35px;
}
.purple .mouth {
  bottom: 15px;
}

/* 黑色柱子头部（180px） */
.black .pillar-head {
  height: 40%;
}
.black .eyes {
  top: 30px;
}
.black .mouth {
  bottom: 12px;
}

/* 黄色柱子头部（160px） */
.yellow .pillar-head {
  height: 40%;
}
.yellow .eyes {
  top: 28px;
}
.yellow .mouth {
  bottom: 10px;
}

/* 橙色柱子头部（最矮 100px） */
.orange .pillar-head {
  height: 40%;
}
.orange .eyes {
  top: 22px;
}
.orange .mouth {
  bottom: 8px;
}

/* 眼睛容器 */
.eyes {
  display: flex;
  gap: 15px;
  z-index: 20;
  position: absolute;
}

/* 眼睛样式 */
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

/* 嘴巴基础样式 */
.mouth {
  width: 8px;
  height: 4px;
  background: rgba(31, 41, 55, 0.3);
  border-radius: 2px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  transition: all 0.3s ease;
}

/* 颜色配置 */
.purple .pillar-body,
.purple .pillar-head {
  background-color: #8b5cf6;
}
.purple .pillar-body {
  height: 260px;
}

.black .pillar-body,
.black .pillar-head {
  background-color: #1f2937;
}
.black .pillar-body {
  height: 180px;
}

.yellow .pillar-body,
.yellow .pillar-head {
  background-color: #fbbf24;
}
.yellow .pillar-body {
  height: 160px;
}

/* 橙色柱子 */
.orange .pillar-body,
.orange .pillar-head {
  background-color: #f97316;
}
.orange .pillar-body {
  height: 100px;
  border-radius: 15px 15px 0 0;
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