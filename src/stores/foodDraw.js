import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useFoodDrawStore = defineStore('foodDraw', {
  state: () => ({
    userData: {}, // 存储每个用户的数据
    currentUserId: null // 当前用户ID
  }),
  
  getters: {
    // 获取当前用户的配置
    config() {
      const userId = this.currentUserId
      if (!userId || !this.userData[userId]) {
        return {
          dailyDrawTimes: 5,
          dailyExchangeLimit: 3,
          today: new Date().toDateString()
        }
      }
      return this.userData[userId].config
    },
    
    // 获取当前用户的剩余抽签次数
    remainDrawTimes() {
      const userId = this.currentUserId
      if (!userId || !this.userData[userId]) {
        return 5
      }
      return this.userData[userId].remainDrawTimes
    },
    
    // 获取当前用户的今日抽签历史
    todayDrawHistory() {
      const userId = this.currentUserId
      if (!userId || !this.userData[userId]) {
        return []
      }
      return this.userData[userId].todayDrawHistory
    },
    
    // 获取当前用户的今日兑换次数
    todayExchangeCount() {
      const userId = this.currentUserId
      if (!userId || !this.userData[userId]) {
        return 0
      }
      return this.userData[userId].todayExchangeCount
    },
    
    // 获取当前用户的当前抽签人
    currentDrawer() {
      const userId = this.currentUserId
      if (!userId || !this.userData[userId]) {
        return 'girl'
      }
      return this.userData[userId].currentDrawer
    },
    
    // 获取当前用户的食物列表
    foodList() {
      const userId = this.currentUserId
      if (!userId || !this.userData[userId]) {
        return [
          { id: 1, name: '黄焖鸡米饭', category: '午餐', taste: '咸香', ingredients: '鸡肉,米饭,土豆,青椒' },
          { id: 2, name: '麻辣烫', category: '午餐', taste: '麻辣', ingredients: '各种蔬菜,肉类,粉丝' },
          { id: 3, name: '烧烤', category: '夜宵', taste: '香辣', ingredients: '肉串,蔬菜,海鲜' },
          { id: 4, name: '炸鸡', category: '外卖', taste: '酥脆', ingredients: '鸡肉,面粉,调料' },
          { id: 5, name: '火锅', category: '晚餐', taste: '麻辣', ingredients: '各种食材,汤底' },
          { id: 6, name: '米线', category: '早餐', taste: '清淡', ingredients: '米线,汤,蔬菜' },
          { id: 7, name: '包子', category: '早餐', taste: '咸鲜', ingredients: '面粉,肉馅,蔬菜' },
          { id: 8, name: '盖浇饭', category: '午餐', taste: '咸香', ingredients: '米饭,各种配菜' },
          { id: 9, name: '寿司', category: '外卖', taste: '清淡', ingredients: '米饭,海苔,各种馅料' },
          { id: 10, name: '粥', category: '早餐', taste: '清淡', ingredients: '大米,各种配料' }
        ]
      }
      return this.userData[userId].foodList
    },
    
    // 获取当前用户的任务列表
    taskList() {
      const userId = this.currentUserId
      if (!userId || !this.userData[userId]) {
        return [
          { id: 1, content: '给对方一个大大的拥抱' },
          { id: 2, content: '帮对方带一杯奶茶' },
          { id: 3, content: '陪对方逛校园' },
          { id: 4, content: '为对方准备一份小惊喜' },
          { id: 5, content: '和对方一起看一场电影' },
          { id: 6, content: '给对方写一封情书' },
          { id: 7, content: '陪对方去图书馆学习' },
          { id: 8, content: '为对方唱一首歌' },
          { id: 9, content: '和对方一起吃早餐' },
          { id: 10, content: '陪对方散步聊天' },
          { id: 11, content: '为对方按摩' },
          { id: 12, content: '和对方一起运动' },
          { id: 13, content: '为对方拍照' },
          { id: 14, content: '和对方一起做饭' },
          { id: 15, content: '陪对方逛街' },
          { id: 16, content: '为对方准备水果' }
        ]
      }
      return this.userData[userId].taskList
    },
    
    // 获取当前用户的今日已完成任务ID列表
    todayCompletedTaskIds() {
      const userId = this.currentUserId
      if (!userId || !this.userData[userId]) {
        return []
      }
      return this.userData[userId].todayCompletedTaskIds
    }
  },
  actions: {
    // 初始化用户数据
    initUser(userId) {
      this.currentUserId = userId
      if (!this.userData[userId]) {
        this.userData[userId] = {
          config: {
            dailyDrawTimes: 5,
            dailyExchangeLimit: 3,
            today: new Date().toDateString()
          },
          remainDrawTimes: 5,
          todayDrawHistory: [],
          todayExchangeCount: 0,
          currentDrawer: 'girl',
          foodList: [
            { id: 1, name: '黄焖鸡米饭', category: '午餐', taste: '咸香', ingredients: '鸡肉,米饭,土豆,青椒' },
            { id: 2, name: '麻辣烫', category: '午餐', taste: '麻辣', ingredients: '各种蔬菜,肉类,粉丝' },
            { id: 3, name: '烧烤', category: '夜宵', taste: '香辣', ingredients: '肉串,蔬菜,海鲜' },
            { id: 4, name: '炸鸡', category: '外卖', taste: '酥脆', ingredients: '鸡肉,面粉,调料' },
            { id: 5, name: '火锅', category: '晚餐', taste: '麻辣', ingredients: '各种食材,汤底' },
            { id: 6, name: '米线', category: '早餐', taste: '清淡', ingredients: '米线,汤,蔬菜' },
            { id: 7, name: '包子', category: '早餐', taste: '咸鲜', ingredients: '面粉,肉馅,蔬菜' },
            { id: 8, name: '盖浇饭', category: '午餐', taste: '咸香', ingredients: '米饭,各种配菜' },
            { id: 9, name: '寿司', category: '外卖', taste: '清淡', ingredients: '米饭,海苔,各种馅料' },
            { id: 10, name: '粥', category: '早餐', taste: '清淡', ingredients: '大米,各种配料' }
          ],
          taskList: [
            { id: 1, content: '给对方一个大大的拥抱' },
            { id: 2, content: '帮对方带一杯奶茶' },
            { id: 3, content: '陪对方逛校园' },
            { id: 4, content: '为对方准备一份小惊喜' },
            { id: 5, content: '和对方一起看一场电影' },
            { id: 6, content: '给对方写一封情书' },
            { id: 7, content: '陪对方去图书馆学习' },
            { id: 8, content: '为对方唱一首歌' },
            { id: 9, content: '和对方一起吃早餐' },
            { id: 10, content: '陪对方散步聊天' },
            { id: 11, content: '为对方按摩' },
            { id: 12, content: '和对方一起运动' },
            { id: 13, content: '为对方拍照' },
            { id: 14, content: '和对方一起做饭' },
            { id: 15, content: '陪对方逛街' },
            { id: 16, content: '为对方准备水果' }
          ],
          todayCompletedTaskIds: []
        }
      }
      // 检查是否跨天
      this.checkAndResetDaily()
    },
    
    // 切换用户
    switchUser(userId) {
      this.currentUserId = userId
      if (userId) {
        this.initUser(userId)
      }
    },
    
    // 检查是否跨天，跨天自动重置
    checkAndResetDaily() {
      if (!this.currentUserId) return
      
      const today = new Date().toDateString()
      if (this.config.today !== today) {
        this.userData[this.currentUserId].config.today = today
        this.userData[this.currentUserId].remainDrawTimes = this.config.dailyDrawTimes
        this.userData[this.currentUserId].todayDrawHistory = []
        this.userData[this.currentUserId].todayExchangeCount = 0
        this.userData[this.currentUserId].todayCompletedTaskIds = []
      }
    },
    
    // 消耗抽签次数
    consumeDrawTime() {
      if (!this.currentUserId) return false
      
      if (this.remainDrawTimes > 0) {
        this.userData[this.currentUserId].remainDrawTimes--
        return true
      }
      return false
    },
    
    // 兑换抽签次数
    exchangeDrawTime() {
      if (!this.currentUserId) return false
      
      if (this.todayExchangeCount < this.config.dailyExchangeLimit) {
        this.userData[this.currentUserId].todayExchangeCount++
        this.userData[this.currentUserId].remainDrawTimes++
        return true
      }
      return false
    },
    
    // 添加菜品
    addFood(food) {
      if (!this.currentUserId) return
      
      const newId = Math.max(...this.foodList.map(item => item.id), 0) + 1
      this.userData[this.currentUserId].foodList.push({
        id: newId,
        ...food
      })
    },
    
    // 更新菜品
    updateFood(id, food) {
      if (!this.currentUserId) return
      
      const index = this.foodList.findIndex(item => item.id === id)
      if (index !== -1) {
        this.userData[this.currentUserId].foodList[index] = { ...this.foodList[index], ...food }
      }
    },
    
    // 删除菜品
    deleteFood(id) {
      if (!this.currentUserId) return
      
      this.userData[this.currentUserId].foodList = this.foodList.filter(item => item.id !== id)
    },
    
    // 核心抽签逻辑
    drawRandomFood(filter = {}) {
      if (!this.currentUserId) return { success: false, message: '请先登录' }
      
      // 检查是否跨天
      this.checkAndResetDaily()
      
      // 检查次数
      if (!this.consumeDrawTime()) {
        return { success: false, message: '抽签次数不足' }
      }
      
      // 筛选菜品池
      let filteredFoods = [...this.foodList]
      
      // 排除今日已抽
      const todayDrawnFoodIds = this.todayDrawHistory.map(item => item.foodId)
      filteredFoods = filteredFoods.filter(item => !todayDrawnFoodIds.includes(item.id))
      
      // 按分类筛选
      if (filter.category && filter.category !== '全部') {
        filteredFoods = filteredFoods.filter(item => item.category === filter.category)
      }
      
      // 按口味筛选
      if (filter.taste) {
        filteredFoods = filteredFoods.filter(item => item.taste === filter.taste)
      }
      
      // 无数据时全库兜底
      if (filteredFoods.length === 0) {
        filteredFoods = [...this.foodList]
      }
      
      // 随机抽取
      const randomIndex = Math.floor(Math.random() * filteredFoods.length)
      const selectedFood = filteredFoods[randomIndex]
      
      // 记录历史
      this.userData[this.currentUserId].todayDrawHistory.push({
        id: Date.now(),
        foodId: selectedFood.id,
        foodName: selectedFood.name,
        drawer: this.currentDrawer,
        isRegret: false,
        timestamp: new Date().toISOString()
      })
      
      return {
        success: true,
        food: selectedFood
      }
    },
    
    // 反悔再抽
    regretDraw() {
      if (!this.currentUserId) return { success: false, message: '请先登录' }
      
      // 检查是否跨天
      this.checkAndResetDaily()

      // 标记最后一次抽签为反悔
      if (this.todayDrawHistory.length > 0) {
        const lastDraw = this.userData[this.currentUserId].todayDrawHistory[this.todayDrawHistory.length - 1]
        lastDraw.isRegret = true
      }
      
      return { success: true }
    },
    
    // 随机抽任务
    drawRandomTask() {
      if (!this.currentUserId) return { success: false, message: '请先登录' }
      
      // 筛选未完成的任务
      const availableTasks = this.taskList.filter(task => !this.todayCompletedTaskIds.includes(task.id))
      
      if (availableTasks.length === 0) {
        return { success: false, message: '今日任务已完成' }
      }
      
      const randomIndex = Math.floor(Math.random() * availableTasks.length)
      const selectedTask = availableTasks[randomIndex]
      
      return {
        success: true,
        task: selectedTask
      }
    },
    
    // 完成任务
    completeTask(taskId) {
      if (!this.currentUserId) return false
      
      if (!this.todayCompletedTaskIds.includes(taskId)) {
        this.userData[this.currentUserId].todayCompletedTaskIds.push(taskId)
        return true
      }
      return false
    },
    
    // 添加任务
    addTask(task) {
      if (!this.currentUserId) return
      
      const newId = Math.max(...this.taskList.map(item => item.id), 0) + 1
      this.userData[this.currentUserId].taskList.push({
        id: newId,
        content: task.content
      })
    },
    
    // 更新任务
    updateTask(id, task) {
      if (!this.currentUserId) return
      
      const index = this.taskList.findIndex(item => item.id === id)
      if (index !== -1) {
        this.userData[this.currentUserId].taskList[index] = { ...this.taskList[index], ...task }
      }
    },
    
    // 删除任务
    deleteTask(id) {
      if (!this.currentUserId) return
      
      this.userData[this.currentUserId].taskList = this.taskList.filter(item => item.id !== id)
      this.userData[this.currentUserId].todayCompletedTaskIds = this.todayCompletedTaskIds.filter(taskId => taskId !== id)
    },
    
    // 更新配置
    updateConfig(config) {
      if (!this.currentUserId) return
      
      this.userData[this.currentUserId].config = { ...this.config, ...config }
      // 重置今日次数
      this.userData[this.currentUserId].remainDrawTimes = this.config.dailyDrawTimes
    },
    
    // 设置当前抽签人
    setCurrentDrawer(drawer) {
      if (!this.currentUserId) return
      
      this.userData[this.currentUserId].currentDrawer = drawer
    }
  },
  persist: true
})
