<template>
  <div class="food-draw">
    <!-- 顶部信息栏 -->
    <div class="card top-info">
      <div class="drawer-selector">
        <div class="segment-control">
          <div
            class="segment-item"
            :class="{ active: foodStore.currentDrawer === 'girl' }"
            @click="foodStore.setCurrentDrawer('girl')"
          >
            {{ coupleStore.baseInfo.girlName }}抽
          </div>
          <div
            class="segment-item"
            :class="{ active: foodStore.currentDrawer === 'boy' }"
            @click="foodStore.setCurrentDrawer('boy')"
          >
            {{ coupleStore.baseInfo.boyName }}抽
          </div>
        </div>
      </div>
      <div class="draw-times">
        <span class="times-label">剩余抽签次数：</span>
        <span class="times-number">{{ foodStore.remainDrawTimes }}</span>
      </div>
    </div>

    <!-- 主要分类栏 -->
    <div class="main-categories">
      <div class="category-row">
        <div
          class="category-item primary"
          :class="{ active: selectedCategory === '全部' }"
          @click="selectedCategory = '全部'"
        >
          <span class="category-icon">🍽️</span>
          <span class="category-name">全部</span>
        </div>
        <div
          class="category-item primary"
          :class="{ active: selectedCategory === '早餐' }"
          @click="selectedCategory = '早餐'"
        >
          <span class="category-icon">🌅</span>
          <span class="category-name">早餐</span>
        </div>
        <div
          class="category-item primary"
          :class="{ active: selectedCategory === '午餐' }"
          @click="selectedCategory = '午餐'"
        >
          <span class="category-icon">☀️</span>
          <span class="category-name">午餐</span>
        </div>
        <div
          class="category-item primary"
          :class="{ active: selectedCategory === '晚餐' }"
          @click="selectedCategory = '晚餐'"
        >
          <span class="category-icon">🌙</span>
          <span class="category-name">晚餐</span>
        </div>
      </div>
    </div>

    <!-- 其他分类栏 -->
    <div class="filter-bar">
      <div class="filter-scroll">
        <div
          class="filter-item"
          :class="{ active: selectedCategory === '外卖' }"
          @click="selectedCategory = '外卖'"
        >
          外卖
        </div>
        <div
          class="filter-item"
          :class="{ active: selectedCategory === '校园食堂' }"
          @click="selectedCategory = '校园食堂'"
        >
          校园食堂
        </div>
        <div
          class="filter-item"
          :class="{ active: selectedCategory === '火锅' }"
          @click="selectedCategory = '火锅'"
        >
          火锅
        </div>
        <div
          class="filter-item"
          :class="{ active: selectedCategory === '夜宵' }"
          @click="selectedCategory = '夜宵'"
        >
          夜宵
        </div>
      </div>
    </div>

    <!-- 核心抽签区 -->
    <div class="draw-area">
      <div class="result-display">
        <h2 v-if="!lastDrawResult && !isDrawing">点击下方按钮开始抽签</h2>
        <h2 v-else-if="isDrawing" class="random-food-name">{{ randomFoodName }}</h2>
        <div v-else class="draw-result">
          <h2>{{ lastDrawResult.food.name }}</h2>
          <div class="food-meta">
            <span class="tag tag-primary">{{
              lastDrawResult.food.category
            }}</span>
            <span class="tag tag-secondary">{{
              lastDrawResult.food.taste
            }}</span>
          </div>
          <p class="food-ingredients">{{ lastDrawResult.food.ingredients }}</p>
        </div>
      </div>
      <div class="draw-buttons">
        <button
          class="draw-button wheel-button"
          :disabled="foodStore.remainDrawTimes <= 0 || isDrawing"
          @click="handleWheelDraw"
        >
          {{ isDrawing ? '抽奖中...' : '开始抽奖' }}
        </button>
      </div>
    </div>

    <!-- 次数用完专属任务区 -->
    <div v-if="foodStore.remainDrawTimes <= 0" class="task-area card">
      <h3>次数用完了？完成任务兑换次数吧！</h3>
      <div class="task-info">
        <p>
          今日已兑换：{{ foodStore.todayExchangeCount }}/{{
            foodStore.config.dailyExchangeLimit
          }}
        </p>
      </div>
      <div v-if="currentTask" class="current-task">
        <h4>当前任务：</h4>
        <p>{{ currentTask.content }}</p>
        <div class="task-actions">
          <button class="btn-primary" @click="handleCompleteTask">
            完成任务
          </button>
          <button class="btn-secondary" @click="handleChangeTask">
            换一个
          </button>
        </div>
      </div>
      <button v-else class="btn-primary" @click="handleDrawTask">
        随机抽任务
      </button>
    </div>

    <!-- 底部快捷入口 -->
    <div class="bottom-actions">
      <button class="btn-secondary" @click="showFoodManage = true">
        菜品库管理
      </button>
      <button class="btn-secondary" @click="showSettings = true">
        抽签设置
      </button>
      <button class="btn-secondary" @click="showHistory = true">
        抽奖历史
      </button>
    </div>

    <!-- 抽奖历史弹窗 -->
    <div v-if="showHistory" class="modal">
      <div class="modal-content">
        <h2>抽奖历史</h2>
        <div v-if="drawHistory.length === 0" class="empty-state">
          <p>暂无抽奖历史</p>
        </div>
        <div v-else class="history-list">
          <div v-for="item in drawHistory" :key="item.id" class="history-item">
            <div class="history-food">
              <h3>{{ item.food.name }}</h3>
              <div class="food-meta">
                <span class="tag tag-primary">{{ item.food.category }}</span>
                <span class="tag tag-secondary">{{ item.food.taste }}</span>
              </div>
            </div>
            <div class="history-info">
              <p class="history-time">{{ item.time }}</p>
              <p class="history-drawer">
                {{
                  item.drawer === "girl"
                    ? coupleStore.baseInfo.girlName
                    : coupleStore.baseInfo.boyName
                }}抽
              </p>
            </div>
          </div>
        </div>
        <button class="btn-secondary close-btn" @click="showHistory = false">
          关闭
        </button>
      </div>
    </div>

    <!-- 抽签结果弹窗 -->
    <div v-if="showResultModal" class="modal">
      <div class="modal-content">
        <div class="result-message">
          <p class="egg-message">
            抽中啦！今天就吃这个吧😋
          </p>
        </div>
        <div class="result-food">
          <h2>{{ lastDrawResult.food.name }}</h2>
          <div class="food-meta">
            <span class="tag tag-primary">{{
              lastDrawResult.food.category
            }}</span>
            <span class="tag tag-secondary">{{
              lastDrawResult.food.taste
            }}</span>
          </div>
          <p class="food-ingredients">{{ lastDrawResult.food.ingredients }}</p>
        </div>
        <div class="modal-actions">
          <button class="btn-primary" @click="showResultModal = false">
            就吃这个
          </button>
          <button class="btn-secondary" @click="handleRegret">反悔再抽</button>
        </div>
      </div>
    </div>

    <!-- 菜品库管理弹窗 -->
    <div v-if="showFoodManage" class="modal">
      <div class="modal-content">
        <FoodManage @close="showFoodManage = false" />
        <button class="btn-secondary close-btn" @click="showFoodManage = false">
          关闭
        </button>
      </div>
    </div>

    <!-- 抽签设置弹窗 -->
    <div v-if="showSettings" class="modal">
      <div class="modal-content">
        <h2>抽签设置</h2>
        <div class="form-item">
          <label>每日免费抽签次数</label>
          <input
            v-model.number="settingsForm.dailyDrawTimes"
            type="number"
            class="input"
            min="1"
          />
        </div>
        <div class="form-item">
          <label>每日任务兑换上限</label>
          <input
            v-model.number="settingsForm.dailyExchangeLimit"
            type="number"
            class="input"
            min="1"
          />
        </div>
        <div class="form-actions">
          <button class="btn-primary" @click="saveSettings">保存</button>
          <button class="btn-secondary" @click="showSettings = false">
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useFoodDrawStore } from "../stores/foodDraw";
import { useCoupleInfoStore } from "../stores/coupleInfo";
import { useAuthStore } from "../stores/auth";
import FoodManage from "../components/FoodManage.vue";

