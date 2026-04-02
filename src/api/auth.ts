import axios from 'axios'

interface LoginResponse {
  token?: string
  accessToken?: string
  user?: {
    username: string
    id?: number
  }
}

export const login = async (login: string, password: string): Promise<{ success: boolean; data?: LoginResponse; error?: string }> => {
  try {
    const response = await axios.post<LoginResponse>(
      `/auth-api/login?login=${encodeURIComponent(login)}&password=${encodeURIComponent(password)}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    
    console.log('Login response:', response.data)
    
    const token = response.data?.token || response.data?.accessToken
    if (token) {
      localStorage.setItem('auth_token', token)
      return { success: true, data: response.data }
    }
    
    return { success: true, data: response.data }
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message)
    return { 
      success: false, 
      error: error.response?.data?.message || 'Ошибка авторизации' 
    }
  }
}

export const logout = (): void => {
  localStorage.removeItem('auth_token')
}