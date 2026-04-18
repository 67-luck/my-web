<template>
  <div class="home">
    <header class="lg-topbar">
      <div class="lg-brand">
        <span class="lg-site">心动加载中心</span>
        <span class="lg-ver">v1.0</span>
      </div>
      <p class="lg-poem">{{ sweetWord }}</p>
      <button type="button" class="lg-logout" title="退出登录" @click="logout">
        🚪
      </button>
    </header>

    <section class="lg-hero" aria-label="主页头图">
      <div class="lg-hero-bg" />
      <div class="lg-glass">
        <div class="lg-glass-inner">
          <div class="lg-avatar-col">
            <button
              type="button"
              class="lg-avatar"
              @click="handleUploadAvatar('girl')"
            >
              <img
                v-if="coupleStore.baseInfo.girlAvatar"
                :src="coupleStore.baseInfo.girlAvatar"
                alt=""
              />
              <span v-else class="lg-avatar-fallback">👩</span>
            </button>
            <span class="lg-name">{{ coupleStore.baseInfo.girlName }}</span>
          </div>
          <div class="lg-heart-wrap" aria-hidden="true">
            <span class="lg-heart">❤️</span>
            <span class="lg-heart-rays" />
          </div>
          <div class="lg-avatar-col">
            <button
              type="button"
              class="lg-avatar"
              @click="handleUploadAvatar('boy')"
            >
              <img
                v-if="coupleStore.baseInfo.boyAvatar"
                :src="coupleStore.baseInfo.boyAvatar"
                alt=""
              />
              <span v-else class="lg-avatar-fallback">👨</span>
            </button>
            <span class="lg-name">{{ coupleStore.baseInfo.boyName }}</span>
          </div>
        </div>
      </div>
    </section>

    <div class="lg-wave-wrap" aria-hidden="true">
      <svg
        class="lg-wave"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#fafafa"
          d="M0,40 C240,100 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
        />
      </svg>
    </div>

    <section class="lg-paper" aria-label="在一起计时">
      <p class="lg-timer-title">这是我们一起走过的</p>
      <p class="lg-timer-line">
        <span class="lg-num">{{ duration.days }}</span
        ><span class="lg-unit">天</span>
        <span class="lg-num">{{ duration.hours }}</span
        ><span class="lg-unit">时</span>
        <span class="lg-num">{{ duration.minutes }}</span
        ><span class="lg-unit">分</span>
        <span class="lg-num">{{ duration.seconds }}</span
        ><span class="lg-unit">秒</span>
      </p>

      <div class="lg-nav-grid">
        <button type="button" class="lg-nav-card" @click="router.push('/memory')">
          <span class="lg-nav-icon lg-nav-icon--purple">📝</span>
          <span class="lg-nav-t">点点滴滴</span>
          <span class="lg-nav-d">记录时光里的温柔碎片</span>
        </button>
        <button type="button" class="lg-nav-card" @click="router.push('/food')">
          <span class="lg-nav-icon lg-nav-icon--blue">🍔</span>
          <span class="lg-nav-t">今天吃啥</span>
          <span class="lg-nav-d">抽签决定下一顿的小确幸</span>
        </button>
        <button type="button" class="lg-nav-card" @click="router.push('/sync')">
          <span class="lg-nav-icon lg-nav-icon--yellow">🔄</span>
          <span class="lg-nav-t">同步备份</span>
          <span class="lg-nav-d">把我们的数据好好收起来</span>
        </button>
        <button type="button" class="lg-nav-card" @click="scrollToProfile">
          <span class="lg-nav-icon lg-nav-icon--orange">💛</span>
          <span class="lg-nav-t">关于我们</span>
          <span class="lg-nav-d">昵称、生日与我们的小档案</span>
        </button>
        <button
          type="button"
          class="lg-nav-card lg-nav-card--wide"
          @click="router.push({ path: '/memory', query: { tab: 'wish' } })"
        >
          <span class="lg-nav-icon lg-nav-icon--red">✨</span>
          <span class="lg-nav-t">心愿待办</span>
          <span class="lg-nav-d">一起写下想完成的事</span>
        </button>
      </div>
    </section>

    <!-- 重要日期倒计时卡片 -->
    <div class="card">
      <div class="card-header">
        <h2>重要日期</h2>
        <button class="btn-icon" @click="showAddImportantDateModal = true">
          +
        </button>
      </div>
      <div class="countdown-container">
        <div class="countdown-item">
          <h3>{{ coupleStore.baseInfo.girlName }}生日</h3>
          <p class="countdown-number">
            {{ coupleStore.girlBirthdayCountdown }}
          </p>
          <p class="countdown-label">天</p>
          <button
            class="btn-small"
            @mousedown="openDateEditModal('girlBirthday')"
          >
            编辑
          </button>
        </div>
        <div class="countdown-item">
          <h3>{{ coupleStore.baseInfo.boyName }}生日</h3>
          <p class="countdown-number">{{ coupleStore.boyBirthdayCountdown }}</p>
          <p class="countdown-label">天</p>
          <button
            class="btn-small"
            @mousedown="openDateEditModal('boyBirthday')"
          >
            编辑
          </button>
        </div>
      </div>
      <div class="anniversary-list">
        <div class="anniversary-header">
          <h3>自定义纪念日</h3>
          <button class="btn-icon" @mousedown="showAddAnniversaryModal = true">
            +
          </button>
        </div>
        <div
          v-if="coupleStore.customAnniversary.length === 0"
          class="empty-state"
        >
          <p>暂无自定义纪念日</p>
          <button
            class="btn-secondary btn-sm"
            @mousedown="showAddAnniversaryModal = true"
          >
            添加纪念日
          </button>
        </div>
        <transition-group name="anniversary-list" tag="div">
          <div
            v-for="anniversary in coupleStore.customAnniversary"
            :key="anniversary.id"
            class="anniversary-item"
          >
            <div class="anniversary-info">
              <h4>{{ anniversary.name }}</h4>
              <p>{{ anniversary.date }}</p>
            </div>
            <div class="anniversary-actions">
              <span class="anniversary-countdown"
                >{{ getAnniversaryCountdown(anniversary.date) }}天</span
              >
              <button
                class="btn-icon small"
                @mousedown="editAnniversary(anniversary)"
              >
                ✏️
              </button>
              <button
                class="btn-icon small delete"
                @mousedown="deleteAnniversary(anniversary.id)"
              >
                🗑️
              </button>
            </div>
          </div>
        </transition-group>
      </div>
    </div>

    <!-- 喜好档案卡片 -->
    <div id="home-profile" class="card">
      <div class="tab-container">
        <div
          class="tab"
          :class="{ active: activeTab === 'girl' }"
          @click="activeTab = 'girl'"
        >
          👩 {{ coupleStore.baseInfo.girlName }}档案
        </div>
        <div
          class="tab"
          :class="{ active: activeTab === 'boy' }"
          @click="activeTab = 'boy'"
        >
          👨 {{ coupleStore.baseInfo.boyName }}档案
        </div>
      </div>
      <div class="profile-content">
        <!-- 动态渲染档案项 -->
        <div v-for="(item, index) in activeTab === 'girl' ? coupleStore.girlProfile : coupleStore.boyProfile" :key="item.key || index" class="profile-item">
          <div class="profile-handle">
            <div class="handle-dots">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          </div>
          <div class="profile-label">{{ item.label }}</div>
          <div class="profile-value">{{ item.value }}</div>
        </div>
        
        <div class="profile-actions">
          <button class="btn-secondary" @click="showProfileEdit = true">
            编辑档案
          </button>
          <button
            class="btn-primary"
            @click="showAddProfileItemModal = true"
          >
            添加档案项
          </button>
        </div>
      </div>
    </div>

    <div class="lg-fab-stack">
      <button type="button" class="lg-fab-btn" title="回到顶部" @click="scrollToTop">
        ↑
      </button>
      <button type="button" class="lg-fab-btn" title="去干饭" @click="router.push('/food')">
        🍔
      </button>
      <button type="button" class="lg-fab-btn" title="编辑基础信息" @click="showBaseEdit = true">
        ✏️
      </button>
    </div>

    <!-- 基础信息编辑弹窗 -->
    <div v-if="showBaseEdit" class="modal">
      <div
        class="modal-content"
        @mouseenter="handleModalHover('showBaseEdit', true)"
        @mouseleave="handleModalHover('showBaseEdit', false)"
      >
        <div class="modal-header">
          <h2>编辑基础信息</h2>
          <div class="countdown-indicator">
            <div class="countdown-bar">
              <div
                class="countdown-fill"
                :style="{
                  width:
                    (modalCountdowns[getModalKey('showBaseEdit')] / 3) * 100 +
                    '%',
                }"
              ></div>
            </div>
            <span class="countdown-text"
              >{{
                Math.ceil(modalCountdowns[getModalKey("showBaseEdit")] || 3)
              }}s</span
            >
          </div>
        </div>
        <div class="form-item">
          <label>女友昵称</label>
          <input
            v-model="baseForm.girlName"
            type="text"
            class="input"
            placeholder="请输入女友昵称"
          />
        </div>
        <div class="form-item">
          <label>男友昵称</label>
          <input
            v-model="baseForm.boyName"
            type="text"
            class="input"
            placeholder="请输入男友昵称"
          />
        </div>
        <div class="form-item">
          <label>在一起日期</label>
          <input v-model="baseForm.togetherDate" type="date" class="input" />
        </div>
        <div class="form-item">
          <label>女友生日</label>
          <input v-model="baseForm.girlBirthday" type="date" class="input" />
        </div>
        <div class="form-item">
          <label>男友生日</label>
          <input v-model="baseForm.boyBirthday" type="date" class="input" />
        </div>
        <div class="form-actions">
          <button class="btn-primary" @click="saveBaseInfo">保存</button>
          <button class="btn-secondary" @click="showBaseEdit = false">
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- 档案编辑弹窗 -->
    <div v-if="showProfileEdit" class="modal">
      <div
        class="modal-content"
        @mouseenter="handleModalHover('showProfileEdit', true)"
        @mouseleave="handleModalHover('showProfileEdit', false)"
      >
        <div class="modal-header">
          <h2>编辑{{ activeTab === "girl" ? "女友" : "男友" }}档案</h2>
          <div class="countdown-indicator">
            <div class="countdown-bar">
              <div
                class="countdown-fill"
                :style="{
                  width:
                    (modalCountdowns[getModalKey('showProfileEdit')] / 3) *
                      100 +
                    '%',
                }"
              ></div>
            </div>
            <span class="countdown-text"
              >{{
                Math.ceil(modalCountdowns[getModalKey("showProfileEdit")] || 3)
              }}s</span
            >
          </div>
        </div>
        <div class="form-item">
          <label>爱吃的菜（逗号分隔）</label>
          <input
            v-model="profileForm.favoriteFood"
            type="text"
            class="input"
            placeholder="请输入爱吃的菜"
          />
        </div>
        <div class="form-item">
          <label>忌口食材（逗号分隔）</label>
          <input
            v-model="profileForm.tabooFood"
            type="text"
            class="input"
            placeholder="请输入忌口食材"
          />
        </div>
        <div class="form-item">
          <label>饮品喜好（逗号分隔）</label>
          <input
            v-model="profileForm.drinkPreference"
            type="text"
            class="input"
            placeholder="请输入饮品喜好"
          />
        </div>
        <div class="form-item">
          <label>生活习惯（逗号分隔）</label>
          <input
            v-model="profileForm.habits"
            type="text"
            class="input"
            placeholder="请输入生活习惯"
          />
        </div>
        <div class="form-item">
          <label>注意事项</label>
          <input
            v-model="profileForm.notes"
            type="text"
            class="input"
            placeholder="请输入注意事项"
          />
        </div>
        <div class="form-actions">
          <button class="btn-primary" @click="saveProfileInfo">保存</button>
          <button class="btn-secondary" @click="showProfileEdit = false">
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- 添加纪念日弹窗 -->
    <div v-if="showAddAnniversaryModal" class="modal">
      <div
        class="modal-content"
        @mouseenter="handleModalHover('showAddAnniversaryModal', true)"
        @mouseleave="handleModalHover('showAddAnniversaryModal', false)"
      >
        <div class="modal-header">
          <h2>{{ editingAnniversary ? "编辑纪念日" : "添加纪念日" }}</h2>
          <div class="countdown-indicator">
            <div class="countdown-bar">
              <div
                class="countdown-fill"
                :style="{
                  width:
                    (modalCountdowns[getModalKey('showAddAnniversaryModal')] /
                      3) *
                      100 +
                    '%',
                }"
              ></div>
            </div>
            <span class="countdown-text"
              >{{
                Math.ceil(
                  modalCountdowns[getModalKey("showAddAnniversaryModal")] || 3
                )
              }}s</span
            >
          </div>
        </div>
        <div class="form-item">
          <label>纪念日名称</label>
          <input
            v-model="anniversaryForm.name"
            type="text"
            class="input"
            placeholder="请输入纪念日名称"
          />
        </div>
        <div class="form-item">
          <label>日期</label>
          <input v-model="anniversaryForm.date" type="date" class="input" />
        </div>
        <div class="form-actions">
          <button class="btn-primary" @click="saveAnniversary">保存</button>
          <button
            class="btn-secondary"
            @click="showAddAnniversaryModal = false"
          >
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- 日期编辑弹窗 -->
    <div v-if="showDateEditModal" class="modal">
      <div
        class="modal-content"
        @mouseenter="handleModalHover('showDateEditModal', true)"
        @mouseleave="handleModalHover('showDateEditModal', false)"
      >
        <div class="modal-header">
          <h2>编辑日期</h2>
          <div class="countdown-indicator">
            <div class="countdown-bar">
              <div
                class="countdown-fill"
                :style="{
                  width:
                    (modalCountdowns[getModalKey('showDateEditModal')] / 3) *
                      100 +
                    '%',
                }"
              ></div>
            </div>
            <span class="countdown-text"
              >{{
                Math.ceil(
                  modalCountdowns[getModalKey("showDateEditModal")] || 3
                )
              }}s</span
            >
          </div>
        </div>
        <div class="form-item">
          <label>{{
            dateEditType === "girlBirthday"
              ? "女友生日"
              : dateEditType === "boyBirthday"
              ? "男友生日"
              : "在一起日期"
          }}</label>
          <input v-model="dateForm.value" type="date" class="input" />
        </div>
        <div class="form-actions">
          <button class="btn-primary" @click="saveDate">保存</button>
          <button class="btn-secondary" @click="showDateEditModal = false">
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- 添加档案项弹窗 -->
    <div v-if="showAddProfileItemModal" class="modal">
      <div
        class="modal-content"
        @mouseenter="handleModalHover('showAddProfileItemModal', true)"
        @mouseleave="handleModalHover('showAddProfileItemModal', false)"
      >
        <div class="modal-header">
          <h2>添加档案项</h2>
          <div class="countdown-indicator">
            <div class="countdown-bar">
              <div
                class="countdown-fill"
                :style="{
                  width:
                    (modalCountdowns[getModalKey('showAddProfileItemModal')] /
                      3) *
                      100 +
                    '%',
                }"
              ></div>
            </div>
            <span class="countdown-text"
              >{{
                Math.ceil(
                  modalCountdowns[getModalKey("showAddProfileItemModal")] || 3
                )
              }}s</span
            >
          </div>
        </div>
        <div class="form-item">
          <label>档案项标题</label>
          <input
            v-model="profileItemForm.title"
            type="text"
            class="input"
            placeholder="请输入档案项标题"
          />
        </div>
        <div class="form-item">
          <label>档案项内容</label>
          <input
            v-model="profileItemForm.content"
            type="text"
            class="input"
            placeholder="请输入档案项内容"
          />
        </div>
        <div class="form-actions">
          <button class="btn-primary" @click="saveProfileItem">保存</button>
          <button
            class="btn-secondary"
            @click="showAddProfileItemModal = false"
          >
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- 添加重要日期名称弹窗 -->
    <div v-if="showAddImportantDateModal" class="modal">
      <div
        class="modal-content"
        @mouseenter="handleModalHover('showAddImportantDateModal', true)"
        @mouseleave="handleModalHover('showAddImportantDateModal', false)"
      >
        <div class="modal-header">
          <h2>添加重要日期</h2>
          <div class="countdown-indicator">
            <div class="countdown-bar">
              <div
                class="countdown-fill"
                :style="{
                  width:
                    (modalCountdowns[getModalKey('showAddImportantDateModal')] /
                      3) *
                      100 +
                    '%',
                }"
              ></div>
            </div>
            <span class="countdown-text"
              >{{
                Math.ceil(
                  modalCountdowns[getModalKey("showAddImportantDateModal")] || 3
                )
              }}s</span
            >
          </div>
        </div>
        <div class="form-item">
          <label>日期名称</label>
          <input
            v-model="importantDateForm.name"
            type="text"
            class="input"
            placeholder="请输入重要日期名称"
          />
        </div>
        <div class="form-item">
          <label>日期</label>
          <input v-model="importantDateForm.date" type="date" class="input" />
          </div>
          <div class="form-actions">
            <button class="btn-primary" @click="saveImportantDate">保存</button>
            <button
              class="btn-secondary"
              @click="showAddImportantDateModal = false"
            >
              取消
            </button>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useCoupleInfoStore } from "../stores/coupleInfo";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const coupleStore = useCoupleInfoStore();
