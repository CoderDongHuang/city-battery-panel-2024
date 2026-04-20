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
    const userId = localStorage.getItem('userUserId')
    console.log('[UserAPI] 当前 userId:', userId)
    
    if (userId) {
      config.headers['X-User-ID'] = userId
    } else {
      console.error('[UserAPI] 未找到 userId，无法设置 X-User-ID 请求头')
    }
    
    // 生产环境不打印日志
    if (import.meta.env.DEV) {
      console.log(`[UserAPI 请求] ${config.method?.toUpperCase()} ${config.url}`)
      console.log('[UserAPI] 请求头:', config.headers)
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
    
    // 处理 401 未授权错误
    if (error.response && error.response.status === 401) {
      console.error('未授权访问：用户 ID 无效或已过期')
      // 不自动跳转，让前端组件处理错误
      // 前端组件可以根据错误信息显示提示信息
    }
    
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

// ==================== 用户端 - 订单管理接口 ====================
export const userOrderAPI = {
  /**
   * 获取当前用户的订单列表
   * GET /user/orders
   * 响应格式：{ code: 200, message: 'success', data: [{ id, createTime, status, vehicleName, stationName, batteryInfo, amount, ... }] }
   */
  getOrders: () => userApi.get('/user/orders'),
  
  /**
   * 获取单个订单详情
   * GET /user/orders/{orderId}
   * 响应格式：{ code: 200, message: 'success', data: { id, createTime, status, vehicleName, stationName, batteryInfo, amount, ... } }
   */
  getOrder: (orderId) => userApi.get(`/user/orders/${orderId}`),
  
  /**
   * 获取用户订单统计
   * GET /user/orders/stats
   * 响应格式：{ code: 200, message: 'success', data: { total: 28, completed: 22, processing: 3, pending: 3 } }
   */
  getStats: () => userApi.get('/user/orders/stats'),
  
  /**
   * 支付订单
   * POST /user/orders/{orderId}/pay
   * 响应格式：{ code: 200, message: '支付成功' }
   */
  payOrder: (orderId) => userApi.post(`/user/orders/${orderId}/pay`),
  
  /**
   * 取消订单
   * POST /user/orders/{orderId}/cancel
   * 响应格式：{ code: 200, message: '订单已取消' }
   */
  cancelOrder: (orderId) => userApi.post(`/user/orders/${orderId}/cancel`)
}

// ==================== 用户端 - 服务网点（换电站）接口 ====================
export const userStationAPI = {
  /**
   * 获取所有服务网点列表（公开信息，无需用户认证）
   * GET /user/stations
   * 响应格式：{ code: 200, message: 'success', data: [{ id, stationId, name, positionX, positionY, address, batteryCapacity, availableBatteries, status, operatingHours, contactPhone, manager }] }
   */
  getStations: () => userApi.get('/user/stations'),
  
  /**
   * 获取单个服务网点详情（公开信息，无需用户认证）
   * GET /user/stations/{stationId}
   * 响应格式：{ code: 200, message: 'success', data: { id, stationId, name, positionX, positionY, address, batteryCapacity, availableBatteries, status, operatingHours, contactPhone, manager } }
   */
  getStation: (stationId) => userApi.get(`/user/stations/${stationId}`),
  
  /**
   * 根据状态筛选服务网点
   * GET /user/stations?status=active
   * 响应格式：{ code: 200, message: 'success', data: [...] }
   */
  getStationsByStatus: (status) => userApi.get(`/user/stations?status=${status}`),
  
  /**
   * 获取附近的服务网点（根据坐标范围）
   * GET /user/stations/nearby?x=50&y=50&radius=100
   * 响应格式：{ code: 200, message: 'success', data: [{ id, stationId, name, positionX, positionY, address, distance, ... }] }
   */
  getNearbyStations: (x, y, radius = 100) => 
    userApi.get(`/user/stations/nearby?x=${x}&y=${y}&radius=${radius}`),
  
  /**
   * 获取可用电池数量大于指定值的站点
   * GET /user/stations/available?minBatteries=5
   * 响应格式：{ code: 200, message: 'success', data: [...] }
   */
  getAvailableStations: (minBatteries = 1) => 
    userApi.get(`/user/stations/available?minBatteries=${minBatteries}`)
}

export default userApi
