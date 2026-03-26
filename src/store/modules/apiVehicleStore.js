import { defineStore } from 'pinia'
import { vehicleAPI, createWebSocket } from '../../services/api'

export const useApiVehicleStore = defineStore('apiVehicle', {
  state: () => ({
    vehicles: [],
    currentVehicle: null,
    onlineVehicles: [],
    vehicleStatus: {},
    loading: false,
    error: null,
    wsConnection: null
  }),
  
  getters: {
    getVehicleById: (state) => (vid) => {
      return state.vehicles.find(vehicle => vehicle.vid === vid)
    },
    
    getOnlineVehicles: (state) => {
      return state.vehicles.filter(vehicle => vehicle.online)
    },
    
    getVehicleStatus: (state) => (vid) => {
      return state.vehicleStatus[vid] || {}
    },
    
    getLowBatteryVehicles: (state) => {
      return state.vehicles.filter(vehicle => vehicle.batteryLevel < 30)
    }
  },
  
  actions: {
    async fetchVehicles() {
      this.loading = true
      this.error = null
      try {
        const response = await vehicleAPI.getVehicles()
        
        // 处理不同的响应格式
        if (typeof response === 'string') {
          // 如果后端直接返回字符串（如"success"），说明没有数据
          console.warn('后端返回字符串响应，可能没有车辆数据')
          this.vehicles = []
          this.onlineVehicles = []
        } else if (Array.isArray(response)) {
          // 如果后端直接返回数组
          this.vehicles = response
          this.onlineVehicles = response.filter(v => v.online || v.onlineStatus).map(v => v.vid)
          console.log('车辆数据加载成功（数组格式），数量:', response.length)
        } else if (response && response.code === 200 && response.data) {
          // 标准格式: { code: 200, message: "成功", data: { content: [...], totalElements: N } }
          if (Array.isArray(response.data.content)) {
            this.vehicles = response.data.content
            this.onlineVehicles = response.data.content.filter(v => v.online || v.onlineStatus).map(v => v.vid)
            console.log('车辆数据加载成功（标准格式），数量:', response.data.content.length)
          } else if (Array.isArray(response.data)) {
            // 如果data直接是数组
            this.vehicles = response.data
            this.onlineVehicles = response.data.filter(v => v.online || v.onlineStatus).map(v => v.vid)
            console.log('车辆数据加载成功（data数组格式），数量:', response.data.length)
          } else {
            throw new Error('API返回的数据格式错误: data字段不是数组')
          }
        } else {
          throw new Error(response?.message || 'API返回的数据格式错误')
        }
      } catch (error) {
        this.error = error.message
        console.error('获取车辆数据失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    async addVehicle(vehicle) {
      // 这里需要后端提供添加车辆的接口
      this.vehicles.push(vehicle)
      if (vehicle.online) {
        this.setVehicleOnline(vehicle.vid)
      }
    },
    
    async updateVehicleStatus(vid, status) {
      try {
        const response = await vehicleAPI.updateVehicleStatus(vid, status)
        if (response.code === 200) {
          const vehicle = this.getVehicleById(vid)
          if (vehicle) {
            Object.assign(vehicle, status, { lastUpdate: new Date().toISOString() })
          }
        } else {
          throw new Error(response.message || '状态更新失败')
        }
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
    
    setVehicleOnline(vid) {
      if (!this.onlineVehicles.includes(vid)) {
        this.onlineVehicles.push(vid)
      }
      const vehicle = this.getVehicleById(vid)
      if (vehicle) {
        vehicle.online = true
      }
    },
    
    setVehicleOffline(vid) {
      this.onlineVehicles = this.onlineVehicles.filter(v => v !== vid)
      const vehicle = this.getVehicleById(vid)
      if (vehicle) {
        vehicle.online = false
      }
    },
    
    async controlVehicleLights(vid, command) {
      try {
        const response = await vehicleAPI.controlLights(vid, command)
        if (response.code === 200) {
          return response
        } else {
          throw new Error(response.message || '灯光控制失败')
        }
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
    
    async controlVehicleHorn(vid, command) {
      try {
        const response = await vehicleAPI.controlHorn(vid, command)
        if (response.code === 200) {
          return response
        } else {
          throw new Error(response.message || '喇叭控制失败')
        }
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
    
    // 启动WebSocket实时数据更新
    startRealTimeUpdates() {
      if (this.wsConnection) {
        this.wsConnection.close()
      }
      
      this.wsConnection = createWebSocket((data) => {
        if (data.type === 'vehicle_update') {
          // 更新车辆数据
          this.vehicles = data.data
        } else if (data.type === 'initial_data') {
          // 初始化数据
          this.vehicles = data.data.vehicles || []
        } else if (data.type === 'vehicle_online') {
          this.setVehicleOnline(data.vid)
        } else if (data.type === 'vehicle_offline') {
          this.setVehicleOffline(data.vid)
        }
      }, (status) => {
        // 连接状态变化回调
        this.wsStatus = status
        console.log('WebSocket连接状态:', status)
      })
    },
    
    // 停止实时更新
    stopRealTimeUpdates() {
      if (this.wsConnection) {
        this.wsConnection.close()
        this.wsConnection = null
      }
    }
  }
})