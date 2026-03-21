<template>
  <div class="alerts">
    <!-- 报警统计区域（大模块） -->
    <div class="alerts-stats-section">
      <div class="section-header">
        <h2 class="section-title">报警管理</h2>
        <p class="section-description">实时监控和处理系统报警信息</p>
      </div>
      
      <div class="alerts-stats">
        <div class="stat-card">
          <div class="stat-icon">⚠️</div>
          <div class="stat-content">
            <h3>活跃报警</h3>
            <div class="stat-value">{{ activeAlertsCount }}</div>
            <div class="stat-label">需要处理</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <h3>已处理报警</h3>
            <div class="stat-value">{{ resolvedAlertsCount }}</div>
            <div class="stat-label">已完成</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🚨</div>
          <div class="stat-content">
            <h3>紧急报警</h3>
            <div class="stat-value">{{ urgentAlertsCount }}</div>
            <div class="stat-label">优先处理</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 报警列表区域（大模块） -->
    <div class="alerts-list-section">
      <div class="section-header">
        <h2 class="section-title">报警列表</h2>
        <p class="section-description">查看和管理所有报警信息</p>
      </div>
      
      <div class="alerts-list">
        <div class="section-header">
          <h2>报警列表</h2>
          <div class="filter-controls">
            <button 
              class="filter-btn" 
              :class="{ active: filter === 'all' }"
              @click="filter = 'all'"
            >
              全部
            </button>
            <button 
              class="filter-btn" 
              :class="{ active: filter === 'active' }"
              @click="filter = 'active'"
            >
              活跃
            </button>
            <button 
              class="filter-btn" 
              :class="{ active: filter === 'resolved' }"
              @click="filter = 'resolved'"
            >
              已处理
            </button>
          </div>
        </div>

        <div class="alerts-table">
          <div class="table-header">
            <div class="col-id">ID</div>
            <div class="col-type">类型</div>
            <div class="col-vehicle">车辆</div>
            <div class="col-battery">电池</div>
            <div class="col-time">时间</div>
            <div class="col-status">状态</div>
            <div class="col-actions">操作</div>
          </div>

          <div class="table-body">
            <div 
              v-for="alert in filteredAlerts" 
              :key="alert.id"
              class="table-row"
              :class="{ resolved: alert.resolved }"
            >
              <div class="col-id">{{ formatAlertId(alert.id) }}</div>
              <div class="col-type">
                <span class="alert-type" :class="getAlertTypeClass(alert.type)">
                  {{ getAlertTypeText(alert.type) }}
                </span>
              </div>
              <div class="col-vehicle">{{ alert.vehicleId || '-' }}</div>
              <div class="col-battery">{{ alert.batteryId || '-' }}</div>
              <div class="col-time">{{ formatTime(alert.timestamp) }}</div>
              <div class="col-status">
                <span class="status-badge" :class="{ resolved: alert.resolved }">
                  {{ alert.resolved ? '已处理' : '待处理' }}
                </span>
              </div>
              <div class="col-actions">
                <button 
                  v-if="!alert.resolved"
                  class="btn btn-small btn-primary"
                  @click="resolveAlert(alert.id)"
                >
                  处理
                </button>
                <button 
                  class="btn btn-small btn-secondary"
                  @click="viewAlertDetails(alert)"
                >
                  详情
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBatteryStore } from '../store/modules/batteryStore'

const batteryStore = useBatteryStore()

const filter = ref('all')

// 计算属性
const activeAlertsCount = computed(() => {
  return batteryStore.batteryAlerts.filter(alert => !alert.resolved).length
})

const resolvedAlertsCount = computed(() => {
  return batteryStore.batteryAlerts.filter(alert => alert.resolved).length
})

const urgentAlertsCount = computed(() => {
  return batteryStore.batteryAlerts.filter(alert => 
    !alert.resolved && alert.priority === 'high'
  ).length
})