const foodStore = useFoodDrawStore();
const coupleStore = useCoupleInfoStore();
const authStore = useAuthStore();

const selectedCategory = ref("全部");
const showResultModal = ref(false);
const showFoodManage = ref(false);
const showSettings = ref(false);
const lastDrawResult = ref(null);
const currentTask = ref(null);
const showHistory = ref(false);

const drawHistory = computed(() => {
  return (foodStore.todayDrawHistory || []).map((item) => {
    const food = foodStore.foodList.find((f) => f.id === item.foodId) || {
      id: item.foodId,
      name: item.foodName || "未知菜品",
      category: "",
      taste: "",
      ingredients: "",
    };

    return {
      id: item.id,
      food,
      time: new Date(item.timestamp).toLocaleString(),
      drawer: item.drawer,
      isRegret: item.isRegret,
    };
  });
});

// 抽奖动画相关状态
const isDrawing = ref(false);
const randomFoodName = ref("");
const animationInterval = ref(null);

const settingsForm = ref({
  dailyDrawTimes: 5,
  dailyExchangeLimit: 3,
});

// 处理点击抽奖
const handleWheelDraw = () => {
  if (foodStore.remainDrawTimes <= 0) {
    alert("剩余抽签次数不足！");
    return;
  }

  const filteredFoods =
    selectedCategory.value === "全部"
      ? foodStore.foodList
      : foodStore.foodList.filter(
          (food) => food.category === selectedCategory.value
        );

  if (filteredFoods.length < 1) {
    alert("菜品数量不足，无法进行抽奖！");
    return;
  }

  isDrawing.value = true;
  randomFoodName.value = "";

  // 滚动展示用的池子：当前分类只有 1 道菜时（如默认「晚餐」只有火锅），
  // 随机索引永远为 0，看起来菜名不会变；此时用全库菜名做滚动动画，最终结果仍按分类抽取。
  const nameRollPool =
    filteredFoods.length > 1
      ? filteredFoods
      : foodStore.foodList.length > 0
        ? foodStore.foodList
        : filteredFoods;

  // 开始随机显示菜名的动画
  let animationCount = 0;
  const maxAnimationCount = 20; // 动画持续的次数
  
  animationInterval.value = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * nameRollPool.length);
    randomFoodName.value = nameRollPool[randomIndex].name;
    animationCount++;

    // 动画结束，确定最终结果
    if (animationCount >= maxAnimationCount) {
      clearInterval(animationInterval.value);
      animationInterval.value = null;
      
      const drawResult = foodStore.drawRandomFood({
        category: selectedCategory.value,
      });

      if (!drawResult.success) {
        isDrawing.value = false;
        alert(drawResult.message || "抽奖失败");
        return;
      }

      const winningFoodItem = drawResult.food;

      // 记录抽奖结果
      lastDrawResult.value = {
        food: winningFoodItem,
      };

      // 重置状态
      isDrawing.value = false;

      // 显示中奖结果弹窗
      showResultModal.value = true;
    }
  }, 100); // 每100毫秒切换一次菜名
};

