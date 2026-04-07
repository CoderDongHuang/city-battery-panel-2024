<template>
  <div class="help-page">
    <!-- 顶部横幅区域 -->
    <div class="help-banner">
      <div class="banner-content">
        <h1 class="banner-title">帮助中心</h1>
        <p class="banner-description">
                CitySwap 官方帮助文档，为您提供全面的产品使用指南、详细的操作步骤说明、常见问题解答以及专业的技术支持服务。无论您是初次使用的新手还是经验丰富的用户，都能在这里找到所需的帮助信息，让您轻松掌握换电服务的每一个环节。
              </p>
        
        <!-- 搜索框 -->
        <div class="search-container">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="搜索帮助文档、常见问题..."
              class="search-input"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 主内容区域 - 全宽布局 -->
    <div class="help-main-container">
      <div class="help-content-wrapper">
        <!-- 快速导航 -->
        <div class="content-box">
          <div class="quick-nav-section">
            <h2 class="section-main-title">快速导航</h2>
          <div class="quick-nav-grid">
            <div class="quick-nav-card" @click="scrollToSection('guide')">
              <div class="nav-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <span class="icon">�</span>
              </div>
              <h3>使用指南</h3>
              <p>快速上手指南</p>
            </div>
            
            <div class="quick-nav-card" @click="scrollToSection('faq')">
              <div class="nav-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                <span class="icon">❓</span>
              </div>
              <h3>常见问题</h3>
              <p>常见问题解答</p>
            </div>
            
            <div class="quick-nav-card" @click="scrollToSection('contact')">
              <div class="nav-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                <span class="icon">�</span>
              </div>
              <h3>联系我们</h3>
              <p>获取帮助支持</p>
            </div>
            
            <div class="quick-nav-card" @click="goToPage('dashboard')">
              <div class="nav-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                <span class="icon">�</span>
              </div>
              <h3>用户仪表盘</h3>
              <p>查看账户信息</p>
            </div>
            </div>
          </div>
        </div>

        <!-- 使用指南 -->
        <div class="content-box">
          <div id="guide" class="guide-section">
            <h2 class="section-main-title">使用指南</h2>
            <div class="guide-cards">
              <div class="guide-card" @click="goToPage('register')">
                <div class="guide-card-icon">📝</div>
                <h3>注册账号</h3>
                <p>快速注册 CitySwap 账号，开启便捷换电之旅</p>
              </div>
              
              <div class="guide-card" @click="goToPage('first-swap')">
                <div class="guide-card-icon">⚡</div>
                <h3>首次换电</h3>
                <p>3 分钟了解完整换电流程，快速上手</p>
              </div>
              
              <div class="guide-card" @click="goToPage('payment')">
                <div class="guide-card-icon">💳</div>
                <h3>支付指南</h3>
                <p>支持多种支付方式，安全便捷</p>
              </div>
              
              <div class="guide-card" @click="goToPage('membership')">
                <div class="guide-card-icon">👑</div>
                <h3>会员服务</h3>
                <p>开通会员，享受专属折扣和优先服务</p>
              </div>
              
              <div class="guide-card" @click="goToPage('stations')">
                <div class="guide-card-icon">📍</div>
                <h3>服务网点</h3>
                <p>查找附近换电站，预约换电服务</p>
              </div>
              
              <div class="guide-card" @click="goToPage('batteries')">
                <div class="guide-card-icon">🔋</div>
                <h3>电池管理</h3>
                <p>电池状态监控、健康度检测</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 常见问题和新手专区 - 左右布局 -->
        <div class="content-box">
          <div class="faq-guide-container">
            <!-- 常见问题 -->
            <div class="faq-section">
              <h2 class="section-main-title">常见问题</h2>
              <div class="faq-list">
                <div 
                  v-for="(item, index) in faqItems" 
                  :key="index"
                  :class="['faq-item', { active: activeFaq === index }]"
                >
                  <div class="faq-question" @click="toggleFaq(index)">
                    <span>{{ item.question }}</span>
                    <span class="toggle-icon">{{ activeFaq === index ? '−' : '+' }}</span>
                  </div>
                  <div v-show="activeFaq === index" class="faq-answer">
                    {{ item.answer }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 新手专区 -->
            <div class="newbie-section">
              <h2 class="section-main-title">新手专区</h2>
              <div class="newbie-cards">
                <div class="newbie-card" @click="goToPage('register')">
                  <div class="newbie-card-icon" style="color: #999;">📝</div>
                  <h3>新手入门</h3>
                  <p>快速了解 CitySwap 基本功能</p>
                </div>
                
                <div class="newbie-card" @click="goToPage('first-swap')">
                  <div class="newbie-card-icon" style="color: #999;">⚡</div>
                  <h3>首次换电</h3>
                  <p>3 分钟学会完整换电流程</p>
                </div>
                
                <div class="newbie-card" @click="goToPage('payment')">
                  <div class="newbie-card-icon" style="color: #999;">💳</div>
                  <h3>支付指南</h3>
                  <p>多种支付方式任你选</p>
                </div>
                
                <div class="newbie-card" @click="goToPage('membership')">
                  <div class="newbie-card-icon" style="color: #999;">👑</div>
                  <h3>会员福利</h3>
                  <p>开通会员享受专属优惠</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 联系我们 -->
        <div class="content-box">
          <div class="contact-section">
            <h2 class="section-main-title">联系我们</h2>
            <div class="contact-methods">
              <div class="contact-card">
                <div class="contact-icon">📧</div>
                <h3>电子邮件</h3>
                <p>support@cityswap.com</p>
                <p class="desc">工作日 24 小时内回复</p>
              </div>
              <div class="contact-card">
                <div class="contact-icon">📱</div>
                <h3>客服电话</h3>
                <p>400-123-4567</p>
                <p class="desc">工作日 9:00-18:00</p>
              </div>
              <div class="contact-card">
                <div class="contact-icon">💬</div>
                <h3>在线客服</h3>
                <p>智能客服 + 人工服务</p>
                <p class="desc">7×24 小时在线</p>
                <button class="btn-primary" @click="startChat">开始聊天</button>
              </div>
              <div class="contact-card">
                <div class="contact-icon">📍</div>
                <h3>公司地址</h3>
                <p>北京市朝阳区科技园 A 座</p>
                <p class="desc">欢迎来访（需预约）</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 右侧悬浮客服 -->
    <div class="floating-service">
      <div class="service-item" @click="startChat">
        <span class="icon">😊</span>
      </div>
      <div class="service-item" @click="scrollToSection('contact')">
        <span class="icon">📞</span>
      </div>
    </div>
    
    <!-- 页脚 -->
    <SiteFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SiteFooter from '../components/SiteFooter.vue'

const router = useRouter()
const searchQuery = ref('')
const activeFaq = ref(null)

const faqItems = ref([
  {
    question: '如何注册 CitySwap 账号？',
    answer: '您可以通过手机号、邮箱或第三方账号（微信、GitHub）进行注册。点击登录页面的"注册"按钮，按照提示填写信息即可完成注册。'
  },
  {
    question: '如何使用换电服务？',
    answer: '1. 在"服务网点"页面查找附近的换电站\n2. 选择"立即换电"或"预约换电"\n3. 到达换电站后，扫描设备二维码\n4. 系统自动完成电池更换\n5. 支付订单费用'
  },
  {
    question: '换电费用如何计算？',
    answer: '换电费用根据电池容量和剩余电量计算。基础费用 + 电量差额费用。会员用户可享受折扣优惠。具体价格请在换电前查看订单预览。'
  },
  {
    question: '电池质量有保障吗？',
    answer: '所有电池都经过严格检测和维护，确保安全可靠。每块电池都有完整的生命周期记录。如发现电池异常，可立即联系客服处理。'
  },
  {
    question: '如何申请发票？',
    answer: '在"订单中心"页面，找到已完成的订单，点击"申请发票"按钮，填写发票信息后即可申请。电子发票将发送到您的邮箱。'
  }
])

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index
}

