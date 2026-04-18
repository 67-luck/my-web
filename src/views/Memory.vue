<template>
  <div class="memory" :class="{ 'memory--wish': activeTab === 'wish' }">
    <!-- 顶部Tab切换 -->
    <div class="tab-container">
      <div
        class="tab"
        :class="{ active: activeTab === 'time' }"
        @click="activeTab = 'time'"
      >
        时光点滴
      </div>
      <div
        class="tab"
        :class="{ active: activeTab === 'thing' }"
        @click="activeTab = 'thing'"
      >
        100件小事
      </div>
      <div
        class="tab"
        :class="{ active: activeTab === 'wish' }"
        @click="activeTab = 'wish'"
      >
        心愿待办
      </div>
    </div>

    <!-- 时光点滴Tab -->
    <div v-if="activeTab === 'time'" class="tab-content">
      <div v-if="memoryStore.timeRecords.length === 0" class="empty-state">
        <p>暂无时光记录</p>
        <p class="empty-hint">点击右下角按钮添加第一条记录吧！</p>
      </div>
      <div v-else class="timeline">
        <div
          v-for="(record, index) in memoryStore.timeRecords"
          :key="record.id"
          class="timeline-item"
          :style="{ '--index': index }"
        >
          <div class="timeline-content">
            <div class="timeline-header">
              <h3>{{ record.title }}</h3>
              <p class="timeline-time">{{ formatTime(record.createTime) }}</p>
            </div>
            <p class="timeline-text">{{ record.content }}</p>
            <div v-if="record.photos.length > 0" class="photo-grid">
              <div
                v-for="(photo, index) in record.photos"
                :key="index"
                class="photo-item"
                @click="previewPhoto(photo)"
              >
                <img :src="photo" alt="时光照片" />
              </div>
            </div>
            <div class="timeline-actions">
              <button class="action-btn" @click="editTimeRecord(record)">
                编辑
              </button>
              <button
                class="action-btn delete-btn"
                @click="deleteTimeRecord(record.id)"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- 悬浮新增按钮 -->
      <div class="fab" @click="showTimeRecordModal = true">+</div>
    </div>

    <!-- 100件小事Tab -->
    <div v-if="activeTab === 'thing'" class="tab-content">
      <!-- 进度卡片 -->
      <div class="card progress-card">
        <h3>完成进度</h3>
        <div class="progress-info">
          <span
            >{{ memoryStore.thingCompletionProgress.completed }}/{{
              memoryStore.thingCompletionProgress.total
            }}</span
          >
          <span>{{ memoryStore.thingCompletionProgress.percentage }}%</span>
        </div>
        <van-progress
          :percentage="memoryStore.thingCompletionProgress.percentage"
          :color="'linear-gradient(to right, #FF7B9C, #FFA8A8)'"
          :stroke-width="12"
          :show-pivot="false"
          class="custom-progress"
        />
      </div>
      <!-- 打卡列表 -->
      <div class="thing-list">
        <div
          v-for="thing in memoryStore.thingList"
          :key="thing.id"
          class="thing-item"
        >
          <div class="thing-checkbox" @click="toggleThingCompletion(thing)">
            <span v-if="thing.isCompleted">✓</span>
          </div>
          <div class="thing-content" :class="{ completed: thing.isCompleted }">
            <p>{{ thing.content }}</p>
            <div
              v-if="thing.isCompleted && thing.completedNote"
              class="thing-note"
            >
              {{ thing.completedNote }}
            </div>
            <div
              v-if="thing.isCompleted && thing.completedPhoto"
              class="thing-photo"
              @click="previewPhoto(thing.completedPhoto)"
            >
              <img :src="thing.completedPhoto" alt="完成照片" />
            </div>
          </div>
          <div class="thing-actions">
            <button class="action-btn" @click="editThing(thing)">编辑</button>
            <button
              class="action-btn delete-btn"
              @click="deleteThing(thing.id)"
            >
              删除
            </button>
          </div>
        </div>
      </div>
      <!-- 底部新增按钮 -->
      <div class="bottom-add-btn">
        <button class="btn-primary" @click="showAddThingModal = true">
          + 添加打卡项
        </button>
      </div>
    </div>

    <!-- 心愿待办Tab（方格纸 + 清单风） -->
    <div v-if="activeTab === 'wish'" class="tab-content wish-tab-root">
      <p class="wish-quote">
        总有些惊奇的际遇&nbsp;&nbsp;比方说当我遇见你
      </p>

      <div
        v-if="memoryStore.wishList.length === 0"
        class="wish-panel wish-empty-panel"
      >
        <p class="wish-empty-title">暂无心愿待办</p>
        <p class="wish-empty-hint">点击右下角「+」添加第一条心愿吧</p>
      </div>

      <div v-else class="wish-panel">
        <div
          v-for="wish in memoryStore.wishList"
          :key="wish.id"
          class="wish-row"
        >
          <button
            type="button"
            class="wish-check"
            :class="{ done: wish.isCompleted }"
            :aria-label="wish.isCompleted ? '标记未完成' : '标记完成'"
            @click="toggleWishCompletion(wish.id)"
          >
            <span v-if="wish.isCompleted" class="wish-check-mark">✓</span>
          </button>
          <button type="button" class="wish-main" @click="editWish(wish)">
            <span class="wish-title">{{ wish.title }}</span>
            <span v-if="wish.detail" class="wish-detail-line">{{
              wish.detail
            }}</span>
            <span v-if="wish.targetTime" class="wish-meta"
              >目标：{{ wish.targetTime }}</span
            >
            <span
              v-if="wish.isCompleted && wish.completedTime"
              class="wish-meta"
              >完成：{{ formatTime(wish.completedTime) }}</span
            >
          </button>
          <div class="wish-row-actions">
            <button type="button" class="wish-mini" @click.stop="editWish(wish)">
              编辑
            </button>
            <button
              type="button"
              class="wish-mini danger"
              @click.stop="deleteWish(wish.id)"
            >
              删
            </button>
          </div>
        </div>
      </div>

      <div class="wish-fab" @click="showWishModal = true">+</div>
    </div>

    <!-- 时光记录编辑弹窗 -->
    <div v-if="showTimeRecordModal" class="modal">
      <div class="modal-content">
        <h2>{{ editingTimeRecord ? "编辑时光记录" : "添加时光记录" }}</h2>
        <div class="form-item">
          <label>标题</label>
          <input
            v-model="timeRecordForm.title"
            type="text"
            class="input"
            placeholder="请输入标题"
          />
        </div>
        <div class="form-item">
          <label>时间</label>
          <input
            v-model="timeRecordForm.time"
            type="datetime-local"
            class="input"
          />
        </div>
        <div class="form-item">
          <label>内容</label>
          <textarea
            v-model="timeRecordForm.content"
            class="textarea"
            placeholder="请输入内容"
          ></textarea>
        </div>
        <div class="form-item">
          <label>照片（最多9张）</label>
          <div class="photo-upload-area">
            <div
              v-for="(photo, index) in timeRecordForm.photos"
              :key="index"
              class="uploaded-photo"
            >
              <img :src="photo" alt="上传的照片" />
              <button class="remove-photo" @click="removePhoto(index)">
                ×
              </button>
            </div>
            <div
              v-if="timeRecordForm.photos.length < 9"
              class="upload-btn"
              @click="triggerPhotoUpload"
            >
              + 上传照片
            </div>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn-primary" @click="saveTimeRecord">保存</button>
          <button class="btn-secondary" @click="showTimeRecordModal = false">
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- 打卡项编辑弹窗 -->
    <div v-if="showAddThingModal" class="modal">
      <div class="modal-content">
        <h2>{{ editingThing ? "编辑打卡项" : "添加打卡项" }}</h2>
        <div class="form-item">
          <label>内容</label>
          <input
            v-model="thingForm.content"
            type="text"
            class="input"
            placeholder="请输入打卡内容"
          />
        </div>
        <div class="form-actions">
          <button class="btn-primary" @click="saveThing">保存</button>
          <button class="btn-secondary" @click="showAddThingModal = false">
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- 打卡完成弹窗 -->
    <div v-if="showThingCompleteModal" class="modal">
      <div class="modal-content">
        <h2>标记完成</h2>
        <div class="form-item">
          <label>完成感言</label>
          <textarea
            v-model="thingCompleteForm.note"
            class="textarea"
            placeholder="请输入完成感言"
          ></textarea>
        </div>
        <div class="form-item">
          <label>完成照片</label>
          <div class="photo-upload-area">
            <div v-if="thingCompleteForm.photo" class="uploaded-photo">
              <img :src="thingCompleteForm.photo" alt="完成照片" />
              <button
                class="remove-photo"
                @click="thingCompleteForm.photo = ''"
              >
                ×
              </button>
            </div>
            <div
              v-else
              class="upload-btn"
              @click="triggerThingCompletePhotoUpload"
            >
              + 上传照片
            </div>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn-primary" @click="confirmThingComplete">
            确定
          </button>
          <button class="btn-secondary" @click="showThingCompleteModal = false">
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- 心愿编辑弹窗 -->
    <div v-if="showWishModal" class="modal">
      <div class="modal-content">
        <h2>{{ editingWish ? "编辑心愿" : "添加心愿" }}</h2>
        <div class="form-item">
          <label>标题</label>
          <input
            v-model="wishForm.title"
            type="text"
            class="input"
            placeholder="请输入心愿标题"
          />
        </div>
        <div class="form-item">
          <label>详情</label>
          <textarea
            v-model="wishForm.detail"
            class="textarea"
            placeholder="请输入心愿详情"
          ></textarea>
        </div>
        <div class="form-item">
          <label>目标时间</label>
          <input v-model="wishForm.targetTime" type="date" class="input" />
        </div>
        <div class="form-actions">
          <button class="btn-primary" @click="saveWish">保存</button>
          <button class="btn-secondary" @click="showWishModal = false">
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- 照片预览弹窗 -->
    <div
      v-if="previewingPhoto"
      class="photo-preview-modal"
      @click="previewingPhoto = null"
    >
      <img :src="previewingPhoto" alt="预览照片" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useMemoryStore } from "../stores/memory";
