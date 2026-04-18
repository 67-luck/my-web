<template>
  <div class="register-container">
    <div class="register-card">
      <h1>心动加载中心</h1>
      <p class="subtitle">注册新账户</p>
      
      <div class="form-group">
        <label for="username">用户名</label>
        <input 
          type="text" 
          id="username" 
          v-model="form.username" 
          placeholder="请输入用户名"
          @input="validateUsername"
          :class="{ error: errors.username }"
        >
        <div v-if="errors.username" class="error-tip">
          {{ errors.username }}
        </div>
        <div class="info-tip">6-20个字符，支持字母、数字和下划线</div>
      </div>
      
      <div class="form-group">
        <label for="password">密码</label>
        <div class="password-input-container">
          <input 
            :type="showPassword ? 'text' : 'password'" 
            id="password" 
            v-model="form.password" 
            placeholder="请输入密码"
            @input="validatePassword"
            :class="{ error: errors.password }"
          >
          <button 
            type="button" 
            class="password-toggle"
            @click="togglePasswordVisibility"
          >
            {{ showPassword ? "👁️" : "👁️‍🗨️" }}
          </button>
        </div>
        <div v-if="errors.password" class="error-tip">
          {{ errors.password }}
        </div>
        <div class="password-strength" v-if="form.password">
          <div class="strength-bar">
            <div 
              class="strength-level" 
              :class="passwordStrengthClass"
              :style="{ width: passwordStrengthWidth }"
            ></div>
          </div>
          <div class="strength-text">{{ passwordStrengthText }}</div>
        </div>
      </div>
      
      <div class="form-group">
        <label for="confirmPassword">确认密码</label>
        <input 
          type="password" 
          id="confirmPassword" 
          v-model="form.confirmPassword" 
          placeholder="请再次输入密码"
          @input="validateConfirmPassword"
          :class="{ error: errors.confirmPassword }"
        >
        <div v-if="errors.confirmPassword" class="error-tip">
          {{ errors.confirmPassword }}
        </div>
      </div>
      
      <div class="form-group">
        <label for="captcha">验证码</label>
        <div class="captcha-container">
          <input 
            type="text" 
            id="captcha" 
            v-model="form.captcha" 
            placeholder="请输入验证码"
            @input="validateCaptcha"
            :class="{ error: errors.captcha }"
          >
          <div class="captcha-image" @click="refreshCaptcha">
            {{ captchaText }}
          </div>
        </div>
        <div v-if="errors.captcha" class="error-tip">
          {{ errors.captcha }}
        </div>
      </div>
      
      <button class="btn-primary" @click="register">注册</button>
      
      <div class="login-link">
        <span>已有账户？</span>
        <a href="#/login" @click.prevent="goToLogin">立即登录</a>
      </div>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useFoodDrawStore } from '../stores/foodDraw'

const router = useRouter()
const authStore = useAuthStore()
const foodStore = useFoodDrawStore()

// 生成验证码
const generateCaptcha = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const form = ref({
  username: '',
  password: '',
  confirmPassword: '',
  captcha: ''
})
const error = ref('')
const errors = ref({
  username: '',
  password: '',
  confirmPassword: '',
  captcha: ''
})
const showPassword = ref(false)
const captchaText = ref(generateCaptcha())

// 刷新验证码
const refreshCaptcha = () => {
  captchaText.value = generateCaptcha()
}

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// 用户名验证
const validateUsername = () => {
  const username = form.value.username.trim()
  const usernameRegex = /^[a-zA-Z0-9_]{6,20}$/
  const weakNames = ['admin', 'root', 'test', 'user', 'guest']
  
  if (!username) {
    errors.value.username = '请输入用户名'
  } else if (!usernameRegex.test(username)) {
    errors.value.username = '用户名必须是6-20个字符，只支持字母、数字和下划线'
  } else if (weakNames.includes(username.toLowerCase())) {
    errors.value.username = '用户名不能使用常见弱名称'
  } else if (/^\d+$/.test(username)) {
    errors.value.username = '用户名不能是纯数字'
  } else {
    errors.value.username = ''
  }
}

// 密码验证
const validatePassword = () => {
  const password = form.value.password
  const username = form.value.username
  
  if (!password) {
    errors.value.password = '请输入密码'
  } else if (password.length < 8) {
    errors.value.password = '密码长度至少8位'
  } else if (password.length < 12) {
    errors.value.password = '密码长度推荐至少12位'
  } else if (password.includes(username)) {
    errors.value.password = '密码不能包含用户名'
  } else if (isWeakPassword(password)) {
    errors.value.password = '密码强度不足，请使用更复杂的密码'
  } else {
    errors.value.password = ''
  }
}

// 确认密码验证
const validateConfirmPassword = () => {
  const confirmPassword = form.value.confirmPassword
  const password = form.value.password
  
  if (!confirmPassword) {
    errors.value.confirmPassword = '请确认密码'
  } else if (confirmPassword !== password) {
    errors.value.confirmPassword = '两次输入的密码不一致'
  } else {
    errors.value.confirmPassword = ''
  }
}

// 验证码验证
const validateCaptcha = () => {
  const captcha = form.value.captcha.trim().toUpperCase()
  
  if (!captcha) {
    errors.value.captcha = '请输入验证码'
  } else if (captcha !== captchaText.value) {
    errors.value.captcha = '验证码不正确'
  } else {
    errors.value.captcha = ''
  }
}

// 检查弱密码
const isWeakPassword = (password) => {
  const weakPasswords = ['123456', 'password', 'admin123', 'qwerty', '111111']
  return weakPasswords.includes(password)
}

