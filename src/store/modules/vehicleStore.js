import { defineStore } from 'pinia'

export const useVehicleStore = defineStore('vehicle', {
  state: () => ({
    vehicles: [],
    currentVehicle: null,
    onlineVehicles: [],
    vehicleStatus: {}
  }),
  
  getters: {
    getVehicleById: (state) => (vid) => {
      return state.vehicles.find(vehicle => vehicle.vid === vid)
    },
    
    getOnlineVehicles: (state) => {
      return state.vehicles.filter(vehicle => state.onlineVehicles.includes(vehicle.vid))
    },
    
    getVehicleStatus: (state) => (vid) => {
      return state.vehicleStatus[vid] || {}
    }
  },
  
  actions: {
    addVehicle(vehicle) {
      this.vehicles.push(vehicle)
    },
    
    updateVehicleStatus(vid, status) {
      this.vehicleStatus[vid] = { ...this.vehicleStatus[vid], ...status }
    },
    
    setVehicleOnline(vid) {
      if (!this.onlineVehicles.includes(vid)) {
        this.onlineVehicles.push(vid)
      }
    },
    
    setVehicleOffline(vid) {
      this.onlineVehicles = this.onlineVehicles.filter(v => v !== vid)
    },
    
    controlVehicleLights(vid, command) {
      // 发送控制指令到车载系统
      console.log(`控制车辆 ${vid} 灯光:`, command)
    },
    
    controlVehicleHorn(vid, command) {
      // 发送控制指令到车载系统
      console.log(`控制车辆 ${vid} 喇叭:`, command)
    }
  }
})