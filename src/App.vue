<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <RouterView />
  </div>
</template>

<style>
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
