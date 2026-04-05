<template>
  <div class="user-map">
    <div class="page-header">
      <h1>🗺️ 换电地图</h1>
      <p>查找附近的换电站点</p>
    </div>
    
    <div class="map-placeholder">
      <div class="map-icon">🗺️</div>
      <h2>地图加载中...</h2>
      <p>正在加载附近的换电站点信息</p>
    </div>
  </div>
</template>

<script setup>
// 换电地图页面
</script>

<style scoped>
.user-map {
  padding: 24px;
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

.map-placeholder {
  text-align: center;
  padding: 100px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.map-icon {
  font-size: 100px;
  margin-bottom: 24px;
  opacity: 0.5;
}

.map-placeholder h2 {
  margin: 0 0 16px 0;
  font-size: 24px;
  color: #333;
}

.map-placeholder p {
  margin: 0;
  color: #666;
  font-size: 16px;
}
</style>