const scrollToSection = (sectionId) => {
  const element = document.querySelector(`.${sectionId}-section`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const goToPage = (page) => {
  const routes = {
    'dashboard': 'UserDashboard',
    'stations': 'Stations',
    'batteries': 'Batteries',
    'orders': 'Orders',
    'register': 'Help',
    'first-swap': 'Guide',
    'payment': 'Guide',
    'membership': 'Guide'
  }
  if (routes[page]) {
    router.push({ name: routes[page] })
  }
}

const startChat = () => {
  alert('正在连接在线客服...')
}
</script>

<style scoped>
.help-page {
  min-height: 100vh;
  /* 使用柔和的渐变背景，参考图片配色：浅蓝绿 → 淡紫 → 白色 */
  background: linear-gradient(180deg, 
    rgba(200, 240, 245, 0.8) 0%, 
    rgba(220, 230, 250, 0.7) 20%, 
    rgba(230, 220, 255, 0.6) 40%, 
    rgba(245, 245, 255, 0.5) 60%,
    rgba(250, 250, 255, 0.4) 80%,
    rgba(255, 255, 255, 0.3) 100%);
  background-attachment: fixed;
}

/* 顶部横幅区域 - 透明背景，与页面背景融为一体 */
.help-banner {
  background: transparent;
  padding: 40px 20px 20px;
  text-align: center;
  position: relative;
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.banner-title {
  font-size: 42px;
  color: #333;
  margin-bottom: 20px;
  font-weight: 700;
  letter-spacing: 2px;
  position: relative;
  display: inline-block;
}

.banner-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.banner-description {
  font-size: 15px;
  color: #555;
  margin-top: 48px;
  margin-bottom: 40px;
  line-height: 2;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 20px;
  text-align: center;
}

.search-container {
  max-width: 1200px;
  margin: 0 auto;
}

.search-box {
  background: white;
  border-radius: 50px;
  padding: 18px 20px 18px 40px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
  border: none;
}

.search-box:hover {
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.16);
  transform: translateY(-2px);
}

.search-box:focus-within {
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.search-icon {
  font-size: 22px;
  opacity: 0.6;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 12px 0;
  color: #333;
  background: transparent;
}

.search-input::placeholder {
  color: #999;
}

/* 主内容容器 - 全宽布局 */
.help-main-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 40px 60px;
}

.help-content-wrapper {
  width: 100%;
}

/* 内容区块容器 - 白色背景 */
.content-box {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 48px 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.8);
  margin-bottom: 40px;
}

.content-box:last-child {
  margin-bottom: 0;
}

/* 章节通用样式 */
.quick-nav-section,
.guide-section,
.faq-section,
.contact-section {
  margin-bottom: 80px;
}

.section-main-title {
  font-size: 36px;
  color: #333;
  margin-bottom: 40px;
  font-weight: 700;
  text-align: center;
  letter-spacing: 1px;
}

/* 快速导航 */
.quick-nav-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}

