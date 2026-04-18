<template>
  <div class="food-manage">
    <h2>菜品库管理</h2>

    <!-- 添加菜品表单 -->
    <div class="add-food-form">
      <h3>{{ editingFood ? "编辑菜品" : "添加菜品" }}</h3>
      <div class="form-item">
        <label>菜名</label>
        <input
          v-model="form.name"
          type="text"
          class="input"
          placeholder="请输入菜名"
        />
      </div>
      <div class="form-item">
        <label>分类</label>
        <select v-model="form.category" class="input">
          <option value="早餐">早餐</option>
          <option value="午餐">午餐</option>
          <option value="晚餐">晚餐</option>
          <option value="外卖">外卖</option>
          <option value="校园食堂">校园食堂</option>
          <option value="火锅">火锅</option>
          <option value="夜宵">夜宵</option>
        </select>
      </div>
      <div class="form-item">
        <label>口味</label>
        <select v-model="form.taste" class="input">
          <option value="清淡">清淡</option>
          <option value="咸香">咸香</option>
          <option value="麻辣">麻辣</option>
          <option value="香辣">香辣</option>
          <option value="酥脆">酥脆</option>
          <option value="咸鲜">咸鲜</option>
        </select>
      </div>
      <div class="form-item">
        <label>食材（逗号分隔）</label>
        <input
          v-model="form.ingredients"
          type="text"
          class="input"
          placeholder="请输入食材，用逗号分隔"
        />
      </div>
      <div class="form-actions">
        <button class="btn-primary" @click="handleSave">
          {{ editingFood ? "保存修改" : "添加菜品" }}
        </button>
        <button class="btn-secondary" @click="handleCancel" v-if="editingFood">
          取消
        </button>
      </div>
    </div>

    <!-- 菜品列表 -->
    <div class="food-list">
      <h3>菜品列表</h3>
      <div v-if="foodList.length === 0" class="empty-state">
        <p>暂无菜品，点击添加菜品按钮开始添加</p>
      </div>
      <FoodItem
        v-for="food in foodList"
        :key="food.id"
        :food="food"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useFoodDrawStore } from "../stores/foodDraw";
import FoodItem from "./FoodItem.vue";

const emit = defineEmits(["close"]);

const foodStore = useFoodDrawStore();

const foodList = computed(() => foodStore.foodList);

const editingFood = ref(null);
const form = ref({
  name: "",
  category: "午餐",
  taste: "咸香",
  ingredients: "",
});

const handleSave = () => {
  if (!form.value.name) {
    alert("请输入菜名");
    return;
  }

  if (editingFood.value) {
    foodStore.updateFood(editingFood.value.id, form.value);
    editingFood.value = null;
  } else {
    foodStore.addFood(form.value);
    emit("close");
  }

  // 重置表单
  form.value = {
    name: "",
    category: "午餐",
    taste: "咸香",
    ingredients: "",
  };
};

const handleEdit = (food) => {
  editingFood.value = food;
  form.value = { ...food };
};

const handleCancel = () => {
  editingFood.value = null;
  form.value = {
    name: "",
    category: "午餐",
    taste: "咸香",
    ingredients: "",
  };
};

const handleDelete = (id) => {
  if (confirm("确定要删除这个菜品吗？")) {
    foodStore.deleteFood(id);
  }
};
</script>

<style scoped>
.food-manage {
  padding: 16px;
  max-height: 80vh;
  overflow-y: auto;
}

.food-manage h2 {
  margin-bottom: 24px;
  text-align: center;
}

.food-manage h3 {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
}

.add-food-form {
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 16px;
  margin-bottom: 24px;
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

.food-list {
  margin-top: 24px;
}

.empty-state {
  text-align: center;
  padding: 48px 16px;
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  color: var(--text-tertiary);
}
</style>
