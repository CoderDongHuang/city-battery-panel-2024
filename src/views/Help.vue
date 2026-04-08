<template>
  <div class="help-page">
    <!-- 顶部横幅区域 -->
    <div class="help-banner">
      <div class="banner-content">
        <h1 class="banner-title">帮助中心</h1>
        <p class="banner-description">
          CitySwap 官方帮助文档，为您提供全面的产品使用指南、详细的操作步骤说明、常见问题解答以及专业的技术支持服务，让您轻松掌握换电服务的每一个环节。
        </p>
        
        <!-- 搜索框 -->
        <div class="search-container">
          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
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

    <!-- 主内容区域 -->
    <div class="help-main-container">
      <div class="help-content-wrapper">
        <!-- 快速导航 -->
        <div class="content-box">
          <div class="quick-nav-section">
            <h2 class="section-main-title">快速导航</h2>
            <div class="quick-nav-grid">
              <div class="quick-nav-card" @click="scrollToSection('guide')">
                <div class="quick-nav-icon-wrapper">
                  <svg class="quick-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
                <div class="quick-nav-card-content">
                  <h3>使用指南</h3>
                  <p>快速上手指南</p>
                </div>
              </div>
              
              <div class="quick-nav-card" @click="scrollToSection('faq')">
                <div class="quick-nav-icon-wrapper">
                  <svg class="quick-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <div class="quick-nav-card-content">
                  <h3>常见问题</h3>
                  <p>常见问题解答</p>
                </div>
              </div>
              
              <div class="quick-nav-card" @click="scrollToSection('contact')">
                <div class="quick-nav-icon-wrapper">
                  <svg class="quick-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <div class="quick-nav-card-content">
                  <h3>联系我们</h3>
                  <p>获取帮助支持</p>
                </div>
              </div>
              
              <div class="quick-nav-card" @click="goToPage('dashboard')">
                <div class="quick-nav-icon-wrapper">
                  <svg class="quick-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </div>
                <div class="quick-nav-card-content">
                  <h3>用户仪表盘</h3>
                  <p>查看账户信息</p>
                </div>
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
                <div class="guide-card-icon-wrapper">
                  <svg class="guide-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                </div>
                <div class="guide-card-content">
                  <h3>注册账号</h3>
                  <p>快速注册 CitySwap 账号，开启便捷换电之旅</p>
                </div>
              </div>
              
              <div class="guide-card" @click="goToPage('first-swap')">
                <div class="guide-card-icon-wrapper">
                  <svg class="guide-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                </div>
                <div class="guide-card-content">
                  <h3>首次换电</h3>
                  <p>3 分钟了解完整换电流程，快速上手</p>
                </div>
              </div>
              
              <div class="guide-card" @click="goToPage('payment')">
                <div class="guide-card-icon-wrapper">
                  <svg class="guide-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                </div>
                <div class="guide-card-content">
                  <h3>支付指南</h3>
                  <p>支持多种支付方式，安全便捷</p>
                </div>
              </div>
              
              <div class="guide-card" @click="goToPage('membership')">
                <div class="guide-card-icon-wrapper">
                  <svg class="guide-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <div class="guide-card-content">
                  <h3>会员服务</h3>
                  <p>开通会员，享受专属折扣和优先服务</p>
                </div>
              </div>
              
              <div class="guide-card" @click="goToPage('stations')">
                <div class="guide-card-icon-wrapper">
                  <svg class="guide-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div class="guide-card-content">
                  <h3>服务网点</h3>
                  <p>查找附近换电站，预约换电服务</p>
                </div>
              </div>
              
              <div class="guide-card" @click="goToPage('batteries')">
                <div class="guide-card-icon-wrapper">
                  <svg class="guide-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="7" width="16" height="10" rx="2" ry="2"></rect>
                    <line x1="6" y1="7" x2="6" y2="17"></line>
                    <line x1="10" y1="7" x2="10" y2="17"></line>
                    <line x1="14" y1="7" x2="14" y2="17"></line>
                  </svg>
                </div>
                <div class="guide-card-content">
                  <h3>电池管理</h3>
                  <p>电池状态监控、健康度检测</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 常见问题和新手专区 - 左右布局 6:4，两个独立框框 -->
        <div class="faq-newbie-container">
          <!-- 常见问题 -->
          <div class="content-box faq-content-box">
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
          </div>

          <!-- 新手专区 -->
          <div class="content-box newbie-content-box">
            <div class="newbie-section">
              <h2 class="section-main-title">新手专区</h2>
              <div class="newbie-cards">
                <div class="newbie-card" @click="goToPage('register')">
                  <svg class="newbie-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                    <path d="M2 2l7.586 7.586"></path>
                    <circle cx="11" cy="11" r="2"></circle>
                  </svg>
                  <div class="newbie-card-content">
                    <h3>新手入门</h3>
                    <p>快速了解 CitySwap 基本功能</p>
                  </div>
                </div>
                
                <div class="newbie-card" @click="goToPage('first-swap')">
                  <svg class="newbie-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                  <div class="newbie-card-content">
                    <h3>首次换电</h3>
                    <p>3 分钟学会完整换电流程</p>
                  </div>
                </div>
                
                <div class="newbie-card" @click="goToPage('payment')">
                  <svg class="newbie-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                  <div class="newbie-card-content">
                    <h3>支付指南</h3>
                    <p>多种支付方式任你选</p>
                  </div>
                </div>
                
                <div class="newbie-card" @click="goToPage('membership')">
                  <svg class="newbie-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <div class="newbie-card-content">
                    <h3>会员福利</h3>
                    <p>开通会员享受专属优惠</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 联系我们 -->
        <div class="content-box">
          <div class="contact-section" id="contact">
            <h2 class="section-main-title">联系我们</h2>
            <div class="contact-methods">
              <div class="contact-item">
                <div class="contact-icon">📞</div>
                <div class="contact-info">
                  <h3>电话咨询</h3>
                  <p>400-888-8888</p>
                  <span>工作日 9:00-18:00</span>
                </div>
              </div>
              
              <div class="contact-item">
                <div class="contact-icon">💬</div>
                <div class="contact-info">
                  <h3>在线客服</h3>
                  <p>实时智能客服</p>
                  <span>7×24 小时服务</span>
                </div>
              </div>
              
              <div class="contact-item">
                <div class="contact-icon">✉️</div>
                <div class="contact-info">
                  <h3>邮件支持</h3>
                  <p>support@cityswap.com</p>
                  <span>24 小时内回复</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 右侧悬浮客服 -->
    <div class="floating-service-container">
      <div class="floating-service">
        <!-- AI 智能助手按钮 -->
        <div class="floating-btn-wrapper" @click="toggleAiAssistant">
          <div class="floating-btn floating-btn-ai" title="AI 智能助手">
            <span style="font-size: 22px;">🤖</span>
          </div>
        </div>
        
        <!-- 评价按钮 - 鼠标悬停显示 -->
        <div class="floating-btn-wrapper" @mouseenter="showRateMenuOnly" @mouseleave="handleRateMouseLeave">
          <div 
            class="floating-btn floating-btn-rate"
          >
            <svg class="floating-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
          </div>
          <div v-show="showRateMenu" class="floating-menu floating-menu-rate" @mouseenter="keepRateMenuOpen" @mouseleave="handleRateMouseLeave">
            <div class="floating-menu-header">
              <div class="header-title-wrapper">
                <h4>您对此文档页面的整体评价？</h4>
                <span v-if="rating !== null" class="rating-emoji happy">
                  😊
                </span>
              </div>
              <span class="close-btn" @click="closeAllMenus">✕</span>
            </div>
            <div class="floating-menu-content rating-form-content">
              <!-- 评分部分 -->
              <div class="rating-section">
                <div class="rating-numbers">
                  <span 
                    v-for="num in 11" 
                    :key="num - 1"
                    :class="['rating-number', { selected: rating === num - 1 }]"
                    @click="setRating(num - 1)"
                  >
                    {{ num - 1 }}
                  </span>
                </div>
                <div class="rating-labels">
                  <span>非常不满意</span>
                  <span>非常满意</span>
                </div>
              </div>

              <!-- 满意原因选择 -->
              <div class="rating-reasons" v-if="rating >= 6">
                <div class="reasons-title"><span class="required">*</span> 您感到满意的原因是？（最多选三项）</div>
                <div class="reasons-grid">
                  <label class="reason-checkbox" v-for="(reason, index) in reasons" :key="index">
                    <input 
                      type="checkbox" 
                      v-model="selectedReasons" 
                      :value="reason"
                      :disabled="selectedReasons.length >= 3 && !selectedReasons.includes(reason)"
                    >
                    <span class="checkbox-text">{{ reason }}</span>
                  </label>
                </div>
              </div>

              <!-- 不满意原因选择 -->
              <div class="rating-reasons" v-if="rating < 6">
                <div class="reasons-title"><span class="required">*</span> 您感到不满意的原因是？（最多选三项）</div>
                <div class="reasons-grid">
                  <label class="reason-checkbox" v-for="(reason, index) in dissatisfactionReasons" :key="index">
                    <input 
                      type="checkbox" 
                      v-model="selectedReasons" 
                      :value="reason"
                      :disabled="selectedReasons.length >= 3 && !selectedReasons.includes(reason)"
                    >
                    <span class="checkbox-text">{{ reason }}</span>
                  </label>
                </div>
              </div>

              <!-- 文本反馈 -->
              <div class="rating-feedback">
                <div class="feedback-title">请针对您所遇到的问题给出具体的反馈</div>
                <textarea 
                  v-model="feedbackText"
                  maxlength="200"
                  placeholder="请输入内容"
                  rows="4"
                ></textarea>
                <div class="feedback-count">{{ feedbackText.length }}/200</div>
              </div>

              <!-- 提交按钮 -->
              <div class="rating-actions">
                <button class="action-btn action-btn-submit" @click="submitRating" :disabled="!canSubmit">提交</button>
                <button class="action-btn action-btn-cancel" @click="cancelRating">取消</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 联系电话按钮 - 鼠标悬停显示 -->
        <div class="floating-btn-wrapper" @mouseenter="showPhoneMenuOnly" @mouseleave="handlePhoneMouseLeave">
          <div 
            class="floating-btn floating-btn-phone"
          >
            <svg class="floating-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          <div v-show="showPhoneMenu" class="floating-menu floating-menu-phone" @mouseenter="keepPhoneMenuOpen" @mouseleave="handlePhoneMouseLeave">
            <div class="floating-menu-header">
              <h4>联系我们</h4>
              <span class="close-btn" @click="closeAllMenus">✕</span>
            </div>
            <div class="floating-menu-content">
              <div class="contact-item-floating">
                <div class="contact-icon-floating no-color">📞</div>
                <div class="contact-info-floating">
                  <h3>联系销售</h3>
                  <p>950808 转 1</p>
                </div>
              </div>
              
              <div class="contact-item-floating">
                <div class="contact-icon-floating no-color">🤖</div>
                <div class="contact-info-floating">
                  <h3>智能客服（已升级为云宝助手）</h3>
                  <p>点击右侧 🤖，直达 AI 助手</p>
                </div>
              </div>
              
              <div class="contact-item-floating">
                <div class="contact-icon-floating no-color">📝</div>
                <div class="contact-info-floating">
                  <h3>建议反馈</h3>
                  <p>您的每一条建议声音，我们都认真对待</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 页脚 -->
    <SiteFooter />
    
    <!-- AI 智能助手 -->
    <AiAssistant ref="aiAssistantRef" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import SiteFooter from '../components/SiteFooter.vue'
