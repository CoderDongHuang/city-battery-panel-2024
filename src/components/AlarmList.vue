<template>
  <div class="alarm-list">
    <!-- 筛选工具栏 -->
    <div class="filter-toolbar">
      <div class="filter-group">
        <label>报警类型:</label>
        <select v-model="filters.type" @change="handleFilterChange">
          <option value="">全部类型</option>
          <option value="temperature">温度异常</option>
          <option value="voltage">电压异常</option>
          <option value="current">电流异常</option>
          <option value="soc">电量异常</option>
          <option value="connection">连接异常</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>报警级别:</label>
        <select v-model="filters.level" @change="handleFilterChange">
          <option value="">全部级别</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>处理状态:</label>
        <select v-model="filters.resolved" @change="handleFilterChange">
          <option :value="false">未处理</option>
          <option :value="true">已处理</option>
          <option value="">全部</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>时间范围:</label>
        <input 
          type="date" 
          v-model="filters.startTime" 
          @change="handleFilterChange"
          placeholder="开始时间"
        />
        <span>至</span>
        <input 
          type="date" 
          v-model="filters.endTime" 
          @change="handleFilterChange"
          placeholder="结束时间"
        />
      </div>
      
      <div class="filter-group">
        <label>车辆编号:</label>
        <input 
          type="text" 
          v-model="filters.vid" 
          @input="handleFilterChange"
          placeholder="输入车辆编号"
          style="width: 120px;"
        />
      </div>
      
      <div class="filter-group">
        <label>电池编号:</label>
        <input 
          type="text" 
          v-model="filters.pid" 
          @input="handleFilterChange"
          placeholder="输入电池编号"
          style="width: 120px;"
        />
      </div>
      
      <button class="clear-filters" @click="clearFilters">
        <span class="btn-icon">🗑️</span>
        清除筛选
      </button>
    </div>
    
    <!-- 报警列表 -->
    <div class="alarm-table">
      <div class="table-header">
        <div class="header-cell">时间</div>
        <div class="header-cell">车辆</div>
        <div class="header-cell">类型</div>
        <div class="header-cell">级别</div>
        <div class="header-cell">触发值</div>
        <div class="header-cell">状态</div>
        <div class="header-cell actions">操作</div>
      </div>
      
      <div class="table-body">
        <div 
          v-for="alarm in filteredAlarms" 
          :key="alarm.id"
          class="table-row"
          :class="{ resolved: alarm.resolved }"
        >
          <div class="table-cell">{{ formatTime(alarm.timestamp) }}</div>
          <div class="table-cell">{{ alarm.vid || '未知' }}</div>
          <div class="table-cell">{{ getAlarmTypeText(alarm.alarmType) }}</div>
          <div class="table-cell">
            <span 
              class="level-badge" 
              :style="{ backgroundColor: getLevelColor(alarm.level) }"
            >
              {{ getLevelText(alarm.level) }}
            </span>
          </div>
          <div class="table-cell">{{ alarm.triggerValue }}</div>
          <div class="table-cell">
            <span class="status-badge" :class="{ resolved: alarm.resolved }">
              {{ alarm.resolved ? '已处理' : '未处理' }}
            </span>
          </div>
          <div class="table-cell actions">
            <button class="action-btn" @click="viewAlarmDetail(alarm)">查看</button>
            <button 
              v-if="!alarm.resolved" 
              class="action-btn handle" 
              @click="handleAlarm(alarm.id)"
            >
              处理
            </button>
            <button class="action-btn delete" @click="deleteAlarm(alarm.id)">删除</button>
          </div>
        </div>
        
        <div v-if="filteredAlarms.length === 0" class="no-data">
          <p>暂无报警数据</p>
        </div>
      </div>
    </div>
    
    <!-- 分页控件 -->
    <div v-if="pagination.total > pagination.pageSize" class="pagination">
      <button 
        :disabled="pagination.current === 1"
        @click="changePage(pagination.current - 1)"
      >
        上一页
      </button>
      
      <span class="page-info">
        第 {{ pagination.current }} 页，共 {{ Math.ceil(pagination.total / pagination.pageSize) }} 页
      </span>
      
      <button 
        :disabled="pagination.current >= Math.ceil(pagination.total / pagination.pageSize)"
        @click="changePage(pagination.current + 1)"
      >
        下一页
      </button>
    </div>
    
    <!-- 批量操作 -->
    <div v-if="selectedAlarms.length > 0" class="batch-actions">
      <span>已选择 {{ selectedAlarms.length }} 条报警</span>
      <button class="batch-btn" @click="handleSelectedAlarms">批量处理</button>
      <button class="batch-btn delete" @click="deleteSelectedAlarms">批量删除</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAlarmStore } from '../store/modules/alarmStore'

const alarmStore = useAlarmStore()

// 筛选条件
const filters = ref({
  type: '',
  level: '',
  resolved: false,
  startTime: '',
  endTime: '',
  vid: '',      // 车辆编号
  pid: ''       // 电池编号
})

const selectedAlarms = ref([])
const pagination = ref({
  current: 1,
  pageSize: 20,
  total: 0
})

// 计算属性
const filteredAlarms = computed(() => {
  let alarms = alarmStore.alarms.data || []
  
  // 应用筛选条件
  if (filters.value.type) {
    alarms = alarms.filter(alarm => alarm.alarmType === filters.value.type)
  }
  
  if (filters.value.level) {
    alarms = alarms.filter(alarm => alarm.level === filters.value.level)
  }
  
  if (filters.value.resolved !== '') {
    alarms = alarms.filter(alarm => alarm.resolved === filters.value.resolved)
  }
  
  if (filters.value.startTime) {
    alarms = alarms.filter(alarm => 
      new Date(alarm.timestamp) >= new Date(filters.value.startTime)
    )
  }
  
  if (filters.value.endTime) {
    alarms = alarms.filter(alarm => 
      new Date(alarm.timestamp) <= new Date(filters.value.endTime + 'T23:59:59')
    )
  }
  
  return alarms
})