import { useFoodDrawStore } from "../stores/foodDraw";

const memoryStore = useMemoryStore();
const foodStore = useFoodDrawStore();
const route = useRoute();

const activeTab = ref("time");
const showTimeRecordModal = ref(false);
const showAddThingModal = ref(false);
const showThingCompleteModal = ref(false);
const showWishModal = ref(false);
const editingTimeRecord = ref(null);
const editingThing = ref(null);
const editingWish = ref(null);
const previewingPhoto = ref(null);
const thingToComplete = ref(null);

watch(
  () => route.query.tab,
  (tab) => {
    if (tab === "wish" || tab === "time" || tab === "thing") {
      activeTab.value = tab;
    }
  },
  { immediate: true }
);

// 时光记录表单
const timeRecordForm = ref({
  title: "",
  content: "",
  photos: [],
  time: "",
});

// 打卡项表单
const thingForm = ref({
  content: "",
});

// 打卡完成表单
const thingCompleteForm = ref({
  note: "",
  photo: "",
});

// 心愿表单
const wishForm = ref({
  title: "",
  detail: "",
  targetTime: "",
});

// 格式化时间
const formatTime = (timeString) => {
  const date = new Date(timeString);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 保存时光记录
const saveTimeRecord = () => {
  if (!timeRecordForm.value.title) {
    alert("请输入标题");
    return;
  }

  if (editingTimeRecord.value) {
    memoryStore.updateTimeRecord(
      editingTimeRecord.value.id,
      timeRecordForm.value
    );
  } else {
    memoryStore.addTimeRecord(timeRecordForm.value);
  }

  showTimeRecordModal.value = false;
  resetTimeRecordForm();
  alert("保存成功！");
};

// 重置时光记录表单
const resetTimeRecordForm = () => {
  editingTimeRecord.value = null;
  timeRecordForm.value = {
    title: "",
    content: "",
    photos: [],
    time: "",
  };
};

// 编辑时光记录
const editTimeRecord = (record) => {
  editingTimeRecord.value = record;
  // 转换ISO时间为datetime-local格式
  const date = new Date(record.createTime);
  const localTime = date.toISOString().slice(0, 16);
  timeRecordForm.value = {
    title: record.title,
    content: record.content,
    photos: [...record.photos],
    time: localTime,
  };
  showTimeRecordModal.value = true;
};

// 删除时光记录
const deleteTimeRecord = (id) => {
  if (confirm("确定要删除这条时光记录吗？")) {
    memoryStore.deleteTimeRecord(id);
    alert("删除成功！");
  }
};

// 触发照片上传
const triggerPhotoUpload = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.multiple = true;
  input.onchange = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 9 - timeRecordForm.value.photos.length;
    const filesToUpload = files.slice(0, remainingSlots);

    filesToUpload.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        timeRecordForm.value.photos.push(event.target.result);
      };
      reader.readAsDataURL(file);
    });
  };
  input.click();
};

