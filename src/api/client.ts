import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('Request with token:', config.url, config.headers.Authorization)
    } else {
      console.log('Request without token:', config.url)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    console.log('Response success:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.config?.url)
    console.error('Error details:', error.response?.data)
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient