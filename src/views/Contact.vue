<template>
  <div class="contact-page">
    <div class="contact-container">
      <div class="contact-header">
        <h1>联系我们</h1>
        <p>如果您有任何问题或建议，请随时与我们联系</p>
      </div>

      <div class="contact-content">
        <!-- 联系方式 -->
        <div class="contact-methods">
          <div class="method-card">
            <div class="method-icon">📧</div>
            <h3>电子邮件</h3>
            <p>support@cityswap.com</p>
          </div>

          <div class="method-card">
            <div class="method-icon">📱</div>
            <h3>客服电话</h3>
            <p>400-123-4567</p>
          </div>

          <div class="method-card">
            <div class="method-icon">💬</div>
            <h3>在线客服</h3>
            <p>工作日 9:00-18:00</p>
          </div>

          <div class="method-card">
            <div class="method-icon">📍</div>
            <h3>公司地址</h3>
            <p>北京市朝阳区科技园 A 座</p>
          </div>
        </div>

        <!-- 联系表单 -->
        <div class="contact-form-section">
          <h2>在线留言</h2>
          <form @submit.prevent="handleSubmit" class="contact-form">
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
    
    <!-- 页脚 -->
    <SiteFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SiteFooter from '../components/SiteFooter.vue'

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

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
.contact-page {
  min-height: 100vh;
  /* 使用控制台风格的渐变背景 */
  background: linear-gradient(180deg, 
    rgba(200, 240, 245, 0.8) 0%, 
    rgba(220, 230, 250, 0.7) 20%, 
    rgba(230, 220, 255, 0.6) 40%, 
    rgba(245, 245, 255, 0.5) 60%,
    rgba(250, 250, 255, 0.4) 80%,
    rgba(255, 255, 255, 0.3) 100%);
  background-attachment: fixed;
  padding: 20px 20px 40px;
  transition: background-color 0.3s ease;
}

/* 深色模式下，背景保持不变，内容卡片变深色 */
html.dark-mode .contact-page {
  background: linear-gradient(180deg, 
    rgba(200, 240, 245, 0.8) 0%, 
    rgba(220, 230, 250, 0.7) 20%, 
    rgba(230, 220, 255, 0.6) 40%, 
    rgba(245, 245, 255, 0.5) 60%,
    rgba(250, 250, 255, 0.4) 80%,
    rgba(255, 255, 255, 0.3) 100%);
}

.contact-container {
  max-width: 1200px;
  margin: 0 auto;
}

.contact-header {
  text-align: center;
  margin-bottom: 40px;
}

.contact-header h1 {
  font-size: 36px;
  color: #333;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #0066cc 0%, #00cc99 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: color 0.3s ease;
  line-height: 1.4;
}

/* 深色模式下，标题保持深色（在渐变背景上） */
html.dark-mode .contact-header h1 {
  color: #333 !important;
  background: linear-gradient(135deg, #0066cc 0%, #00cc99 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.contact-header p {
  font-size: 16px;
  color: #666;
  transition: color 0.3s ease;
  line-height: 1.6;
}

/* 深色模式下，描述文字保持深色（在渐变背景上） */
html.dark-mode .contact-header p {
  color: #666 !important;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.contact-methods {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.method-card {
  background: white;
  padding: 30px 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

/* 深色模式下，卡片变深色（纯黑色） */
html.dark-mode .method-card {
  background: #000000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}

.method-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

/* 深色模式下，hover 效果 */
html.dark-mode .method-card:hover {
  box-shadow: 0 8px 16px rgba(255, 255, 255, 0.1);
}

.method-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.method-card h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
  transition: color 0.3s ease;
}

/* 深色模式下，卡片标题变白色 */
html.dark-mode .method-card h3 {
  color: #ffffff !important;
}

.method-card p {
  font-size: 14px;
  color: #666;
  transition: color 0.3s ease;
}

/* 深色模式下，卡片描述变白色 */
html.dark-mode .method-card p {
  color: #ffffff !important;
}

.contact-form-section {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

/* 深色模式下，表单区域变深色 */
html.dark-mode .contact-form-section {
  background: #000000;
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.1);
  border: 2px solid #ffffff;
}

.contact-form-section h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 30px;
  transition: color 0.3s ease;
}

/* 深色模式下，表单标题变白色 */
html.dark-mode .contact-form-section h2 {
  color: #ffffff !important;
}

.contact-form {
  display: flex;
  flex-direction: column;
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
  transition: color 0.3s ease;
}

/* 深色模式下，标签变白色 */
html.dark-mode .form-group label {
  color: #ffffff !important;
}

.form-group input,
.form-group textarea {
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  font-family: inherit;
  background: white;
  color: #333;
}

/* 深色模式下，输入框变深色 */
html.dark-mode .form-group input,
html.dark-mode .form-group textarea {
  background: #1a1a2e;
  border-color: #444;
  color: #ffffff;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

/* 深色模式下，focus 效果 */
html.dark-mode .form-group input:focus,
html.dark-mode .form-group textarea:focus {
  border-color: #4facfe;
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.2);
}

.form-group textarea {
  resize: vertical;
}

.submit-btn {
  padding: 14px 32px;
  background: #000000;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}

/* 深色模式下，按钮变白色背景 + 黑色文字 */
html.dark-mode .submit-btn {
  background: #ffffff;
  color: #000000;
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.3);
}

html.dark-mode .submit-btn:hover {
  box-shadow: 0 6px 12px rgba(255, 255, 255, 0.4);
}

/* 响应式 */
@media (max-width: 968px) {
  .contact-content {
    grid-template-columns: 1fr;
  }

  .contact-methods {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .contact-methods {
    grid-template-columns: 1fr;
  }

  .contact-form-section {
    padding: 20px;
  }
}
</style>
