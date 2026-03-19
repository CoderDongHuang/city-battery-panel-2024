const express = require('express')
const cors = require('cors')
const WebSocket = require('ws')
const http = require('http')

const app = express()
const PORT = 8080

// 创建HTTP服务器
const server = http.createServer(app)

// 创建WebSocket服务器，绑定到同一个HTTP服务器
const wss = new WebSocket.Server({ server })

// 中间件
app.use(cors())
app.use(express.json())

// 模拟数据
let vehicles = [
  {
    vid: "V001",
    pid: "B001",
    voltage: 3.8,
    temperature: 25.0,
    batteryLevel: 65.0,
    lightStatus: "off",
    position: { x: 10, y: 15 },
    online: true,
    lastUpdate: new Date().toISOString()
  },
  {
    vid: "V002",
    pid: "B002",
    voltage: 3.6,
    temperature: 28.0,
    batteryLevel: 45.0,
    lightStatus: "off",
    position: { x: 25, y: 30 },
    online: true,
    lastUpdate: new Date().toISOString()
  },
  {
    vid: "V003",
    pid: "B003",
    voltage: 3.9,
    temperature: 22.0,
    batteryLevel: 80.0,
    lightStatus: "lowBeam",
    position: { x: 40, y: 20 },
    online: false,
    lastUpdate: new Date().toISOString()
  }
]

let batteries = [
  {
    pid: "B001",
    status: "inUse",
    currentVehicle: "V001",
    voltage: 3.8,
    temperature: 25.0,
    remainingCapacity: 65.0,
    health: 95.0
  },
  {
    pid: "B002",
    status: "inUse",
    currentVehicle: "V002",
    voltage: 3.6,
    temperature: 28.0,
    remainingCapacity: 45.0,
    health: 88.0
  },
  {
    pid: "B003",
    status: "available",
    currentVehicle: null,
    voltage: 3.9,
    temperature: 22.0,
    remainingCapacity: 80.0,
    health: 92.0
  },
  {
    pid: "B004",
    status: "available",
    currentVehicle: null,
    voltage: 4.0,
    temperature: 24.0,
    remainingCapacity: 90.0,
    health: 96.0
  }
]

let alerts = [
  {
    id: 1,
    type: "lowBattery",
    vid: "V002",
    message: "电池电量过低",
    level: "high",
    resolved: false,
    triggerValue: 45.0,
    thresholdValue: 50.0,
    timestamp: new Date().toISOString()
  }
]

// API路由 - 车辆管理
app.get('/api/vehicles', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: vehicles
  })
})

app.get('/api/vehicles/:vid', (req, res) => {
  const vehicle = vehicles.find(v => v.vid === req.params.vid)
  if (vehicle) {
    res.json({
      code: 200,
      message: 'success',
      data: vehicle
    })
  } else {
    res.status(404).json({
      code: 404,
      message: '车辆不存在',
      data: null
    })
  }
})

app.put('/api/vehicles/:vid/status', (req, res) => {
  const vehicleIndex = vehicles.findIndex(v => v.vid === req.params.vid)
  if (vehicleIndex !== -1) {
    vehicles[vehicleIndex] = { ...vehicles[vehicleIndex], ...req.body }
    vehicles[vehicleIndex].lastUpdate = new Date().toISOString()
    
    res.json({
      code: 200,
      message: '车辆状态更新成功',
      data: vehicles[vehicleIndex]
    })
  } else {
    res.status(404).json({
      code: 404,
      message: '车辆不存在',
      data: null
    })
  }
})

app.post('/api/vehicles/:vid/control/lights', (req, res) => {
  const vehicleIndex = vehicles.findIndex(v => v.vid === req.params.vid)
  if (vehicleIndex !== -1) {
    vehicles[vehicleIndex].lightStatus = req.body.command
    vehicles[vehicleIndex].lastUpdate = new Date().toISOString()
    
    res.json({
      code: 200,
      message: '灯光控制成功',
      data: { command: req.body.command }
    })
  } else {
    res.status(404).json({
      code: 404,
      message: '车辆不存在',
      data: null
    })
  }
})