import AiAssistant from '../components/AiAssistant.vue'
import { ref as vueRef } from 'vue'

const router = useRouter()
const searchQuery = ref('')
const activeFaq = ref(null)
const showRateMenu = ref(false)
const showPhoneMenu = ref(false)
const rating = ref(null)
const selectedReasons = ref([])
const feedbackText = ref('')

// AI 助手控制
const aiAssistantRef = vueRef(null)
const toggleAiAssistant = () => {
  if (aiAssistantRef.value) {
    aiAssistantRef.value.toggleAssistant()
  }
}

onMounted(() => {
  console.log('=== Help Component Mounted ===')
  // AI 助手已独立为组件，无需在此初始化
})

watch(rating, (newVal) => {
  console.log('Rating changed to:', newVal)
  console.log('Emoji should appear:', newVal !== null)
})

const reasons = ref([
  '内容与产品页面一致',
  '内容易理解',
  '示例代码齐全',
  '步骤可操作',
  '想要的内容易搜到',
  '最佳实践丰富'
])

const dissatisfactionReasons = ref([
  '内容与产品页面不一致',
  '内容难以理解',
  '缺少示例代码',
  '步骤不可操作',
  '想要的内容难搜到',
  '缺乏最佳实践'
])

const faqItems = ref([
  {
    question: '如何注册 CitySwap 账号？',
    answer: '您可以通过 CitySwap APP 或官网进行注册。点击"注册"按钮，输入手机号码获取验证码，设置密码后即可完成注册。注册过程仅需 1-2 分钟。'
  },
  {
    question: '换电流程是怎样的？',
    answer: '换电流程非常简单：1. 通过 APP 查找附近换电站并预约；2. 到达换电站后扫描设备二维码；3. 取出旧电池放入换电柜；4. 从换电柜取出满电电池；5. 在 APP 确认完成换电。整个过程仅需 3-5 分钟。'
  },
  {
    question: '如何支付换电费用？',
    answer: 'CitySwap 支持多种支付方式，包括微信支付、支付宝、银联卡等。您可以在 APP 中绑定 preferred 支付方式，换电完成后系统会自动扣费。会员用户还可享受专属折扣。'
  },
  {
    question: '电池安全如何保障？',
    answer: 'CitySwap 所有电池均经过严格质量检测，并配备智能 BMS 电池管理系统。系统实时监控电池状态，包括温度、电压、电流等参数，确保使用安全。每次换电前都会进行自动检测。'
  },
  {
    question: '会员有哪些专属福利？',
    answer: 'CitySwap 会员可享受多重福利：1. 换电费用专属折扣；2. 优先预约换电；3. 免费电池检测；4. 生日礼包；5. 积分翻倍等。会员分为白银、黄金、铂金三个等级，等级越高福利越多。'
  }
])