onUnmounted(() => {
  if (animationInterval.value) {
    clearInterval(animationInterval.value);
    animationInterval.value = null;
  }
});

// 初始化
onMounted(() => {
  // 初始化 auth store
  authStore.init();
  
  // 初始化 foodDraw store 的用户数据
  const currentUser = authStore.currentUser;
  if (currentUser) {
    foodStore.initUser(currentUser.id);
  }
  
  // 检查是否跨天
  foodStore.checkAndResetDaily();
  // 初始化设置表单
  settingsForm.value = {
    dailyDrawTimes: foodStore.config.dailyDrawTimes,
    dailyExchangeLimit: foodStore.config.dailyExchangeLimit,
  };
});



// 处理反悔再抽
const handleRegret = () => {
  const result = foodStore.regretDraw();
  if (result.success) {
    showResultModal.value = false;
    handleWheelDraw();
  } else {
    alert(result.message);
  }
};

// 随机抽任务
const handleDrawTask = () => {
  const result = foodStore.drawRandomTask();
  if (result.success) {
    currentTask.value = result.task;
  } else {
    alert(result.message);
  }
};

// 完成任务
const handleCompleteTask = () => {
  if (currentTask.value) {
    foodStore.completeTask(currentTask.value.id);
    const exchangeResult = foodStore.exchangeDrawTime();
    if (exchangeResult) {
      alert("任务完成！获得1次抽签机会");
      currentTask.value = null;
    } else {
      alert("今日兑换次数已达上限");
    }
  }
};