const filteredAlerts = computed(() => {
  const alerts = batteryStore.batteryAlerts
  switch (filter.value) {
    case 'active':
      return alerts.filter(alert => !alert.resolved)
    case 'resolved':
      return alerts.filter(alert => alert.resolved)
    default:
      return alerts
  }
})

// 方法
const getAlertTypeClass = (type) => {
  const typeMap = {
    'low_battery': 'warning',
    'high_temperature': 'danger',
    'low_voltage': 'warning',
    'offline': 'info',
    'error': 'danger'
  }
  return typeMap[type] || 'info'
}

const getAlertTypeText = (type) => {
  const typeMap = {
    'low_battery': '电量不足',
    'high_temperature': '温度过高',
    'low_voltage': '电压过低',
    'offline': '设备离线',
    'error': '系统错误'
  }
  return typeMap[type] || type
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString('zh-CN')
}

const formatAlertId = (id) => {
  // 将ID缩短为4位数字，例如：0001, 0002, 0003...
  if (!id) return '0000'
  // 如果是字符串，提取数字部分；如果是数字，直接使用
  const num = typeof id === 'string' ? parseInt(id.replace(/\D/g, '')) || 0 : id
  // 确保是4位数字，不足补零
  return String(num % 10000).padStart(4, '0')
}

const resolveAlert = (alertId) => {
  batteryStore.resolveAlert(alertId)
}

const viewAlertDetails = (alert) => {
  console.log('查看报警详情:', alert)
  // 这里可以打开详情弹窗或跳转到详情页面
}

onMounted(() => {
  // 加载报警数据
  if (batteryStore.batteryAlerts.length === 0) {
    // 如果没有报警数据，添加一些示例数据
    batteryStore.addBatteryAlert({
      type: 'low_battery',
      vehicleId: 'V001',
      batteryId: 'B001',
      message: '电池电量低于20%',
      priority: 'high'
    })
    batteryStore.addBatteryAlert({
      type: 'high_temperature',
      vehicleId: 'V002',
      batteryId: 'B002',
      message: '电池温度超过60°C',
      priority: 'high'
    })
  }
})
</script>

<style scoped>
.alerts {
  padding: 24px;   /* 与 Dashboard 统一内边距 */
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* 大模块间距设置 - 与系统概览页面保持一致 */
.alerts-stats-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 48px;          /* 大模块间距 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.alerts-list-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 0;               /* 最后一个模块不要下边距 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

/* 大模块悬停效果 */
.alerts-stats-section:hover,
.alerts-list-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

/* 头部样式（与 Dashboard 保持一致） */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
  gap: 24px;
}

.section-title-group {
  flex: 1;
  min-width: 0;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  line-height: 1.2;
}

.section-description {
  font-size: 16px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.alerts-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 0;               /* 由外层大模块控制间距 */
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  font-size: 32px;
}

.stat-content h3 {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

.filter-controls {
  display: flex;
  gap: 8px;
}

.filter-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.alerts-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: grid;
  grid-template-columns: 80px 140px 120px 120px 200px 120px 160px;  /* ID列缩短为80px */
  padding: 20px 24px;
  background: #f8f9fa;
  font-weight: 600;
  color: #666;
  border-bottom: 1px solid #e9ecef;
  gap: 16px;
  text-align: center;  /* 表头居中显示 */
}

.table-body {
  max-height: 400px;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 80px 140px 120px 120px 200px 120px 160px;  /* ID列缩短为80px */
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
  gap: 16px;
  text-align: center;  /* 数据居中显示 */
}

.table-row:last-child {
  border-bottom: none;
}

.table-row.resolved {
  opacity: 0.6;
}

.alert-type {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.alert-type.warning {
  background: #fff3cd;
  color: #856404;
}

.alert-type.danger {
  background: #f8d7da;
  color: #721c24;
}

.alert-type.info {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: #ffc107;
  color: #856404;
}

.status-badge.resolved {
  background: #28a745;
  color: white;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
}

.btn-small {
  padding: 4px 8px;
  font-size: 11px;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn:hover {
  opacity: 0.8;
}
</style>