.quick-nav-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 40px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.quick-nav-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.85);
  border-color: rgba(255, 255, 255, 0.7);
}

.nav-icon {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.nav-icon .icon {
  font-size: 40px;
}

.quick-nav-card h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 12px;
  font-weight: 600;
}

.quick-nav-card p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

/* 使用指南 */
.guide-cards {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 24px;
}

.guide-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 32px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.guide-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.85);
  border-color: rgba(255, 255, 255, 0.7);
}

.guide-card-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.guide-card h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 600;
}

.guide-card p {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

/* 常见问题 */
.faq-section {
  margin-bottom: 0;
  flex: 1;
  padding-right: 24px;
}

.faq-guide-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 80px;
}

.faq-list {
  max-width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.faq-item {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.faq-item.active {
  border-color: rgba(255, 255, 255, 0.7);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.85);
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  cursor: pointer;
  font-size: 17px;
  font-weight: 600;
  color: #333;
  background: transparent;
  transition: all 0.3s;
}

.faq-question:hover {
  background: rgba(255, 255, 255, 0.5);
}

.toggle-icon {
  font-size: 24px;
  color: #667eea;
  font-weight: 300;
  transition: all 0.3s;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
}

.faq-item.active .toggle-icon {
  color: #764ba2;
  background: rgba(118, 75, 162, 0.15);
}

.faq-answer {
  padding: 0 28px 24px;
  color: #666;
  line-height: 2;
  font-size: 15px;
  white-space: pre-line;
  background: transparent;
}

/* 新手专区 */
.newbie-section {
  margin-bottom: 0;
  flex: 1;
  padding-left: 24px;
}

.newbie-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.newbie-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 28px 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.newbie-card:hover {
  transform: translateX(8px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.85);
  border-color: rgba(255, 255, 255, 0.7);
}

.newbie-card-icon {
  font-size: 40px;
  flex-shrink: 0;
}

.newbie-card h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 4px;
  font-weight: 600;
}

.newbie-card p {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

/* 联系我们 */
.contact-section {
  margin-bottom: 80px;
}

.contact-methods {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.contact-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  text-align: center;
  padding: 36px 20px;
  border-radius: 16px;
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.contact-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.85);
  border-color: rgba(255, 255, 255, 0.7);
}

.contact-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.contact-card h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 12px;
  font-weight: 600;
}

.contact-card p {
  font-size: 15px;
  color: #666;
  margin-bottom: 6px;
}

.contact-card .desc {
  font-size: 13px;
  color: #999;
}

.btn-primary {
  margin-top: 16px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

/* 右侧悬浮客服 */
.floating-service {
  position: fixed;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 999;
}

.service-item {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 3px solid rgba(255, 255, 255, 0.5);
  position: relative;
  overflow: hidden;
}

.service-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.service-item:hover::before {
  opacity: 0.1;
}

.service-item:hover {
  transform: translateY(-50%) scale(1.15);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.3);
  border-color: #667eea;
}

.service-item .icon {
  font-size: 28px;
  position: relative;
  z-index: 1;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .guide-cards {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .quick-nav-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .faq-guide-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .faq-section {
    padding-right: 0;
  }
  
  .newbie-section {
    padding-left: 0;
  }
}

@media (max-width: 768px) {
  .help-banner {
    padding: 40px 20px 30px;
    min-height: 200px;
  }
  
  .banner-title {
    font-size: 36px;
  }
  
  .banner-description {
    font-size: 14px;
  }
  
  .search-box {
    padding: 12px 12px 12px 20px;
  }
  
  .search-input {
    font-size: 14px;
    padding: 10px 0;
  }
  
  .help-main-container {
    padding: 30px 20px 40px;
  }
  
  .guide-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .quick-nav-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .contact-methods {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .floating-service {
    display: none;
  }
}
</style>