// 换一个任务
const handleChangeTask = () => {
  handleDrawTask();
};

// 保存设置
const saveSettings = () => {
  foodStore.updateConfig(settingsForm.value);
  showSettings.value = false;
  alert("保存成功！");
};
</script>

<style scoped>
.food-draw {
  padding-bottom: 100px;
  background: transparent;
  min-height: 100vh;
  position: relative;
}

.food-draw::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: none;
  z-index: 1;
}

.food-draw > * {
  position: relative;
  z-index: 2;
}

.top-info {
  margin: 16px;
  padding: 16px;
  transition: var(--transition);
}

.drawer-selector {
  margin-bottom: 16px;
}

.segment-control {
  display: flex;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 4px;
  backdrop-filter: blur(10px);
}

.segment-item {
  flex: 1;
  padding: 12px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  border-radius: 6px;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.segment-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: all 0.6s ease;
}

.segment-item:hover::before {
  left: 100%;
}

.segment-item.active {
  background: var(--gradient-primary);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 107, 139, 0.4);
  transform: translateY(-2px);
}

.segment-item.active::before {
  left: 100%;
}

.draw-times {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.times-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.times-number {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-color);
}

.main-categories {
  margin: 0 16px 16px;
}

.category-row {
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.category-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow);
}

.category-item.primary {
  min-height: 80px;
  justify-content: center;
}

.category-icon {
  font-size: 24px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.category-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.category-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: all 0.6s ease;
}

.category-item:hover::before {
  left: 100%;
}

.category-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

.category-item.active {
  background: var(--gradient-primary);
  color: white;
  box-shadow: 0 6px 20px rgba(255, 107, 139, 0.4);
  transform: translateY(-4px);
}

.category-item.active .category-name {
  color: white;
}

.category-item.active .category-icon {
  transform: scale(1.2);
}

.filter-bar {
  margin: 0 16px 16px;
  overflow: hidden;
}

.filter-scroll {
  display: flex;
  gap: 12px;
  padding: 8px 0;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.filter-scroll::-webkit-scrollbar {
  display: none;
}

.filter-item {
  padding: 8px 16px;
  background-color: #f5f5f5;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.filter-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: all 0.6s ease;
}

.filter-item:hover::before {
  left: 100%;
}

.filter-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.filter-item.active {
  background: var(--gradient-primary);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 107, 139, 0.4);
  transform: translateY(-2px);
}

.draw-area {
  margin: 0 16px 24px;
  padding: 40px 20px;
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  text-align: center;
  transition: var(--transition);
  backdrop-filter: blur(10px);
}

.draw-area:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}

.result-display {
  margin-bottom: 40px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.6s ease;
}

.result-display h2 {
  font-size: 20px;
  color: var(--text-secondary);
  margin-bottom: 16px;
  animation: pulse-text 1.5s ease-in-out infinite;
}

.draw-result h2 {
  font-size: 24px;
  color: var(--primary-color);
  margin-bottom: 16px;
  animation: bounceIn 0.6s ease;
  text-shadow: 0 2px 8px rgba(255, 107, 139, 0.4);
}

.draw-result {
  animation: resultReveal 0.8s ease-out;
}

.random-food-name {
  font-size: 28px;
  color: var(--primary-color);
  margin-bottom: 16px;
  animation: foodNameChange 0.1s ease-in-out;
  text-shadow: 0 2px 12px rgba(255, 107, 139, 0.6);
  font-weight: 700;
}

