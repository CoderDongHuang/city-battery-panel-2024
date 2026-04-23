import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 开发环境打印日志
    if (import.meta.env.DEV) {
      console.log(`[API 请求] ${config.method?.toUpperCase()} ${config.url}`)
    }
    
    // 添加认证 token（如果有）
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 添加用户 ID（如果有）- 用于用户端接口认证
    const userId = localStorage.getItem('userId')
    console.log('[request.js] 当前 userId:', userId)
    if (userId) {
      config.headers['X-User-ID'] = userId
      console.log('[request.js] 已添加 X-User-ID:', userId)
    } else {
      console.error('[request.js] 未找到 userId')
    }
    console.log('[request.js] 请求头:', config.headers)
    
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 直接返回 data
    return response.data
  },
  (error) => {
    console.error('API 响应错误:', error)
    
    // 处理常见错误
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          console.error('未授权，请重新登录')
          // 可以在这里跳转登录页
          break
        case 403:
          console.error('无权访问')
          break
        case 404:
          console.error('请求的资源不存在')
          break
        case 500:
          console.error('服务器错误')
          break
        default:
          console.error(`请求失败：${status}`)
      }
    }
    
    return Promise.reject(error)
  }
)

export default request
