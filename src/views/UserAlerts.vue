<template>
  <div class="user-alerts">
    <div class="page-header">
      <h1>🔔 我的报警</h1>
      <p>查看您的报警信息</p>
    </div>
    
    <div class="empty-state">
      <div class="empty-icon">✅</div>
      <h2>暂无报警</h2>
      <p>您的所有设备运行正常</p>
    </div>
  </div>
</template>

<script setup>
// 我的报警页面
</script>

<style scoped>
.user-alerts {
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

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 24px;
  opacity: 0.5;
}

.empty-state h2 {
  margin: 0 0 16px 0;
  font-size: 24px;
  color: #333;
}

.empty-state p {
  margin: 0;
  color: #666;
  font-size: 16px;
}
</style>
