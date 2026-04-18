<template>
  <div class="login-container">
    <!-- 角色容器 -->
    <div class="characters-container">
      <!-- 紫色角色 -->
      <div class="character character--purple" ref="purpleCharacter">
        <div class="character__body"></div>
        <div class="character__eyes">
          <div
            class="character__eye character__eye--left"
            ref="purpleLeftEye"
          ></div>
          <div
            class="character__eye character__eye--right"
            ref="purpleRightEye"
          ></div>
        </div>
        <div class="character__mouth"></div>
      </div>

      <!-- 黑色角色 -->
      <div class="character character--black" ref="blackCharacter">
        <div class="character__body"></div>
        <div class="character__eyes">
          <div
            class="character__eye character__eye--left"
            ref="blackLeftEye"
          ></div>
          <div
            class="character__eye character__eye--right"
            ref="blackRightEye"
          ></div>
        </div>
        <div class="character__mouth"></div>
      </div>

      <!-- 主角色（橙色） -->
      <div class="character character--main" ref="mainCharacter">
        <div class="character__body"></div>
        <div class="character__eyes">
          <div
            class="character__eye character__eye--left"
            ref="mainLeftEye"
          ></div>
          <div
            class="character__eye character__eye--right"
            ref="mainRightEye"
          ></div>
        </div>
        <div class="character__mouth"></div>
        <div
          class="character__hand character__hand--left"
          ref="mainLeftHand"
        ></div>
        <div
          class="character__hand character__hand--right"
          ref="mainRightHand"
        ></div>
      </div>

      <!-- 黄色角色 -->
      <div class="character character--yellow" ref="yellowCharacter">
        <div class="character__body"></div>
        <div class="character__eyes">
          <div
            class="character__eye character__eye--left"
            ref="yellowLeftEye"
          ></div>
          <div
            class="character__eye character__eye--right"
            ref="yellowRightEye"
          ></div>
        </div>
        <div class="character__mouth"></div>
      </div>
    </div>

    <div class="login-card">
      <h1>心动加载中心</h1>
      <p class="subtitle">登录账户</p>

      <div class="form-group">
        <label for="username">用户名</label>
        <input
          type="text"
          id="username"
          v-model="form.username"
          placeholder="请输入用户名"
        />
      </div>

      <div class="form-group">
        <label for="password">密码</label>
        <div class="password-input-container">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="form.password"
            placeholder="请输入密码"
          />
          <button
            type="button"
            class="password-toggle"
            @click="togglePasswordVisibility"
          >
            {{ showPassword ? "👁️" : "👁️‍🗨️" }}
          </button>
        </div>
      </div>

      <button class="btn-primary" @click="simpleLogin">登录</button>

      <div class="register-link">
        <span>还没有账户？</span>
        <a href="#/register" @click.prevent="goToRegister">立即注册</a>
      </div>

      <div v-if="error" class="error-message">
        <span>{{ error }}</span>
        <a
          v-if="error.includes('尚未注册')"
          href="#/register"
          @click.prevent="goToRegister"
          class="register-link-in-error"
        >
          立即注册
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useFoodDrawStore } from "../stores/foodDraw";

const router = useRouter();
const authStore = useAuthStore();
const foodStore = useFoodDrawStore();

// 生成验证码
const generateCaptcha = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const form = ref({
  username: "",
  password: "",
  captcha: "",
});
const error = ref("");
const errors = ref({
  username: "",
  password: "",
  captcha: "",
});
const showPassword = ref(false);
const showCaptcha = ref(false);
const loginAttempts = ref(0);
const lockedUntil = ref(null);
const captchaText = ref(generateCaptcha());

// 刷新验证码
const refreshCaptcha = () => {
  captchaText.value = generateCaptcha();
};

// 角色引用
const mainCharacter = ref(null);
const mainLeftEye = ref(null);
const mainRightEye = ref(null);
const mainLeftHand = ref(null);
const mainRightHand = ref(null);

const purpleCharacter = ref(null);
const purpleLeftEye = ref(null);
const purpleRightEye = ref(null);

const blackCharacter = ref(null);
const blackLeftEye = ref(null);
const blackRightEye = ref(null);

const yellowCharacter = ref(null);
const yellowLeftEye = ref(null);
const yellowRightEye = ref(null);

// 动画相关
const blinkTimers = ref({});
const isFollowing = ref(false);

