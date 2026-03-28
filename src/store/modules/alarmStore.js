import { defineStore } from 'pinia'
import { alarmAPI } from '../../services/api'

export const useAlarmStore = defineStore('alarm', {
  state: () => ({
    // 实时报警列表
    realtimeAlarms: [],
    
    // 历史报警列表
    historyAlarms: {
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
      resolved: false
    },
    
    // 统计信息
    statistics: {
      today: 0,
      week: 0,
      month: 0,
      byType: {},
      byLevel: {},
      trend: []
    },
    
    // 当前选中的报警
    currentAlarm: null,
    
    // WebSocket连接
    wsConnection: null,
    
    // 未读报警数量
    unreadCount: 0,
    
    // 加载状态
    loading: false,
    error: null
  }),

  getters: {
    // 获取未处理的报警
    getUnresolvedAlarms: (state) => {
      return state.realtimeAlarms.filter(alarm => !alarm.resolved)
    },
    
    // 按级别获取报警
    getAlarmsByLevel: (state) => (level) => {
      return state.realtimeAlarms.filter(alarm => alarm.level === level)
    },
    
    // 按类型获取报警
    getAlarmsByType: (state) => (type) => {
      return state.realtimeAlarms.filter(alarm => alarm.alarmType === type)
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
    // 初始化WebSocket连接
    initWebSocket() {
      // 如果已经有连接，先关闭
      if (this.wsConnection && this.wsConnection.readyState !== WebSocket.CLOSED) {
        this.wsConnection.close(1000, '重新初始化连接')
      }
      
      try {
        const wsUrl = 'ws://localhost:8080/websocket'
        
        this.wsConnection = new WebSocket(wsUrl)
        
        this.wsConnection.onopen = () => {
          console.log('报警WebSocket连接成功')
          this.error = null
        }
        
        this.wsConnection.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            console.log('收到WebSocket消息:', data)
            
            // 根据消息类型处理
            switch (data.type) {
              case 'new_alarm':
                this.handleNewAlarm(data.data)
                break
              case 'alarm_handled':
                this.handleAlarmHandled(data.data)
                break
              case 'ping':
                // 响应心跳包
                this.wsConnection.send(JSON.stringify({ type: 'pong' }))
                break
              default:
                console.warn('未知的WebSocket消息类型:', data.type)
            }
          } catch (error) {
            console.error('WebSocket消息解析错误:', error)
          }
        }
        
        this.wsConnection.onerror = (error) => {
          console.error('报警WebSocket连接错误:', error)
          this.error = '实时报警推送连接失败'
        }
        
        this.wsConnection.onclose = (event) => {
          console.log('报警WebSocket连接关闭，代码:', event.code, '原因:', event.reason)
          
          // 正常关闭不重连
          if (event.code === 1000) {
            console.log('WebSocket正常关闭，停止重连')
            return
          }
          
          // 非正常关闭，10秒后重连
          console.log('10秒后尝试重连WebSocket')
          setTimeout(() => {
            if (!this.wsConnection || this.wsConnection.readyState === WebSocket.CLOSED) {
              this.initWebSocket()
            }
          }, 10000)
        }
        
      } catch (error) {
        console.error('报警WebSocket初始化失败:', error)
        this.error = 'WebSocket初始化失败'
      }
    },
    
    // 处理新报警
    handleNewAlarm(alarmData) {
      // 检查是否已存在相同报警
      const existingAlarm = this.realtimeAlarms.find(a => 
        a.vid === alarmData.vid && 
        a.pid === alarmData.pid && 
        a.alarmType === alarmData.alarmType &&
        !a.resolved
      )
      
      if (!existingAlarm) {
        // 添加到实时列表开头
        this.realtimeAlarms.unshift({
          ...alarmData,
          id: alarmData.id || Date.now(), // 使用后端ID或临时ID
          timestamp: alarmData.timestamp || new Date().toISOString(),
          resolved: false
        })
        
        // 限制实时报警数量
        if (this.realtimeAlarms.length > 100) {
          this.realtimeAlarms = this.realtimeAlarms.slice(0, 100)
        }
        
        // 更新未读数量
        this.unreadCount += 1
        
        // 更新统计信息
        this.updateStatistics(alarmData)
        
        // 播放报警音效（如果是高优先级）
        if (alarmData.level === 'high') {
          this.playAlarmSound()
        }
        
        // 显示通知
        this.showNotification(alarmData)
      }
    },
    
    // 处理报警已处理消息
    handleAlarmHandled(alarmData) {
      // 更新实时报警状态
      const alarm = this.realtimeAlarms.find(a => a.id === alarmData.id)
      if (alarm) {
        alarm.resolved = true
        alarm.handledBy = alarmData.handledBy
        alarm.handledAt = alarmData.handledAt
      }
      
      // 更新历史报警状态
      const historyAlarm = this.historyAlarms.data.find(a => a.id === alarmData.id)
      if (historyAlarm) {
        historyAlarm.resolved = true
        historyAlarm.handledBy = alarmData.handledBy
        historyAlarm.handledAt = alarmData.handledAt
      }
      
      // 减少未读数量
      if (this.unreadCount > 0) {
        this.unreadCount -= 1
      }
    },
    
    // 播放报警音效
    playAlarmSound() {
      // 创建简单的音效
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2)
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
      } catch (error) {
        console.warn('音效播放失败:', error)
      }
    },
    
    // 显示通知
    showNotification(alarmData) {
      // 创建浏览器通知
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('电池报警', {
          body: `${this.getAlarmTypeText(alarmData.alarmType)} - ${this.getLevelText(alarmData.level)}级别`,
          icon: '/favicon.ico'
        })
      }
    },
    
    // 更新统计信息
    updateStatistics(alarmData) {
      // 更新今日报警数量
      const today = new Date().toDateString()
      const alarmDate = new Date(alarmData.timestamp).toDateString()
      if (today === alarmDate) {
        this.statistics.today += 1
      }
      
      // 按类型统计
      if (!this.statistics.byType[alarmData.alarmType]) {
        this.statistics.byType[alarmData.alarmType] = 0
      }
      this.statistics.byType[alarmData.alarmType] += 1
      
      // 按级别统计
      if (!this.statistics.byLevel[alarmData.level]) {
        this.statistics.byLevel[alarmData.level] = 0
      }
      this.statistics.byLevel[alarmData.level] += 1
    },
    
    // 获取历史报警
    async fetchHistoryAlarms(params = {}) {
      this.historyAlarms.loading = true
      this.error = null
      
      try {
        const response = await alarmAPI.getAlarms({
          page: this.historyAlarms.pagination.current - 1, // 后端从0开始
          size: this.historyAlarms.pagination.pageSize,
          ...this.filters,
          ...params
        })
        
        // 后端返回格式: { code: 200, message: "成功", data: { content: [...], totalElements: N } }
        if (response && response.code === 200 && response.data) {
          this.historyAlarms.data = response.data.content || []
          this.historyAlarms.pagination.total = response.data.totalElements || 0
        } else {
          throw new Error(response?.message || '获取报警历史失败')
        }
        
      } catch (error) {
        // 如果API返回404，说明报警功能尚未实现
        if (error.response && error.response.status === 404) {
          console.warn('报警API尚未实现，使用空数据')
          this.historyAlarms.data = []
          this.historyAlarms.pagination.total = 0
          this.error = '报警功能正在开发中，敬请期待'
        } else {
          this.error = error.message
          console.error('获取历史报警失败:', error)
        }
      } finally {
        this.historyAlarms.loading = false
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
          this.statistics = {
            today: 0,
            week: 0,
            month: 0,
            byType: {},
            byLevel: {},
            trend: []
          }
        } else {
          console.error('获取报警统计失败:', error)
        }
      }
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