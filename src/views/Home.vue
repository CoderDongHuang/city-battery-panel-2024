<template>
  <div class="home">
    <!-- 轮播图区域 -->
    <div class="carousel-section">
      <div class="carousel">
        <div class="carousel-slide active">
          <div class="slide-content">
            <h1>CitySwap - 智能换电系统</h1>
            <p>让每一次出行都充满能量</p>
            <button class="cta-btn" @click="goToDashboard">立即体验</button>
          </div>
          <div class="slide-bg">
            <div class="gradient-overlay"></div>
          </div>
        </div>
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
        <h2>准备好开始使用了吗？</h2>
        <p>立即登录控制台，管理您的设备和电池</p>
        <div class="cta-buttons">
          <button class="cta-btn primary" @click="goToDashboard">进入控制台</button>
          <button class="cta-btn secondary" @click="goToGuide">查看使用指南</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToDashboard = () => {
  router.push('/dashboard')
}

const goToGuide = () => {
  router.push('/guide')
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: #F5F5F5;
}

/* 轮播图区域 */
.carousel-section {
  position: relative;
  height: 600px;
  overflow: hidden;
  background: linear-gradient(135deg, #0066cc 0%, #00cc99 100%);
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
}

.carousel-slide.active {
  opacity: 1;
}

.slide-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  max-width: 800px;
  padding: 0 20px;
}

.slide-content h1 {
  font-size: 56px;
  font-weight: 700;
  margin: 0 0 24px 0;
  letter-spacing: 2px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.slide-content p {
  font-size: 24px;
  margin: 0 0 40px 0;
  opacity: 0.95;
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
  background: url('/images/623.jpg') center/cover;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 102, 204, 0.85) 0%, rgba(0, 204, 153, 0.85) 100%);
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

/* 介绍区域 */
.intro-section {
  background: white;
}

.intro-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}

.intro-card {
  text-align: center;
  padding: 40px 24px;
  background: #F5F5F5;
  border-radius: 16px;
  transition: all 0.3s ease;
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

/* 数据统计 */
.stats-section {
  background: linear-gradient(135deg, #0066cc 0%, #00cc99 100%);
}

.stats-section .section-title {
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  margin-top: 60px;
}

.stat-card {
  text-align: center;
  padding: 40px 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
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

/* 功能亮点 */
.features-section {
  background: white;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-top: 60px;
}

.feature-item {
  text-align: center;
  padding: 40px 24px;
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

/* CTA 区域 */
.cta-section {
  background: #F5F5F5;
  text-align: center;
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