const goToPage = (page) => {
  const routes = {
    'register': '/user/register',
    'first-swap': '/user/guide',
    'payment': '/user/payment',
    'membership': '/user/membership',
    'stations': '/user/stations',
    'batteries': '/user/batteries',
    'dashboard': '/user/dashboard'
  }
  if (routes[page]) {
    router.push(routes[page])
  }
}

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index
}

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const toggleRateMenu = () => {
  showRateMenu.value = !showRateMenu.value
  showPhoneMenu.value = false
}

const showRateMenuOnly = () => {
  if (rateMenuTimeout.value) {
    clearTimeout(rateMenuTimeout.value)
    rateMenuTimeout.value = null
  }
  showRateMenu.value = true
  showPhoneMenu.value = false
}

const keepRateMenuOpen = () => {
  // 保持菜单打开
  if (rateMenuTimeout.value) {
    clearTimeout(rateMenuTimeout.value)
    rateMenuTimeout.value = null
  }
}

const rateMenuTimeout = ref(null)

const handleRateMouseLeave = () => {
  rateMenuTimeout.value = setTimeout(() => {
    showRateMenu.value = false
  }, 200)
}

const togglePhoneMenu = () => {
  showPhoneMenu.value = !showPhoneMenu.value
  showRateMenu.value = false
}

