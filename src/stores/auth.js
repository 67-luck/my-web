import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    users: [],
    currentUser: null,
    isLoggedIn: false,
    devices: [],
    currentDeviceId: null,
    syncCode: null
  }),
  persist: {
    key: 'auth',
    storage: localStorage,
    paths: ['users', 'currentUser', 'isLoggedIn', 'devices']
  },
  getters: {
    hasMultipleDevices() {
      return this.devices.length > 1
    },
    hasRegisteredUsers() {
      return this.users.length > 0
    },
    canRegister() {
      return this.users.length < 2
    }
  },
  actions: {
    // 初始化加载用户数据
    init() {
      // 从localStorage加载用户数据
      const storedUsers = localStorage.getItem('auth_users')
      if (storedUsers) {
        this.users = JSON.parse(storedUsers)
      } else {
        // 添加默认用户以便测试
        this.users = [
          {
            id: '1',
            username: 'test',
            password: '12345678',
            createdAt: new Date().toISOString()
          }
        ]
        // 保存到localStorage
        localStorage.setItem('auth_users', JSON.stringify(this.users))
      }
      
      // 从localStorage加载当前用户
      const storedCurrentUser = localStorage.getItem('auth_current_user')
      if (storedCurrentUser) {
        this.currentUser = JSON.parse(storedCurrentUser)
        this.isLoggedIn = true
        this.loadDevices()
      } else {
        // 没有当前用户，保持未登录状态
        this.currentUser = null
        this.isLoggedIn = false
        this.devices = []
        this.currentDeviceId = null
      }
      

    },
    
    // 创建用户账户
    createAccount(username, password) {
      if (this.users.length >= 2) {
        throw new Error('最多只能注册2个账号')
      }
      
      // 检查用户名是否已存在
      if (this.users.some(user => user.username === username)) {
        throw new Error('用户名已存在')
      }
      
      const user = {
        id: Date.now().toString(),
        username,
        password,
        createdAt: new Date().toISOString()
      }
      
      this.users.push(user)
      this.currentUser = user
      this.isLoggedIn = true
      this.addDevice()
      this.generateSyncCode()
      
      // 保存到localStorage
      localStorage.setItem('auth_users', JSON.stringify(this.users))
      localStorage.setItem('auth_current_user', JSON.stringify(this.currentUser))
      
      return user
    },
    
    // 登录
    login(username, password) {
      const user = this.users.find(user => user.username === username && user.password === password)
      if (user) {
        this.currentUser = user
        this.isLoggedIn = true
        this.loadDevices()
        this.addDevice()
        
        // 保存当前用户到localStorage
        localStorage.setItem('auth_current_user', JSON.stringify(this.currentUser))
        
        return true
      }
      return false
    },
    
    // 登出
    logout() {
      this.currentUser = null
      this.isLoggedIn = false
      this.devices = []
      this.currentDeviceId = null
      localStorage.removeItem('auth_current_user')
    },
    
    // 添加设备
    addDevice() {
      const deviceId = this.generateDeviceId()
      this.currentDeviceId = deviceId
      
      const device = {
        id: deviceId,
        name: this.getDeviceName(),
        lastActive: new Date().toISOString()
      }
      
      this.devices.push(device)
      this.saveDevices()
    },
    
    // 生成设备ID
    generateDeviceId() {
      return 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    },
    
    // 获取设备名称
    getDeviceName() {
      const userAgent = navigator.userAgent
      if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
        return 'iPhone/iPad'
      } else if (userAgent.includes('Android')) {
        return 'Android'
      } else if (userAgent.includes('Windows')) {
        return 'Windows'
      } else if (userAgent.includes('Macintosh')) {
        return 'Mac'
      } else {
        return 'Unknown Device'
      }
    },
    
    // 加载设备列表
    loadDevices() {
      const storedDevices = localStorage.getItem('auth_devices')
      if (storedDevices) {
        this.devices = JSON.parse(storedDevices)
      }
    },
    
    // 保存设备列表
    saveDevices() {
      localStorage.setItem('auth_devices', JSON.stringify(this.devices))
    },
    
    // 生成同步码
    generateSyncCode() {
      this.syncCode = Math.floor(100000 + Math.random() * 900000).toString()
      // 同步码5分钟后过期
      setTimeout(() => {
        this.syncCode = null
      }, 5 * 60 * 1000)
      return this.syncCode
    },
    
    // 验证同步码
    validateSyncCode(code) {
      return code === this.syncCode
    },
    
    // 检查用户是否存在
    checkUserExists(username) {
      return this.users.some(user => user.username === username)
    }
  }
})
