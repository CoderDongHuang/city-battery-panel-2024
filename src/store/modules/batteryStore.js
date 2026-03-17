import { defineStore } from 'pinia'

export const useBatteryStore = defineStore('battery', {
  state: () => ({
    batteries: [],
    batteryHistory: {},
    batteryAlerts: []
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
    addBattery(battery) {
      this.batteries.push(battery)
    },
    
    updateBatteryStatus(pid, status) {
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
      this.batteryAlerts.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        resolved: false,
        ...alert
      })
    },
    
    resolveAlert(alertId) {
      const alert = this.batteryAlerts.find(a => a.id === alertId)
      if (alert) {
        alert.resolved = true
      }
    }
  }
})