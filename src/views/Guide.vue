<template>
  <div class="guide">
    <div class="page-header">
      <h1>使用指南</h1>
      <p>快速了解如何使用 CitySwap 换电系统</p>
    </div>

    <div class="guide-content">
      <!-- 快速入门 -->
      <div class="guide-section">
        <h2>🚀 快速入门</h2>
        <div class="guide-steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>注册账号</h3>
              <p>点击首页右上角的"登录"按钮，进入登录页面后选择"注册账号"，填写相关信息完成注册</p>
            </div>
          </div>
          
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>添加车辆</h3>
              <p>登录后进入"控制台"，点击"我的车辆"，添加您的第一辆车，填写车辆信息</p>
            </div>
          </div>
          
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>添加电池</h3>
              <p>在"我的电池"页面添加电池信息，绑定到您的车辆</p>
            </div>
          </div>
          
          <div class="step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>开始使用</h3>
              <p>通过"换电地图"查找附近的换电站点，享受便捷的换电服务</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 功能说明 -->
      <div class="guide-section">
        <h2>📋 功能说明</h2>
        <div class="feature-list">
          <div class="feature-doc">
            <div class="feature-icon">🚗</div>
            <div class="feature-doc-content">
              <h3>我的车辆</h3>
              <p>查看和管理您名下的所有车辆，包括车辆状态、位置信息等</p>
              <ul>
                <li>实时查看车辆在线状态</li>
                <li>查看车辆基本信息</li>
                <li>管理车辆绑定关系</li>
              </ul>
            </div>
          </div>
          
          <div class="feature-doc">
            <div class="feature-icon">🔋</div>
            <div class="feature-doc-content">
              <h3>我的电池</h3>
              <p>管理您的电池设备，监控电池健康状态和电量</p>
              <ul>
                <li>实时电量监控</li>
                <li>电池健康度分析</li>
                <li>充放电记录查询</li>
              </ul>
            </div>
          </div>
          
          <div class="feature-doc">
            <div class="feature-icon">🗺️</div>
            <div class="feature-doc-content">
              <h3>换电地图</h3>
              <p>查找附近的换电站点，查看站点实时信息</p>
              <ul>
                <li>站点位置导航</li>
                <li>电池库存查询</li>
                <li>站点繁忙度显示</li>
              </ul>
            </div>
          </div>
          
          <div class="feature-doc">
            <div class="feature-icon">🔔</div>
            <div class="feature-doc-content">
              <h3>我的报警</h3>
              <p>查看和管理所有报警信息，及时处理异常情况</p>
              <ul>
                <li>实时报警推送</li>
                <li>报警历史记录</li>
                <li>报警处理跟踪</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- 常见问题 -->
      <div class="guide-section">
        <h2>❓ 常见问题</h2>
        <div class="faq-list">
          <div class="faq-item">
            <h3>如何更换电池？</h3>
            <p>在"换电地图"中找到附近的换电站点，前往站点后按照操作指引完成换电。系统会自动记录换电信息。</p>
          </div>
          
          <div class="faq-item">
            <h3>电池报警如何处理？</h3>
            <p>收到报警后，在"我的报警"页面查看详情。根据报警类型，可能需要联系站点工作人员或等待系统自动恢复。</p>
          </div>
          
          <div class="faq-item">
            <h3>如何查看用电统计？</h3>
            <p>在"我的电池"页面点击具体电池，可以查看详细的历史记录和用电统计分析。</p>
          </div>
          
          <div class="faq-item">
            <h3>支持哪些支付方式？</h3>
            <p>目前支持微信支付、支付宝和银行卡支付。在个人中心可以绑定支付方式。</p>
          </div>
        </div>
      </div>

      <!-- 联系我们 -->
      <div class="guide-section">
        <h2>📞 需要帮助？</h2>
        <div class="contact-info">
          <p>如果您在使用过程中遇到任何问题，欢迎通过以下方式联系我们：</p>
          <div class="contact-methods">
            <div class="contact-item">
              <span class="contact-icon">📧</span>
              <div>
                <strong>客服邮箱</strong>
                <p>support@cityswap.com</p>
              </div>
            </div>
            <div class="contact-item">
              <span class="contact-icon">📱</span>
              <div>
                <strong>客服热线</strong>
                <p>400-123-4567</p>
              </div>
            </div>
            <div class="contact-item">
              <span class="contact-icon">💬</span>
              <div>
                <strong>在线客服</strong>
                <p>工作日 9:00-18:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 页脚 -->
    <SiteFooter />
  </div>
</template>

<script setup>
// 指引页面
import SiteFooter from '../components/SiteFooter.vue'
</script>