// 初始化角色动画
const initCharacterAnimations = () => {
  // 启动眨眼动画
  startBlinkAnimation(mainCharacter.value, 3000, 5000);
  startBlinkAnimation(purpleCharacter.value, 3500, 5500);
  startBlinkAnimation(blackCharacter.value, 4000, 6000);
  startBlinkAnimation(yellowCharacter.value, 4500, 6500);

  // 页面加载动画
  animateCharactersIn();
};

// 启动眨眼动画
const startBlinkAnimation = (character, minInterval, maxInterval) => {
  if (!character) return;

  const blink = () => {
    character.classList.add("character--blinking");
    setTimeout(() => {
      character.classList.remove("character--blinking");
      // 随机间隔后再次眨眼
      const interval =
        Math.random() * (maxInterval - minInterval) + minInterval;
      blinkTimers.value[character.dataset.id || Math.random()] = setTimeout(
        blink,
        interval
      );
    }, 500); // 眨眼动画总时长
  };

  // 初始延迟后开始眨眼
  const initialDelay = Math.random() * 2000;
  setTimeout(blink, initialDelay);
};

// 页面加载动画
const animateCharactersIn = () => {
  const characters = [
    purpleCharacter.value,
    blackCharacter.value,
    mainCharacter.value,
    yellowCharacter.value,
  ];

  characters.forEach((character, index) => {
    if (character) {
      character.style.opacity = "0";
      character.style.transform = "scale(0.8)";
      character.style.transition = "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";

      setTimeout(() => {
        character.style.opacity = "1";
        character.style.transform = "scale(1)";
      }, index * 100);
    }
  });
};

// 处理用户名输入框聚焦
const handleUsernameFocus = () => {
  isFollowing.value = true;
};

// 处理用户名输入框失焦
const handleUsernameBlur = () => {
  isFollowing.value = false;
  resetEyesPosition();
};

// 处理用户名输入
const handleUsernameInput = (event) => {
  if (!isFollowing.value) return;

  const input = event.target;
  const inputRect = input.getBoundingClientRect();
  const containerRect = input
    .closest(".login-container")
    .getBoundingClientRect();
  const inputCenter = inputRect.left + inputRect.width / 2 - containerRect.left;
  const containerCenter = containerRect.width / 2;
  const offset = (inputCenter - containerCenter) / containerCenter;

  // 限制偏移量
  const maxOffset = 8;
  const eyeOffset = Math.max(
    -maxOffset,
    Math.min(maxOffset, offset * maxOffset)
  );

  // 移动主角色眼睛
  moveEyes(mainLeftEye.value, mainRightEye.value, eyeOffset);

  // 移动配角眼睛（50%幅度）
  moveEyes(purpleLeftEye.value, purpleRightEye.value, eyeOffset * 0.5);
  moveEyes(blackLeftEye.value, blackRightEye.value, eyeOffset * 0.5);
  moveEyes(yellowLeftEye.value, yellowRightEye.value, eyeOffset * 0.5);
};

// 移动眼睛
const moveEyes = (leftEye, rightEye, offset) => {
  if (leftEye && rightEye) {
    leftEye.style.transform = `translateX(${offset}px)`;
    rightEye.style.transform = `translateX(${offset}px)`;
  }
};

// 重置眼睛位置
const resetEyesPosition = () => {
  moveEyes(mainLeftEye.value, mainRightEye.value, 0);
  moveEyes(purpleLeftEye.value, purpleRightEye.value, 0);
  moveEyes(blackLeftEye.value, blackRightEye.value, 0);
  moveEyes(yellowLeftEye.value, yellowRightEye.value, 0);
};

// 处理密码输入框聚焦
const handlePasswordFocus = () => {
  if (!showPassword.value) {
    coverEyes();
  }
};

// 处理密码输入框失焦
const handlePasswordBlur = () => {
  if (!showPassword.value) {
    uncoverEyes();
  }
};

// 用户名验证
const validateUsername = () => {
  const username = form.value.username.trim();
  const usernameRegex = /^[a-zA-Z0-9_]{6,20}$/;

  if (!username) {
    errors.value.username = "请输入用户名";
  } else if (!usernameRegex.test(username)) {
    errors.value.username = "用户名必须是6-20个字符，只支持字母、数字和下划线";
  } else {
    errors.value.username = "";
  }
};

// 密码验证
const validatePassword = () => {
  const password = form.value.password;

  if (!password) {
    errors.value.password = "请输入密码";
  } else if (password.length < 8) {
    errors.value.password = "密码长度至少8位";
  } else if (password.length < 12) {
    errors.value.password = "密码长度推荐至少12位";
  } else {
    errors.value.password = "";
  }
};

