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
      try {
        const wsUrl = 'ws://localhost:8080/websocket'
        
        this.wsConnection = new WebSocket(wsUrl)
        
        this.wsConnection.onopen = () => {
          console.log('WebSocket连接成功')
          // 发送认证信息
          this.wsConnection.send(JSON.stringify({
            type: 'auth',
            token: 'user-token'
          }))
        }
        
        this.wsConnection.onmessage = (event) => {
          const data = JSON.parse(event.data)
          if (data.type === 'battery_alarm') {
            this.handleNewAlarm(data)
          }
        }
        
        this.wsConnection.onerror = (error) => {
          console.error('WebSocket错误:', error)
          this.error = 'WebSocket连接失败'
        }
        
        this.wsConnection.onclose = () => {
          console.log('WebSocket连接关闭')
          // 5秒后重连
          setTimeout(() => {
            this.initWebSocket()
          }, 5000)
        }
        
      } catch (error) {
        console.error('WebSocket初始化失败:', error)
        this.error = error.message
      }
    },
    
    // 处理新报警
    handleNewAlarm(alarmData) {
      // 添加到实时列表开头
      this.realtimeAlarms.unshift({
        ...alarmData,
        id: Date.now(), // 临时ID
        timestamp: new Date().toISOString(),
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
        this.error = error.message
        console.error('获取历史报警失败:', error)
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
        console.error('获取报警统计失败:', error)
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
        this.error = error.message
        console.error('处理报警失败:', error)
        throw error
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