const showPhoneMenuOnly = () => {
  if (phoneMenuTimeout.value) {
    clearTimeout(phoneMenuTimeout.value)
    phoneMenuTimeout.value = null
  }
  showPhoneMenu.value = true
  showRateMenu.value = false
}

const keepPhoneMenuOpen = () => {
  // 保持菜单打开
  if (phoneMenuTimeout.value) {
    clearTimeout(phoneMenuTimeout.value)
    phoneMenuTimeout.value = null
  }
}

const phoneMenuTimeout = ref(null)

const handlePhoneMouseLeave = () => {
  phoneMenuTimeout.value = setTimeout(() => {
    showPhoneMenu.value = false
  }, 200)
}

const closeAllMenus = () => {
  showRateMenu.value = false
  showPhoneMenu.value = false
}

const setRating = (value) => {
  rating.value = value
  selectedReasons.value = []
  feedbackText.value = ''
}

const canSubmit = computed(() => {
  // 必须选择评分
  if (rating.value === null) return false
  // 必须选择至少一个原因
  if (selectedReasons.value.length === 0) return false
  return true
})

const cancelRating = () => {
  closeAllMenus()
  rating.value = null
  selectedReasons.value = []
  feedbackText.value = ''
}

const submitRating = () => {
  if (!canSubmit.value) {
    alert('请完成必填项')
    return
  }
  
  alert(`感谢您的评价！
评分：${rating.value}分
原因：${selectedReasons.value.join(', ')}
反馈：${feedbackText.value || '无'}`)
  
  closeAllMenus()
  rating.value = null
  selectedReasons.value = []
  feedbackText.value = ''
}

