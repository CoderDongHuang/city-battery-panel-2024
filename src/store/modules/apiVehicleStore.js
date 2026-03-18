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
        if (response.code === 200) {
          this.vehicles = response.data
          this.onlineVehicles = response.data.filter(v => v.online).map(v => v.vid)
        } else {
          throw new Error(response.message || '获取车辆数据失败')
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
          const vehicle = this.getVehicleById(data.vid)
          if (vehicle) {
            Object.assign(vehicle, data.status)
          }
        } else if (data.type === 'vehicle_online') {
          this.setVehicleOnline(data.vid)
        } else if (data.type === 'vehicle_offline') {
          this.setVehicleOffline(data.vid)
        }
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