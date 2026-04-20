import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import router from './router'
import pinia from './store'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 监听其他标签页的登录/登出事件
window.addEventListener('storage', (event) => {
  // 监听管理端 token 变化
  if (event.key === 'adminToken' && event.newValue !== event.oldValue) {
    if (event.newValue === null && event.oldValue) {
      console.log('检测到其他标签页管理端已登出')
      // 只在当前也在管理端时刷新
      if (window.location.pathname.includes('/admin/')) {
        window.location.reload()
      }
    }
  }
  
  // 监听用户端 token 变化
  if (event.key === 'userToken' && event.newValue !== event.oldValue) {
    if (event.newValue === null && event.oldValue) {
      console.log('检测到其他标签页用户端已登出')
      // 只在当前也在用户端时刷新
      if (!window.location.pathname.includes('/admin/')) {
        window.location.reload()
      }
    }
  }
})

app.mount('#app')