const startAiChat = () => {
  alert('AI 智能客服功能即将上线，敬请期待！')
}
</script>

<style scoped>
.help-page {
  min-height: 100vh;
  background: linear-gradient(180deg, 
    rgba(200, 240, 245, 0.8) 0%, 
    rgba(220, 230, 250, 0.7) 20%, 
    rgba(230, 220, 255, 0.6) 40%, 
    rgba(245, 245, 255, 0.5) 60%,
    rgba(250, 250, 255, 0.4) 80%,
    rgba(255, 255, 255, 0.3) 100%);
  background-attachment: fixed;
}

.help-banner {
  padding: 80px 20px 60px;
  text-align: center;
  position: relative;
}

.banner-content {
  max-width: 1400px;
  margin: 0 auto;
}

.banner-title {
  font-size: 56px;
  color: #333;
  margin-bottom: 24px;
  font-weight: 700;
  letter-spacing: 2px;
}

.banner-description {
  font-size: 15px;
  color: #555;
  margin-top: 48px;
  margin-bottom: 40px;
  line-height: 1.6;
  max-width: 1600px;
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
  padding: 14px 20px 14px 40px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
  border: none;
}

.search-box:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.search-icon {
  width: 24px;
  height: 24px;
  color: #999;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #333;
  background: transparent;
}

.search-input::placeholder {
  color: #bbb;
}

/* 主内容容器 - 全宽布局 */
.help-main-container {
  max-width: 1700px;
  margin: 0 auto;
  padding: 20px 80px 60px;
}

.help-content-wrapper {
  width: 100%;
}

/* 内容区块容器 - 白色背景 */
.content-box {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 48px 80px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.8);
  margin-bottom: 48px;
}

.content-box:last-child {
  margin-bottom: 0;
}

/* 常见问题和新手专区的框框在容器内无底部间距 */
.faq-content-box,
.newbie-content-box {
  margin-bottom: 0;
}

/* 章节通用样式 */
.quick-nav-section,
.guide-section,
.faq-section,
.newbie-section,
.contact-section {
  margin-bottom: 0;
}

.section-main-title {
  font-size: 40px;
  color: #333;
  margin-bottom: 48px;
  font-weight: 700;
  text-align: center;
  letter-spacing: 1px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

/* 快速导航 */
.quick-nav-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}

.quick-nav-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(200, 200, 200, 0.2);
}

.quick-nav-card:hover {
  transform: translateY(-4px);
  border-color: rgba(100, 150, 200, 0.4);
}

.quick-nav-icon {
  width: 32px;
  height: 32px;
  color: white;
  flex-shrink: 0;
}