// 移除照片
const removePhoto = (index) => {
  timeRecordForm.value.photos.splice(index, 1);
};

// 预览照片
const previewPhoto = (photo) => {
  previewingPhoto.value = photo;
};

// 保存打卡项
const saveThing = () => {
  if (!thingForm.value.content) {
    alert("请输入打卡内容");
    return;
  }

  if (editingThing.value) {
    memoryStore.updateThing(editingThing.value.id, thingForm.value);
  } else {
    memoryStore.addThing(thingForm.value);
  }

  showAddThingModal.value = false;
  resetThingForm();
  alert("保存成功！");
};

// 重置打卡项表单
const resetThingForm = () => {
  editingThing.value = null;
  thingForm.value = {
    content: "",
  };
};

// 编辑打卡项
const editThing = (thing) => {
  editingThing.value = thing;
  thingForm.value = {
    content: thing.content,
  };
  showAddThingModal.value = true;
};

// 删除打卡项
const deleteThing = (id) => {
  if (confirm("确定要删除这个打卡项吗？")) {
    memoryStore.deleteThing(id);
    alert("删除成功！");
  }
};

// 切换打卡项完成状态
const toggleThingCompletion = (thing) => {
  if (!thing.isCompleted) {
    thingToComplete.value = thing;
    thingCompleteForm.value = {
      note: "",
      photo: "",
    };
    showThingCompleteModal.value = true;
  } else {
    memoryStore.toggleThingCompletion(thing.id);
    alert("已标记为未完成");
  }
};