// 验证码验证
const validateCaptcha = () => {
  const captcha = form.value.captcha.trim().toUpperCase();

  if (!captcha) {
    errors.value.captcha = "请输入验证码";
  } else if (captcha !== captchaText.value) {
    errors.value.captcha = "验证码不正确";
  } else {
    errors.value.captcha = "";
  }
};

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;

  if (showPassword.value) {
    uncoverEyes();
  } else {
    coverEyes();
  }
};

// 捂住眼睛
const coverEyes = () => {
  // 主角色抬手捂眼睛
  if (mainRightHand.value) {
    mainRightHand.value.style.transform =
      "rotate(-45deg) translateX(-10px) translateY(-10px)";
  }

  // 配角动作
  if (purpleCharacter.value) {
    purpleCharacter.value.classList.add("character--closing-eyes");
  }

  if (blackCharacter.value) {
    blackCharacter.value.classList.add("character--tilting-head");
  }

  if (yellowCharacter.value) {
    yellowCharacter.value.classList.add("character--bowing-head");
  }
};

// 松开眼睛
const uncoverEyes = () => {
  // 主角色松手
  if (mainRightHand.value) {
    mainRightHand.value.style.transform =
      "rotate(0deg) translateX(0) translateY(0)";
  }

  // 配角恢复
  if (purpleCharacter.value) {
    purpleCharacter.value.classList.remove("character--closing-eyes");
  }

  if (blackCharacter.value) {
    blackCharacter.value.classList.remove("character--tilting-head");
  }

  if (yellowCharacter.value) {
    yellowCharacter.value.classList.remove("character--bowing-head");
  }
};

// 登录功能
const login = () => {
  // 检查账号是否被锁定
  if (lockedUntil.value && Date.now() < lockedUntil.value) {
    const remainingTime = Math.ceil((lockedUntil.value - Date.now()) / 1000);
    error.value = `账号已被锁定，请${remainingTime}秒后重试`;
    return;
  }

  // 验证表单
  validateUsername();
  validatePassword();

  // 如果需要验证码，验证验证码
  if (showCaptcha.value) {
    validateCaptcha();
  }

  if (
    errors.value.username ||
    errors.value.password ||
    (showCaptcha.value && errors.value.captcha)
  ) {
    error.value = "请检查表单信息";
    return;
  }

  if (!form.value.username || !form.value.password) {
    error.value = "请输入用户名和密码";
    return;
  }

  try {
    console.log("登录开始");
    console.log("用户名:", form.value.username);
    console.log("密码:", form.value.password);

    // 初始化auth store，确保用户数据已加载
    console.log("初始化auth store");
    authStore.init();
    console.log("用户列表:", authStore.users);

    // 检查账号是否存在
    const userExists = authStore.checkUserExists(form.value.username);
    console.log("用户是否存在:", userExists);
    if (!userExists) {
      // 账号未注册
      error.value = "该账号尚未注册，请先完成注册后再进行登录";
      console.log("登录失败: 账号未注册");
      return;
    }

    const success = authStore.login(form.value.username, form.value.password);
    console.log("登录结果:", success);
    console.log("当前用户:", authStore.currentUser);
    if (success) {
      // 登录成功后重置计数器
      loginAttempts.value = 0;
      showCaptcha.value = false;
      lockedUntil.value = null;

      // 初始化 foodDraw store 的用户数据
      const currentUser = authStore.currentUser;
      if (currentUser) {
        console.log("初始化foodDraw store");
        foodStore.initUser(currentUser.id);
      }

      // 登录成功后直接跳转到首页
      console.log("跳转到首页");
      router.push("/home");
    } else {
      // 登录失败，增加失败次数
      loginAttempts.value++;

      // 失败3次后显示验证码
      if (loginAttempts.value >= 3) {
        showCaptcha.value = true;
      }

      // 失败5次后锁定账号10分钟
      if (loginAttempts.value >= 5) {
        lockedUntil.value = Date.now() + 10 * 60 * 1000;
        showCaptcha.value = false;
      }

      error.value = "用户名或密码错误";
      console.log("登录失败: 用户名或密码错误");
    }
  } catch (error) {
    // 处理可能的异常情况
    console.error("登录失败:", error);
    error.value = "登录失败，请稍后重试";
  }
};

// 跳转到注册页面
const goToRegister = () => {
  authStore.init();
  if (!authStore.canRegister) {
    error.value = "当前已达到最多2个账号，无法继续注册";
    return;
  }
  error.value = "";
  router.push("/register");
};

