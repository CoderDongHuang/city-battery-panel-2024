/**
 * 车辆管理服务
 * 提供车辆相关的 API 接口调用
 */

import axios from 'axios'

// API 基础 URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 添加认证 token
apiClient.interceptors.request.use(
  config => {
    // 管理端 API 使用 adminToken，用户端 API 使用 userToken
    let token = null
    if (config.url.includes('/admin/')) {
      token = localStorage.getItem('adminToken')
    } else {
      token = localStorage.getItem('userToken')
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
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
      // 服务器返回错误响应
      console.error('API Error:', error.response.status, error.response.data)
      
      if (error.response.status === 401) {
        // 未授权，根据 URL 清除对应的 token
        if (error.config.url.includes('/admin/')) {
          localStorage.removeItem('adminToken')
        } else {
          localStorage.removeItem('userToken')
        }
        window.location.href = '/login'
      }
    } else if (error.request) {
      // 请求已发送但没有响应
      console.error('Network Error:', error.request)
    } else {
      // 其他错误
      console.error('Error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

/**
 * 获取车辆列表
 * @returns {Promise<Array>} 车辆列表
 */
export const getVehicles = async () => {
  try {
    const response = await apiClient.get('/vehicles')
    return response.data
  } catch (error) {
    console.error('获取车辆列表失败:', error)
    throw error
  }
}

/**
 * 获取单个车辆详情
 * @param {number} vehicleId - 车辆 ID
 * @returns {Promise<Object>} 车辆详情
 */
export const getVehicleById = async (vehicleId) => {
  try {
    const response = await apiClient.get(`/vehicles/${vehicleId}`)
    return response.data
  } catch (error) {
    console.error('获取车辆详情失败:', error)
    throw error
  }
}

/**
 * 添加新车辆
 * @param {Object} vehicleData - 车辆数据
 * @param {string} vehicleData.name - 车辆名称
 * @param {string} vehicleData.brand - 品牌型号
 * @param {string} vehicleData.vin - 车架号 (VIN)
 * @param {string} vehicleData.plateNumber - 车牌号
 * @param {string} vehicleData.purchaseDate - 购买日期
 * @param {string} vehicleData.notes - 备注
 * @returns {Promise<Object>} 创建的车辆信息
 */
export const addVehicle = async (vehicleData) => {
  try {
    const response = await apiClient.post('/vehicles', vehicleData)
    return response.data
  } catch (error) {
    console.error('添加车辆失败:', error)
    throw error
  }
}

/**
 * 更新车辆信息
 * @param {number} vehicleId - 车辆 ID
 * @param {Object} vehicleData - 更新的车辆数据
 * @returns {Promise<Object>} 更新后的车辆信息
 */
export const updateVehicle = async (vehicleId, vehicleData) => {
  try {
    const response = await apiClient.put(`/vehicles/${vehicleId}`, vehicleData)
    return response.data
  } catch (error) {
    console.error('更新车辆失败:', error)
    throw error
  }
}

/**
 * 删除车辆
 * @param {number} vehicleId - 车辆 ID
 * @returns {Promise<void>}
 */
export const deleteVehicle = async (vehicleId) => {
  try {
    await apiClient.delete(`/vehicles/${vehicleId}`)
  } catch (error) {
    console.error('删除车辆失败:', error)
    throw error
  }
}

/**
 * 获取车辆状态
 * @param {number} vehicleId - 车辆 ID
 * @returns {Promise<Object>} 车辆状态
 */
export const getVehicleStatus = async (vehicleId) => {
  try {
    const response = await apiClient.get(`/vehicles/${vehicleId}/status`)
    return response.data
  } catch (error) {
    console.error('获取车辆状态失败:', error)
    throw error
  }
}

export default {
  getVehicles,
  getVehicleById,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicleStatus
}
