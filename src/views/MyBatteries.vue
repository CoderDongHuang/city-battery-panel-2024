<template>
  <div class="my-batteries">
    <div class="page-header">
      <h1>🔋 我的电池</h1>
      <p>管理您的电池信息</p>
    </div>
    
    <div class="empty-state">
      <div class="empty-icon">🔋</div>
      <h2>暂无电池</h2>
      <p>您还没有添加任何电池</p>
      <button class="add-btn">添加第一块电池</button>
    </div>
  </div>
</template>

<script setup>
// 我的电池页面
</script>

<style scoped>
.my-batteries {
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
  margin: 0 0 24px 0;
  color: #666;
  font-size: 16px;
}

.add-btn {
  padding: 12px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}
</style>