<style scoped>
.guide {
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
  padding: 40px 20px;
}

.page-header {
  max-width: 1200px;
  margin: 0 auto 60px;
  text-align: center;
}

.page-header h1 {
  font-size: 48px;
  color: #333;
  margin: 0 0 16px 0;
}

/* 深色模式下，标题变成黑色（因为背景是浅色渐变） */
html.dark-mode .page-header h1 {
  color: #333333 !important;
}

.page-header p {
  font-size: 20px;
  color: #666;
  margin: 0;
}

/* 深色模式下，描述变成黑色（因为背景是浅色渐变） */
html.dark-mode .page-header p {
  color: #666666 !important;
}

.guide-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.guide-section {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

/* 深色模式下，内容卡片变成纯黑色 */
html.dark-mode .guide-section {
  background: #000000;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

.guide-section h2 {
  font-size: 32px;
  color: #333;
  margin: 0 0 32px 0;
  padding-bottom: 16px;
  border-bottom: 2px solid #F5F5F5;
}

/* 深色模式下，章节标题变成白色（因为在黑色卡片上） */
html.dark-mode .guide-section h2 {
  color: #ffffff !important;
  border-bottom-color: #333;
}

/* 快速入门步骤 */
.guide-steps {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.step {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.step-number {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0066cc 0%, #00cc99 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  flex-shrink: 0;
}

.step-content h3 {
  font-size: 20px;
  color: #333;
  margin: 0 0 8px 0;
}

/* 深色模式下，步骤标题变成白色（因为在黑色卡片上） */
html.dark-mode .step-content h3 {
  color: #ffffff !important;
}

.step-content p {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* 深色模式下，步骤描述变成白色（因为在黑色卡片上） */
html.dark-mode .step-content p {
  color: #ffffff !important;
}

/* 功能说明 */
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.feature-icon {
  font-size: 48px;
  flex-shrink: 0;
}

.feature-doc {
  display: flex;
  gap: 24px;
  padding: 24px;
  background: #F5F5F5;
  border-radius: 12px;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 深色模式下，功能卡片背景变纯黑色，文字变白色，加白色边框 */
html.dark-mode .feature-doc {
  background: #000000;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
}

/* 深色模式下，功能标题变白色 */
html.dark-mode .feature-doc-content h3 {
  color: #ffffff !important;
}

/* 深色模式下，功能描述变白色 */
html.dark-mode .feature-doc-content p {
  color: #ffffff !important;
}

/* 深色模式下，列表文字变白色 */
html.dark-mode .feature-doc-content li {
  color: #ffffff !important;
}

/* 常见问题 */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.faq-item {
  padding: 24px;
  background: #F5F5F5;
  border-radius: 12px;
  border-left: 4px solid #0066cc;
}

/* 深色模式下，FAQ 卡片变成纯黑色 */
html.dark-mode .faq-item {
  background: #000000;
}

.faq-item h3 {
  font-size: 18px;
  color: #333;
  margin: 0 0 12px 0;
}

/* 深色模式下，FAQ 标题变成白色（因为在黑色卡片上） */
html.dark-mode .faq-item h3 {
  color: #ffffff !important;
}

.faq-item p {
  font-size: 15px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* 深色模式下，FAQ 描述变成白色（因为在黑色卡片上） */
html.dark-mode .faq-item p {
  color: #ffffff !important;
}

/* 联系我们 */
.contact-info p {
  font-size: 16px;
  color: #666;
  margin: 0 0 24px 0;
}

/* 深色模式下，联系说明变成白色（因为在黑色卡片上） */
html.dark-mode .contact-info p {
  color: #ffffff !important;
}

.contact-methods {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}

.contact-item {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 20px;
  background: #F5F5F5;
  border-radius: 12px;
  flex: 1;
  min-width: 200px;
}

/* 深色模式下，联系卡片变成纯黑色 */
html.dark-mode .contact-item {
  background: #000000;
}

.contact-icon {
  font-size: 36px;
}

.contact-item strong {
  display: block;
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
}

/* 深色模式下，联系标题变成白色（因为在黑色卡片上） */
html.dark-mode .contact-item strong {
  color: #ffffff !important;
}

.contact-item p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

/* 深色模式下，联系描述变成白色（因为在黑色卡片上） */
html.dark-mode .contact-item p {
  color: #ffffff !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .guide {
    padding: 20px 16px;
  }
  
  .page-header h1 {
    font-size: 32px;
  }
  
  .guide-section {
    padding: 24px;
  }
  
  .guide-section h2 {
    font-size: 24px;
  }
  
  .step {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .feature-doc {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .contact-methods {
    flex-direction: column;
  }
}
</style>
