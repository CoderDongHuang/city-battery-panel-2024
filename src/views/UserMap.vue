<template>
  <div class="user-map">
    <div class="page-header">
      <h1>换电地图</h1>
      <p>查找附近的换电站点</p>
    </div>
    
    <div class="map-content">
      <h2>换电站点信息</h2>
      <p>这里将显示附近的换电站点列表</p>
    </div>

    <!-- 页脚 -->
    <SiteFooter />
  </div>
</template>

<script setup>
import SiteFooter from '../components/SiteFooter.vue'
// 换电地图页面
</script>

<style scoped>
.user-map {
  padding: 24px;
  min-height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  color: #333;
}

.page-header p {
  margin: 0;
  color: #666;
}

.map-content {
  text-align: center;
  padding: 120px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  flex: 1;
}

.map-content h2 {
  margin: 0 0 24px 0;
  font-size: 28px;
  color: #333;
  letter-spacing: 2px;
}

.map-content p {
  margin: 0;
  color: #666;
  font-size: 18px;
  letter-spacing: 1px;
  line-height: 1.8;
}

/* 页脚样式 */
.user-map :deep(.site-footer) {
  margin-top: 80px;
}
</style>
