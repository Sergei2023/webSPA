<template>
  <div class="comment-form">
    <h4>Добавить комментарий</h4>
    <form @submit.prevent="submitComment">
      <div class="form-row">
        <div class="form-group">
          <label>Имя *</label>
          <input
            v-model="form.name"
            type="text"
            required
            maxlength="50"
            placeholder="Ваше имя"
          />
        </div>
        
        <div class="form-group">
          <label>Email *</label>
          <input
            v-model="form.email"
            type="email"
            required
            maxlength="50"
            placeholder="your@email.com"
          />
        </div>
      </div>
      
      <div class="form-group">
        <label>Комментарий *</label>
        <textarea
          v-model="form.text"
          required
          maxlength="255"
          rows="4"
          placeholder="Ваш комментарий..."
        ></textarea>
      </div>
      
      <div v-if="errors.length" class="errors">
        <p v-for="err in errors" :key="err">{{ err }}</p>
      </div>
      
      <button type="submit" :disabled="isSubmitting" class="submit-btn">
        {{ isSubmitting ? 'Отправка...' : 'Отправить комментарий' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useCommentsStore } from '@/stores/comments'

const props = defineProps<{
  postId: number
}>()

const emit = defineEmits<{
  (e: 'comment-added'): void
}>()

const commentsStore = useCommentsStore()
const isSubmitting = ref(false)
const errors = ref<string[]>([])

const form = reactive({
  name: '',
  email: '',
  text: ''
})

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const submitComment = async () => {
  console.log('Форма отправлена')
  console.log('Данные формы:', form)
  console.log('postId:', props.postId)
  
  errors.value = []
  
  if (!form.name) errors.value.push('Имя обязательно')
  if (!form.email) errors.value.push('Email обязателен')
  if (!validateEmail(form.email)) errors.value.push('Введите корректный email')
  if (!form.text) errors.value.push('Текст комментария обязателен')
  
  if (errors.value.length > 0) {
    console.log('Ошибки валидации:', errors.value)
    return
  }
  
  isSubmitting.value = true
  
  try {
    const commentData = {
      userInfo: form.name,
      email: form.email,
      textComment: form.text
    }
    console.log('Отправляем комментарий:', commentData)
    console.log('postId:', props.postId)
    
    await commentsStore.addComment(commentData, props.postId)
    
    console.log('Комментарий создан!')
    
    form.name = ''
    form.email = ''
    form.text = ''
    
    emit('comment-added')
  } catch (error: any) {
    console.error('Ошибка создания комментария:', error)
    console.error('Детали ошибки:', error.response?.data)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/components/CommentForm';
</style>