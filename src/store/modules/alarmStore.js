import { defineStore } from 'pinia'
import { alarmAPI } from '../../services/api'

export const useAlarmStore = defineStore('alarm', {
  state: () => ({
    // 报警列表数据
    alarms: {
      data: [],
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0
      },
      loading: false
    },
    
    // 筛选条件
    filters: {
      type: null,
      level: null,
      startTime: null,
      endTime: null,
      resolved: false,
      vid: null,      // 车辆编号筛选
      pid: null       // 电池编号筛选
    },
    
    // 统计信息
    statistics: {
      today: 0,
      week: 0,
      month: 0,
      unresolved: 0,  // 未处理报警数
      byType: {},
      byLevel: {},
      byVehicle: {},  // 按车辆统计
      byBattery: {}   // 按电池统计
    },
    
    // 当前选中的报警
    currentAlarm: null,
    
    // 加载状态
    loading: false,
    error: null
  }),

  getters: {
    // 获取筛选后的报警列表
    getFilteredAlarms: (state) => {
      let alarms = state.alarms.data
      
      // 应用筛选条件
      if (state.filters.type) {
        alarms = alarms.filter(alarm => alarm.alarmType === state.filters.type)
      }
      
      if (state.filters.level) {
        alarms = alarms.filter(alarm => alarm.level === state.filters.level)
      }
      
      if (state.filters.vid) {
        alarms = alarms.filter(alarm => alarm.vid === state.filters.vid)
      }
      
      if (state.filters.pid) {
        alarms = alarms.filter(alarm => alarm.pid === state.filters.pid)
      }
      
      if (state.filters.resolved !== null) {
        alarms = alarms.filter(alarm => alarm.resolved === state.filters.resolved)
      }
      
      if (state.filters.startTime) {
        alarms = alarms.filter(alarm => 
          new Date(alarm.timestamp) >= new Date(state.filters.startTime)
        )
      }
      
      if (state.filters.endTime) {
        alarms = alarms.filter(alarm => 
          new Date(alarm.timestamp) <= new Date(state.filters.endTime + 'T23:59:59')
        )
      }
      
      return alarms
    },
    
    // 获取未处理的报警
    getUnresolvedAlarms: (state) => {
      return state.alarms.data.filter(alarm => !alarm.resolved)
    },
    
    // 获取报警级别颜色
    getLevelColor: () => (level) => {
      const colors = {
        high: '#ff4d4f',
        medium: '#faad14',
        low: '#52c41a'
      }
      return colors[level] || '#d9d9d9'
    },
    
    // 获取报警类型文本
    getAlarmTypeText: () => (type) => {
      const types = {
        temperature: '温度异常',
        voltage: '电压异常',
        current: '电流异常',
        soc: '电量异常',
        connection: '连接异常'
      }
      return types[type] || type
    },
    
    // 获取报警级别文本
    getLevelText: () => (level) => {
      const levels = {
        high: '高',
        medium: '中',
        low: '低'
      }
      return levels[level] || level
    }
  },

  actions: {
    
    // 获取历史报警
    async fetchHistoryAlarms(params = {}) {
      this.alarms.loading = true
      this.error = null
      
      try {
        const response = await alarmAPI.getHistoryAlarms({
          page: this.alarms.pagination.current - 1, // 后端从0开始
          size: this.alarms.pagination.pageSize,
          ...this.filters,
          ...params
        })
        
        // 后端返回格式: { code: 200, message: "成功", data: { content: [...], totalElements: N } }
        if (response && response.code === 200 && response.data) {
          this.alarms.data = response.data.content || []
          this.alarms.pagination.total = response.data.totalElements || 0
          
          // 更新统计信息
          this.updateStatisticsFromData(this.alarms.data)
        } else {
          throw new Error(response?.message || '获取报警数据失败')
        }
        
      } catch (error) {
        // 如果API返回404，说明报警功能尚未实现
        if (error.response && error.response.status === 404) {
          console.warn('报警API尚未实现，使用空数据')
          this.alarms.data = []
          this.alarms.pagination.total = 0
          this.error = '报警功能正在开发中，敬请期待'
        } else {
          this.error = error.message
          console.error('获取报警数据失败:', error)
        }
      } finally {
        this.alarms.loading = false
      }
    },
    
    // 获取报警统计
    async fetchStatistics(period = 'today') {
      try {
        const response = await alarmAPI.getAlarmStatistics({ period })
        
        // 后端返回格式: { code: 200, message: "成功", data: {...} }
        if (response && response.code === 200 && response.data) {
          this.statistics = { ...this.statistics, ...response.data }
        } else {
          throw new Error(response?.message || '获取报警统计失败')
        }
      } catch (error) {
        // 如果API返回404，说明报警功能尚未实现
        if (error.response && error.response.status === 404) {
          console.warn('报警统计API尚未实现，使用默认统计')
          this.updateStatisticsFromData(this.alarms.data)
        } else {
          console.error('获取报警统计失败:', error)
        }
      }
    },
    
    // 从数据更新统计信息
    updateStatisticsFromData(alarms) {
      const today = new Date().toISOString().split('T')[0]
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      
      this.statistics = {
        today: alarms.filter(a => a.timestamp.startsWith(today)).length,
        week: alarms.filter(a => a.timestamp >= weekAgo).length,
        month: alarms.filter(a => a.timestamp >= monthAgo).length,
        unresolved: alarms.filter(a => !a.resolved).length,
        byType: {},
        byLevel: {},
        byVehicle: {},
        byBattery: {}
      }
      
      // 按类型统计
      alarms.forEach(alarm => {
        if (!this.statistics.byType[alarm.alarmType]) {
          this.statistics.byType[alarm.alarmType] = 0
        }
        this.statistics.byType[alarm.alarmType]++
        
        // 按级别统计
        if (!this.statistics.byLevel[alarm.level]) {
          this.statistics.byLevel[alarm.level] = 0
        }
        this.statistics.byLevel[alarm.level]++
        
        // 按车辆统计
        if (alarm.vid) {
          if (!this.statistics.byVehicle[alarm.vid]) {
            this.statistics.byVehicle[alarm.vid] = 0
          }
          this.statistics.byVehicle[alarm.vid]++
        }
        
        // 按电池统计
        if (alarm.pid) {
          if (!this.statistics.byBattery[alarm.pid]) {
            this.statistics.byBattery[alarm.pid] = 0
          }
          this.statistics.byBattery[alarm.pid]++
        }
      })
    },
    
    // 标记报警为已处理
    async handleAlarm(alarmId) {
      try {
        const response = await alarmAPI.handleAlarm(alarmId)
        
        // 后端返回格式: { code: 200, message: "报警已标记为已处理", data: null }
        if (response && response.code === 200) {
          // 更新实时报警状态
          const alarm = this.realtimeAlarms.find(a => a.id === alarmId)
          if (alarm) {
            alarm.resolved = true
          }
          
          // 更新历史报警状态
          const historyAlarm = this.historyAlarms.data.find(a => a.id === alarmId)
          if (historyAlarm) {
            historyAlarm.resolved = true
          }
          
          // 减少未读数量
          if (this.unreadCount > 0) {
            this.unreadCount -= 1
          }
        } else {
          throw new Error(response?.message || '处理报警失败')
        }
        
      } catch (error) {
        // 如果API返回404，说明报警功能尚未实现
        if (error.response && error.response.status === 404) {
          console.warn('报警处理API尚未实现')
          throw new Error('报警处理功能正在开发中，请稍后再试')
        } else {
          this.error = error.message
          console.error('处理报警失败:', error)
          throw error
        }
      }
    },
    
    // 删除报警
    async deleteAlarm(alarmId) {
      try {
        const response = await alarmAPI.deleteAlarm(alarmId)
        
        // 后端返回格式: { code: 200, message: "报警删除成功", data: null }
        if (response && response.code === 200) {
          // 从实时报警列表中移除
          this.realtimeAlarms = this.realtimeAlarms.filter(a => a.id !== alarmId)
          
          // 从历史报警列表中移除
          this.historyAlarms.data = this.historyAlarms.data.filter(a => a.id !== alarmId)
          this.historyAlarms.pagination.total -= 1
          
          // 如果删除的是未读报警，减少未读数量
          const deletedAlarm = this.realtimeAlarms.find(a => a.id === alarmId)
          if (deletedAlarm && !deletedAlarm.resolved && this.unreadCount > 0) {
            this.unreadCount -= 1
          }
        } else {
          throw new Error(response?.message || '删除报警失败')
        }
        
      } catch (error) {
        // 如果API返回404，说明报警功能尚未实现
        if (error.response && error.response.status === 404) {
          console.warn('报警删除API尚未实现')
          throw new Error('报警删除功能正在开发中，请稍后再试')
        } else {
          this.error = error.message
          console.error('删除报警失败:', error)
          throw error
        }
      }
    },
    
    // 设置筛选条件
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
      this.fetchHistoryAlarms()
    },
    
    // 设置当前报警
    setCurrentAlarm(alarm) {
      this.currentAlarm = alarm
    },
    
    // 清除所有报警
    clearAllAlarms() {
      this.realtimeAlarms = []
      this.unreadCount = 0
    },
    
    // 标记所有报警为已读
    markAllAsRead() {
      this.unreadCount = 0
    }
  }
})