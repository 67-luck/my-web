<template>
  <div class="food-item">
    <div class="food-info">
      <h3>{{ food.name }}</h3>
      <div class="food-meta">
        <span class="tag tag-primary">{{ food.category }}</span>
        <span class="tag tag-secondary">{{ food.taste }}</span>
      </div>
      <p class="food-ingredients">{{ food.ingredients }}</p>
    </div>
    <div class="food-actions">
      <button class="action-btn edit-btn" @click="handleEdit">编辑</button>
      <button class="action-btn delete-btn" @click="handleDelete">删除</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  food: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])

const handleEdit = () => {
  emit('edit', props.food)
}

const handleDelete = () => {
  emit('delete', props.food.id)
}
</script>

<style scoped>
.food-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  margin-bottom: 12px;
}

.food-info {
  flex: 1;
  margin-right: 12px;
}

.food-info h3 {
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 600;
}

.food-meta {
  margin-bottom: 8px;
}

.food-ingredients {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.food-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn {
  background-color: var(--secondary-color);
  color: var(--text-primary);
}

.delete-btn {
  background-color: #FF6B6B;
  color: white;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
