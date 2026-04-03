Pagination.vue<template>
  <div class="pagination">
    <button 
      :disabled="currentPage === 1"
      @click="$emit('page-change', currentPage - 1)"
      class="page-btn"
    >
      ← Назад
    </button>
    
    <span class="page-info">
      {{ currentPage }} / {{ totalPages }}
    </span>
    
    <button 
      :disabled="currentPage === totalPages"
      @click="$emit('page-change', currentPage + 1)"
      class="page-btn"
    >
      Вперед →
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentPage: number
  totalPages: number
}>()

defineEmits<{
  (e: 'page-change', page: number): void
}>()
</script>

<style scoped lang="scss">
@import '@/styles/components/Pagination';
</style>