// 确认打卡完成
const confirmThingComplete = () => {
  if (thingToComplete.value) {
    memoryStore.toggleThingCompletion(thingToComplete.value.id, {
      note: thingCompleteForm.value.note,
      photo: thingCompleteForm.value.photo,
    });
    // 增加抽奖次数
    foodStore.remainDrawTimes++;
    showThingCompleteModal.value = false;
    thingToComplete.value = null;
    thingCompleteForm.value = {
      note: "",
      photo: "",
    };
    alert("标记完成成功！获得1次抽奖机会！");
  }
};

// 触发打卡完成照片上传
const triggerThingCompletePhotoUpload = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        thingCompleteForm.value.photo = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
};

// 保存心愿
const saveWish = () => {
  if (!wishForm.value.title) {
    alert("请输入心愿标题");
    return;
  }

  if (editingWish.value) {
    memoryStore.updateWish(editingWish.value.id, wishForm.value);
  } else {
    memoryStore.addWish(wishForm.value);
  }

  showWishModal.value = false;
  resetWishForm();
  alert("保存成功！");
};

// 重置心愿表单
const resetWishForm = () => {
  editingWish.value = null;
  wishForm.value = {
    title: "",
    detail: "",
    targetTime: "",
  };
};

// 编辑心愿
const editWish = (wish) => {
  editingWish.value = wish;
  wishForm.value = {
    title: wish.title,
    detail: wish.detail,
    targetTime: wish.targetTime,
  };
  showWishModal.value = true;
};

// 删除心愿
const deleteWish = (id) => {
  if (confirm("确定要删除这个心愿吗？")) {
    memoryStore.deleteWish(id);
    alert("删除成功！");
  }
};

// 切换心愿完成状态
const toggleWishCompletion = (id) => {
  memoryStore.toggleWishCompletion(id);
};
</script>

<style scoped>
.memory {
  padding-bottom: 80px;
  background: transparent;
  min-height: 100vh;
  position: relative;
}

.memory::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: none;
  z-index: 1;
}

.memory > * {
  position: relative;
  z-index: 2;
}

.tab-container {
  display: flex;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 10;
}

.tab {
  flex: 1;
  padding: 16px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
}

.tab.active {
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
}

.tab-content {
  padding: 16px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-tertiary);
}

.empty-hint {
  margin-top: 8px;
  font-size: 14px;
}

.timeline-content {
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 16px;
  margin-left: 12px;
  flex: 1;
  transition: var(--transition);
}

.timeline-content:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.timeline-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 0;
}

.timeline-time {
  font-size: 12px;
  color: var(--text-tertiary);
  margin: 0;
}

.timeline-text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 12px;
}

.timeline-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f5f5f5;
  color: var(--text-secondary);
}

