import { defineStore } from 'pinia'
import { mockDataService } from '../../services/mockData'

export const useVehicleStore = defineStore('vehicle', {
  state: () => ({
    vehicles: [],
    currentVehicle: null,
    onlineVehicles: [],
    vehicleStatus: {},
    loading: false,
    error: null
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
        const vehicles = await mockDataService.getVehicles()
        this.vehicles = vehicles
        this.onlineVehicles = vehicles.filter(v => v.online).map(v => v.vid)
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    async addVehicle(vehicle) {
      this.vehicles.push(vehicle)
      if (vehicle.online) {
        this.setVehicleOnline(vehicle.vid)
      }
    },
    
    async updateVehicleStatus(vid, status) {
      const vehicle = this.getVehicleById(vid)
      if (vehicle) {
        Object.assign(vehicle, status, { lastUpdate: new Date().toISOString() })
        await mockDataService.updateVehicleStatus(vid, status)
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
        const result = await mockDataService.sendControlCommand(vid, {
          type: 'lights',
          command: command
        })
        return result
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
    
    async controlVehicleHorn(vid, command) {
      try {
        const result = await mockDataService.sendControlCommand(vid, {
          type: 'horn', 
          command: command
        })
        return result
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
    
    startRealTimeUpdates() {
      mockDataService.startRealTimeUpdates((data) => {
        this.vehicles = data.vehicles
        this.onlineVehicles = data.vehicles.filter(v => v.online).map(v => v.vid)
      })
    }
  }
})