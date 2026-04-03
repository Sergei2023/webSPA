<template>
  <div class="home">
    <div class="container">
      <div class="home-header">
        <h1>я название приложения)</h1>
        <div class="header-actions">
          <button @click="showCreateModal = true" class="create-btn">
            + Создать пост
          </button>
          <span class="user-name">{{ authStore.user?.username }}</span>
          <button @click="logout" class="logout-btn">Выйти</button>
        </div>
      </div>

      <div v-if="showCreateModal" class="modal" @click.self="showCreateModal = false">
        <div class="modal-content">
          <h3>Создать новый пост</h3>
          <PostForm 
            @post-created="onPostCreated" 
            @cancel="showCreateModal = false"
          />
        </div>
      </div>

      <div v-if="postsStore.isLoading" class="loading">
        Загрузка...
      </div>

      <div v-else-if="postsStore.posts.length === 0" class="empty-state">
        <p>Пока нет ни одного поста</p>
        <button @click="showCreateModal = true" class="create-first-btn">
          Создать первый пост
        </button>
      </div>

      <div v-else class="posts-list">
        <div v-for="post in paginatedPosts" :key="post.id" class="post-card">
          <div class="post-header">
            <router-link :to="`/user/${post.userInfoId}`" class="author-link">
              {{ post.author }}
            </router-link>
            <span class="post-date">{{ formatDate(post.dateTime) }}</span>
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

      <Pagination 
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        @page-change="changePage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePostsStore } from '@/stores/posts'
import Pagination from '@/components/Pagination.vue'
import PostForm from '@/components/PostForm.vue'

const router = useRouter()
const authStore = useAuthStore()
const postsStore = usePostsStore()

const currentPage = ref(1)
const itemsPerPage = 5
const showCreateModal = ref(false)

const totalPages = computed(() => {
  return Math.ceil(postsStore.posts.length / itemsPerPage)
})

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return postsStore.posts.slice(start, end)
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('ru-RU')
}

const changePage = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const onPostCreated = async () => {
  showCreateModal.value = false
  await postsStore.fetchAllPosts()
}

onMounted(() => {
  postsStore.fetchAllPosts()
})
</script>

<style scoped lang="scss">
@import '@/styles/views/Home';
</style>