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
  min-height: calc(100vh - 80px);
  background: #f5f7fa;
  padding: 40px 20px;
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
}

.contact-header p {
  font-size: 16px;
  color: #666;
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

.method-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.method-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.method-card h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

.method-card p {
  font-size: 14px;
  color: #666;
}

.contact-form-section {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.contact-form-section h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 30px;
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
}

.form-group input,
.form-group textarea {
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
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
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 102, 204, 0.3);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 102, 204, 0.4);
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
