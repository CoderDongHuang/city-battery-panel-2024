import axios from 'axios'

// 创建 axios 实例（使用与管理端相同的基础配置）
const userApi = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 添加用户认证信息
userApi.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取用户 ID
    const userId = localStorage.getItem('userId')
    if (userId) {
      config.headers['X-User-ID'] = userId
    }
    
    // 生产环境不打印日志
    if (import.meta.env.DEV) {
      console.log(`[UserAPI 请求] ${config.method?.toUpperCase()} ${config.url}`)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
userApi.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('UserAPI 请求错误:', error)
    return Promise.reject(error)
  }
)

// ==================== 用户端 - 数量统计接口 ====================
export const userStatsAPI = {
  /**
   * 获取用户车辆数量统计
   * GET /user/stats/vehicles/count
   * 响应格式：{ code: 200, message: 'success', data: { count: 5 } }
   */
  getVehicleCount: () => userApi.get('/user/stats/vehicles/count'),
  
  /**
   * 获取用户电池数量统计
   * GET /user/stats/batteries/count
   * 响应格式：{ code: 200, message: 'success', data: { count: 3 } }
   */
  getBatteryCount: () => userApi.get('/user/stats/batteries/count'),
  
  /**
   * 获取用户综合统计（推荐）
   * GET /user/stats/summary
   * 响应格式：{ code: 200, message: 'success', data: { vehicles: 5, batteries: 3 } }
   */
  getSummary: () => userApi.get('/user/stats/summary')
}

// ==================== 用户端 - 车辆管理接口 ====================
export const userVehicleAPI = {
  /**
   * 获取当前用户的车辆列表
   * GET /user/vehicles
   * 响应格式：{ code: 200, message: 'success', data: [{ id, name, brand, vin, status, ... }] }
   */
  getVehicles: () => userApi.get('/user/vehicles'),
  
  /**
   * 获取单个车辆详情
   * GET /user/vehicles/{vehicleId}
   * 响应格式：{ code: 200, message: 'success', data: { id, name, brand, vin, ... } }
   */
  getVehicle: (vehicleId) => userApi.get(`/user/vehicles/${vehicleId}`),
  
  /**
   * 添加车辆
   * POST /user/vehicles
   * 请求格式：{ name: '我的车', brand: '特斯拉', vin: 'xxx', plateNumber: 'xxx', ... }
   * 响应格式：{ code: 200, message: '添加成功', data: { id: 1, ... } }
   */
  addVehicle: (vehicleData) => userApi.post('/user/vehicles', vehicleData),
  
  /**
   * 更新车辆
   * PUT /user/vehicles/{vehicleId}
   * 请求格式：{ name: '新车名', brand: '新品牌', ... }
   * 响应格式：{ code: 200, message: '更新成功', data: { id: 1, ... } }
   */
  updateVehicle: (vehicleId, vehicleData) => 
    userApi.put(`/user/vehicles/${vehicleId}`, vehicleData),
  
  /**
   * 删除车辆
   * DELETE /user/vehicles/{vehicleId}
   * 响应格式：{ code: 200, message: '删除成功' }
   */
  deleteVehicle: (vehicleId) => userApi.delete(`/user/vehicles/${vehicleId}`)
}

// ==================== 用户端 - 电池管理接口 ====================
export const userBatteryAPI = {
  /**
   * 获取当前用户的电池列表
   * GET /user/batteries
   * 响应格式：{ code: 200, message: 'success', data: [{ id, name, model, code, capacity, status, ... }] }
   */
  getBatteries: () => userApi.get('/user/batteries'),
  
  /**
   * 获取单个电池详情
   * GET /user/batteries/{batteryId}
   * 响应格式：{ code: 200, message: 'success', data: { id, name, model, code, ... } }
   */
  getBattery: (batteryId) => userApi.get(`/user/batteries/${batteryId}`),
  
  /**
   * 添加电池
   * POST /user/batteries
   * 请求格式：{ name: '我的电池', model: 'CATL-100Ah', code: 'xxx', capacity: 100, ... }
   * 响应格式：{ code: 200, message: '添加成功', data: { id: 1, ... } }
   */
  addBattery: (batteryData) => userApi.post('/user/batteries', batteryData),
  
  /**
   * 更新电池
   * PUT /user/batteries/{batteryId}
   * 请求格式：{ name: '新电池名', model: '新型号', capacity: 120, ... }
   * 响应格式：{ code: 200, message: '更新成功', data: { id: 1, ... } }
   */
  updateBattery: (batteryId, batteryData) => 
    userApi.put(`/user/batteries/${batteryId}`, batteryData),
  
  /**
   * 删除电池
   * DELETE /user/batteries/{batteryId}
   * 响应格式：{ code: 200, message: '删除成功' }
   */
  deleteBattery: (batteryId) => userApi.delete(`/user/batteries/${batteryId}`)
}

export default userApi
