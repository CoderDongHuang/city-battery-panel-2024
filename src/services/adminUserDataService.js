/**
 * 管理端用户数据服务
 * 提供管理端访问用户端车辆和电池数据的 API 接口
 */

import axios from 'axios'

// API 基础 URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 添加管理端认证 token
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    if (import.meta.env.DEV) {
      console.log(`[AdminUserDataAPI 请求] ${config.method?.toUpperCase()} ${config.url}`)
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 统一处理错误
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data)
      
      if (error.response.status === 401) {
        console.error('未授权访问，请重新登录管理端')
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminRole')
        window.location.href = '/login'
      }
    } else if (error.request) {
      console.error('Network Error:', error.request)
    } else {
      console.error('Error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

/**
 * 获取所有用户车辆（管理端专用）
 * GET /api/admin/user-vehicles
 * 
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页大小
 * @param {number} params.userId - 按用户 ID 筛选
 * @param {string} params.status - 按状态筛选
 * @param {string} params.keyword - 关键词搜索
 * @returns {Promise<Object>} 用户车辆列表（分页）
 */
export const getUserVehicles = async (params = {}) => {
  try {
    const response = await apiClient.get('/api/admin/user-vehicles', { params })
    return response.data
  } catch (error) {
    console.error('获取用户车辆列表失败:', error)
    throw error
  }
}

/**
 * 获取所有用户电池（管理端专用）
 * GET /api/admin/user-batteries
 * 
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页大小
 * @param {number} params.userId - 按用户 ID 筛选
 * @param {string} params.status - 按状态筛选
 * @param {string} params.model - 按型号筛选
 * @param {string} params.keyword - 关键词搜索
 * @returns {Promise<Object>} 用户电池列表（分页）
 */
export const getUserBatteries = async (params = {}) => {
  try {
    const response = await apiClient.get('/api/admin/user-batteries', { params })
    return response.data
  } catch (error) {
    console.error('获取用户电池列表失败:', error)
    throw error
  }
}

/**
 * 获取用户数据统计（管理端专用）
 * GET /api/admin/user-data/statistics
 * 
 * @returns {Promise<Object>} 用户数据统计信息
 */
export const getUserDataStatistics = async () => {
  try {
    const response = await apiClient.get('/api/admin/user-data/statistics')
    return response.data
  } catch (error) {
    console.error('获取用户数据统计失败:', error)
    throw error
  }
}

export default {
  getUserVehicles,
  getUserBatteries,
  getUserDataStatistics
}
