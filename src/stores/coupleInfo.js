import { defineStore } from 'pinia'

export const useCoupleInfoStore = defineStore('coupleInfo', {
  state: () => ({
    baseInfo: {
      girlName: '宝贝',
      boyName: '亲爱的',
      togetherDate: '2024-01-01',
      girlBirthday: '1999-01-01',
      boyBirthday: '1999-01-01',
      girlAvatar: '',
      boyAvatar: ''
    },
    girlProfile: [
      { key: 'favoriteFood', value: '火锅,麻辣烫,奶茶', label: '爱吃的菜' },
      { key: 'tabooFood', value: '香菜,洋葱', label: '忌口食材' },
      { key: 'drinkPreference', value: '奶茶,果汁', label: '饮品喜好' },
      { key: 'habits', value: '喜欢吃甜的,讨厌早起', label: '生活习惯' },
      { key: 'notes', value: '生理期不能吃冰的', label: '注意事项' }
    ],
    boyProfile: [
      { key: 'favoriteFood', value: '烧烤,炸鸡,可乐', label: '爱吃的菜' },
      { key: 'tabooFood', value: '胡萝卜,苦瓜', label: '忌口食材' },
      { key: 'drinkPreference', value: '可乐,雪碧', label: '饮品喜好' },
      { key: 'habits', value: '喜欢运动,爱打游戏', label: '生活习惯' },
      { key: 'notes', value: '不要让他熬夜', label: '注意事项' }
    ],
    customAnniversary: [
      {
        id: 1,
        name: '第一次约会',
        date: '2023-12-01'
      },
      {
        id: 2,
        name: '第一次牵手',
        date: '2023-12-15'
      }
    ],
    sweetWords: [
      '你是我今生最美的相遇',
      '和你在一起的每一天都是晴天',
      '你是我的小幸运',
      '爱你不是一时兴起，而是一生一世',
      '有你在身边，就是最幸福的事',
      '你是我生命中最美好的存在',
      '和你在一起，我什么都不怕',
      '你是我的整个世界',
      '爱你到永远',
      '有你的地方就是家'
    ],
    // 用于计算在一起时长的定时器
    timer: null
  }),
  getters: {
    // 计算在一起的天/时/分/秒
    togetherDuration() {
      const togetherDate = new Date(this.baseInfo.togetherDate)
      const now = new Date()
      const diff = now - togetherDate
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      return {
        days,
        hours,
        minutes,
        seconds
      }
    },
    // 计算双方生日倒计时
    girlBirthdayCountdown() {
      const today = new Date()
      const birthday = new Date(this.baseInfo.girlBirthday)
      birthday.setFullYear(today.getFullYear())
      
      if (birthday < today) {
        birthday.setFullYear(today.getFullYear() + 1)
      }
      
      const diff = birthday - today
      return Math.floor(diff / (1000 * 60 * 60 * 24))
    },
    boyBirthdayCountdown() {
      const today = new Date()
      const birthday = new Date(this.baseInfo.boyBirthday)
      birthday.setFullYear(today.getFullYear())
      
      if (birthday < today) {
        birthday.setFullYear(today.getFullYear() + 1)
      }
      
      const diff = birthday - today
      return Math.floor(diff / (1000 * 60 * 60 * 24))
    },
    // 合并双方忌口食材
    allTabooFood() {
      const girlTabooItem = this.girlProfile.find(item => item.key === 'tabooFood')
      const boyTabooItem = this.boyProfile.find(item => item.key === 'tabooFood')
      const girlTaboo = girlTabooItem ? girlTabooItem.value.split(',').map(item => item.trim()).filter(Boolean) : []
      const boyTaboo = boyTabooItem ? boyTabooItem.value.split(',').map(item => item.trim()).filter(Boolean) : []
      return [...new Set([...girlTaboo, ...boyTaboo])]
    }
  },
  actions: {
    // 更新基础信息
    updateBaseInfo(info) {
      this.baseInfo = { ...this.baseInfo, ...info }
    },
    // 更新女友档案
    updateGirlProfile(profile) {
      if (typeof profile === 'object' && !Array.isArray(profile)) {
        // 处理添加新档案项的情况
        const newKey = Object.keys(profile)[0]
        const newValue = profile[newKey]
        const newLabel = newKey // 简化处理，实际可以根据需要添加标签
        this.girlProfile.push({ key: newKey, value: newValue, label: newLabel })
      } else if (Array.isArray(profile)) {
        // 处理排序后的数组
        this.girlProfile = profile
      }
    },
    // 更新男友档案
    updateBoyProfile(profile) {
      if (typeof profile === 'object' && !Array.isArray(profile)) {
        // 处理添加新档案项的情况
        const newKey = Object.keys(profile)[0]
        const newValue = profile[newKey]
        const newLabel = newKey // 简化处理，实际可以根据需要添加标签
        this.boyProfile.push({ key: newKey, value: newValue, label: newLabel })
      } else if (Array.isArray(profile)) {
        // 处理排序后的数组
        this.boyProfile = profile
      }
    },
    // 排序档案项
    sortProfile(type, sortedArray) {
      if (type === 'girl') {
        this.girlProfile = sortedArray
      } else if (type === 'boy') {
        this.boyProfile = sortedArray
      }
    },
    // 添加自定义纪念日
    addAnniversary(anniversary) {
      const newId = Math.max(...this.customAnniversary.map(item => item.id), 0) + 1
      this.customAnniversary.push({
        id: newId,
        ...anniversary
      })
    },
    // 更新自定义纪念日
    updateAnniversary(id, anniversary) {
      const index = this.customAnniversary.findIndex(item => item.id === id)
      if (index !== -1) {
        this.customAnniversary[index] = { ...this.customAnniversary[index], ...anniversary }
      }
    },
    // 删除自定义纪念日
    deleteAnniversary(id) {
      this.customAnniversary = this.customAnniversary.filter(item => item.id !== id)
    },
    // 获取随机甜蜜文案
    getRandomSweetWord() {
      const randomIndex = Math.floor(Math.random() * this.sweetWords.length)
      return this.sweetWords[randomIndex]
    },
    // 开始定时器更新在一起时长
    startTimer() {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        // 通过访问器自动触发更新
        this.togetherDuration
      }, 1000)
    },
    // 停止定时器
    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    // 重置档案数据
    resetProfileData() {
      this.girlProfile = [
        { key: 'favoriteFood', value: '火锅,麻辣烫,奶茶', label: '爱吃的菜' },
        { key: 'tabooFood', value: '香菜,洋葱', label: '忌口食材' },
        { key: 'drinkPreference', value: '奶茶,果汁', label: '饮品喜好' },
        { key: 'habits', value: '喜欢吃甜的,讨厌早起', label: '生活习惯' },
        { key: 'notes', value: '生理期不能吃冰的', label: '注意事项' }
      ];
      this.boyProfile = [
        { key: 'favoriteFood', value: '烧烤,炸鸡,可乐', label: '爱吃的菜' },
        { key: 'tabooFood', value: '胡萝卜,苦瓜', label: '忌口食材' },
        { key: 'drinkPreference', value: '可乐,雪碧', label: '饮品喜好' },
        { key: 'habits', value: '喜欢运动,爱打游戏', label: '生活习惯' },
        { key: 'notes', value: '不要让他熬夜', label: '注意事项' }
      ];
    }
  },
  persist: true
})
