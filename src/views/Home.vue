<template>
  <div class="home">
      <!-- 轮播图区域 - 全屏高度 -->
      <div class="carousel-section">
        <div class="carousel">
          <div class="carousel-slide active">
            <div class="slide-content">
              <h1>CitySwap - 智能换电</h1>
              <p>让每一次出行都充满能量</p>
              <button class="cta-btn" @click="goToDashboard">立即体验</button>
            </div>
            <div class="slide-bg">
              <div class="image-overlay"></div>
            </div>
          </div>
        </div>
        
        <!-- 向下箭头 - 放在轮播图内部 -->
        <div class="scroll-arrow" @click="scrollToContent" v-show="showArrow">
          <svg width="30" height="20" viewBox="0 0 30 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 5L15 15L25 5"/>
            <path d="M5 1L15 11L25 1" opacity="0.5"/>
          </svg>
        </div>
      </div>

      <!-- 系统介绍 -->
      <div class="intro-section">
        <div class="section-container">
          <h2 class="section-title">关于 CitySwap</h2>
          <p class="section-subtitle">智能、高效、可靠的电池换电解决方案</p>
          
          <div class="intro-grid">
            <div class="intro-card">
              <div class="card-icon">🔋</div>
              <h3>智能换电</h3>
              <p>实时监测电池状态，智能推荐最佳换电站点，让您的出行无忧</p>
            </div>
            
            <div class="intro-card">
              <div class="card-icon">🚗</div>
              <h3>车辆管理</h3>
              <p>一站式管理您的车辆和电池，随时掌握设备运行状态</p>
            </div>
            
            <div class="intro-card">
              <div class="card-icon">📊</div>
              <h3>数据分析</h3>
              <p>详细的用电统计和报警记录，帮助您优化使用策略</p>
            </div>
            
            <div class="intro-card">
              <div class="card-icon">🛡️</div>
              <h3>安全可靠</h3>
              <p>7×24 小时监控，实时报警推送，确保设备安全运行</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据统计 -->
      <div class="stats-section">
        <div class="section-container">
          <h2 class="section-title">系统数据</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">1000+</div>
              <div class="stat-label">注册用户</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">5000+</div>
              <div class="stat-label">在线设备</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">100+</div>
              <div class="stat-label">换电站点</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">99.9%</div>
              <div class="stat-label">服务可用性</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 功能亮点 -->
      <div class="features-section">
        <div class="section-container">
          <h2 class="section-title">核心功能</h2>
          <div class="features-grid">
            <div class="feature-item">
              <div class="feature-icon">🗺️</div>
              <h3>换电地图</h3>
              <p>实时显示附近换电站点，一键导航，快速换电</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">📱</div>
              <h3>移动管理</h3>
              <p>随时随地通过手机管理您的设备，便捷高效</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🔔</div>
              <h3>智能报警</h3>
              <p>异常情况实时推送，及时处理，防患于未然</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA 区域 -->
      <div class="cta-section">
        <div class="section-container">
          <h2 class="section-title">准备好开始使用了吗？</h2>
          <p class="section-subtitle">立即登录控制台，管理您的设备和电池</p>
          <div class="cta-buttons">
            <button class="cta-btn primary" @click="goToDashboard">进入控制台</button>
            <button class="cta-btn secondary" @click="goToGuide">查看使用指南</button>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showArrow = ref(true) // 控制箭头显示

const goToDashboard = () => {
  router.push('/dashboard')
}

const goToGuide = () => {
  router.push('/guide')
}

// 滚动到内容区域
const scrollToContent = () => {
  const introSection = document.querySelector('.intro-section')
  
  console.log('=== 点击箭头 ===')
  console.log('找到 intro-section:', !!introSection)
  
  if (introSection) {
    const navHeight = 80 // 导航栏高度
    const elementPosition = introSection.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - navHeight
    
    console.log('元素位置:', elementPosition)
    console.log('目标滚动位置:', offsetPosition)
    console.log('当前滚动位置:', window.pageYOffset)
    
    // 隐藏箭头
    showArrow.value = false
    
    // 尝试多种滚动方式
    // 方式 1：直接设置 documentElement.scrollTop
    document.documentElement.scrollTop = offsetPosition
    
    // 方式 2：设置 body.scrollTop
    document.body.scrollTop = offsetPosition
    
    // 方式 3：使用 scrollTo
    window.scrollTo(0, offsetPosition)
    
    console.log('设置后位置:', window.pageYOffset || document.documentElement.scrollTop)
  }
}

