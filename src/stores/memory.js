import { defineStore } from 'pinia'

export const useMemoryStore = defineStore('memory', {
  state: () => ({
    timeRecords: [
      {
        id: 1,
        createTime: new Date().toISOString(),
        title: '第一次约会',
        content: '我们在校园里散步，一起吃了晚餐，度过了美好的一天',
        photos: []
      }
    ],
    thingList: [
      { id: 1, content: '一起逛校园', isCompleted: false, completedTime: null, completedPhoto: '', completedNote: '' },
      { id: 2, content: '一起去图书馆学习', isCompleted: false, completedTime: null, completedPhoto: '', completedNote: '' },
      { id: 3, content: '一起看电影', isCompleted: false, completedTime: null, completedPhoto: '', completedNote: '' },
      { id: 4, content: '一起吃早餐', isCompleted: false, completedTime: null, completedPhoto: '', completedNote: '' },
      { id: 5, content: '一起运动', isCompleted: false, completedTime: null, completedPhoto: '', completedNote: '' },
      { id: 6, content: '一起逛街', isCompleted: false, completedTime: null, completedPhoto: '', completedNote: '' },
      { id: 7, content: '一起做饭', isCompleted: false, completedTime: null, completedPhoto: '', completedNote: '' },
      { id: 8, content: '一起旅行', isCompleted: false, completedTime: null, completedPhoto: '', completedNote: '' },
      { id: 9, content: '一起过生日', isCompleted: false, completedTime: null, completedPhoto: '', completedNote: '' },
      { id: 10, content: '一起过情人节', isCompleted: false, completedTime: null, completedPhoto: '', completedNote: '' },
      { id: 11, content: '一起拍情侣照', isCompleted: false, completedTime: null, completedPhoto: '', completedNote: '' },
      { id: 12, content: '一起看星星', isCompleted: false, completedTime: null, completedPhoto: '', completedNote: '' },
      { id: 13, content: '一起参加活动', isCompleted: false, completedTime: null, completedPhoto: '', completedNote: '' },
      { id: 14, content: '一起熬夜复习', isCompleted: false, completedTime: null, completedPhoto: '', completedNote: '' },
      { id: 15, content: '一起毕业', isCompleted: false, completedTime: null, completedPhoto: '', completedNote: '' }
    ],
    wishList: [
      { id: 1, title: '一起去旅行', detail: '想去海边看日出', targetTime: '2024-12-31', isCompleted: false, completedTime: null },
      { id: 2, title: '一起看演唱会', detail: '看喜欢的歌手演唱会', targetTime: '2024-10-01', isCompleted: false, completedTime: null }
    ]
  }),
  getters: {
    // 计算100件小事的完成进度
    thingCompletionProgress() {
      const completedCount = this.thingList.filter(item => item.isCompleted).length
      const totalCount = this.thingList.length
      return {
        percentage: Math.round((completedCount / totalCount) * 100),
        completed: completedCount,
        total: totalCount
      }
    }
  },
  actions: {
    // 添加时光记录
    addTimeRecord(record) {
      const newId = Math.max(...this.timeRecords.map(item => item.id), 0) + 1
      this.timeRecords.push({
        id: newId,
        createTime: record.time ? new Date(record.time).toISOString() : new Date().toISOString(),
        ...record
      })
      // 按时间倒序排列
      this.timeRecords.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
    },
    // 更新时光记录
    updateTimeRecord(id, record) {
      const index = this.timeRecords.findIndex(item => item.id === id)
      if (index !== -1) {
        this.timeRecords[index] = { 
          ...this.timeRecords[index], 
          ...record,
          createTime: record.time ? new Date(record.time).toISOString() : this.timeRecords[index].createTime
        }
        // 重新排序
        this.timeRecords.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
      }
    },
    // 删除时光记录
    deleteTimeRecord(id) {
      this.timeRecords = this.timeRecords.filter(item => item.id !== id)
    },
    // 添加打卡事项
    addThing(thing) {
      const newId = Math.max(...this.thingList.map(item => item.id), 0) + 1
      this.thingList.push({
        id: newId,
        content: thing.content,
        isCompleted: false,
        completedTime: null,
        completedPhoto: '',
        completedNote: ''
      })
    },
    // 更新打卡事项
    updateThing(id, thing) {
      const index = this.thingList.findIndex(item => item.id === id)
      if (index !== -1) {
        this.thingList[index] = { ...this.thingList[index], ...thing }
      }
    },
    // 切换打卡事项完成状态
    toggleThingCompletion(id, completedData = {}) {
      const index = this.thingList.findIndex(item => item.id === id)
      if (index !== -1) {
        this.thingList[index].isCompleted = !this.thingList[index].isCompleted
        if (this.thingList[index].isCompleted) {
          this.thingList[index].completedTime = new Date().toISOString()
          this.thingList[index].completedPhoto = completedData.photo || ''
          this.thingList[index].completedNote = completedData.note || ''
        } else {
          this.thingList[index].completedTime = null
          this.thingList[index].completedPhoto = ''
          this.thingList[index].completedNote = ''
        }
      }
    },
    // 删除打卡事项
    deleteThing(id) {
      this.thingList = this.thingList.filter(item => item.id !== id)
    },
    // 添加心愿待办
    addWish(wish) {
      const newId = Math.max(...this.wishList.map(item => item.id), 0) + 1
      this.wishList.push({
        id: newId,
        ...wish,
        isCompleted: false,
        completedTime: null
      })
    },
    // 更新心愿待办
    updateWish(id, wish) {
      const index = this.wishList.findIndex(item => item.id === id)
      if (index !== -1) {
        this.wishList[index] = { ...this.wishList[index], ...wish }
      }
    },
    // 切换心愿待办完成状态
    toggleWishCompletion(id) {
      const index = this.wishList.findIndex(item => item.id === id)
      if (index !== -1) {
        this.wishList[index].isCompleted = !this.wishList[index].isCompleted
        if (this.wishList[index].isCompleted) {
          this.wishList[index].completedTime = new Date().toISOString()
        } else {
          this.wishList[index].completedTime = null
        }
      }
    },
    // 删除心愿待办
    deleteWish(id) {
      this.wishList = this.wishList.filter(item => item.id !== id)
    }
  },
  persist: true
})