const authStore = useAuthStore();
const router = useRouter();

// 检查登录状态
// if (!authStore.isLoggedIn) {
//   router.push("/login");
// }

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const scrollToProfile = () => {
  document.getElementById("home-profile")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

// 登出功能
const logout = () => {
  try {
    // 显示确认提示
    if (confirm("确定要退出登录吗？")) {
      // 清除用户本地存储的认证信息并终止当前用户会话
      authStore.logout();
      // 使用 Vue Router 导航到登录页面，确保路径正确
      router.push("/login");
    }
  } catch (error) {
    // 错误处理
    console.error("退出登录失败:", error);
    alert("退出登录失败，请稍后重试");
  }
};

const activeTab = ref("girl");
const showBaseEdit = ref(false);
const showProfileEdit = ref(false);
const showAddAnniversaryModal = ref(false);
const showDateEditModal = ref(false);
const showAddProfileItemModal = ref(false);
const showAddImportantDateModal = ref(false);
const sweetWord = ref("");
const editingAnniversary = ref(null);
const dateEditType = ref("");

// 档案项拖拽相关状态
const draggingItem = ref(null);
const dragIndex = ref(-1);
const dragOffset = ref(0);
const startY = ref(0);

// 弹窗管理
const modalTimers = ref({});
const modalCountdowns = ref({});
const modalHovered = ref({});

// 生成唯一键的函数
const getModalKey = (modalName) => {
  // 使用 modalName 作为键，而不是 ref 对象
  return modalName;
};

// 显示弹窗并设置自动关闭
const showModalWithAutoClose = (modalRef, modalName, duration = 3000) => {
  const key = getModalKey(modalName);
  // 清除之前的定时器
  if (modalTimers.value[key]) {
    clearTimeout(modalTimers.value[key]);
  }

  // 显示弹窗
  modalRef.value = true;

  // 初始化倒计时
  modalCountdowns.value[key] = duration / 1000;
  modalHovered.value[key] = false;

  // 开始倒计时
  const countdownInterval = setInterval(() => {
    if (!modalHovered.value[key]) {
      modalCountdowns.value[key] -= 0.1;
      if (modalCountdowns.value[key] <= 0) {
        clearInterval(countdownInterval);
        modalRef.value = false;
      }
    }
  }, 100);

  // 设置自动关闭定时器
  modalTimers.value[key] = setTimeout(() => {
    clearInterval(countdownInterval);
    modalRef.value = false;
  }, duration);
};

// 处理弹窗悬停
const handleModalHover = (modalName, isHovered) => {
  const key = getModalKey(modalName);
  modalHovered.value[key] = isHovered;
};

// 基础信息表单
const baseForm = ref({
  girlName: "",
  boyName: "",
  togetherDate: "",
  girlBirthday: "",
  boyBirthday: "",
});

// 档案表单
const profileForm = ref({
  favoriteFood: "",
  tabooFood: "",
  drinkPreference: "",
  habits: "",
  notes: "",
});

// 纪念日表单
const anniversaryForm = ref({
  name: "",
  date: "",
});

// 日期编辑表单
const dateForm = ref({
  value: "",
});

// 档案项表单
const profileItemForm = ref({
  title: "",
  content: "",
});

// 重要日期表单
const importantDateForm = ref({
  name: "",
  date: "",
});

// 计算在一起时长
const duration = computed(() => coupleStore.togetherDuration);

// 档案项拖拽相关方法
const startProfileDrag = (item, index, event, isTouch = false) => {
  draggingItem.value = item;
  dragIndex.value = index;

  // 获取起始位置
  if (isTouch) {
    startY.value = event.touches[0].clientY;
  } else {
    startY.value = event.clientY;
  }

  // 添加事件监听器
  if (isTouch) {
    document.addEventListener("touchmove", onProfileDrag, { passive: false });
    document.addEventListener("touchend", stopProfileDrag);
  } else {
    document.addEventListener("mousemove", onProfileDrag);
    document.addEventListener("mouseup", stopProfileDrag);
  }

  // 阻止默认事件
  event.preventDefault();
};

const onProfileDrag = (event) => {
  if (!draggingItem.value) return;

  // 计算当前位置
  let currentY;
  if (event.type === "touchmove") {
    currentY = event.touches[0].clientY;
  } else {
    currentY = event.clientY;
  }

  // 计算偏移量
  dragOffset.value = currentY - startY.value;

  // 计算新的位置
  const profileList =
    activeTab.value === "girl"
      ? coupleStore.girlProfile
      : coupleStore.boyProfile;
  const itemHeight = 60; // 假设每个档案项的高度
  const newIndex = Math.max(
    0,
    Math.min(
      profileList.length - 1,
      dragIndex.value + Math.round(dragOffset.value / itemHeight)
    )
  );

  // 如果位置发生变化，更新排序
  if (newIndex !== dragIndex.value) {
    const updatedList = [...profileList];
    updatedList.splice(dragIndex.value, 1);
    updatedList.splice(newIndex, 0, draggingItem.value);

    // 更新store中的数据
    if (activeTab.value === "girl") {
      coupleStore.updateGirlProfile(updatedList);
    } else {
      coupleStore.updateBoyProfile(updatedList);
    }

    // 调整起始位置，使拖拽更流畅（先计算位移再更新索引）
    const indexDelta = newIndex - dragIndex.value;
    startY.value = currentY - indexDelta * itemHeight;
    // 更新拖拽索引
    dragIndex.value = newIndex;
    dragOffset.value = 0;
  }
};

const stopProfileDrag = () => {
  draggingItem.value = null;
  dragIndex.value = -1;
  dragOffset.value = 0;

  // 移除事件监听器
  document.removeEventListener("mousemove", onProfileDrag);
  document.removeEventListener("mouseup", stopProfileDrag);
  document.removeEventListener("touchmove", onProfileDrag);
  document.removeEventListener("touchend", stopProfileDrag);

  // 显示成功提示
  setTimeout(() => {
    alert("排序成功！");
  }, 300);
};

// 监听activeTab变化
watch(activeTab, () => {
  // 切换标签时重新初始化表单数据
  initFormData();
});

// 初始化数据
onMounted(() => {
  // 检查并重置档案数据
  if (!Array.isArray(coupleStore.girlProfile) || !Array.isArray(coupleStore.boyProfile)) {
    // 重置档案数据
    coupleStore.resetProfileData();
  }

  // 输出档案数据到控制台
  console.log('Girl Profile:', coupleStore.girlProfile);
  console.log('Boy Profile:', coupleStore.boyProfile);
  console.log('Active Tab:', activeTab.value);

  // 开始定时器
  coupleStore.startTimer();
  // 获取随机甜蜜文案
  updateSweetWord();
  // 初始化表单数据
  initFormData();
});

onUnmounted(() => {
  // 停止定时器
  coupleStore.stopTimer();
});

// 更新甜蜜文案
const updateSweetWord = () => {
  sweetWord.value = coupleStore.getRandomSweetWord();
};

// 初始化表单数据
const initFormData = () => {
  baseForm.value = { ...coupleStore.baseInfo };
  if (activeTab.value === "girl") {
    // 将数组转换为对象格式
    const profileObj = {};
    coupleStore.girlProfile.forEach(item => {
      profileObj[item.key] = item.value;
    });
    profileForm.value = profileObj;
  } else {
    // 将数组转换为对象格式
    const profileObj = {};
    coupleStore.boyProfile.forEach(item => {
      profileObj[item.key] = item.value;
    });
    profileForm.value = profileObj;
  }
};

// 计算纪念日倒计时
const getAnniversaryCountdown = (date) => {
  const today = new Date();
  const anniversary = new Date(date);
  anniversary.setFullYear(today.getFullYear());

  if (anniversary < today) {
    anniversary.setFullYear(today.getFullYear() + 1);
  }

  const diff = anniversary - today;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

// 保存基础信息
const saveBaseInfo = () => {
  coupleStore.updateBaseInfo(baseForm.value);
  showBaseEdit.value = false;
  alert("保存成功！");
};

// 保存档案信息
const saveProfileInfo = () => {
  if (activeTab.value === "girl") {
    // 找到现有的档案数组
    const existingProfile = [...coupleStore.girlProfile];
    // 更新每个字段的值
    Object.keys(profileForm.value).forEach(key => {
      const item = existingProfile.find(item => item.key === key);
      if (item) {
        item.value = profileForm.value[key];
      }
    });
    // 保存更新后的数组
    coupleStore.updateGirlProfile(existingProfile);
  } else {
    // 找到现有的档案数组
    const existingProfile = [...coupleStore.boyProfile];
    // 更新每个字段的值
    Object.keys(profileForm.value).forEach(key => {
      const item = existingProfile.find(item => item.key === key);
      if (item) {
        item.value = profileForm.value[key];
      }
    });
    // 保存更新后的数组
    coupleStore.updateBoyProfile(existingProfile);
  }
  showProfileEdit.value = false;
  alert("保存成功！");
};

// 上传头像
const handleUploadAvatar = (type) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        if (type === "girl") {
          coupleStore.updateBaseInfo({ girlAvatar: base64 });
        } else {
          coupleStore.updateBaseInfo({ boyAvatar: base64 });
        }
        alert("头像上传成功！");
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
};

// 保存纪念日
const saveAnniversary = () => {
  if (!anniversaryForm.value.name) {
    alert("请输入纪念日名称");
    return;
  }

  if (editingAnniversary.value) {
    coupleStore.updateAnniversary(
      editingAnniversary.value.id,
      anniversaryForm.value
    );
  } else {
    coupleStore.addAnniversary(anniversaryForm.value);
  }

  showAddAnniversaryModal.value = false;
  resetAnniversaryForm();
  alert("保存成功！");
};

// 重置纪念日表单
const resetAnniversaryForm = () => {
  editingAnniversary.value = null;
  anniversaryForm.value = {
    name: "",
    date: "",
  };
};

// 编辑纪念日
const editAnniversary = (anniversary) => {
  editingAnniversary.value = anniversary;
  anniversaryForm.value = {
    name: anniversary.name,
    date: anniversary.date,
  };
  showAddAnniversaryModal.value = true;
};

// 删除纪念日
const deleteAnniversary = (id) => {
  if (confirm("确定要删除这个纪念日吗？")) {
    coupleStore.deleteAnniversary(id);
    alert("删除成功！");
  }
};

// 显示日期编辑弹窗
const openDateEditModal = (type) => {
  console.log("openDateEditModal called with type:", type);
  dateEditType.value = type;
  dateForm.value = {
    value: coupleStore.baseInfo[type],
  };
  showDateEditModal.value = true;
  console.log("showDateEditModal.value:", showDateEditModal.value);
};

// 保存日期
const saveDate = () => {
  coupleStore.updateBaseInfo({ [dateEditType.value]: dateForm.value.value });
  showDateEditModal.value = false;
  alert("保存成功！");
};

// 保存档案项
const saveProfileItem = () => {
  if (!profileItemForm.value.title) {
    alert("请输入档案项标题");
    return;
  }

  // 根据当前激活的标签页确定要保存到哪个档案
  if (activeTab.value === "girl") {
    // 添加到女友档案
    coupleStore.updateGirlProfile({
      [profileItemForm.value.title]: profileItemForm.value.content,
    });
  } else {
    // 添加到男友档案
    coupleStore.updateBoyProfile({
      [profileItemForm.value.title]: profileItemForm.value.content,
    });
  }

  alert("档案项添加成功！");
  showAddProfileItemModal.value = false;
  profileItemForm.value = {
    title: "",
    content: "",
  };
};

// 保存重要日期
const saveImportantDate = () => {
  // 验证输入
  if (!importantDateForm.value.name) {
    alert("请输入日期名称");
    return;
  }

  if (!importantDateForm.value.date) {
    alert("请选择日期");
    return;
  }

  // 检查是否有重复名称
  const isDuplicate = coupleStore.customAnniversary.some(
    (item) => item.name === importantDateForm.value.name
  );

  if (isDuplicate) {
    alert("该日期名称已存在，请使用其他名称");
    return;
  }

  // 保存到自定义纪念日列表
  coupleStore.addAnniversary(importantDateForm.value);

  alert("重要日期添加成功！");
  showAddImportantDateModal.value = false;
  importantDateForm.value = {
    name: "",
    date: "",
  };
};

// 重置档案数据
const resetProfileData = () => {
  // 调用store中的重置方法
  coupleStore.resetProfileData();
  
  // 重新初始化表单数据
  initFormData();
  
  // 显示成功提示
  alert("档案数据已重置成功！");
};
</script>

<style scoped>
.home {
  padding-bottom: 80px;
  background: transparent;
  min-height: 100vh;
  position: relative;
}

.home::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: none;
  z-index: 1;
}