@keyframes resultReveal {
  0% {
    opacity: 0;
    transform: scale(0.5) translateY(30px);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1) translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes foodNameChange {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(10px);
  }
  50% {
    opacity: 1;
    transform: scale(1.1) translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse-text {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes bounceIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.food-meta {
  margin-bottom: 12px;
}

.food-ingredients {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.4;
  max-width: 80%;
  margin: 0 auto;
}

.draw-buttons {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.draw-button {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: white;
  border: none;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(255, 107, 139, 0.4);
  position: relative;
  overflow: hidden;
  animation: pulse 2s infinite;
}

.wheel-button {
  background: linear-gradient(135deg, #ffa500 0%, #ff6347 100%);
}

.draw-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: all 0.6s ease;
}

.draw-button:hover:not(:disabled)::before {
  left: 100%;
}

.draw-button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(255, 107, 139, 0.6);
  animation: none;
}

.draw-button:active:not(:disabled) {
  transform: scale(0.95);
}

.draw-button:disabled {
  background: #e5e5e5;
  color: #999999;
  cursor: not-allowed;
  box-shadow: none;
  animation: none;
}

@keyframes pulse {
  0% {
    box-shadow: 0 6px 20px rgba(255, 107, 139, 0.4);
  }
  50% {
    box-shadow: 0 8px 24px rgba(255, 107, 139, 0.6);
  }
  100% {
    box-shadow: 0 6px 20px rgba(255, 107, 139, 0.4);
  }
}

.task-area {
  margin: 0 16px 24px;
  padding: 20px;
}

.task-area h3 {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
}

.task-info {
  margin-bottom: 20px;
  padding: 12px;
  background-color: rgba(255, 123, 156, 0.1);
  border-radius: 8px;
  font-size: 14px;
  color: var(--text-secondary);
}

.current-task {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.current-task h4 {
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
}

.current-task p {
  margin-bottom: 16px;
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.task-actions {
  display: flex;
  gap: 12px;
}

.task-actions button {
  flex: 1;
}

.bottom-actions {
  position: fixed;
  bottom: 80px;
  left: 0;
  right: 0;
  display: flex;
  gap: 12px;
  padding: 0 16px;
  z-index: 90;
}

.bottom-actions button {
  flex: 1;
  height: 48px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
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

.result-message {
  margin-bottom: 24px;
  text-align: center;
}

.egg-message {
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 16px;
}

.result-food {
  margin-bottom: 24px;
  text-align: center;
}

.result-food h2 {
  font-size: 28px;
  color: var(--primary-color);
  margin-bottom: 16px;
  animation: bounceIn 0.6s ease;
  text-shadow: 0 2px 12px rgba(255, 107, 139, 0.6);
}

.result-food {
  animation: resultReveal 0.8s ease-out;
}

.result-message {
  animation: fadeInUp 0.6s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-actions button {
  flex: 1;
}

.close-btn {
  width: 100%;
  margin-top: 24px;
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

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.form-actions button {
  flex: 1;
}

.history-list {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.history-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.history-food {
  flex: 1;
  margin-right: 12px;
}

.history-food h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--primary-color);
}

.history-info {
  text-align: right;
  font-size: 12px;
  color: var(--text-tertiary);
}

.history-time {
  margin-bottom: 4px;
}

.history-drawer {
  font-weight: 500;
  color: var(--text-secondary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .draw-area {
    padding: 30px 16px;
  }

  .draw-result h2 {
    font-size: 20px;
  }

  .draw-button {
    width: 150px;
    height: 150px;
    font-size: 14px;
  }

  .bottom-actions {
    padding: 0 12px;
  }

  .bottom-actions button {
    font-size: 12px;
  }

  .task-area {
    padding: 16px;
  }

  .modal-content {
    padding: 20px;
  }

  /* 移动端分类按钮调整 */
  .category-item.primary {
    min-height: 60px;
    padding: 12px 4px;
  }

  .category-icon {
    font-size: 20px;
    margin-bottom: 4px;
  }

  .category-name {
    font-size: 12px;
  }

  .category-row {
    gap: 8px;
  }

  .main-categories {
    margin: 0 12px 12px;
  }

  .filter-bar {
    margin: 0 12px 12px;
  }
}
</style>