// 监听滚动，实现自动捕捉
let isAutoScrolling = false
let lastScrollTop = 0
let hasPausedAtIntro = false // 标记是否已经在 intro 处暂停过

const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const viewportHeight = window.innerHeight
  
  // 控制箭头显示：在顶部时显示
  if (scrollTop < 50) {
    showArrow.value = true
  } else {
    showArrow.value = false
  }
  
  // 自动锁定期间不处理
  if (isAutoScrolling) {
    return
  }
  
  const introSection = document.querySelector('.intro-section')
  
  if (!introSection) {
    lastScrollTop = scrollTop
    return
  }
  
  const introTop = introSection.getBoundingClientRect().top
  
  // 判断滚动方向
  const isScrollingDown = scrollTop > lastScrollTop
  const isScrollingUp = scrollTop < lastScrollTop
  
  console.log('=== 滚动检测 ===')
  console.log('滚动方向:', isScrollingDown ? '向下' : '向上')
  console.log('scrollTop:', scrollTop)
  console.log('introTop:', introTop)
  
  // 向下滑动：只要 intro-section 开始进入视口，就自动捕捉
  if (isScrollingDown && scrollTop > 30 && introTop < viewportHeight * 0.8 && introTop > 0) {
    console.log('>>> 向下滑动，introTop =', introTop, '触发捕捉到 CitySwap 介绍')
    isAutoScrolling = true
    
    const navHeight = 80
    const targetPosition = introSection.offsetTop - navHeight
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    })
    
    // 标记已经暂停过
    hasPausedAtIntro = true
    
    setTimeout(() => {
      isAutoScrolling = false
      console.log('<<< 向下捕捉完成')
    }, 500)
    
    lastScrollTop = scrollTop
    return
  }
  
  // 向上滑动：从其他内容回到 CitySwap 介绍，再次向上滑时触发轮播图
  if (isScrollingUp && hasPausedAtIntro) {
    // 当 CitySwap 介绍完全显示在视口中时（introTop 在 -50 到 50 之间）
    if (introTop >= -50 && introTop <= 50 && scrollTop > 50) {
      console.log('>>> 向上滑动，CitySwap 介绍完全显示，触发轮播图')
      isAutoScrolling = true
      
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      
      // 重置标记
      hasPausedAtIntro = false
      
      setTimeout(() => {
        isAutoScrolling = false
        console.log('<<< 向上捕捉完成')
      }, 500)
      
      lastScrollTop = scrollTop
      return
    }
  }
  
  // 更新上次滚动位置
  lastScrollTop = scrollTop
}