.quick-nav-icon-wrapper {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.quick-nav-card:nth-child(2) .quick-nav-icon-wrapper {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.quick-nav-card:nth-child(3) .quick-nav-icon-wrapper {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.quick-nav-card:nth-child(4) .quick-nav-icon-wrapper {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.quick-nav-card-content {
  flex: 1;
  min-width: 0;
}

.quick-nav-card h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 6px;
  font-weight: 600;
}

.quick-nav-card p {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

/* 使用指南 */
.guide-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.guide-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(200, 200, 200, 0.2);
}

.guide-card:hover {
  transform: translateY(-4px);
  border-color: rgba(100, 150, 200, 0.4);
}

.guide-card-icon {
  width: 32px;
  height: 32px;
  color: white;
  flex-shrink: 0;
}

.guide-card-icon-wrapper {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.guide-card:nth-child(2) .guide-card-icon-wrapper {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.guide-card:nth-child(3) .guide-card-icon-wrapper {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.guide-card:nth-child(4) .guide-card-icon-wrapper {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.guide-card:nth-child(5) .guide-card-icon-wrapper {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.guide-card:nth-child(6) .guide-card-icon-wrapper {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.guide-card-content {
  flex: 1;
  min-width: 0;
}

.guide-card h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 6px;
  font-weight: 600;
}

.guide-card p {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

/* 常见问题和新手专区容器 - 6:4 布局 */
.faq-newbie-container {
  display: grid;
  grid-template-columns: 6fr 4fr;
  gap: 40px;
  margin-bottom: 48px;
}

.faq-content-box,
.newbie-content-box {
  min-width: 0;
}

/* 常见问题 */
.faq-section {
  margin-bottom: 0;
}

.faq-section .section-main-title {
  text-align: center;
  margin-bottom: 40px;
}

.faq-list {
  max-width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.faq-item {
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(200, 200, 200, 0.3);
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-item:hover {
  border-color: rgba(100, 150, 200, 0.5);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.faq-question {
  padding: 20px 24px;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
}

.toggle-icon {
  font-size: 24px;
  color: #999;
  transition: transform 0.3s ease;
}

.faq-item.active .toggle-icon {
  transform: rotate(45deg);
}

.faq-answer {
  padding: 0 24px 20px;
  font-size: 15px;
  color: #666;
  line-height: 1.8;
  border-top: 1px solid rgba(200, 200, 200, 0.2);
  margin-top: 0;
  padding-top: 16px;
}

/* 新手专区 */
.newbie-section {
  margin-bottom: 0;
}

.newbie-section .section-main-title {
  text-align: center;
  margin-bottom: 40px;
}

.newbie-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.newbie-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(200, 200, 200, 0.2);
}

.newbie-card:hover {
  transform: translateY(-4px);
  border-color: rgba(100, 150, 200, 0.4);
}

.newbie-card-icon {
  width: 40px;
  height: 40px;
  color: #999;
  flex-shrink: 0;
}

.newbie-card-content {
  flex: 1;
  min-width: 0;
}

.newbie-card h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 6px;
  font-weight: 600;
}

.newbie-card p {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

/* 联系我们 */
.contact-methods {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.contact-item {
  background: white;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  border: 1px solid rgba(200, 200, 200, 0.2);
  transition: all 0.3s ease;
}

.contact-item:hover {
  transform: translateY(-4px);
  border-color: rgba(100, 150, 200, 0.4);
}

.contact-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.contact-info h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 12px;
  font-weight: 600;
}

.contact-info p {
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}

.contact-info span {
  font-size: 13px;
  color: #999;
}

/* 右侧悬浮客服 */
.floating-service-container {
  position: fixed;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
}

.floating-service {
  background: white;
  border-radius: 12px;
  padding: 12px 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(200, 200, 200, 0.2);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.floating-btn-wrapper {
  position: relative;
}

.floating-btn {
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.floating-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.floating-btn.floating-btn-ai {
  background: white;
}

.floating-btn.floating-btn-rate {
  background: white;
}

.floating-btn.floating-btn-rate:hover {
  background: #f5f5f5;
  border-color: #edbcc3;
}

.floating-icon {
  width: 24px;
  height: 24px;
  color: #333;
  flex-shrink: 0;
}

/* 悬浮菜单 - 通用样式 */
.floating-menu {
  position: absolute;
  right: 64px;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  border: none;
  overflow: hidden;
  animation: slideIn 0.3s ease;
}

/* AI 客服菜单 - 紧凑型 */
.floating-menu-ai {
  min-width: 400px;
  max-width: 400px;
}

/* 评价菜单 - 宽大型 */
.floating-menu-rate {
  min-width: 680px;
  max-width: 680px;
}

/* 电话/联系菜单 - 中等型 */
.floating-menu-phone {
  min-width: 500px;
  max-width: 500px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-50%) translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}

/* AI 客服菜单 - 带渐变头部 */
.floating-menu-ai .floating-menu-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #ffdde1 0%, #ee9ca7 100%);
}

.floating-menu-ai .floating-menu-header h4 {
  font-size: 16px;
  color: white;
  font-weight: 600;
  margin: 0;
}

.floating-menu-ai .close-btn {
  color: rgba(255, 255, 255, 0.8);
}

.floating-menu-ai .close-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.2);
}

.floating-menu-ai .floating-menu-content {
  padding: 24px;
}

.floating-menu-header h4 {
  font-size: 16px;
  color: #333;
  font-weight: 600;
  margin: 0;
}

/* 评价菜单 - 白色头部 */
.floating-menu-rate .floating-menu-header {
  padding: 20px 32px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
}

.floating-menu-rate .floating-menu-header h4 {
  font-size: 16px;
  color: #333;
  font-weight: 600;
  margin: 0;
}

.floating-menu-rate .close-btn {
  font-size: 22px;
  color: #999;
  cursor: pointer;
  transition: color 0.3s ease;
  line-height: 1;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.floating-menu-rate .close-btn:hover {
  color: #333;
  background: #f5f5f5;
}

.floating-menu-rate .floating-menu-content {
  padding: 24px 32px 28px 32px;
}

/* 评价菜单标题包装器 */
.floating-menu-rate .header-title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.floating-menu-rate .rating-emoji {
  font-size: 24px;
  animation: popIn 0.3s ease;
}

@keyframes popIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* 电话菜单 - 简洁白色 */
.floating-menu-phone .floating-menu-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
}

.floating-menu-phone .floating-menu-header h4 {
  font-size: 16px;
  color: #333;
  font-weight: 600;
  margin: 0;
}

.floating-menu-phone .floating-menu-content {
  padding: 20px 24px;
}

/* AI 客服菜单 */
.ai-service-item {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.ai-avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(135deg, #ffdde1 0%, #ee9ca7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ai-avatar-large.no-color {
  background: transparent;
  border: 1px solid rgba(200, 200, 200, 0.5);
}

.ai-avatar-large svg {
  width: 28px;
  height: 28px;
  color: white;
}

.ai-avatar-large.no-color svg {
  color: #666;
}

.ai-info h3 {
  font-size: 15px;
  color: #1a1a1a;
  margin-bottom: 6px;
  font-weight: 600;
}

.ai-info p {
  font-size: 13px;
  color: #333;
  margin: 0;
}

.ai-start-btn {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ai-start-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* 评价菜单 */
.rating-section {
  margin-bottom: 24px;
}

.rating-numbers {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 16px;
}

.rating-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.rating-number:hover {
  border-color: #52c41a;
  color: #52c41a;
}

.rating-number.selected {
  background: #52c41a;
  color: white;
  border-color: #52c41a;
}

.rating-emoji-score {
  font-size: 20px;
}

.rating-emoji-score.selected {
  background: #52c41a;
  border-color: #52c41a;
  animation: popIn 0.3s ease;
}

.rating-labels {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #999;
  margin-top: 10px;
}

/* 评价表单样式 */
.rating-form-content {
  min-width: 680px;
  max-width: 680px;
  padding: 0;
}

.rating-section {
  margin-bottom: 32px;
}

.required {
  color: #ff4d4f;
  margin-right: 4px;
}

.reasons-title {
  font-size: 14px;
  color: #1a1a1a;
  margin-bottom: 16px;
  font-weight: 500;
  line-height: 1.5;
}

.reasons-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 20px;
  margin-bottom: 24px;
}

.reason-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #1a1a1a;
  transition: all 0.3s ease;
  padding: 0;
  background: transparent;
}

.reason-checkbox:hover {
  color: #000000;
}

.reason-checkbox:hover input[type="checkbox"] {
  border-color: #000000;
}

.reason-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 1px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  appearance: none;
  -webkit-appearance: none;
  background: white;
  transition: all 0.2s ease;
  position: relative;
}

.reason-checkbox input[type="checkbox"]:checked {
  background: #000000;
  border-color: #000000;
}

.reason-checkbox input[type="checkbox"]:checked::after {
  content: '✓';
  position: absolute;
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.reason-checkbox input[type="checkbox"]:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.checkbox-text {
  line-height: 1.6;
  user-select: none;
}

.rating-feedback {
  margin-bottom: 24px;
}

.feedback-title {
  font-size: 14px;
  color: #1a1a1a;
  margin-bottom: 12px;
  font-weight: 500;
}

.rating-feedback textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  color: #1a1a1a;
  resize: none;
  font-family: inherit;
  transition: all 0.3s ease;
  box-sizing: border-box;
  min-height: 100px;
  background: white;
}

.rating-feedback textarea:focus {
  outline: none;
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.rating-feedback textarea::placeholder {
  color: #bfbfbf;
}

.feedback-count {
  text-align: right;
  font-size: 12px;
  color: #666;
  margin-top: 8px;
}

.rating-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-start;
  align-items: center;
  margin-top: 28px;
  padding-top: 0;
  border-top: none;
}

.action-btn {
  padding: 10px 32px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #d9d9d9;
  background: white;
  min-width: 100px;
  flex: 0 0 auto;
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.action-btn-cancel {
  color: #666;
  border-color: #d9d9d9;
  background: white;
}

.action-btn-cancel:hover {
  border-color: #999;
  color: #333;
}

.action-btn-submit {
  background: #1890ff;
  color: white;
  border: none;
}

.action-btn-submit:hover:not(:disabled) {
  background: #40a9ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.action-btn-submit:disabled {
  background: #f5f5f5;
  color: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  border: 1px solid #d9d9d9;
}

.submit-rating-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-rating-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

/* 电话菜单 */
.contact-item-floating {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  transition: background 0.3s ease;
}

.contact-item-floating:hover {
  background: #fafafa;
}

.contact-icon-floating {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 20px;
}

.contact-icon-floating.no-color {
  background: #fafafa;
  border: 1px solid #e8e8e8;
  font-size: 18px;
}

.contact-icon-floating svg {
  width: 22px;
  height: 22px;
  color: white;
}

.contact-icon-floating.no-color svg {
  color: #666;
}

.contact-info-floating {
  flex: 1;
  min-width: 0;
}

.contact-info-floating h3 {
  font-size: 15px;
  color: #1a1a1a;
  margin-bottom: 6px;
  font-weight: 600;
}

.contact-info-floating p {
  font-size: 13px;
  color: #333;
  margin: 0;
  line-height: 1.4;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .quick-nav-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .guide-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .contact-methods {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 992px) {
  .faq-newbie-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .faq-content-box,
  .newbie-content-box {
    margin-bottom: 0;
  }
  
  .faq-section {
    padding-right: 0;
  }
  
  .newbie-section {
    padding-left: 0;
  }
  
  .help-main-container {
    padding: 20px 40px 40px;
  }
  
  .content-box {
    padding: 40px 48px;
  }
}

@media (max-width: 768px) {
  .banner-title {
    font-size: 36px;
  }
  
  .banner-description {
    font-size: 14px;
  }
  
  .section-main-title {
    font-size: 28px;
  }
  
  .quick-nav-grid {
    grid-template-columns: 1fr;
  }
  
  .guide-cards {
    grid-template-columns: 1fr;
  }
  
  .help-main-container {
    padding: 20px 20px 30px;
  }
  
  .content-box {
    padding: 32px 24px;
  }
  
  .floating-service {
    right: 16px;
  }
  
  .floating-btn {
    width: 48px;
    height: 48px;
  }
}
</style>