// 方法
const getAlarmTypeText = (type) => alarmStore.getAlarmTypeText(type)
const getLevelText = (level) => alarmStore.getLevelText(level)
const getLevelColor = (level) => alarmStore.getLevelColor(level)

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleFilterChange = () => {
  pagination.value.current = 1
  loadAlarms()
}

const clearFilters = () => {
  filters.value = {
    type: '',
    level: '',
    resolved: false,
    startTime: '',
    endTime: ''
  }
  pagination.value.current = 1
  loadAlarms()
}

const loadAlarms = async () => {
  await alarmStore.fetchHistoryAlarms({
    page: pagination.value.current,
    size: pagination.value.pageSize,
    ...filters.value
  })
  
  pagination.value.total = alarmStore.alarms.pagination.total
}

const changePage = (page) => {
  pagination.value.current = page
  loadAlarms()
}

const viewAlarmDetail = (alarm) => {
  alarmStore.setCurrentAlarm(alarm)
  emit('view-detail', alarm)
}

const handleAlarm = async (alarmId) => {
  try {
    await alarmStore.handleAlarm(alarmId)
    console.log('报警处理成功')
    // 刷新列表
    await loadAlarms()
  } catch (error) {
    console.error('处理报警失败:', error)
    if (error.response?.status === 404) {
      alert('报警API尚未实现，请稍后再试')
    } else {
      alert('处理报警失败: ' + error.message)
    }
  }
}

const deleteAlarm = async (alarmId) => {
  if (confirm('确定要删除这条报警记录吗？')) {
    try {
      // 调用删除API
      await alarmStore.deleteAlarm(alarmId)
      console.log('报警删除成功')
      // 刷新列表
      await loadAlarms()
    } catch (error) {
      console.error('删除报警失败:', error)
      if (error.response?.status === 404) {
        alert('报警API尚未实现，请稍后再试')
      } else {
        alert('删除报警失败: ' + error.message)
      }
    }
  }
}

const handleSelectedAlarms = async () => {
  if (confirm(`确定要批量处理 ${selectedAlarms.value.length} 条报警吗？`)) {
    for (const alarmId of selectedAlarms.value) {
      await handleAlarm(alarmId)
    }
    selectedAlarms.value = []
  }
}

const deleteSelectedAlarms = () => {
  if (confirm(`确定要批量删除 ${selectedAlarms.value.length} 条报警吗？`)) {
    // 这里调用批量删除API
    console.log('批量删除报警:', selectedAlarms.value)
    selectedAlarms.value = []
  }
}

// 事件发射器
const emit = defineEmits(['view-detail'])

// 生命周期
onMounted(() => {
  loadAlarms()
})

// 监听筛选条件变化 - 只在用户主动改变时触发
watch(() => ({
  type: filters.value.type,
  level: filters.value.level,
  resolved: filters.value.resolved,
  startTime: filters.value.startTime,
  endTime: filters.value.endTime
}), () => {
  // 延迟执行，避免频繁触发
  setTimeout(() => {
    handleFilterChange()
  }, 300)
})
</script>

<style scoped>
.alarm-list {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-toolbar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.filter-group select,
.filter-group input {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.clear-filters {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
}

.clear-filters:hover {
  background: #f0f0f0;
}

.alarm-table {
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 0.8fr 1fr 0.8fr 0.8fr 0.8fr 1.2fr;
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
}

.header-cell {
  padding: 12px 8px;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
}

.header-cell.actions {
  text-align: center;
}

.table-body {
  max-height: 400px;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 0.8fr 1fr 0.8fr 0.8fr 0.8fr 1.2fr;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
}

.table-row:hover {
  background: #f8f9fa;
}

.table-row.resolved {
  background: #f6ffed;
  opacity: 0.7;
}

.table-cell {
  padding: 12px 8px;
  font-size: 14px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.level-badge {
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  background: #fff2f0;
  color: #ff4d4f;
}

.status-badge.resolved {
  background: #f6ffed;
  color: #52c41a;
}

.actions {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.action-btn {
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f0f0f0;
}

.action-btn.handle {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.action-btn.handle:hover {
  background: #40a9ff;
}

.action-btn.delete {
  background: #ff4d4f;
  color: white;
  border-color: #ff4d4f;
}

.action-btn.delete:hover {
  background: #ff7875;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #999;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  padding: 16px;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button:not(:disabled):hover {
  background: #f0f0f0;
}

.page-info {
  font-size: 14px;
  color: #666;
}

.batch-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
  padding: 12px 16px;
  background: #f0f8ff;
  border-radius: 4px;
}

.batch-btn {
  padding: 6px 12px;
  border: 1px solid #1890ff;
  border-radius: 4px;
  background: #1890ff;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

.batch-btn:hover {
  background: #40a9ff;
}

.batch-btn.delete {
  background: #ff4d4f;
  border-color: #ff4d4f;
}

.batch-btn.delete:hover {
  background: #ff7875;
}

@media (max-width: 768px) {
  .filter-toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    justify-content: space-between;
  }
  
  .alarm-table {
    overflow-x: auto;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: repeat(7, 150px);
  }
}
</style>