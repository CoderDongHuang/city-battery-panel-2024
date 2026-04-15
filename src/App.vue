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
/* 浅色模式主题变量（默认）- 使用淡淡的渐变色 */
:root {
  --bg-primary: linear-gradient(180deg, 
    rgba(200, 240, 245, 0.3) 0%, 
    rgba(220, 230, 250, 0.25) 20%, 
    rgba(230, 220, 255, 0.2) 40%, 
    rgba(245, 245, 255, 0.15) 60%,
    rgba(250, 250, 255, 0.1) 80%,
    rgba(255, 255, 255, 0.05) 100%);
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
  --footer-bg: #000000;
  --footer-text: #ffffff;
}

/* 深色模式覆盖 - 保持背景不变，只改变卡片和文字颜色 */
html.dark-mode {
  --bg-primary: linear-gradient(180deg, 
    rgba(200, 240, 245, 0.3) 0%, 
    rgba(220, 230, 250, 0.25) 20%, 
    rgba(230, 220, 255, 0.2) 40%, 
    rgba(245, 245, 255, 0.15) 60%,
    rgba(250, 250, 255, 0.1) 80%,
    rgba(255, 255, 255, 0.05) 100%);
  --bg-secondary: #f0f0f0;
  --bg-tertiary: #e0e0e0;
  --text-primary: #ffffff;
  --text-secondary: #e0e0e0;
  --text-tertiary: #a0a0a0;
  --border-color: #404040;
  --shadow-color: rgba(255, 255, 255, 0.1);
  --card-bg: #1a1a1a;
  --input-bg: #2c2c2c;
  --hover-bg: #333333;
  --footer-bg: #1a1a1a;
  --footer-text: #ffffff;
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
  background-attachment: fixed;
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
