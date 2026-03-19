import { defineStore } from 'pinia'
import { batteryAPI } from '../../services/api'

export const useApiBatteryStore = defineStore('apiBattery', {
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
    async fetchBatteries(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await batteryAPI.getBatteries(params)
        if (response.code === 200) {
          this.batteries = response.data
          
          // 初始化电池历史数据
          response.data.forEach(battery => {
            if (battery.history && battery.history.length > 0) {
              this.batteryHistory[battery.pid] = battery.history
            }
          })
        } else {
          throw new Error(response.message || '获取电池数据失败')
        }
      } catch (error) {
        this.error = error.message
        console.error('获取电池数据失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    async fetchBatteryHistory(pid, params = {}) {
      try {
        const response = await batteryAPI.getBatteryHistory(pid, params)
        if (response.code === 200) {
          this.batteryHistory[pid] = response.data
          return response.data
        } else {
          throw new Error(response.message || '获取电池历史失败')
        }
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
    
    async addBattery(battery) {
      // 这里需要后端提供添加电池的接口
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
    
    async addBatteryAlert(alert) {
      try {
        const response = await alertAPI.addAlert(alert)
        if (response.code === 200) {
          this.batteryAlerts.unshift({
            id: Date.now(),
            timestamp: new Date().toISOString(),
            resolved: false,
            ...alert
          })
        } else {
          throw new Error(response.message || '添加报警失败')
        }
      } catch (error) {
        this.error = error.message
        throw error
      }
    },
    
    async resolveAlert(alertId) {
      try {
        const response = await alertAPI.resolveAlert(alertId)
        if (response.code === 200) {
          const alert = this.batteryAlerts.find(a => a.id === alertId)
          if (alert) {
            alert.resolved = true
          }
        } else {
          throw new Error(response.message || '解决报警失败')
        }
      } catch (error) {
        this.error = error.message
        throw error
      }
    }
  }
})