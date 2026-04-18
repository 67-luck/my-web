import { defineStore } from 'pinia'
import { useCoupleInfoStore } from './coupleInfo'

export const useSyncStore = defineStore('sync', {
  state: () => ({
    lastSyncTime: null,
    syncStatus: 'idle', // idle, syncing, synced, error
    backupHistory: [],
    offlineChanges: []
  }),
  getters: {
    hasOfflineChanges() {
      return this.offlineChanges.length > 0
    },
    lastBackup() {
      return this.backupHistory.length > 0 ? this.backupHistory[0] : null
    }
  },
  actions: {
    // 手动同步数据
    async syncData() {
      this.syncStatus = 'syncing'
      try {
        // 获取当前数据
        const coupleStore = useCoupleInfoStore()
        const currentData = {
          baseInfo: { ...coupleStore.baseInfo },
          girlProfile: [...coupleStore.girlProfile],
          boyProfile: [...coupleStore.boyProfile],
          customAnniversary: [...coupleStore.customAnniversary],
          syncTime: new Date().toISOString()
        }
        
        // 存储到本地存储，作为备份
        localStorage.setItem('couple_data_backup', JSON.stringify(currentData))
        
        // 更新同步状态
        this.lastSyncTime = new Date().toISOString()
        this.syncStatus = 'synced'
        
        // 记录备份历史
        this.addBackupHistory(currentData)
        
        // 处理离线变更
        if (this.hasOfflineChanges) {
          this.processOfflineChanges()
        }
        
        return true
      } catch (error) {
        console.error('同步失败:', error)
        this.syncStatus = 'error'
        return false
      }
    },
    
    // 处理离线变更
    processOfflineChanges() {
      const coupleStore = useCoupleInfoStore()
      
      this.offlineChanges.forEach(change => {
        switch (change.type) {
          case 'updateBaseInfo':
            coupleStore.updateBaseInfo(change.data)
            break
          case 'updateGirlProfile':
            coupleStore.updateGirlProfile(change.data)
            break
          case 'updateBoyProfile':
            coupleStore.updateBoyProfile(change.data)
            break
          case 'addAnniversary':
            coupleStore.addAnniversary(change.data)
            break
          case 'updateAnniversary':
            coupleStore.updateAnniversary(change.id, change.data)
            break
          case 'deleteAnniversary':
            coupleStore.deleteAnniversary(change.id)
            break
        }
      })
      
      // 清空离线变更
      this.offlineChanges = []
    },
    
    // 记录离线变更
    recordOfflineChange(type, data, id = null) {
      this.offlineChanges.push({
        id,
        type,
        data,
        timestamp: new Date().toISOString()
      })
    },
    
    // 添加备份历史
    addBackupHistory(data) {
      this.backupHistory.unshift({
        timestamp: new Date().toISOString(),
        dataSize: JSON.stringify(data).length
      })
      
      // 只保留最近10次备份
      if (this.backupHistory.length > 10) {
        this.backupHistory = this.backupHistory.slice(0, 10)
      }
    },
    
    // 从备份恢复数据
    restoreFromBackup() {
      const backup = localStorage.getItem('couple_data_backup')
      if (backup) {
        try {
          const data = JSON.parse(backup)
          const coupleStore = useCoupleInfoStore()
          
          coupleStore.baseInfo = data.baseInfo
          coupleStore.girlProfile = Array.isArray(data.girlProfile) ? data.girlProfile : Object.values(data.girlProfile || {})
          coupleStore.boyProfile = Array.isArray(data.boyProfile) ? data.boyProfile : Object.values(data.boyProfile || {})
          coupleStore.customAnniversary = data.customAnniversary
          
          this.lastSyncTime = new Date().toISOString()
          this.syncStatus = 'synced'
          
          return true
        } catch (error) {
          console.error('恢复备份失败:', error)
          return false
        }
      }
      return false
    },
    
    // 导出数据
    exportData() {
      const coupleStore = useCoupleInfoStore()
      const data = {
        baseInfo: { ...coupleStore.baseInfo },
        girlProfile: [...coupleStore.girlProfile],
        boyProfile: [...coupleStore.boyProfile],
        customAnniversary: [...coupleStore.customAnniversary],
        exportTime: new Date().toISOString()
      }
      return JSON.stringify(data)
    },
    
    // 导入数据
    importData(dataStr) {
      try {
        const data = JSON.parse(dataStr)
        const coupleStore = useCoupleInfoStore()
        
        coupleStore.baseInfo = data.baseInfo
        coupleStore.girlProfile = Array.isArray(data.girlProfile) ? data.girlProfile : Object.values(data.girlProfile || {})
        coupleStore.boyProfile = Array.isArray(data.boyProfile) ? data.boyProfile : Object.values(data.boyProfile || {})
        coupleStore.customAnniversary = data.customAnniversary
        
        this.syncData()
        return true
      } catch (error) {
        console.error('导入数据失败:', error)
        return false
      }
    }
  },
  persist: true
})
