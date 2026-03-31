import { defineStore } from 'pinia'
import { batteryAPI } from '../../services/api'

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
    },
    
    // 根据文档中的统计字段
    totalBatteries: (state) => state.batteries.length,
    
    inUseBatteries: (state) => state.batteries.filter(b => b.vid && b.vid.trim() !== '').length,
    
    availableBatteries: (state) => state.batteries.filter(b => !b.vid || b.vid.trim() === '').length,
    
    maintenanceBatteries: (state) => state.batteries.filter(b => b.status === 'maintenance').length,
    
    // 兼容API文档的状态字段（如果后端实现了健康状态统计）
    normalBatteries: (state) => state.batteries.filter(b => b.status === 'normal').length,
    lowBatteries: (state) => state.batteries.filter(b => b.status === 'low').length,
    overheatBatteries: (state) => state.batteries.filter(b => b.status === 'overheat').length,
    lowVoltageBatteries: (state) => state.batteries.filter(b => b.status === 'low_voltage').length
  },
  
  actions: {
    async fetchBatteries(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await batteryAPI.getBatteries(params)
        
        // 处理后端API响应格式: { code: 200, message: "成功", data: { content: [...], totalElements: N } }
        if (response && response.code === 200 && response.data) {
          if (Array.isArray(response.data.content)) {
            this.batteries = response.data.content
            console.log('电池数据加载成功，数量:', response.data.content.length)
            // 打印电池状态分布
            this.logBatteryStatusDistribution()
          } else if (Array.isArray(response.data)) {
            this.batteries = response.data
            console.log('电池数据加载成功（data数组格式），数量:', response.data.length)
            // 打印电池状态分布
            this.logBatteryStatusDistribution()
          } else {
            throw new Error('API返回的数据格式错误: data字段不是数组')
          }
        } else {
          throw new Error(response?.message || '获取电池数据失败')
        }
      } catch (error) {
        // 如果API返回404，说明电池功能尚未实现
        if (error.response && error.response.status === 404) {
          console.warn('电池API尚未实现，使用空数据')
          this.batteries = []
          this.error = '电池功能正在开发中，敬请期待'
        } else {
          this.error = error.message
          console.error('获取电池数据失败:', error)
        }
      } finally {
        this.loading = false
      }
    },
    
    // 获取电池历史记录
    async fetchBatteryHistory(pid, params = {}) {
      try {
        const response = await batteryAPI.getBatteryHistory(pid, params)
        
        // 处理后端API响应格式: { code: 200, message: "成功", data: [...] }
        if (response && response.code === 200 && response.data) {
          if (Array.isArray(response.data)) {
            this.batteryHistory[pid] = response.data
          } else {
            throw new Error('API返回的历史数据格式错误')
          }
          
          console.log(`电池${pid}历史记录加载成功，数量:`, response.data.length)
          return response.data
        } else {
          throw new Error(response?.message || '获取电池历史记录失败')
        }
      } catch (error) {
        // 如果API返回404，说明电池功能尚未实现
        if (error.response && error.response.status === 404) {
          console.warn('电池历史API尚未实现，返回空数据')
          this.batteryHistory[pid] = []
          return []
        }
        console.error(`获取电池${pid}历史记录失败:`, error)
        throw error
      }
    },
    
    // 获取单个电池信息
    async fetchBattery(pid) {
      try {
        const response = await batteryAPI.getBattery(pid)
        
        // 处理后端API响应格式: { code: 200, message: "成功", data: {...} }
        if (response && response.code === 200 && response.data) {
          console.log(`电池${pid}信息加载成功`)
          return response.data
        } else {
          throw new Error(response?.message || '获取电池信息失败')
        }
      } catch (error) {
        // 如果API返回404，说明电池功能尚未实现
        if (error.response && error.response.status === 404) {
          console.warn('电池API尚未实现，返回空数据')
          return null
        }
        console.error(`获取电池${pid}信息失败:`, error)
        throw error
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
    },
    
    resolveAlert(alertId) {
      const alert = this.batteryAlerts.find(a => a.id === alertId)
      if (alert) {
        alert.resolved = true
      }
    },
    
    startRealTimeUpdates() {
      console.log('电池实时更新已启动')
      // 这里可以添加WebSocket连接逻辑
    },
    
    logBatteryStatusDistribution() {
      if (this.batteries.length === 0) {
        console.log('电池列表为空，无法统计状态分布')
        return
      }
      
      const statusCount = {}
      this.batteries.forEach(battery => {
        const status = battery.status || 'unknown'
        statusCount[status] = (statusCount[status] || 0) + 1
      })
      
      console.log('电池状态分布:', statusCount)
      console.log('电池状态详情:')
      this.batteries.forEach(battery => {
        console.log(`电池 ${battery.pid}: 状态=${battery.status}, 电量=${battery.batteryLevel}%, 电压=${battery.voltage}V, 温度=${battery.temperature}°C`)
      })
    },

    // 获取电池统计信息
    async fetchBatteryStatistics() {
      try {
        const response = await batteryAPI.getBatteryStatistics()
        
        // 处理后端API响应格式: { code: 200, message: "成功", data: {...} }
        if (response && response.code === 200 && response.data) {
          console.log('电池统计信息加载成功')
          return response.data
        } else {
          throw new Error(response?.message || '获取电池统计信息失败')
        }
      } catch (error) {
        // 如果API返回404，说明电池功能尚未实现
        if (error.response && error.response.status === 404) {
          console.warn('电池统计API尚未实现，返回空数据')
          return {
            totalBatteries: 0,
            normalBatteries: 0,
            lowBatteries: 0,
            overheatBatteries: 0,
            lowVoltageBatteries: 0
          }
        }
        console.error('获取电池统计信息失败:', error)
        throw error
      }
    }
  }
})