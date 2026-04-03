<template>
  <div class="post-form">
    <form @submit.prevent="submitPost">
      <div class="form-group">
        <label>Заголовок  (макс. 50 символов)</label> 
        <!-- во всех полях птавил ограничения, чтобы не сломать  -->
        <input
          v-model="form.title"
          type="text"
          required
          maxlength="50"
          placeholder="Заголовок поста"
        />
      </div>
      
      <div class="form-group">
        <label>Краткое описание  (макс. 100 символов)</label>
        <textarea
          v-model="form.briefDescription"
          required
          maxlength="100"
          rows="2"
          placeholder="Краткое описание..."
        ></textarea>
      </div>
      
      <div class="form-group">
        <label>Полное описание (макс. 255 символов)</label>
        <textarea
          v-model="form.fullDescription"
          maxlength="255"
          rows="6"
          placeholder="Полное описание поста..."
        ></textarea>
      </div>
      
      <div v-if="errors.length" class="errors">
        <p v-for="err in errors" :key="err">{{ err }}</p>
      </div>
      
      <div class="form-actions">
        <button type="button" @click="$emit('cancel')" class="cancel-btn" v-if="isEdit">
          Отмена
        </button>
        <button type="submit" :disabled="isSubmitting" class="submit-btn">
          {{ isSubmitting ? 'Сохранение...' : (isEdit ? 'Обновить' : 'Создать') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { usePostsStore } from '@/stores/posts'

const props = defineProps<{
  post?: any
}>()

const emit = defineEmits<{
  (e: 'post-created'): void
  (e: 'post-updated'): void
  (e: 'cancel'): void
}>()

const postsStore = usePostsStore()
const isSubmitting = ref(false)
const errors = ref<string[]>([])
const isEdit = computed(() => !!props.post)

const form = reactive({
  title: '',
  briefDescription: '',
  fullDescription: ''
})

watch(() => props.post, (newPost) => {
  if (newPost) {
    form.title = newPost.title || ''
    form.briefDescription = newPost.briefDescription || ''
    form.fullDescription = newPost.fullDescription || ''
  }
}, { immediate: true })

const submitPost = async () => {
  errors.value = []
  
  if (!form.title) errors.value.push('Заголовок обязателен')
  if (!form.briefDescription) errors.value.push('Краткое описание обязательно')
  
  if (errors.value.length > 0) return
  
  isSubmitting.value = true
  
  try {
    if (isEdit.value) {
      await postsStore.editPost({
        id: props.post.id,
        ...form
      })
      emit('post-updated')
    } else {
      await postsStore.addPost({
        ...form,
        author: 'Keldysh',
        userInfoId: 1,
        dateTime: new Date().toISOString(),
        comments: []
      })
      emit('post-created')
    }
    
    if (!isEdit.value) {
      form.title = ''
      form.briefDescription = ''
      form.fullDescription = ''
    }
  } catch (error) {
    console.error('Ошибка сохранения:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/components/PostForm';
</style>