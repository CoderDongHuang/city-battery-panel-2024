import axios from 'axios'

// 创建 axios 实例（使用与管理端相同的基础配置）
const contactApi = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 添加用户认证信息
contactApi.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取用户 ID
    const userId = localStorage.getItem('userId')
    
    if (userId) {
      config.headers['X-User-ID'] = userId
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
contactApi.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('[ContactAPI] 请求错误:', error)
    return Promise.reject(error)
  }
)

/**
 * 提交留言
 * @param {Object} data - 留言数据
 * @param {string} data.name - 姓名
 * @param {string} data.email - 邮箱
 * @param {string} data.subject - 主题
 * @param {string} data.message - 留言内容
 * @returns {Promise}
 */
export const submitMessageAPI = (data) => {
  return contactApi.post('/api/contact/messages', data)
}

/**
 * 获取用户的留言历史
 * @param {number} page - 页码
 * @param {number} pageSize - 每页数量
 * @returns {Promise}
 */
export const getMessageHistoryAPI = (page = 1, pageSize = 10) => {
  return contactApi.get('/api/contact/messages', {
    params: { page, pageSize }
  }).then(response => {
    // 响应拦截器已经返回了 response.data
    // 所以这里的 response 是 { code: 200, message: 'success', data: { content: [...] } }
    if (response.data && response.data.content) {
      return response.data.content
    }
    // 如果直接是数组
    if (Array.isArray(response.data)) {
      return response.data
    }
    return response.data || []
  })
}

/**
 * 获取留言详情
 * @param {number} messageId - 留言 ID
 * @returns {Promise}
 */
export const getMessageDetailAPI = (messageId) => {
  return contactApi.get(`/api/contact/messages/${messageId}`)
    .then(response => {
      // 响应拦截器已经返回了 response.data
      // 返回 { code: 200, message: 'success', data: {...} }
      return response.data
    })
}

export default {
  submitMessageAPI,
  getMessageHistoryAPI,
  getMessageDetailAPI
}
