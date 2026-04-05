<template>
  <div class="dashboard-layout">
    <!-- 侧边栏导航 -->
    <aside class="dashboard-sidebar">
      <div class="sidebar-header">
        <h3>控制台</h3>
      </div>
      <nav class="sidebar-nav">
        <router-link 
          :to="{ name: 'UserDashboard' }"
          class="sidebar-item"
          :class="{ active: $route.name === 'UserDashboard' }"
        >
          <span class="sidebar-icon">📊</span>
          <span>控制台首页</span>
        </router-link>
        
        <router-link 
          :to="{ name: 'MyVehicles' }"
          class="sidebar-item"
          :class="{ active: $route.name === 'MyVehicles' }"
        >
          <span class="sidebar-icon"></span>
          <span>我的车辆</span>
        </router-link>
        
        <router-link 
          :to="{ name: 'MyBatteries' }"
          class="sidebar-item"
          :class="{ active: $route.name === 'MyBatteries' }"
        >
          <span class="sidebar-icon">🔋</span>
          <span>我的电池</span>
        </router-link>
        
        <router-link 
          :to="{ name: 'UserMap' }"
          class="sidebar-item"
          :class="{ active: $route.name === 'UserMap' }"
        >
          <span class="sidebar-icon">🗺️</span>
          <span>换电地图</span>
        </router-link>
        
        <router-link 
          :to="{ name: 'UserAlerts' }"
          class="sidebar-item"
          :class="{ active: $route.name === 'UserAlerts' }"
        >
          <span class="sidebar-icon"></span>
          <span>我的报警</span>
        </router-link>
        
        <router-link 
          :to="{ name: 'UserProfile' }"
          class="sidebar-item"
          :class="{ active: $route.name === 'UserProfile' }"
        >
          <span class="sidebar-icon">👤</span>
          <span>个人中心</span>
        </router-link>
      </nav>
    </aside>

    <!-- 主内容区域 -->
    <main class="dashboard-main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
// Dashboard Layout Component
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  height: calc(100vh - 120px);
  background: #f5f7fa;
}

/* 侧边栏 */
.dashboard-sidebar {
  width: 240px;
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.sidebar-header h3 {
  margin: 0;
  color: white;
  font-size: 18px;
  font-weight: 600;
}

.sidebar-nav {
  padding: 10px 0;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #666;
  text-decoration: none;
  transition: all 0.3s;
  border-left: 3px solid transparent;
  margin-bottom: 4px;
}

.sidebar-item:hover {
  background: #f5f7fa;
  color: #667eea;
}

.sidebar-item.active {
  background: #f0f2ff;
  color: #667eea;
  border-left-color: #667eea;
  font-weight: 500;
}

.sidebar-icon {
  margin-right: 12px;
  font-size: 18px;
}

/* 主内容区 */
.dashboard-main {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* 响应式 */
@media (max-width: 768px) {
  .dashboard-sidebar {
    width: 200px;
  }
}
</style>