.home > * {
  position: relative;
  z-index: 2;
}

/* —— Like_Girl 风格首页 —— */
.lg-topbar {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px 16px 8px;
  max-width: 960px;
  margin: 0 auto;
}

.lg-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lg-site {
  font-weight: 700;
  font-size: 17px;
  color: var(--text-primary);
  letter-spacing: 0.02em;
}

.lg-ver {
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #5b8def, #7ec8e3);
  padding: 2px 8px;
  border-radius: 999px;
}

.lg-poem {
  margin: 0;
  font-size: 11px;
  line-height: 1.45;
  color: var(--text-tertiary);
  text-align: right;
  max-width: 56vw;
  justify-self: end;
}

.lg-logout {
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.85);
  border-radius: 10px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 18px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.lg-logout:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.lg-hero {
  position: relative;
  min-height: 280px;
  padding: 24px 16px 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.lg-hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 120% 80% at 50% 100%, rgba(255, 255, 255, 0.35) 0%, transparent 55%),
    linear-gradient(180deg, #b8e0c8 0%, #8fc9a8 35%, #6aab7e 70%, #4d8a63 100%);
  filter: saturate(1.08);
}

.lg-hero-bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    rgba(255, 255, 255, 0.22) 1px,
    transparent 1px
  );
  background-size: 10px 10px;
  opacity: 0.25;
  mix-blend-mode: overlay;
}

