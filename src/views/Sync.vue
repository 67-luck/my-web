<template>
  <div class="sync-container">
    <div class="sync-card">
      <h1>数据同步管理</h1>
      
      <!-- 同步状态 -->
      <div class="sync-status">
        <h2>同步状态</h2>
        <div class="status-item">
          <span class="label">当前状态：</span>
          <span class="status" :class="syncStatusClass">{{ syncStatusText }}</span>
        </div>
        <div class="status-item" v-if="syncStore.lastSyncTime">
          <span class="label">上次同步：</span>
          <span class="value">{{ formatTime(syncStore.lastSyncTime) }}</span>
        </div>
        <div class="status-item" v-if="syncStore.hasOfflineChanges">
          <span class="label">离线变更：</span>
          <span class="value">{{ syncStore.offlineChanges.length }} 项</span>
        </div>
        <button class="btn-primary" @click="syncData">立即同步</button>
      </div>
      
      <!-- 设备管理 -->
      <div class="device-management">
        <h2>设备管理</h2>
        <div v-if="authStore.devices.length > 0">
          <div v-for="device in authStore.devices" :key="device.id" class="device-item">
            <div class="device-info">
              <span class="device-name">{{ device.name }}</span>
              <span class="device-time">{{ formatTime(device.lastActive) }}</span>
            </div>
            <span v-if="device.id === authStore.currentDeviceId" class="current-device">当前设备</span>
          </div>
        </div>
        <div v-else class="empty-state">
          暂无设备记录
        </div>
      </div>
      
      <!-- 同步码 -->
      <div class="sync-code">
        <h2>设备关联</h2>
        <p class="hint">使用同步码在其他设备上登录同一账户</p>
        <div class="code-container">
          <span class="code">{{ authStore.syncCode || '点击生成' }}</span>
          <button class="btn-secondary" @click="generateSyncCode">生成同步码</button>
        </div>
        <p class="code-hint" v-if="authStore.syncCode">同步码将在5分钟后过期</p>
      </div>
      
      <!-- 备份管理 -->
      <div class="backup-management">
        <h2>备份管理</h2>
        <div class="backup-actions">
          <button class="btn-secondary" @click="exportData">导出数据</button>
          <button class="btn-secondary" @click="restoreFromBackup">从备份恢复</button>
        </div>
        <div v-if="syncStore.backupHistory.length > 0">
          <h3>备份历史</h3>
          <div v-for="(backup, index) in syncStore.backupHistory" :key="index" class="backup-item">
            <span class="backup-time">{{ formatTime(backup.timestamp) }}</span>
            <span class="backup-size">{{ formatSize(backup.dataSize) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useSyncStore } from '../stores/sync'

const authStore = useAuthStore()
const syncStore = useSyncStore()

const syncStatusClass = computed(() => {
  switch (syncStore.syncStatus) {
    case 'syncing':
      return 'syncing'
    case 'synced':
      return 'synced'
    case 'error':
      return 'error'
    default:
      return 'idle'
  }
})

const syncStatusText = computed(() => {
  switch (syncStore.syncStatus) {
    case 'syncing':
      return '同步中'
    case 'synced':
      return '已同步'
    case 'error':
      return '同步失败'
    default:
      return '空闲'
  }
})

const syncData = async () => {
  await syncStore.syncData()
}

const generateSyncCode = () => {
  authStore.generateSyncCode()
}

const exportData = () => {
  const data = syncStore.exportData()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `couple-data-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const restoreFromBackup = () => {
  if (confirm('确定要从备份恢复数据吗？这将覆盖当前数据。')) {
    const success = syncStore.restoreFromBackup()
    if (success) {
      alert('恢复成功！')
    } else {
      alert('恢复失败，请检查备份文件。')
    }
  }
}

const formatTime = (time) => {
  const date = new Date(time)
  return date.toLocaleString('zh-CN')
}

const formatSize = (size) => {
  if (size < 1024) {
    return size + ' B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB'
  } else {
    return (size / (1024 * 1024)).toFixed(2) + ' MB'
  }
}
</script>

<style scoped>
.sync-container {
  min-height: 100vh;
  background: transparent;
  padding: 20px;
  position: relative;
}

.sync-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: none;
  z-index: 1;
}

.sync-container > * {
  position: relative;
  z-index: 2;
}

.sync-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #FF7B9C;
  margin-bottom: 30px;
  font-size: 24px;
}

h2 {
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #E5E5E5;
}

h3 {
  font-size: 16px;
  color: #666;
  margin: 15px 0 10px;
}

.sync-status,
.device-management,
.sync-code,
.backup-management {
  margin-bottom: 30px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #F8F9FA;
  border-radius: 8px;
}

.label {
  font-weight: 500;
  color: #666;
}

.value {
  color: #333;
}

.status {
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 12px;
}

.status.syncing {
  background-color: #E3F2FD;
  color: #1976D2;
}

.status.synced {
  background-color: #E8F5E8;
  color: #388E3C;
}

.status.error {
  background-color: #FFF3E0;
  color: #F57C00;
}

.status.idle {
  background-color: #F5F5F5;
  color: #757575;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #FF7B9C 0%, #FFA8A8 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 15px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 123, 156, 0.4);
}

.btn-secondary {
  padding: 8px 16px;
  background-color: #F5F5F5;
  color: #333;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background-color: #E0E0E0;
}

.device-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #F8F9FA;
  border-radius: 8px;
  margin-bottom: 10px;
}

.device-info {
  display: flex;
  flex-direction: column;
}

.device-name {
  font-weight: 500;
  color: #333;
}

.device-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.current-device {
  padding: 4px 12px;
  background-color: #E8F5E8;
  color: #388E3C;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.empty-state {
  padding: 30px;
  text-align: center;
  color: #999;
  background-color: #F8F9FA;
  border-radius: 8px;
}

.hint {
  color: #666;
  margin-bottom: 15px;
  font-size: 14px;
}

.code-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.code {
  flex: 1;
  padding: 12px;
  background-color: #F8F9FA;
  border: 1px solid #E5E5E5;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  letter-spacing: 2px;
}

.code-hint {
  font-size: 12px;
  color: #999;
  text-align: center;
}

.backup-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.backup-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #F8F9FA;
  border-radius: 8px;
  margin-bottom: 8px;
}

.backup-time {
  color: #333;
}

.backup-size {
  color: #666;
  font-size: 14px;
}

@media (max-width: 768px) {
  .sync-card {
    padding: 20px;
  }
  
  h1 {
    font-size: 20px;
  }
  
  .code-container {
    flex-direction: column;
  }
  
  .code {
    width: 100%;
  }
  
  .backup-actions {
    flex-direction: column;
  }
  
  .btn-secondary {
    width: 100%;
  }
}
</style>
