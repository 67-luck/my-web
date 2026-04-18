<template>
  <div class="app">
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <!-- 底部Tabbar导航 -->
    <div v-if="authStore.isLoggedIn" class="tabbar">
      <div 
        class="tabbar-item" 
        :class="{ active: $route.path === '/home' }"
        @click="() => router.push('/home')"
      >
        <div class="tabbar-item-icon">🏠</div>
        <div class="tabbar-item-text">我们</div>
      </div>
      <div 
        class="tabbar-item" 
        :class="{ active: $route.path === '/food' }"
        @click="navigateTo('/food')"
      >
        <div class="tabbar-item-icon">🍔</div>
        <div class="tabbar-item-text">干饭</div>
      </div>
      <div 
        class="tabbar-item" 
        :class="{ active: $route.path === '/memory' }"
        @click="navigateTo('/memory')"
      >
        <div class="tabbar-item-icon">📷</div>
        <div class="tabbar-item-text">纪念册</div>
      </div>
      <div 
        class="tabbar-item" 
        :class="{ active: $route.path === '/sync' }"
        @click="navigateTo('/sync')"
      >
        <div class="tabbar-item-icon">🔄</div>
        <div class="tabbar-item-text">同步</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: var(--gradient-bg);
}

/* 页面过渡动画 */
.page-enter-active,
.page-leave-active {
  transition: all 0.5s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 99;
  backdrop-filter: blur(10px);
  animation: slideUp 0.5s ease;
}

/* 四个导航项时的调整 */
.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--text-tertiary);
  transition: var(--transition);
  cursor: pointer;
  position: relative;
  padding: 8px 0;
}

.tabbar-item-icon {
  font-size: 24px;
  margin-bottom: 4px;
  transition: var(--transition);
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.tabbar-item.active {
  color: var(--primary-color);
  transform: translateY(-2px);
  animation: bounce 0.5s ease;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-2px);
  }
  50% {
    transform: translateY(-6px);
  }
}

.tabbar-item.active::after {
  content: '';
  position: absolute;
  top: 0;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--primary-color);
  box-shadow: 0 0 10px var(--primary-color);
  animation: pulse 2s infinite;
}

.tabbar-item.active .tabbar-item-icon {
  transform: scale(1.1);
  filter: drop-shadow(0 0 8px var(--primary-color));
  animation: rotate 0.5s ease;
}

@keyframes rotate {
  from {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.2) rotate(10deg);
  }
  to {
    transform: scale(1.1) rotate(0deg);
  }
}

.tabbar-item-text {
  font-size: 12px;
  font-weight: 500;
  transition: var(--transition);
}

.tabbar-item.active .tabbar-item-text {
  font-weight: 600;
  animation: pulse-text 1s ease;
}

@keyframes pulse-text {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.tabbar-item:hover {
  color: var(--primary-color);
}

.tabbar-item:hover .tabbar-item-icon {
  transform: scale(1.1);
}
</style>
