import { defineStore } from 'pinia'
import { mockDataService } from '../../services/mockData'

export const useBatteryStore = defineStore('battery', {
  state: () => ({
    batteries: [],
    batteryHistory: {},
    batteryAlerts: [],
    loading: false,
    error: null
  }),
  
  getters: {
    getBatteryById: (state) => (pid) => {
      return state.batteries.find(battery => battery.pid === pid)
    },
    
    getBatteryHistory: (state) => (pid) => {
      return state.batteryHistory[pid] || []
    },
    
    getActiveAlerts: (state) => {
      return state.batteryAlerts.filter(alert => !alert.resolved)
    }
  },
  
  actions: {
    async fetchBatteries() {
      this.loading = true
      this.error = null
      try {
        const batteries = await mockDataService.getBatteries()
        this.batteries = batteries
        
        // 初始化电池历史数据
        batteries.forEach(battery => {
          if (battery.history && battery.history.length > 0) {
            this.batteryHistory[battery.pid] = battery.history
          }
        })
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    async addBattery(battery) {
      this.batteries.push(battery)
    },
    
    async updateBatteryStatus(pid, status) {
      const battery = this.getBatteryById(pid)
      if (battery) {
        Object.assign(battery, status)
        this.recordBatteryHistory(pid, status)
      }
    },
    
    recordBatteryHistory(pid, data) {
      if (!this.batteryHistory[pid]) {
        this.batteryHistory[pid] = []
      }
      this.batteryHistory[pid].push({
        timestamp: new Date().toISOString(),
        ...data
      })
    },
    
    addBatteryAlert(alert) {
      this.batteryAlerts.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        resolved: false,
        ...alert
      })
      mockDataService.addAlert(alert)
    },
    
    resolveAlert(alertId) {
      const alert = this.batteryAlerts.find(a => a.id === alertId)
      if (alert) {
        alert.resolved = true
      }
    }
  }
})