// 简化登录函数
const simpleLogin = () => {
  console.log("登录开始");
  console.log("用户名:", form.value.username);
  console.log("密码:", form.value.password);

  try {
    // 初始化auth store
    authStore.init();
    console.log("用户列表:", authStore.users);

    // 登录
    const success = authStore.login(form.value.username, form.value.password);
    console.log("登录结果:", success);

    if (success) {
      console.log("登录成功，跳转到首页");
      router.push("/home");
    } else {
      console.log("登录失败");
      error.value = "用户名或密码错误";
    }
  } catch (err) {
    console.error("登录错误:", err);
    error.value = "登录失败，请稍后重试";
  }
};

// 组件挂载时初始化
onMounted(() => {
  initCharacterAnimations();
});

// 组件卸载时清理
onUnmounted(() => {
  // 清除所有眨眼定时器
  Object.values(blinkTimers.value).forEach((timer) => clearTimeout(timer));
});
</script>

<style scoped>
/* CSS变量系统 */
:root {
  /* 角色相关变量 */
  --main-character-size: 100%;
  --secondary-character-size: 88%;
  --background-character-size: 78%;
  --main-character-bottom: 60px;
  --purple-character-bottom: 50px;
  --black-character-bottom: 70px;
  --yellow-character-bottom: 65px;
  --character-opacity: 1;

  /* 颜色系统 */
  --main-color: #ff7b9c;
  --main-color-dark: #ff5a85;
  --main-color-light: #ffa8a8;
  --secondary-color: #4ecdc4;
  --accent-color: #ffa500;
  --purple-color: #9b59b6;
  --black-color: #34495e;
  --yellow-color: #f1c40f;

  /* 中性色 */
  --white: #ffffff;
  --gray-100: #f8f9fa;
  --gray-200: #e9ecef;
  --gray-300: #dee2e6;
  --gray-400: #ced4da;
  --gray-500: #adb5bd;
  --gray-600: #6c757d;
  --gray-700: #495057;
  --gray-800: #343a40;
  --gray-900: #212529;

  /* 错误颜色 */
  --error-color: #dc3545;
  --error-color-light: #f8d7da;

  /* 间距系统 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 40px;

  /* 字体系统 */
  --font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
  --font-size-xxl: 32px;

  /* 字重 */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* 边框圆角 */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --border-radius-xl: 16px;
  --border-radius-xxl: 20px;

  /* 阴影系统 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);

  /* 过渡动画 */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.25s ease;
  --transition-slow: 0.35s ease;

  /* 输入框高度 */
  --input-height: 48px;

  /* 按钮高度 */
  --button-height: 48px;

  /* 最小视口宽度 */
  --min-viewport-width: 320px;
}

.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  padding: var(--spacing-md);
  position: relative;
  overflow: hidden;
  min-width: var(--min-viewport-width);
}

.login-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: none;
  z-index: 1;
}

.login-container > * {
  position: relative;
  z-index: 2;
}

/* 角色容器 */
.characters-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 20px;
  padding: 0 20px;
  z-index: 10;
}

/* 角色基础样式 */
.character {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
}