.lg-glass {
  position: relative;
  z-index: 1;
  width: min(420px, 92vw);
  padding: 3px;
  border-radius: 28px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.55),
    rgba(255, 255, 255, 0.12)
  );
  box-shadow: 0 24px 60px rgba(20, 60, 40, 0.25);
}

.lg-glass-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 22px;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.45);
}

.lg-avatar-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.lg-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.45);
  cursor: pointer;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  transition: transform 0.2s ease;
}

.lg-avatar:hover {
  transform: scale(1.05);
}

.lg-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lg-avatar-fallback {
  font-size: 32px;
  line-height: 72px;
}

.lg-name {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lg-heart-wrap {
  position: relative;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.lg-heart {
  font-size: 28px;
  z-index: 1;
  animation: lgHeartPulse 2s ease-in-out infinite;
  filter: drop-shadow(0 2px 6px rgba(220, 40, 70, 0.45));
}

.lg-heart-rays {
  position: absolute;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    transparent 0deg 340deg,
    rgba(173, 216, 255, 0.55) 340deg 360deg
  );
  animation: lgSpin 10s linear infinite;
  opacity: 0.65;
}

@keyframes lgHeartPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.12);
  }
}

@keyframes lgSpin {
  to {
    transform: rotate(360deg);
  }
}