// 密码强度计算
const passwordStrength = computed(() => {
  const password = form.value.password
  let score = 0
  
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[!@#$%^&*()_+-=\[\]{}|;:'",.<>?/~]/.test(password)) score += 1
  
  return score
})

// 密码强度类名
const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value
  if (strength <= 2) return 'weak'
  if (strength <= 4) return 'medium'
  return 'strong'
})

// 密码强度宽度
const passwordStrengthWidth = computed(() => {
  const strength = passwordStrength.value
  return `${(strength / 6) * 100}%`
})

// 密码强度文本
const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength <= 2) return '弱'
  if (strength <= 4) return '中'
  return '强'
})

// 注册功能
const register = () => {
  // 验证表单
  validateUsername()
  validatePassword()
  validateConfirmPassword()
  validateCaptcha()
  
  if (errors.value.username || errors.value.password || errors.value.confirmPassword || errors.value.captcha) {
    error.value = '请检查表单信息'
    return
  }
  
  try {
    authStore.init()
    
    if (!authStore.canRegister) {
      error.value = '最多只能注册2个账号'
      return
    }
    
    const user = authStore.createAccount(form.value.username, form.value.password)
    
    // 初始化 foodDraw store 的用户数据
    if (user) {
      foodStore.initUser(user.id)
    }
    
    router.push('/')
  } catch (err) {
    error.value = err.message
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
/* CSS变量系统 */
:root {
  --main-color: #FF7B9C;
  --main-color-light: #FFA8A8;
  --error-color: #FF4D4F;
  --error-color-light: #FFF0F0;
  --gray-100: #f8f9fa;
  --gray-200: #e9ecef;
  --gray-300: #dee2e6;
  --gray-400: #ced4da;
  --gray-500: #adb5bd;
  --gray-600: #6c757d;
  --gray-700: #495057;
  --gray-800: #343a40;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --transition-normal: 0.3s ease;
}

.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  padding: 20px;
  position: relative;
  overflow: hidden;
  min-width: 320px;
}

.register-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: none;
  z-index: 1;
}

.register-container > * {
  position: relative;
  z-index: 2;
}

.register-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 2px solid #f0f0f0;
}

.register-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #ff9a9e, #fad0c4, #fad0c4, #fbc2eb, #a18cd1);
  border-radius: 20px 20px 0 0;
}

h1 {
  text-align: center;
  color: #FF7B9C;
  margin-bottom: 10px;
  font-size: 28px;
  font-family: "Comic Sans MS", "Chalkboard SE", sans-serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  animation: bounce 2s ease-in-out infinite;
}

.subtitle {
  text-align: center;
  color: var(--gray-600);
  margin-bottom: 30px;
  font-size: 16px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--gray-700);
  font-weight: 500;
  transition: color var(--transition-normal);
}

.form-group:focus-within label {
  color: var(--main-color);
}

input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #f0f0f0;
  border-radius: 20px;
  font-size: 16px;
  transition: all var(--transition-normal);
  background-color: #f9f9f9;
  color: #333;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

input:focus {
  outline: none;
  border-color: #ff9a9e;
  box-shadow: 0 0 0 4px rgba(255, 154, 158, 0.15), inset 0 2px 4px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px) scale(1.02);
  background-color: white;
}

input.error {
  border-color: var(--error-color);
  box-shadow: 0 0 0 4px rgba(255, 77, 79, 0.1);
}

.password-input-container {
  position: relative;
  display: flex;
  align-items: center;
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
  transition: transform var(--transition-normal);
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
  transition: all var(--transition-normal);
  min-width: 100px;
  border: 1px solid #ddd;
}

.captcha-image:hover {
  background: linear-gradient(135deg, #e0e0e0 0%, #d0d0d0 100%);
  transform: scale(1.05);
}

.password-strength {
  margin-top: 8px;
}

.strength-bar {
  width: 100%;
  height: 4px;
  background-color: var(--gray-200);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.strength-level {
  height: 100%;
  transition: width var(--transition-normal);
  border-radius: 2px;
}

.strength-level.weak {
  background-color: var(--error-color);
}

.strength-level.medium {
  background-color: var(--warning-color);
}

.strength-level.strong {
  background-color: var(--success-color);
}

.strength-text {
  font-size: 12px;
  color: var(--gray-600);
  text-align: right;
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
  margin-top: 20px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(255, 154, 158, 0.4);
  font-family: "Comic Sans MS", "Chalkboard SE", sans-serif;
  letter-spacing: 1px;
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

.login-link {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: var(--gray-600);
}

.login-link a {
  color: var(--main-color);
  text-decoration: none;
  font-weight: 500;
  margin-left: 5px;
  transition: all var(--transition-normal);
  position: relative;
  padding: 8px 16px;
  border: 2px solid var(--main-color);
  border-radius: 20px;
  background-color: white;
}

.login-link a:hover {
  color: white;
  background-color: var(--main-color);
  text-decoration: none;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 123, 156, 0.4);
}

.error-message {
  margin-top: 15px;
  padding: 10px;
  background-color: var(--error-color-light);
  color: var(--error-color);
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  border-left: 4px solid var(--error-color);
  animation: slideIn 0.3s ease;
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

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
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

@media (max-width: 768px) {
  .register-card {
    padding: 30px 20px;
  }
  
  h1 {
    font-size: 24px;
  }
  
  .btn-primary {
    padding: 14px;
    font-size: 16px;
  }
  
  .form-group {
    margin-bottom: 16px;
  }
}
</style>