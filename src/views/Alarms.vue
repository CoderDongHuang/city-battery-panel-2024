<template>
  <div class="alarms-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1>🚨 电池报警管理</h1>
        <p>查看和管理所有电池系统的报警信息</p>
      </div>
      <div class="header-actions">
        <button class="action-btn export-btn" @click="exportAlarms">
          <span class="btn-icon">📊</span>
          导出报表
        </button>
        <button class="action-btn refresh-btn" @click="refreshAlarms">
          <span class="btn-icon">🔄</span>
          刷新数据
        </button>
      </div>
    </div>
    
    <!-- 报警统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon" style="background: #fff2f0; color: #ff4d4f;">🔥</div>
        <div class="stat-content">
          <div class="stat-value">{{ alarmStore.statistics.today }}</div>
          <div class="stat-label">今日报警</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon" style="background: #fff7e6; color: #faad14;">📊</div>
        <div class="stat-content">
          <div class="stat-value">{{ alarmStore.statistics.week }}</div>
          <div class="stat-label">本周报警</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon" style="background: #f6ffed; color: #52c41a;">📈</div>
        <div class="stat-content">
          <div class="stat-value">{{ alarmStore.statistics.month }}</div>
          <div class="stat-label">本月报警</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon" style="background: #f0f8ff; color: #1890ff;">⚠️</div>
        <div class="stat-content">
          <div class="stat-value">{{ alarmStore.statistics.unresolved }}</div>
          <div class="stat-label">未处理</div>
        </div>
      </div>
    </div>
    
    <!-- 筛选工具栏 -->
    <div class="filter-toolbar">
      <div class="filter-group">
        <label>报警类型：</label>
        <select v-model="alarmStore.filters.type" @change="applyFilters">
          <option value="">全部类型</option>
          <option value="temperature">温度异常</option>
          <option value="voltage">电压异常</option>
          <option value="current">电流异常</option>
          <option value="soc">电量异常</option>
          <option value="connection">连接异常</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>报警级别：</label>
        <select v-model="alarmStore.filters.level" @change="applyFilters">
          <option value="">全部级别</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>处理状态：</label>
        <select v-model="alarmStore.filters.resolved" @change="applyFilters">
          <option :value="null">全部状态</option>
          <option :value="false">未处理</option>
          <option :value="true">已处理</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>开始时间：</label>
        <input type="date" v-model="alarmStore.filters.startTime" @change="applyFilters">
      </div>
      
      <div class="filter-group">
        <label>结束时间：</label>
        <input type="date" v-model="alarmStore.filters.endTime" @change="applyFilters">
      </div>
      
      <div class="filter-actions">
        <button class="clear-btn" @click="clearFilters">清除筛选</button>
      </div>
    </div>

    <!-- 报警列表 -->
    <div class="alarm-content">
      <!-- 加载状态 -->
      <div v-if="alarmStore.alarms.loading" class="loading-state">
        <div class="loading-icon">⏳</div>
        <div class="loading-text">正在加载报警数据...</div>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="alarmStore.error" class="error-state">
        <div class="error-icon">⚠️</div>
        <div class="error-content">
          <h3>数据加载失败</h3>
          <p>{{ alarmStore.error }}</p>
          <button class="retry-btn" @click="refreshAlarms">重试</button>
        </div>
      </div>
      
      <!-- 正常状态 -->
      <div v-else>
        <AlarmList @view-detail="showAlarmDetail" />
      </div>
    </div>
    
    <!-- 报警详情模态框 -->
    <AlarmDetail 
      :visible="detailVisible" 
      :alarm="currentAlarm"
      @close="hideAlarmDetail"
      @alarm-handled="handleAlarmHandled"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAlarmStore } from '../store/modules/alarmStore'
import AlarmList from '../components/AlarmList.vue'
import AlarmDetail from '../components/AlarmDetail.vue'

const alarmStore = useAlarmStore()

