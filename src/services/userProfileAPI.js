import axios from 'axios'

// 创建 axios 实例（使用与管理端相同的基础配置）
const userProfileApi = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 添加用户认证信息
userProfileApi.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取用户 ID
    const userId = localStorage.getItem('userUserId')
    
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
userProfileApi.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // 处理 401 未授权错误
    if (error.response && error.response.status === 401) {
      console.error('未授权访问：用户 ID 无效或已过期')
    }
    
    return Promise.reject(error)
  }
)

// ==================== 个人中心 - 用户信息接口 ====================
export const userProfileAPI = {
  /**
   * 获取当前用户详细信息
   * GET /user/profile
   * 
   * 【后端响应格式】
   * {
   *   "code": 200,
   *   "message": "success",
   *   "data": {
   *     "id": 1,
   *     "username": "张三",
   *     "email": "zhangsan@example.com",
   *     "phone": "13800138000",
   *     "avatar": "https://example.com/avatars/user1.png",
   *     "role": "user",
   *     "createdAt": "2024-01-01T00:00:00Z",
   *     "updatedAt": "2024-01-15T00:00:00Z"
   *   }
   * }
   */
  getProfile: () => userProfileApi.get('/user/profile'),
  
  /**
   * 更新用户基本信息
   * PUT /user/profile
   * 
   * 【请求格式】
   * {
   *   "username": "张三",
   *   "email": "zhangsan@example.com",
   *   "phone": "13800138000"
   * }
   * 
   * 【后端响应格式】
   * {
   *   "code": 200,
   *   "message": "更新成功",
   *   "data": {
   *     "id": 1,
   *     "username": "张三",
   *     "email": "zhangsan@example.com",
   *     "phone": "13800138000",
   *     "avatar": "https://example.com/avatars/user1.png",
   *     "role": "user",
   *     "updatedAt": "2024-01-15T00:00:00Z"
   *   }
   * }
   */
  updateProfile: (profileData) => userProfileApi.put('/user/profile', profileData),
  
  /**
   * 修改密码
   * PUT /user/profile/password
   * 
   * 【请求格式】
   * {
   *   "currentPassword": "oldPassword123",
   *   "newPassword": "newPassword123"
   * }
   * 
   * 【后端响应格式】
   * {
   *   "code": 200,
   *   "message": "密码修改成功"
   * }
   */
  changePassword: (passwordData) => userProfileApi.put('/user/profile/password', passwordData)
}

// ==================== 个人中心 - 头像上传接口 ====================
export const userAvatarAPI = {
  /**
   * 上传用户头像
   * POST /user/profile/avatar
   * 
   * 【请求格式】（multipart/form-data）
   * avatar: File (图片文件)
   * 
   * 【后端响应格式】
   * {
   *   "code": 200,
   *   "message": "上传成功",
   *   "data": {
   *     "avatar": "https://example.com/avatars/user1_1705334400.png"
   *   }
   * }
   */
  uploadAvatar: (avatarFile) => {
    const formData = new FormData()
    formData.append('avatar', avatarFile)
    return userProfileApi.post('/user/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

// ==================== 个人中心 - 系统设置接口 ====================
export const userSettingsAPI = {
  /**
   * 获取用户设置
   * GET /user/settings
   * 
   * 【后端响应格式】
   * {
   *   "code": 200,
   *   "message": "success",
   *   "data": {
   *     "notifications": true,
   *     "darkMode": false
   *   }
   * }
   */
  getSettings: () => userProfileApi.get('/user/settings'),
  
  /**
   * 更新用户设置
   * PUT /user/settings
   * 
   * 【请求格式】
   * {
   *   "notifications": true,
   *   "darkMode": false
   * }
   * 
   * 【后端响应格式】
   * {
   *   "code": 200,
   *   "message": "设置已更新",
   *   "data": {
   *     "notifications": true,
   *     "darkMode": false
   *   }
   * }
   */
  updateSettings: (settingsData) => userProfileApi.put('/user/settings', settingsData)
}

export default {
  userProfileAPI,
  userAvatarAPI,
  userSettingsAPI
}
