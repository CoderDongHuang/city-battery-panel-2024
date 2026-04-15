<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'

// 初始化深色模式
onMounted(() => {
  const isDarkMode = localStorage.getItem('darkMode') === 'true'
  if (isDarkMode) {
    document.documentElement.classList.add('dark-mode')
  }
  
  // 监听深色模式变化
  window.addEventListener('darkModeChange', (event) => {
    if (event.detail) {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
  })
})
</script>

<template>
  <div class="app">
    <RouterView />
  </div>
</template>

<style>
/* 深色模式主题变量 */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-tertiary: #e9ecef;
  --text-primary: #333333;
  --text-secondary: #666666;
  --text-tertiary: #999999;
  --border-color: #e0e0e0;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --card-bg: #ffffff;
  --input-bg: #ffffff;
  --hover-bg: #f0f0f0;
}

/* 深色模式覆盖 */
html.dark-mode {
  --bg-primary: #121212;
  --bg-secondary: #1e1e1e;
  --bg-tertiary: #2c2c2c;
  --text-primary: #ffffff;
  --text-secondary: #e0e0e0;
  --text-tertiary: #a0a0a0;
  --border-color: #404040;
  --shadow-color: rgba(0, 0, 0, 0.4);
  --card-bg: #1e1e1e;
  --input-bg: #2c2c2c;
  --hover-bg: #333333;
}

/* 全局重置样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.app {
  width: 100%;
  min-height: 100vh;
}

/* 覆盖自定义布局组件的默认样式 */
.layout, .header, .main-container, .sidebar, .main-content {
  margin: 0;
  padding: 0;
  width: 100%;
}

/* 确保所有容器都是全宽 */
.header-content, .business-metrics-section, 
.system-navigation-section, .data-visualization-section,
.map-controls-section, .map-display-section, 
.info-panels-section {
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>