// 响应式数据
const detailVisible = ref(false)
const currentAlarm = ref({})

// 方法
const showAlarmDetail = (alarm) => {
  currentAlarm.value = alarm
  detailVisible.value = true
}

const hideAlarmDetail = () => {
  detailVisible.value = false
  currentAlarm.value = {}
}

const handleAlarmHandled = (alarmId) => {
  console.log('报警已处理:', alarmId)
  // 刷新报警列表和统计
  refreshAlarms()
}

// 刷新报警数据
const refreshAlarms = async () => {
  try {
    await alarmStore.fetchStatistics('today')
    await alarmStore.fetchHistoryAlarms()
  } catch (error) {
    console.error('刷新报警数据失败:', error)
  }
}

// 导出报警数据
const exportAlarms = () => {
  const alarms = alarmStore.alarms.data
  if (alarms.length === 0) {
    alert('暂无报警数据可导出')
    return
  }
  
  // 创建CSV格式数据
  const headers = ['报警ID', '车辆编号', '电池编号', '报警类型', '级别', '触发值', '阈值', '时间', '状态']
  const csvData = alarms.map(alarm => [
    alarm.id,
    alarm.vid || '未知',
    alarm.pid || '未知',
    alarmStore.getAlarmTypeText(alarm.alarmType),
    alarmStore.getLevelText(alarm.level),
    alarm.triggerValue,
    alarm.thresholdValue,
    new Date(alarm.timestamp).toLocaleString('zh-CN'),
    alarm.resolved ? '已处理' : '未处理'
  ])
  
  // 创建CSV内容
  const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n')
  
  // 创建下载链接
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `电池报警数据_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

// 防抖函数
const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

// 防抖后的刷新函数
const debouncedRefreshAlarms = debounce(refreshAlarms, 500)

// 应用筛选（防抖）
const applyFilters = () => {
  debouncedRefreshAlarms()
}

// 清除筛选（立即执行）
const clearFilters = () => {
  alarmStore.filters = {
    type: null,
    level: null,
    startTime: null,
    endTime: null,
    resolved: null,
    vid: null,
    pid: null
  }
  // 清除筛选后立即刷新，不需要防抖
  refreshAlarms()
}

// 生命周期
onMounted(() => {
  // 初始化报警数据
  refreshAlarms()
})
</script>

<style scoped>
.alarms-view {
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.header-content {
  flex: 1;
}

.page-header h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.page-header p {
  margin: 0;
  font-size: 16px;
  color: #666;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.export-btn {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: white;
}

.export-btn:hover {
  background: linear-gradient(135deg, #ff5252 0%, #e74c3c 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.refresh-btn {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  color: white;
}

.refresh-btn:hover {
  background: linear-gradient(135deg, #26c6da 0%, #00acc1 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.3);
}

.btn-icon {
  font-size: 16px;
}

/* 筛选工具栏 */
.filter-toolbar {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}

.filter-group select,
.filter-group input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  min-width: 120px;
}

.filter-group select:focus,
.filter-group input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.filter-actions {
  margin-left: auto;
}

.clear-btn {
  padding: 8px 16px;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 6px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: #e9ecef;
  color: #333;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.alarm-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.feature-notice {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border: 1px solid #ffc107;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.notice-icon {
  font-size: 48px;
  flex-shrink: 0;
}

.notice-content h3 {
  margin: 0 0 8px 0;
  color: #856404;
  font-size: 18px;
  font-weight: 600;
}

.notice-content p {
  margin: 0 0 8px 0;
  color: #856404;
  font-size: 14px;
}

.notice-detail {
  font-size: 12px;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .alarms-view {
    padding: 16px;
  }
  
  .stats-cards {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .stat-card {
    padding: 16px;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
  
  .stat-value {
    font-size: 24px;
  }
  
  .feature-notice {
    flex-direction: column;
    text-align: center;
    padding: 16px;
  }
  
  .notice-icon {
    font-size: 36px;
  }
}
</style>