.lg-wave-wrap {
  line-height: 0;
  margin-top: -1px;
}

.lg-wave {
  display: block;
  width: 100%;
  height: 48px;
}

.lg-paper {
  --grid: rgba(0, 0, 0, 0.06);
  background-color: #fafafa;
  background-image:
    linear-gradient(var(--grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid) 1px, transparent 1px);
  background-size: 20px 20px;
  padding: 28px 16px 32px;
  text-align: center;
}

.lg-timer-title {
  margin: 0 0 12px;
  font-family: "Georgia", "Times New Roman", "Songti SC", serif;
  font-size: 15px;
  color: #e07a2b;
  letter-spacing: 0.06em;
}

.lg-timer-line {
  margin: 0 0 28px;
  font-family: "Georgia", "Times New Roman", "Songti SC", serif;
  font-size: clamp(22px, 5.5vw, 34px);
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.35;
}

.lg-num {
  margin: 0 2px 0 6px;
}

.lg-num:first-child {
  margin-left: 0;
}

.lg-unit {
  font-size: 0.62em;
  font-weight: 600;
  color: #444;
  margin-right: 4px;
}

.lg-nav-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  max-width: 720px;
  margin: 0 auto;
}

.lg-nav-card {
  text-align: left;
  border: none;
  cursor: pointer;
  background: #fff;
  border-radius: 16px;
  padding: 16px 14px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.lg-nav-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.1);
}

