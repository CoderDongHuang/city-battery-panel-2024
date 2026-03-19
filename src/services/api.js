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
  
  // 控制车辆灯光
  controlLights: (vid, command) => 
    api.post(`/vehicles/${vid}/control/lights`, { command }),
  
  // 控制车辆喇叭
  controlHorn: (vid, command) => 
    api.post(`/vehicles/${vid}/control/horn`, { command })
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
  let reconnectAttempts = 0
  const maxReconnectAttempts = 5
  const reconnectDelay = 3000 // 3秒重连延迟
  let reconnectTimeout = null
  let heartbeatInterval = null
  
  const connect = () => {
    try {
      ws = new WebSocket('ws://localhost:8080/ws')
      
      ws.onopen = () => {
        console.log('WebSocket连接已建立')
        reconnectAttempts = 0
        onStatusChange && onStatusChange('connected')
        
        // 启动心跳检测
        heartbeatInterval = setInterval(() => {
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }))
          }
        }, 30000) // 每30秒发送一次心跳
      }
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          // 忽略心跳响应
          if (data.type === 'pong') {
            return
          }
          
          onMessage(data)
        } catch (error) {
          console.error('WebSocket消息解析错误:', error)
        }
      }
      
      ws.onclose = (event) => {
        console.log('WebSocket连接已关闭', event.code, event.reason)
        onStatusChange && onStatusChange('disconnected')
        
        // 清理心跳检测
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval)
          heartbeatInterval = null
        }
        
        // 自动重连逻辑
        if (reconnectAttempts < maxReconnectAttempts) {
          console.log(`将在 ${reconnectDelay/1000} 秒后尝试重连 (${reconnectAttempts + 1}/${maxReconnectAttempts})`)
          reconnectTimeout = setTimeout(() => {
            reconnectAttempts++
            connect()
          }, reconnectDelay)
        } else {
          console.log('已达到最大重连次数，停止重连')
          onStatusChange && onStatusChange('failed')
        }
      }
      
      ws.onerror = (error) => {
        console.error('WebSocket错误:', error)
        onStatusChange && onStatusChange('error')
      }
      
    } catch (error) {
      console.error('WebSocket连接创建失败:', error)
      onStatusChange && onStatusChange('error')
    }
  }
  
  // 开始连接
  connect()
  
  // 返回关闭函数
  return {
    close: () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout)
      }
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval)
      }
      if (ws) {
        ws.close()
      }
    },
    reconnect: () => {
      reconnectAttempts = 0
      if (ws) {
        ws.close()
      } else {
        connect()
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