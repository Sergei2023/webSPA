import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as apiLogin, logout as apiLogout } from '@/api/auth'
import apiClient from '@/api/client'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const user = ref<{ username: string; id: number } | null>(null)

  const login = async (username: string, password: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    
    const result = await apiLogin(username, password)
    
    if (result.success) {
      isAuthenticated.value = true
      
      try {
        const usersResponse = await apiClient.get('/userInfo/findAll')
        const users = usersResponse.data
        const currentUser = users.find((u: any) => u.fullName === username)
        user.value = { username, id: currentUser?.id || 1 }
      } catch (e) {
        user.value = { username, id: 1 }
      }
      
      isLoading.value = false
      return true
    } else {
      error.value = result.error || 'Ошибка авторизации'
      isLoading.value = false
      return false
    }
  }

  const logout = () => {
    apiLogout()
    isAuthenticated.value = false
    user.value = null
  }

  const checkAuth = () => {
    const token = localStorage.getItem('auth_token')
    isAuthenticated.value = !!token
  }

  checkAuth()

  return { isAuthenticated, isLoading, error, user, login, logout }
})