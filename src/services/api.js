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
    api.post(`/vehicles/${vid}/control/horn`, null, { params: command })
}

// 电池管理API
export const batteryAPI = {
  // 获取电池列表
  getBatteries: (params) => api.get('/batteries', { params }),
  
  // 获取电池历史记录
  getBatteryHistory: (pid, params) => 
    api.get(`/batteries/${pid}/history`, { params })
}

// 报警管理API
export const alertAPI = {
  // 获取报警列表
  getAlerts: (params) => api.get('/alerts', { params }),
  
  // 添加报警
  addAlert: (alert) => api.post('/alerts', alert),
  
  // 解决报警
  resolveAlert: (id) => api.put(`/alerts/${id}/resolve`)
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