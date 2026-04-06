<template>
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-content">
        <!-- 左侧：联系信息 -->
        <div class="footer-section">
          <h3>联系我们</h3>
          <div class="contact-info">
            <p><strong>客服电话：</strong>400-888-8888</p>
            <p><strong>工作时间：</strong>周一至周五 9:00-18:00</p>
            <p><strong>电子邮箱：</strong>support@cityswap.com</p>
          </div>
          <div class="social-links">
            <a href="#" class="social-icon">微信</a>
            <a href="#" class="social-icon">微博</a>
            <a href="#" class="social-icon">抖音</a>
          </div>
        </div>
        
        <!-- 中间：快速链接 -->
        <div class="footer-section">
          <h3>快速链接</h3>
          <ul class="footer-links">
            <li><a href="https://github.com" target="_blank" rel="noopener">GitHub 开源</a></li>
            <li><a href="https://zhuanlan.zhihu.com/" target="_blank" rel="noopener">知乎专栏</a></li>
            <li><a href="https://www.bilibili.com/" target="_blank" rel="noopener">哔哩哔哩</a></li>
            <li><a href="https://www.yuque.com/" target="_blank" rel="noopener">语雀文档</a></li>
          </ul>
        </div>
        
        <!-- 右侧：行业链接（2 列显示） -->
        <div class="footer-section">
          <h3>行业资源</h3>
          <ul class="footer-links">
            <li><a href="https://www.evchina.org/" target="_blank" rel="noopener">中国电动汽车百人会</a></li>
            <li><a href="http://www.catl.com/" target="_blank" rel="noopener">宁德时代新能源</a></li>
            <li><a href="https://www.nio.com/" target="_blank" rel="noopener">蔚来汽车 - 换电服务</a></li>
            <li><a href="https://www.byd.com/" target="_blank" rel="noopener">比亚迪汽车</a></li>
            <li><a href="http://www.china-nev.com/" target="_blank" rel="noopener">第一电动网</a></li>
            <li><a href="https://www.xinhuanet.com/auto/" target="_blank" rel="noopener">新华网汽车</a></li>
            <li><a href="http://www.miit.gov.cn/" target="_blank" rel="noopener">工业和信息化部</a></li>
            <li><a href="https://www.ndrc.gov.cn/" target="_blank" rel="noopener">国家发展和改革委员会</a></li>
          </ul>
        </div>
      </div>
      
      <!-- 底部版权信息 -->
      <div class="footer-bottom">
        <div class="footer-info">
          <p>&copy; 2024 CitySwap. 保留所有权利.</p>
          <p>地址：北京市朝阳区科技园区创新大厦 8 层 | 京 ICP 备 12345678 号</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// 页脚组件，无逻辑
</script>

<style scoped>
/* 页脚样式 */
.site-footer {
  background: #1a1a1a;
  color: #ccc;
  padding: 60px 20px 30px;
  margin-top: 80px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-bottom: 40px;
}

.footer-section h3 {
  color: white;
  font-size: 18px;
  margin: 0 0 20px 0;
  font-weight: 600;
}

.contact-info p {
  margin: 12px 0;
  font-size: 15px;
  line-height: 1.6;
}

.social-links {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.social-icon {
  display: inline-block;
  padding: 8px 16px;
  background: #333;
  color: #ccc;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.social-icon:hover {
  background: #0066cc;
  color: white;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* 行业资源链接分两列显示 */
.footer-section:last-child .footer-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px 16px;
}

.footer-links li {
  margin-bottom: 12px;
}

/* 行业资源链接不需要底部边距 */
.footer-section:last-child .footer-links li {
  margin-bottom: 0;
}

.footer-links a {
  color: #ccc;
  text-decoration: none;
  font-size: 15px;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: white;
}

.footer-bottom {
  border-top: 1px solid #333;
  padding-top: 24px;
  text-align: center;
}

.footer-info p {
  margin: 8px 0;
  font-size: 14px;
  color: #999;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .site-footer {
    padding: 40px 15px 20px;
    margin-top: 40px;
  }
  
  /* 移动端行业资源恢复单列 */
  .footer-section:last-child .footer-links {
    display: block;
  }
}
</style>
