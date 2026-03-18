// 模拟数据服务
export const mockDataService = {
  // 模拟车辆数据
  vehicles: [
    {
      vid: "V001",
      pid: "B001",
      voltage: 3.8,
      temperature: 25,
      batteryLevel: 65,
      lightStatus: "off",
      position: { x: 10, y: 15 },
      online: true,
      lastUpdate: new Date().toISOString()
    },
    {
      vid: "V002", 
      pid: "B002",
      voltage: 3.2,
      temperature: 28,
      batteryLevel: 25,
      lightStatus: "lowBeam",
      position: { x: 45, y: 60 },
      online: true,
      lastUpdate: new Date().toISOString()
    },
    {
      vid: "V003",
      pid: "B003", 
      voltage: 4.0,
      temperature: 22,
      batteryLevel: 85,
      lightStatus: "off",
      position: { x: 80, y: 25 },
      online: false,
      lastUpdate: new Date(Date.now() - 300000).toISOString()
    }
  ],

  // 模拟电池数据
  batteries: [
    {
      pid: "B001",
      status: "inUse",
      currentVehicle: "V001",
      voltage: 3.8,
      temperature: 25,
      remainingCapacity: 65,
      health: 95,
      history: [
        { timestamp: new Date(Date.now() - 3600000).toISOString(), vehicleId: "V001", capacity: 70 },
        { timestamp: new Date(Date.now() - 1800000).toISOString(), vehicleId: "V001", capacity: 68 }
      ]
    },
    {
      pid: "B002",
      status: "inUse", 
      currentVehicle: "V002",
      voltage: 3.2,
      temperature: 28,
      remainingCapacity: 25,
      health: 88,
      history: [
        { timestamp: new Date(Date.now() - 7200000).toISOString(), vehicleId: "V002", capacity: 45 },
        { timestamp: new Date(Date.now() - 3600000).toISOString(), vehicleId: "V002", capacity: 35 }
      ]
    },
    {
      pid: "B003",
      status: "available",
      currentVehicle: null,
      voltage: 4.0,
      temperature: 22,
      remainingCapacity: 85,
      health: 92,
      history: []
    }
  ],

  // 模拟报警数据
  alerts: [
    {
      id: 1,
      type: "lowBattery",
      vid: "V002",
      timestamp: new Date(Date.now() - 600000).toISOString(),
      resolved: false,
      message: "电池电量过低"
    },
    {
      id: 2,
      type: "temperature", 
      vid: "V001",
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      resolved: true,
      message: "电池温度异常"
    }
  ],

  // 获取车辆数据
  getVehicles() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.vehicles])
      }, 500)
    })
  },

  // 更新车辆状态
  updateVehicleStatus(vid, status) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const vehicle = this.vehicles.find(v => v.vid === vid)
        if (vehicle) {
          Object.assign(vehicle, status, { lastUpdate: new Date().toISOString() })
        }
        resolve(vehicle)
      }, 300)
    })
  },

  // 发送控制指令
  sendControlCommand(vid, command) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`发送指令到车辆 ${vid}:`, command)
        resolve({ success: true, message: "指令发送成功" })
      }, 500)
    })
  },

  // 获取电池数据
  getBatteries() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.batteries])
      }, 500)
    })
  },

  // 添加报警
  addAlert(alert) {
    this.alerts.unshift({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      resolved: false,
      ...alert
    })
  },

  // 模拟实时数据更新
  startRealTimeUpdates(callback) {
    setInterval(() => {
      // 随机更新一些车辆数据
      this.vehicles.forEach(vehicle => {
        if (vehicle.online) {
          // 模拟电池电量变化
          if (Math.random() > 0.7) {
            vehicle.batteryLevel = Math.max(5, vehicle.batteryLevel - Math.random() * 3)
            vehicle.voltage = 3.0 + (vehicle.batteryLevel / 100) * 1.2
          }
          
          // 模拟温度变化
          if (Math.random() > 0.8) {
            vehicle.temperature = 20 + Math.random() * 15
          }
          
          // 模拟灯光状态变化
          if (Math.random() > 0.9) {
            const statuses = ["off", "lowBeam", "highBeam"]
            vehicle.lightStatus = statuses[Math.floor(Math.random() * statuses.length)]
          }
          
          vehicle.lastUpdate = new Date().toISOString()
        }
      })
      
      callback({
        vehicles: [...this.vehicles],
        alerts: [...this.alerts]
      })
    }, 3000)
  }
}