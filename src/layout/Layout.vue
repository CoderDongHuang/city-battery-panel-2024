<template>
  <div class="layout">
    <header class="header">
      <div class="header-left">
        <h1 class="title">城市智能电车管理与换电系统</h1>
      </div>
      <div class="header-right">
        <span class="time">{{ currentTime }}</span>
      </div>
    </header>
    
    <div class="main-container">
      <aside class="sidebar">
        <nav class="nav-menu">
          <router-link 
            v-for="route in routes" 
            :key="route.name"
            :to="{ name: route.name }"
            class="nav-item"
            :class="{ active: $route.name === route.name }"
          >
            <span class="nav-icon">{{ getRouteIcon(route.name) }}</span>
            <span class="nav-text">{{ route.meta.title }}</span>
          </router-link>
        </nav>
      </aside>
      
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const currentTime = ref('')

const routes = computed(() => {
  return router.getRoutes().filter(r => r.meta && r.meta.title)
})

const getRouteIcon = (routeName) => {
  const icons = {
    Dashboard: '📊',
    Vehicles: '🚗',
    Batteries: '🔋',
    Map: '🗺️',
    Settings: '⚙️'
  }
  return icons[routeName] || '📄'
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

onMounted(() => {
  updateTime()
  const timer = setInterval(updateTime, 1000)
  onUnmounted(() => clearInterval(timer))
})
</script>

<style scoped>
.layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  height: 60px;
  background: #2c3e50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-left .title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.header-right .time {
  font-size: 14px;
  opacity: 0.8;
}

.main-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: 200px;
  background: #34495e;
  overflow-y: auto;
}

.nav-menu {
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #bdc3c7;
  text-decoration: none;
  transition: all 0.3s;
}

.nav-item:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}

.nav-item.active {
  background: #3498db;
  color: white;
}

.nav-icon {
  margin-right: 10px;
  font-size: 16px;
}

.nav-text {
  font-size: 14px;
  font-weight: 500;
}

.main-content {
  flex: 1;
  padding: 20px;
  background: #ecf0f1;
  overflow-y: auto;
}
</style>