onMounted(() => {
  console.log('Home 组件已挂载，开始监听滚动')
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  console.log('Home 组件已卸载，停止监听滚动')
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: #F5F5F5;
}

/* CSS Scroll Snap - 接近时捕捉，允许慢慢滑动 */
.snap-container {
  scroll-snap-type: y proximity;
  overflow-y: scroll;
  height: 100vh;
  scroll-behavior: smooth;
}

/* 每个捕捉项 - 全屏高度 */
.snap-item {
  scroll-snap-align: start;
  scroll-snap-stop: normal;
  height: 100vh;
  width: 100%;
  position: relative;
}

/* 轮播图区域 - 全屏高度 */
.carousel-section {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  scroll-snap-align: start;
}

.carousel {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* 向下箭头 - 北大官网风格 */
.scroll-arrow {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
  animation: bounce 2s infinite;
  pointer-events: auto;
}

.scroll-arrow:hover {
  color: white;
  transform: translateX(-50%) translateY(3px);
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}

/* 响应式适配 */
@media (max-height: 700px) {
  .scroll-arrow {
    bottom: 20px;
    width: 40px;
    height: 40px;
  }
  
  .slide-content h1 {
    font-size: clamp(36px, 6vw, 56px);
  }
  
  .slide-content p {
    font-size: clamp(14px, 2.5vw, 20px);
  }
}

@media (max-width: 768px) {
  .scroll-arrow {
    bottom: 15px;
    width: 35px;
    height: 35px;
  }
  
  .slide-bg {
    background-position: center 40%;
  }
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 1s ease;
  z-index: 1;
}

.carousel-slide.active {
  opacity: 1;
}

.slide-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
  padding: 0 20px;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.slide-content h1 {
  font-size: clamp(32px, 5vw, 64px);
  font-weight: 700;
  margin: 0 0 16px 0;
  letter-spacing: 2px;
  color: white;
  text-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
  line-height: 1.2;
  word-break: break-word;
}

.slide-content p {
  font-size: clamp(14px, 2.5vw, 22px);
  margin: 0 0 32px 0;
  opacity: 0.95;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  line-height: 1.5;
}

.cta-btn {
  padding: 16px 48px;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-btn.primary {
  background: white;
  color: #0066cc;
}

.cta-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.3);
}

.cta-btn.secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
  margin-left: 16px;
}

.cta-btn.secondary:hover {
  background: white;
  color: #0066cc;
}

.slide-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('/images/623.jpg') center center/cover no-repeat;
}

/* 图片调节层 - 让图片变暗，突出文字 */
.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}

/* 通用区块样式 */
.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px;
}

.section-title {
  text-align: center;
  font-size: 42px;
  font-weight: 700;
  color: #333;
  margin: 0 0 16px 0;
}

.section-subtitle {
  text-align: center;
  font-size: 20px;
  color: #666;
  margin: 0 0 60px 0;
}

/* 介绍区域 - 全屏高度 */
.intro-section {
  background: white;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: start;
}

.intro-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  max-width: 1400px;
  width: 90%;
  margin: 0 auto;
  padding: 40px 20px;
}

.intro-card {
  text-align: center;
  padding: 40px 24px;
  background: #F5F5F5;
  border-radius: 16px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 280px;
}

.intro-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.card-icon {
  font-size: 64px;
  margin-bottom: 24px;
}

.intro-card h3 {
  font-size: 24px;
  color: #333;
  margin: 0 0 16px 0;
}

.intro-card p {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
}

/* 数据统计 - 全屏高度 */
.stats-section {
  background: linear-gradient(135deg, #0066cc 0%, #00cc99 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  scroll-snap-align: start;
}

.stats-section .section-title {
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  margin-top: 60px;
  max-width: 1400px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}

.stat-card {
  text-align: center;
  padding: 40px 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 280px;
}

.stat-number {
  font-size: 56px;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
}

.stat-label {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
}

/* 功能亮点 - 全屏高度 */
.features-section {
  background: white;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  scroll-snap-align: start;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-top: 60px;
  max-width: 1400px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}

.feature-item {
  text-align: center;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 320px;
}

.feature-icon {
  font-size: 72px;
  margin-bottom: 24px;
}

.feature-item h3 {
  font-size: 28px;
  color: #333;
  margin: 0 0 16px 0;
}

.feature-item p {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
}

/* CTA 区域 - 全屏高度 */
.cta-section {
  background: #F5F5F5;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 20px;
  scroll-snap-align: start;
}

.cta-section h2 {
  font-size: 42px;
  color: #333;
  margin: 0 0 16px 0;
}

.cta-section p {
  font-size: 20px;
  color: #666;
  margin: 0 0 40px 0;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .intro-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .slide-content h1 {
    font-size: 36px;
  }
  
  .slide-content p {
    font-size: 18px;
  }
  
  .scroll-arrow {
    bottom: 20px;
    width: 40px;
    height: 40px;
  }
  
  .slide-bg {
    background-position: center 50%;
  }
  
  .intro-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-buttons {
    flex-direction: column;
  }
  
  .cta-btn.secondary {
    margin-left: 0;
    margin-top: 16px;
  }
}
</style>
