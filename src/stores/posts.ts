import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from '@/api/posts'
import { useAuthStore } from './auth'

export const usePostsStore = defineStore('posts', () => {
  const posts = ref<any[]>([])
  const currentPost = ref<any>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchAllPosts = async () => {
    isLoading.value = true
    error.value = null
    try {
      posts.value = await getAllPosts()
    } catch (err: any) {
      error.value = err.message || 'Ошибка загрузки постов'
    } finally {
      isLoading.value = false
    }
  }

  const fetchPostById = async (id: number) => {
    isLoading.value = true
    error.value = null
    try {
      currentPost.value = await getPostById(id)
    } catch (err: any) {
      error.value = err.message || 'Ошибка загрузки поста'
    } finally {
      isLoading.value = false
    }
  }

  const addPost = async (data: any) => {
    isLoading.value = true
    error.value = null
    try {
      const authStore = useAuthStore()
      const newPost = await createPost(data, authStore.user?.id || 1)
      await fetchAllPosts()
      return newPost
    } catch (err: any) {
      error.value = err.message || 'Ошибка создания поста'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const editPost = async (data: any) => {
    isLoading.value = true
    error.value = null
    try {
      const updatedPost = await updatePost(data)
      await fetchAllPosts()
      return updatedPost
    } catch (err: any) {
      error.value = err.message || 'Ошибка обновления поста'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const removePost = async (id: number) => {
    isLoading.value = true
    error.value = null
    try {
      await deletePost(id)
      await fetchAllPosts()
    } catch (err: any) {
      error.value = err.message || 'Ошибка удаления поста'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    posts,
    currentPost,
    isLoading,
    error,
    fetchAllPosts,
    fetchPostById,
    addPost,
    editPost,
    removePost
  }
})