app.post('/api/vehicles/:vid/control/horn', (req, res) => {
  const vehicleIndex = vehicles.findIndex(v => v.vid === req.params.vid)
  if (vehicleIndex !== -1) {
    res.json({
      code: 200,
      message: '喇叭控制成功',
      data: { command: req.body.command }
    })
  } else {
    res.status(404).json({
      code: 404,
      message: '车辆不存在',
      data: null
    })
  }
})

// API路由 - 电池管理
app.get('/api/batteries', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: batteries
  })
})

app.get('/api/batteries/:pid/history', (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: [] // 简化实现，返回空历史数据
  })
})

// API路由 - 报警管理
app.get('/api/alerts', (req, res) => {
  const { resolved } = req.query
  let filteredAlerts = alerts
  
  if (resolved !== undefined) {
    filteredAlerts = alerts.filter(alert => alert.resolved === (resolved === 'true'))
  }
  
  res.json({
    code: 200,
    message: 'success',
    data: filteredAlerts
  })
})

app.post('/api/alerts', (req, res) => {
  const newAlert = {
    id: alerts.length + 1,
    ...req.body,
    timestamp: new Date().toISOString()
  }
  alerts.push(newAlert)
  
  res.json({
    code: 200,
    message: '报警添加成功',
    data: newAlert
  })
})

app.put('/api/alerts/:id/resolve', (req, res) => {
  const alertIndex = alerts.findIndex(a => a.id === parseInt(req.params.id))
  if (alertIndex !== -1) {
    alerts[alertIndex].resolved = true
    res.json({
      code: 200,
      message: '报警已解决',
      data: alerts[alertIndex]
    })
  } else {
    res.status(404).json({
      code: 404,
      message: '报警不存在',
      data: null
    })
  }
})

// API路由 - 系统统计
app.get('/api/dashboard/overview', (req, res) => {
  const onlineVehicles = vehicles.filter(v => v.online).length
  const totalVehicles = vehicles.length
  const availableBatteries = batteries.filter(b => b.status === 'available').length
  const totalBatteries = batteries.length
  const activeAlerts = alerts.filter(a => !a.resolved).length
  
  res.json({
    code: 200,
    message: 'success',
    data: {
      onlineVehicles,
      totalVehicles,
      availableBatteries,
      totalBatteries,
      activeAlerts
    }
  })
})

// WebSocket连接处理
wss.on('connection', (ws) => {
  console.log('WebSocket客户端已连接')
  
  // 发送初始数据
  ws.send(JSON.stringify({
    type: 'initial_data',
    data: {
      vehicles: vehicles,
      batteries: batteries,
      alerts: alerts.filter(a => !a.resolved)
    }
  }))
  
  // 定时发送车辆状态更新（模拟实时数据）
  const interval = setInterval(() => {
    // 随机更新一些车辆状态
    vehicles.forEach(vehicle => {
      if (vehicle.online) {
        vehicle.voltage = (3.5 + Math.random() * 0.5).toFixed(2)
        vehicle.temperature = (20 + Math.random() * 10).toFixed(1)
        vehicle.batteryLevel = Math.max(0, vehicle.batteryLevel - 0.1).toFixed(1)
        vehicle.lastUpdate = new Date().toISOString()
      }
    })
    
    ws.send(JSON.stringify({
      type: 'vehicle_update',
      data: vehicles
    }))
  }, 5000)
  
  ws.on('close', () => {
    console.log('WebSocket客户端已断开连接')
    clearInterval(interval)
  })
  
  ws.on('error', (error) => {
    console.error('WebSocket错误:', error)
  })
})

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({
    code: 200,
    message: '服务正常',
    data: {
      status: 'running',
      timestamp: new Date().toISOString()
    }
  })
})

// 启动服务器
server.listen(PORT, () => {
  console.log(`后端服务器运行在 http://localhost:${PORT}`)
  console.log(`WebSocket服务器运行在 ws://localhost:${PORT}`)
})