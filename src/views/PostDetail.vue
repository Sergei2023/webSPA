<template>
  <div class="post-detail">
    <div class="container">
      <button @click="goBack" class="back-btn">← Назад</button>
      
      <div v-if="postsStore.isLoading" class="loading">
        Загрузка...
      </div>
      
      <div v-else-if="post" class="post-content">
        <div class="post-header">
          <h1>{{ post.title }}</h1>
          <div class="post-meta">
            <router-link :to="`/user/${post.userInfoId}`" class="author">
              Автор: {{ post.author }}
            </router-link>
            <span class="date">{{ formatDate(post.dateTime) }}</span>
          </div>
        </div>
        
        <div class="post-body">
          <p class="brief">{{ post.briefDescription }}</p>
          <p class="full">{{ post.fullDescription }}</p>
        </div>
        
        <div class="comments-section">
          <h3>Комментарии ({{ post.comments?.length || 0 }})</h3>
          
          <CommentForm :post-id="post.id" @comment-added="refreshComments" />
          
          <div v-if="post.comments?.length === 0" class="no-comments">
            Пока нет комментариев. Будьте первым!
          </div>
          
          <div v-else class="comments-list">
            <div v-for="comment in post.comments" :key="comment.id" class="comment-card">
              <div class="comment-header">
                <strong>{{ comment.userInfo }}</strong>
                <span class="comment-email">{{ comment.email }}</span>
                <span class="comment-date">{{ formatDate(comment.dateTime) }}</span>
              </div>
              <p class="comment-text">{{ comment.textComment }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import CommentForm from '@/components/CommentForm.vue'

const route = useRoute()
const router = useRouter()
const postsStore = usePostsStore()

const post = computed(() => postsStore.currentPost)

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('ru-RU')
}

const goBack = () => {
  router.back()
}

const refreshComments = async () => {
  await postsStore.fetchPostById(Number(route.params.id))
}

onMounted(() => {
  postsStore.fetchPostById(Number(route.params.id))
})
</script>

<style scoped lang="scss">
@import '@/styles/views/PostDetail';
</style>