.character:hover {
  animation: bounce 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.character:hover::after {
  content: "";
  animation: blink 0.5s ease;
}

/* 主角色 */
.character--main {
  width: 120px;
  height: 120px;
  bottom: var(--main-character-bottom);
  z-index: 30;
  transform: scale(var(--main-character-size));
  filter: drop-shadow(0 10px 10px rgba(0, 0, 0, 0.2));
}

/* 紫色角色 */
.character--purple {
  width: 100px;
  height: 100px;
  bottom: var(--purple-character-bottom);
  z-index: 10;
  transform: scale(var(--background-character-size));
  opacity: var(--character-opacity);
}

/* 黑色角色 */
.character--black {
  width: 100px;
  height: 100px;
  bottom: var(--black-character-bottom);
  z-index: 20;
  transform: scale(var(--secondary-character-size));
  filter: brightness(0.85);
}

/* 黄色角色 */
.character--yellow {
  width: 100px;
  height: 100px;
  bottom: var(--yellow-character-bottom);
  z-index: 10;
  transform: scale(var(--background-character-size));
  opacity: var(--character-opacity);
}

/* 角色身体 */
.character__body {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
  box-shadow: inset 0 4px 8px rgba(255, 255, 255, 0.4),
    0 6px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.character:hover .character__body {
  transform: scale(1.05);
  box-shadow: inset 0 4px 8px rgba(255, 255, 255, 0.4),
    0 8px 16px rgba(0, 0, 0, 0.15);
}

/* 角色颜色 */
.character--main .character__body {
  background-color: #ff9a9e;
}

.character--purple .character__body {
  background-color: #a18cd1;
}

.character--black .character__body {
  background-color: #8e8e8e;
}

.character--yellow .character__body {
  background-color: #fbc2eb;
}

/* 角色眼睛 */
.character__eyes {
  position: absolute;
  top: 35%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 15px;
  z-index: 10;
}

.character__eye {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: white;
  position: relative;
  transition: transform 0.05s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.character__eye::after {
  content: "";
  position: absolute;
  top: 2px;
  right: 2px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: black;
}

.character__eye::before {
  content: "";
  position: absolute;
  top: 1px;
  right: 1px;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1;
}

/* 角色嘴巴 */
.character__mouth {
  position: absolute;
  bottom: 30%;
  width: 20px;
  height: 8px;
  border-radius: 0 0 10px 10px;
  background-color: rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

/* 角色手 */
.character__hand {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: inherit;
  z-index: 5;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.character__hand--left {
  left: -5px;
  top: 40%;
}

.character__hand--right {
  right: -5px;
  top: 40%;
  z-index: 15; /* 确保手在头部前面 */
}

/* 眨眼动画 */
.character--blinking .character__eye {
  animation: blink 0.5s ease;
}

@keyframes blink {
  0%,
  100% {
    height: 12px;
  }
  50% {
    height: 2px;
  }
}

/* 弹跳动画 */
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0) scale(var(--main-character-size));
  }
  50% {
    transform: translateY(-3px) scale(var(--main-character-size));
  }
}

/* 紫色角色闭眼动画 */
.character--closing-eyes .character__eye {
  height: 2px;
}

/* 黑色角色歪头动画 */
.character--tilting-head {
  animation: tilt 0.4s ease forwards;
}

@keyframes tilt {
  0% {
    transform: scale(var(--secondary-character-size)) rotate(0deg);
  }
  50% {
    transform: scale(var(--secondary-character-size)) rotate(5deg);
  }
  100% {
    transform: scale(var(--secondary-character-size)) rotate(-5deg);
  }
}

/* 黄色角色低头动画 */
.character--bowing-head {
  animation: bow 0.4s ease forwards;
}

@keyframes bow {
  0% {
    transform: scale(var(--background-character-size)) rotate(0deg);
  }
  100% {
    transform: scale(var(--background-character-size)) rotate(-8deg);
  }
}

/* 登录卡片 */
.login-card {
  background: white;
  border-radius: 24px;
  padding: var(--spacing-xl);
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05);
  z-index: 20;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  animation: cardSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 2px solid #f0f0f0;
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.login-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15), 0 6px 16px rgba(0, 0, 0, 0.1);
}

.login-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(
    90deg,
    #ff9a9e,
    #fad0c4,
    #fad0c4,
    #fbc2eb,
    #a18cd1
  );
  border-radius: 24px 24px 0 0;
}

h1 {
  text-align: center;
  color: #ff6b6b;
  margin-bottom: var(--spacing-sm);
  font-size: 28px;
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
  font-family: "Comic Sans MS", "Chalkboard SE", sans-serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  animation: bounce 2s ease-in-out infinite;
}

.subtitle {
  text-align: center;
  color: var(--gray-600);
  margin-bottom: var(--spacing-xl);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-normal);
  font-family: var(--font-family);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--gray-700);
  font-weight: var(--font-weight-medium);
  font-family: var(--font-family);
  transition: color var(--transition-fast);
}

.form-group:focus-within label {
  color: var(--main-color);
}

.password-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #f0f0f0;
  border-radius: 20px;
  font-size: var(--font-size-md);
  font-family: "Comic Sans MS", "Chalkboard SE", sans-serif;
  transition: all var(--transition-normal);
  height: var(--input-height);
  background-color: #f9f9f9;
  color: #333;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

input:focus {
  outline: none;
  border-color: #ff9a9e;
  box-shadow: 0 0 0 4px rgba(255, 154, 158, 0.15),
    inset 0 2px 4px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px) scale(1.02);
  background-color: white;
}

input.error {
  border-color: var(--error-color);
  box-shadow: 0 0 0 4px rgba(220, 53, 69, 0.1);
}

input::placeholder {
  color: var(--gray-400);
  font-size: var(--font-size-sm);
}

