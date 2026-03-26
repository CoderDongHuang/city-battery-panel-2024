<template>
  <div class="alarms-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1>🚨 电池报警管理</h1>
      <p>实时监控和管理电池系统的报警信息</p>
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
          <div class="stat-value">{{ alarmStore.unreadCount }}</div>
          <div class="stat-label">未处理</div>
        </div>
      </div>
    </div>
    
    <!-- 报警列表 -->
    <div class="alarm-content">
      <AlarmList @view-detail="showAlarmDetail" />
    </div>
    
    <!-- 报警详情模态框 -->
    <AlarmDetail 
      :visible="detailVisible" 
      :alarm="currentAlarm"
      @close="hideAlarmDetail"
      @alarm-handled="handleAlarmHandled"
    />
    
    <!-- 实时报警监控（固定在右上角） -->
    <AlarmMonitor 
      @view-detail="showAlarmDetail"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAlarmStore } from '../store/modules/alarmStore'
import AlarmList from '../components/AlarmList.vue'
import AlarmDetail from '../components/AlarmDetail.vue'
import AlarmMonitor from '../components/AlarmMonitor.vue'

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
  // 可以在这里添加处理后的逻辑，比如刷新列表等
}

// 生命周期
onMounted(() => {
  // 初始化报警数据
  alarmStore.fetchStatistics('today')
  alarmStore.fetchHistoryAlarms()
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
  margin-bottom: 32px;
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
}
</style>