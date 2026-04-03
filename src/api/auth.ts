import axios from 'axios'

export const login = async (username: string, password: string) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `/auth-api/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Login response:', response.status, response.data)
    
    const token = response.data?.token || response.data?.accessToken
    if (token) {
      localStorage.setItem('auth_token', token)
      return { success: true, data: response.data }
    }
    
    if (response.status === 200) {
      return { success: true, data: response.data }
    }
    
    return { success: false, error: 'Токен не получен' }
  } catch (error: any) {
    console.error('Login error:', error.response?.status, error.response?.data)
    return { 
      success: false, 
      error: error.response?.data?.message || 'Ошибка авторизации'
    }
  }
}

export const logout = () => {
  localStorage.removeItem('auth_token')
}