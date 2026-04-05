<template>
  <div class="help-page">
    <div class="help-container">
      <div class="page-header">
        <h1>帮助中心</h1>
        <p>常见问题、使用教程和联系方式</p>
      </div>

      <!-- 搜索框 -->
      <div class="search-section">
        <div class="search-box">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="搜索问题或关键词..."
            class="search-input"
          />
        </div>
      </div>

      <!-- 快速分类 -->
      <div class="quick-categories">
        <div class="category-card" @click="scrollToSection('faq')">
          <div class="category-icon">❓</div>
          <h3>常见问题</h3>
          <p>快速找到答案</p>
        </div>
        <div class="category-card" @click="scrollToSection('guide')">
          <div class="category-icon">📖</div>
          <h3>使用教程</h3>
          <p>详细操作指南</p>
        </div>
        <div class="category-card" @click="scrollToSection('contact')">
          <div class="category-icon">💬</div>
          <h3>联系我们</h3>
          <p>获取人工帮助</p>
        </div>
      </div>

      <!-- 常见问题 -->
      <div id="faq" class="section">
        <h2 class="section-title">常见问题</h2>
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

      <!-- 使用教程 -->
      <div id="guide" class="section">
        <h2 class="section-title">使用教程</h2>
        <div class="guide-grid">
          <div class="guide-card">
            <div class="guide-icon">🚗</div>
            <h3>首次使用</h3>
            <p>如何注册并完成首次换电</p>
            <button class="btn-link" @click="viewGuide('first')">查看详情</button>
          </div>
          <div class="guide-card">
            <div class="guide-icon">🔋</div>
            <h3>预约换电</h3>
            <p>提前预约，节省等待时间</p>
            <button class="btn-link" @click="viewGuide('book')">查看详情</button>
          </div>
          <div class="guide-card">
            <div class="guide-icon">💳</div>
            <h3>支付流程</h3>
            <p>多种支付方式，安全便捷</p>
            <button class="btn-link" @click="viewGuide('pay')">查看详情</button>
          </div>
          <div class="guide-card">
            <div class="guide-icon">⚠️</div>
            <h3>问题处理</h3>
            <p>遇到问题怎么办</p>
            <button class="btn-link" @click="viewGuide('issue')">查看详情</button>
          </div>
        </div>
      </div>

      <!-- 联系方式 -->
      <div id="contact" class="section">
        <h2 class="section-title">联系我们</h2>
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

        <!-- 在线留言 -->
        <div class="contact-form-section">
          <h3>在线留言</h3>
          <form @submit.prevent="handleSubmit" class="contact-form">
            <div class="form-row">
              <div class="form-group">
                <label>姓名</label>
                <input 
                  v-model="formData.name" 
                  type="text" 
                  placeholder="请输入您的姓名"
                  required
                />
              </div>
              <div class="form-group">
                <label>邮箱</label>
                <input 
                  v-model="formData.email" 
                  type="email" 
                  placeholder="请输入您的邮箱"
                  required
                />
              </div>
            </div>
            <div class="form-group">
              <label>主题</label>
              <input 
                v-model="formData.subject" 
                type="text" 
                placeholder="请输入主题"
                required
              />
            </div>
            <div class="form-group">
              <label>留言内容</label>
              <textarea 
                v-model="formData.message" 
                rows="6" 
                placeholder="请输入您的留言内容"
                required
              ></textarea>
            </div>
            <button type="submit" class="submit-btn">
              提交留言
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index
}

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const viewGuide = (type) => {
  alert('查看教程：' + type)
}

const startChat = () => {
  alert('正在连接在线客服...')
}

const handleSubmit = () => {
  alert('感谢您的留言！我们会尽快与您联系。')
  formData.value = {
    name: '',
    email: '',
    subject: '',
    message: ''
  }
}
</script>

<style scoped>
.help-page {
  min-height: calc(100vh - 80px);
  background: #f5f7fa;
  padding: 40px 20px;
}

.help-container {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #0066cc 0%, #00cc99 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-header p {
  color: #666;
  font-size: 14px;
}

.search-section {
  margin-bottom: 40px;
}

.search-box {
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 16px 24px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 4px 16px rgba(0, 102, 204, 0.15);
}

.quick-categories {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.category-card {
  background: white;
  padding: 30px 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.category-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.category-card h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 8px;
}

.category-card p {
  font-size: 14px;
  color: #666;
}

.section {
  margin-bottom: 50px;
}

.section-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 24px;
  padding-left: 16px;
  border-left: 4px solid #0066cc;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.faq-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  transition: all 0.3s;
}

.faq-question:hover {
  background: #f5f7fa;
}

.toggle-icon {
  font-size: 24px;
  color: #0066cc;
  font-weight: 300;
}

.faq-answer {
  padding: 0 20px 20px;
  color: #666;
  line-height: 1.8;
  font-size: 14px;
  white-space: pre-line;
}

.guide-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.guide-card {
  background: white;
  padding: 30px 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.guide-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.guide-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.guide-card h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 8px;
}

.guide-card p {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.btn-link {
  color: #0066cc;
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
}

.btn-link:hover {
  text-decoration: underline;
}

.contact-methods {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.contact-card {
  background: white;
  padding: 30px 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.contact-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.contact-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.contact-card h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 8px;
}

.contact-card p {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.contact-card .desc {
  font-size: 12px;
  color: #999;
}

.btn-primary {
  margin-top: 12px;
  padding: 10px 24px;
  background: linear-gradient(135deg, #0066cc 0%, #00cc99 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.4);
}

.contact-form-section {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.contact-form-section h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 30px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.form-group textarea {
  resize: vertical;
}

.submit-btn {
  padding: 14px 32px;
  background: linear-gradient(135deg, #0066cc 0%, #00cc99 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 8px rgba(0, 102, 204, 0.3);
  align-self: flex-start;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 102, 204, 0.4);
}

@media (max-width: 968px) {
  .quick-categories,
  .guide-grid,
  .contact-methods {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .quick-categories,
  .guide-grid,
  .contact-methods {
    grid-template-columns: 1fr;
  }

  .contact-form-section {
    padding: 20px;
  }
}
</style>