.password-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  z-index: 1;
  transition: transform var(--transition-fast);
}

.password-toggle:hover {
  transform: scale(1.1);
}

.captcha-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
}

.captcha-image {
  padding: 12px 16px;
  background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 4px;
  text-align: center;
  cursor: pointer;
  user-select: none;
  transition: all var(--transition-fast);
  min-width: 100px;
  border: 1px solid #ddd;
}

.captcha-image:hover {
  background: linear-gradient(135deg, #e0e0e0 0%, #d0d0d0 100%);
  transform: scale(1.05);
}

.btn-primary {
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
  color: #333;
  border: none;
  border-radius: 24px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all var(--transition-normal);
  margin-top: var(--spacing-lg);
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(255, 154, 158, 0.4);
  z-index: 10;
  letter-spacing: 1px;
  font-family: "Comic Sans MS", "Chalkboard SE", sans-serif;
}

.btn-primary:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 8px 16px rgba(255, 154, 158, 0.6);
  background: linear-gradient(135deg, #fad0c4 0%, #ff9a9e 100%);
}

.btn-primary:active {
  transform: translateY(0) scale(0.98);
  box-shadow: 0 2px 8px rgba(255, 154, 158, 0.4);
  background: linear-gradient(135deg, #ff9a9e 0%, #ff9a9e 100%);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-primary::before {
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
  transition: left 0.6s ease;
}

.btn-primary:hover::before {
  left: 100%;
}

.register-link {
  text-align: center;
  margin-top: 24px;
  font-size: var(--font-size-sm);
  color: var(--gray-600);
  font-family: var(--font-family);
}

.register-link a {
  color: var(--main-color);
  text-decoration: none;
  font-weight: var(--font-weight-semibold);
  margin-left: var(--spacing-xs);
  transition: all var(--transition-fast);
  position: relative;
  padding: 8px 16px;
  border: 2px solid var(--main-color);
  border-radius: 20px;
  background-color: white;
}

.register-link a:hover {
  color: white;
  background-color: var(--main-color);
  text-decoration: none;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 123, 156, 0.4);
}

.error-message {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--error-color-light);
  color: var(--error-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  text-align: center;
  font-family: var(--font-family);
  border-left: 4px solid var(--error-color);
  animation: slideIn 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.register-link-in-error {
  color: var(--main-color);
  text-decoration: none;
  font-weight: var(--font-weight-semibold);
  transition: all var(--transition-fast);
  padding: 6px 12px;
  border: 1px solid var(--main-color);
  border-radius: 16px;
  display: inline-block;
  align-self: center;
  margin-top: 4px;
}

.register-link-in-error:hover {
  color: white;
  background-color: var(--main-color);
  text-decoration: none;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(255, 123, 156, 0.4);
}

.error-tip {
  font-size: 12px;
  color: var(--error-color);
  margin-top: 4px;
  line-height: 1.4;
}

.info-tip {
  font-size: 12px;
  color: var(--gray-500);
  margin-top: 4px;
  line-height: 1.4;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
/* 移动端 (≤767px) */
@media (max-width: 767px) {
  .login-card {
    padding: 24px 20px;
    max-width: 320px;
  }

  h1 {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
    margin-bottom: 24px;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .btn-primary {
    padding: 14px;
    font-size: 16px;
  }

  .characters-container {
    justify-content: center;
  }

  /* 只显示主角色 */
  .character--purple,
  .character--black,
  .character--yellow {
    display: none;
  }

  .character--main {
    width: 100px;
    height: 100px;
    transform: scale(0.6);
  }
}

/* 平板端 (768px-1199px) */
@media (min-width: 768px) and (max-width: 1199px) {
  .login-card {
    padding: 32px 24px;
    max-width: 360px;
  }

  h1 {
    font-size: 28px;
  }

  .characters-container {
    gap: 15px;
  }

  .character--main {
    width: 100px;
    height: 100px;
  }

  .character--purple,
  .character--black,
  .character--yellow {
    width: 85px;
    height: 85px;
  }
}

/* 桌面端 (≥1200px) */
@media (min-width: 1200px) {
  .login-card {
    padding: 40px;
    max-width: 400px;
  }

  h1 {
    font-size: 32px;
  }

  .characters-container {
    gap: 20px;
  }

  .character--main {
    width: 120px;
    height: 120px;
  }

  .character--purple,
  .character--black,
  .character--yellow {
    width: 100px;
    height: 100px;
  }
}
</style>