.lg-nav-card--wide {
  grid-column: span 3;
  flex-direction: row;
  align-items: center;
  gap: 14px;
}

.lg-nav-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.lg-nav-icon--purple {
  background: linear-gradient(135deg, #e8ddff, #d4c4ff);
}
.lg-nav-icon--blue {
  background: linear-gradient(135deg, #d4ecff, #b8dfff);
}
.lg-nav-icon--yellow {
  background: linear-gradient(135deg, #fff3c4, #ffe08a);
}
.lg-nav-icon--orange {
  background: linear-gradient(135deg, #ffe0c2, #ffc48a);
}
.lg-nav-icon--red {
  background: linear-gradient(135deg, #ffd6e0, #ffb3c9);
}

.lg-nav-t {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}

.lg-nav-d {
  font-size: 12px;
  color: var(--text-tertiary);
  line-height: 1.4;
}

.lg-nav-card--wide .lg-nav-d {
  flex: 1;
}

.lg-fab-stack {
  position: fixed;
  right: 14px;
  bottom: 88px;
  z-index: 120;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.lg-fab-btn {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #fff;
  background: linear-gradient(135deg, #ff7b4a, #ff5a3c);
  box-shadow: 0 6px 18px rgba(255, 90, 60, 0.45);
  transition: transform 0.2s ease;
}

.lg-fab-btn:hover {
  transform: scale(1.06);
}

@media (max-width: 520px) {
  .lg-poem {
    display: none;
  }

  .lg-nav-grid {
    grid-template-columns: 1fr;
  }

  .lg-nav-card--wide {
    grid-column: span 1;
    flex-direction: column;
    align-items: flex-start;
  }
}

.card {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: var(--border-radius);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 20px;
  margin: 0 16px 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(255, 123, 156, 0.4);
}

.btn-icon.small {
  width: 24px;
  height: 24px;
  font-size: 12px;
}

.btn-icon.delete {
  background-color: #ff6b6b;
}

.countdown-container {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
}

.countdown-item {
  flex: 1;
  text-align: center;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.countdown-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.countdown-number {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-color);
  margin: 12px 0;
  text-shadow: 0 1px 2px rgba(255, 123, 156, 0.3);
}

.countdown-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.btn-small {
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: var(--secondary-color);
  color: var(--text-primary);
}

.btn-small:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(168, 218, 220, 0.4);
}

.anniversary-list {
  margin-top: 24px;
}

.anniversary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.anniversary-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.anniversary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.anniversary-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateX(4px);
}

.anniversary-info h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text-primary);
}

.anniversary-info p {
  font-size: 12px;
  color: var(--text-tertiary);
  margin: 0;
}

.anniversary-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.anniversary-countdown {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-color);
  margin-right: 8px;
}

/* 动画效果 */
.anniversary-list-enter-active,
.anniversary-list-leave-active {
  transition: all 0.5s ease;
}

.anniversary-list-enter-from,
.anniversary-list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.anniversary-list-move {
  transition: transform 0.5s ease;
}

.tab-container {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 2px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
}

.tab {
  flex: 1;
  padding: 14px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: rgba(245, 245, 245, 0.8);
}

.tab.active {
  color: var(--primary-color);
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.profile-content {
  padding-top: 16px;
}

.profile-list {
  margin-bottom: 20px;
}

.debug-info {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 12px;
  color: #666;
}

.profile-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
}

.profile-item.dragging {
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.profile-handle {
  margin-right: 16px;
  cursor: grab;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-handle:active {
  cursor: grabbing;
}

.handle-dots {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.dot {
  width: 4px;
  height: 4px;
  background-color: #999;
  border-radius: 50%;
}

.profile-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-right: 16px;
  min-width: 90px;
  display: flex;
  align-items: center;
}

.profile-value {
  flex: 1;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  text-align: right;
  background-color: rgba(245, 245, 245, 0.6);
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.profile-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.profile-value:hover {
  background-color: rgba(245, 245, 245, 0.8);
}

.profile-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.profile-actions button {
  flex: 1;
  height: 44px;
  border-radius: 22px;
  font-size: 14px;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 32px 16px;
  background-color: rgba(245, 245, 245, 0.6);
  border-radius: 12px;
  color: var(--text-tertiary);
  font-size: 14px;
}

.btn-sm {
  margin-top: 12px;
  padding: 8px 16px;
  font-size: 12px;
  height: 36px;
  border-radius: 18px;
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
  backdrop-filter: blur(5px);
}

.modal-content {
  background-color: white;
  border-radius: var(--border-radius);
  padding: 24px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-header h2 {
  margin: 0;
  text-align: center;
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 600;
  flex: 1;
}

.countdown-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 16px;
}

.countdown-bar {
  width: 60px;
  height: 4px;
  background-color: #f5f5f5;
  border-radius: 2px;
  overflow: hidden;
}

.countdown-fill {
  height: 100%;
  background: var(--gradient-primary);
  transition: width 0.1s linear;
  border-radius: 2px;
}

.countdown-text {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  min-width: 30px;
  text-align: right;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 28px;
}

.form-actions button {
  flex: 1;
  height: 44px;
  border-radius: 22px;
  font-size: 14px;
  font-weight: 500;
}

/* 适配移动端 */
@media (max-width: 768px) {
  .countdown-container {
    flex-direction: column;
    gap: 12px;
  }

  .countdown-item {
    padding: 16px;
  }

  .card {
    padding: 16px;
    margin: 0 12px 12px;
  }

  .profile-item {
    padding: 12px;
  }

  .profile-label {
    min-width: 80px;
    font-size: 13px;
  }

  .profile-value {
    font-size: 13px;
    padding: 6px 10px;
  }
}
</style>
