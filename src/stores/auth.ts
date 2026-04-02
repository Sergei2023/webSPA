import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as apiLogin, logout as apiLogout } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const user = ref<{ username: string; id?: number } | null>(null)

  const login = async (username: string, password: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null
    
    const result = await apiLogin(username, password)
    
    isLoading.value = false
    
    if (result.success) {
      isAuthenticated.value = true
      user.value = result.data?.user || { username }
      return true
    } else {
      error.value = result.error || 'Ошибка авторизации'
      return false
    }
  }

  const logout = () => {
    apiLogout()
    isAuthenticated.value = false
    user.value = null
    error.value = null
  }


  const checkAuth = () => {
    const token = localStorage.getItem('auth_token')
    isAuthenticated.value = !!token
  }

  checkAuth()

  return { isAuthenticated, isLoading, error, user, login, logout }
})