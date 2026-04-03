<template>
  <div class="user-blog">
    <div class="container">
      <div class="blog-header">
        <button @click="goBack" class="back-btn">← Назад</button>
        <div class="header-actions">
          <span class="user-name">{{ authStore.user?.username }}</span>
          <button @click="logout" class="logout-btn">Выйти</button>
        </div>
      </div>

      <div class="blog-info" v-if="userInfo">
        <h1>{{ userInfo.blogName || userInfo.fullName || `Блог пользователя` }}</h1>
      </div>

      <div class="blog-info" v-else>
        <h1>Загрузка...</h1>
      </div>

      <div v-if="isOwnBlog" class="add-post-section">
        <h3>Создать новую запись</h3>
        <PostForm @post-created="onPostCreated" />
      </div>

      <div v-if="postsStore.isLoading" class="loading">
        Загрузка...
      </div>

      <div v-else class="posts-list">
        <div v-for="post in userPosts" :key="post.id" class="post-card">
          <div class="post-header">
            <span class="post-date">{{ formatDate(post.dateTime) }}</span>
            <div v-if="isOwnBlog" class="post-actions">
              <button @click="editPost(post)" class="edit-btn">Редактировать</button>
              <button @click="deletePost(post.id)" class="delete-btn">Удалить</button>
            </div>
          </div>
          
          <router-link :to="`/post/${post.id}`" class="post-link">
            <h2 class="post-title">{{ post.title }}</h2>
            <p class="post-brief">{{ post.briefDescription }}</p>
          </router-link>
          
          <div class="post-footer">
            <span class="comments-count">{{ post.comments?.length || 0 }} комментариев</span>
          </div>
        </div>
      </div>

      <div v-if="editingPost" class="modal" @click.self="closeModal">
        <div class="modal-content">
          <h3>Редактировать пост</h3>
          <PostForm :post="editingPost" @post-updated="onPostUpdated" @cancel="closeModal" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePostsStore } from '@/stores/posts'
import PostForm from '@/components/PostForm.vue'
import apiClient from '@/api/client'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const postsStore = usePostsStore()

const userId = computed(() => Number(route.params.id))
const isOwnBlog = computed(() => authStore.user?.id === userId.value)

const userInfo = ref<any>(null)
const editingPost = ref<any>(null)

const userPosts = computed(() => {
  return postsStore.posts.filter(post => post.userInfoId === userId.value)
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('ru-RU')
}

const goBack = () => {
  router.back()
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const onPostCreated = async () => {
  await postsStore.fetchAllPosts()
}

const editPost = (post: any) => {
  editingPost.value = post
}

const onPostUpdated = async () => {
  editingPost.value = null
  await postsStore.fetchAllPosts()
}

const deletePost = async (id: number) => {
  if (confirm('Удалить этот пост?')) {
    await postsStore.removePost(id)
  }
}

const closeModal = () => {
  editingPost.value = null
}

const fetchUserInfo = async () => {
  try {
    const response = await apiClient.get('/userInfo/findAll')
    const users = response.data
    userInfo.value = users.find((u: any) => u.id === userId.value)
    
    if (isOwnBlog.value && authStore.user?.username) {
      if (userInfo.value) {
        userInfo.value.fullName = authStore.user.username
        userInfo.value.blogName = `Блог ${authStore.user.username}`
      }
    }
  } catch (error) {
    console.error('Ошибка загрузки пользователя:', error)
  }
}

onMounted(() => {
  fetchUserInfo()
  postsStore.fetchAllPosts()
})
</script>

<style scoped lang="scss">
@import '@/styles/views/UserBlog';
</style>