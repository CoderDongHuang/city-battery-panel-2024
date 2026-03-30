import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    console.log(`发送请求: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API请求错误:', error)
    return Promise.reject(error)
  }
)

// 车辆管理API
export const vehicleAPI = {
  // 获取车辆列表
  getVehicles: () => api.get('/vehicles'),
  
  // 获取单个车辆信息
  getVehicle: (vid) => api.get(`/vehicles/${vid}`),
  
  // 更新车辆状态
  updateVehicleStatus: (vid, status) => 
    api.put(`/vehicles/${vid}/status`, status),
  
  // 控制车辆灯光状态
  controlLights: (vid, command) => 
    api.post(`/vehicles/${vid}/control/lights`, null, { params: command }),
  
  // 控制车辆灯光闪烁
  flashLights: (vid, command) => 
    api.post(`/vehicles/${vid}/control/flash`, null, { params: command }),
  
  // 控制车辆喇叭
  controlHorn: (vid, command) => 
    api.post(`/vehicles/${vid}/control/horn`, null, { params: command }),
  
  // 设置车辆位置
  setPosition: (vid, command) => 
    api.post(`/vehicles/${vid}/control/position`, null, { params: command })
}

// 电池管理API
export const batteryAPI = {
  // 获取电池列表
  getBatteries: (params) => api.get('/batteries', { params }),
  
  // 获取单个电池信息
  getBattery: (pid) => api.get(`/batteries/${pid}`),
  
  // 获取电池历史记录
  getBatteryHistory: (pid, params) => 
    api.get(`/batteries/${pid}/history`, { params }),
  
  // 根据车辆获取电池列表
  getBatteriesByVehicle: (vid) => api.get(`/batteries/vehicle/${vid}`),
  
  // 获取电池统计信息
  getBatteryStatistics: () => api.get('/batteries/statistics')
}

// 报警管理API
export const alertAPI = {
  // 获取报警列表（支持分页和筛选）
  getAlerts: (params) => api.get('/alerts', { params }),
  
  // 获取报警详情
  getAlertDetail: (id) => api.get(`/alerts/${id}`),
  
  // 获取报警统计
  getAlertStatistics: () => api.get('/alerts/statistics'),
  
  // 解决报警
  resolveAlert: (id, data) => api.put(`/alerts/${id}/resolve`, data),
  
  // 批量处理报警
  batchResolveAlerts: (ids, data) => api.put('/alerts/batch-resolve', { ids, ...data }),
  
  // 添加报警
  addAlert: (alert) => api.post('/alerts', alert)
}

// 电池报警API（根据设计文档新增）
export const alarmAPI = {
  // 获取历史报警（已处理+未处理）
  getHistoryAlarms: (params) => api.get('/alarms/history', { params }),
  
  // 获取报警统计
  getAlarmStatistics: (params) => api.get('/alarms/statistics', { params }),
  
  // 标记报警为已处理
  handleAlarm: (alarmId) => api.put(`/alarms/${alarmId}/handle`),
  
  // 获取未处理报警数量
  getUnhandledCount: () => api.get('/alarms/unhandled/count')
}

// 系统统计API
export const dashboardAPI = {
  // 获取系统概览
  getOverview: () => api.get('/dashboard/overview')
}

// WebSocket连接（实时数据）
export const createWebSocket = (onMessage, onStatusChange) => {
  let ws = null
  
  try {
    ws = new WebSocket('ws://localhost:8080/ws')
    
    ws.onopen = () => {
      console.log('WebSocket连接已建立')
      onStatusChange && onStatusChange('connected')
    }
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        onMessage(data)
      } catch (error) {
        console.error('WebSocket消息解析错误:', error)
      }
    }
    
    ws.onclose = (event) => {
      console.log('WebSocket连接已关闭', event.code, event.reason)
      onStatusChange && onStatusChange('disconnected')
    }
    
    ws.onerror = (error) => {
      console.error('WebSocket错误:', error)
      onStatusChange && onStatusChange('error')
    }
    
  } catch (error) {
    console.error('WebSocket连接创建失败:', error)
    onStatusChange && onStatusChange('error')
  }
  
  // 返回关闭函数
  return {
    close: () => {
      if (ws) {
        ws.close()
      }
    },
    getStatus: () => {
      if (!ws) return 'disconnected'
      switch (ws.readyState) {
        case WebSocket.CONNECTING: return 'connecting'
        case WebSocket.OPEN: return 'connected'
        case WebSocket.CLOSING: return 'closing'
        case WebSocket.CLOSED: return 'disconnected'
        default: return 'unknown'
      }
    }
  }
}

export default api