.action-btn.delete-btn {
  background-color: #ff6b6b;
  color: white;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.progress-card {
  margin-bottom: 24px;
  padding: 20px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.custom-progress {
  margin: 16px 0;
  border-radius: 6px;
  overflow: hidden;
}

.custom-progress .van-progress__track {
  background-color: #f5f5f5;
  border-radius: 6px;
}

.custom-progress .van-progress__bar {
  border-radius: 6px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.thing-list {
  margin-top: 16px;
}

.thing-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  margin-bottom: 12px;
}

.thing-checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.thing-checkbox:hover {
  background-color: rgba(255, 123, 156, 0.1);
}

.thing-checkbox span {
  display: none;
}

.thing-item.completed .thing-checkbox {
  background-color: var(--primary-color);
}

.thing-item.completed .thing-checkbox span {
  display: block;
}

.thing-content {
  flex: 1;
  font-size: 14px;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.thing-content p {
  margin: 0 0 8px 0;
}

.thing-content.completed {
  text-decoration: line-through;
  color: var(--text-tertiary);
}

.thing-note {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 8px 0;
  padding: 8px;
  background-color: rgba(255, 123, 156, 0.1);
  border-radius: 6px;
  text-decoration: none;
}

.thing-photo {
  margin-top: 8px;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.thing-photo:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.thing-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thing-actions {
  display: flex;
  gap: 8px;
}

.bottom-add-btn {
  position: fixed;
  bottom: 80px;
  left: 0;
  right: 0;
  padding: 0 16px;
  z-index: 90;
}

.bottom-add-btn button {
  width: 100%;
  height: 48px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
}

.memory--wish .tab-container {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
}

.wish-tab-root {
  margin: -16px;
  padding: 22px 16px 110px;
  min-height: calc(100vh - 120px);
  --grid-line: rgba(0, 0, 0, 0.07);
  background-color: #f5f5f5;
  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 22px 22px;
}

.wish-quote {
  margin: 0 auto 22px;
  max-width: 520px;
  text-align: center;
  font-family: Georgia, "Times New Roman", "Songti SC", "STSong", serif;
  font-size: 14px;
  line-height: 1.75;
  color: #666;
}

.wish-panel {
  max-width: 640px;
  margin: 0 auto;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.07);
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.wish-empty-panel {
  padding: 56px 24px;
  text-align: center;
}

.wish-empty-title {
  font-size: 16px;
  color: #888;
  margin: 0 0 8px;
}

.wish-empty-hint {
  margin: 0;
  font-size: 13px;
  color: #aaa;
}

.wish-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 18px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.wish-row:last-child {
  border-bottom: none;
}

.wish-check {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  margin-top: 2px;
  border-radius: 50%;
  border: 2px solid #c8c8c8;
  background: #fff;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.wish-check.done {
  border-color: #52c41a;
  background: #52c41a;
}

.wish-check-mark {
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
}

.wish-main {
  flex: 1;
  min-width: 0;
  text-align: left;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  font: inherit;
}

.wish-title {
  display: block;
  font-family: Georgia, "Times New Roman", "Songti SC", "STSong", serif;
  font-size: 16px;
  font-weight: 600;
  color: #2d2d2d;
  line-height: 1.35;
}

.wish-detail-line {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

.wish-meta {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #999;
}

.wish-row-actions {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 2px;
}

.wish-mini {
  border: 1px solid #e8e8e8;
  background: #fafafa;
  border-radius: 8px;
  font-size: 11px;
  padding: 4px 8px;
  cursor: pointer;
  color: #666;
}

.wish-mini.danger {
  border-color: #ffccc7;
  color: #cf1322;
  background: #fff2f0;
}

.wish-fab {
  position: fixed;
  bottom: 88px;
  right: 18px;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, #ff7b4a, #ff5a3c);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 600;
  cursor: pointer;
  z-index: 100;
  box-shadow: 0 8px 22px rgba(255, 90, 60, 0.45);
  transition: transform 0.2s ease;
}

.wish-fab:hover {
  transform: scale(1.06);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: var(--border-radius);
  padding: 24px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin-bottom: 24px;
  text-align: center;
}

.form-item {
  margin-bottom: 16px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.textarea {
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
  transition: all 0.3s ease;
}

.textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 123, 156, 0.1);
}

.photo-upload-area {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.uploaded-photo {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
}

.uploaded-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-photo {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-btn {
  width: 80px;
  height: 80px;
  border: 2px dashed #e5e5e5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.form-actions button {
  flex: 1;
}

.photo-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  cursor: pointer;
}

.photo-preview-modal img {
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
}

.fab {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(255, 123, 156, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 100;
  font-size: 24px;
  font-weight: 600;
}

.fab:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(255, 123, 156, 0.6);
}
</style>
