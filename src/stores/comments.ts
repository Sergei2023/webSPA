import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getPostComments, createComment, deleteComment } from '@/api/comments'

export const useCommentsStore = defineStore('comments', () => {
  const comments = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchComments = async (postId: number) => {
    isLoading.value = true
    error.value = null
    try {
      comments.value = await getPostComments(postId)
    } catch (err: any) {
      error.value = err.message || 'Ошибка загрузки комментариев'
    } finally {
      isLoading.value = false
    }
  }

  const addComment = async (data: any, postId: number) => {
    isLoading.value = true
    error.value = null
    try {
      const newComment = await createComment({
        email: data.email,
        textComment: data.textComment,
        userInfo: data.userInfo
      }, postId)
      comments.value.push(newComment)
      return newComment
    } catch (err: any) {
      error.value = err.message || 'Ошибка создания комментария'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const removeComment = async (id: number) => {
    isLoading.value = true
    error.value = null
    try {
      await deleteComment(id)
      comments.value = comments.value.filter(c => c.id !== id)
    } catch (err: any) {
      error.value = err.message || 'Ошибка удаления комментария'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    comments,
    isLoading,
    error,
    fetchComments,
    addComment,
    removeComment
  }
})