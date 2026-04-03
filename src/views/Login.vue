<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Вход</h1>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Логин</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            placeholder="Введите логин"
            :disabled="authStore.isLoading"
          />
        </div>

        <div class="form-group">
          <label for="password">Пароль</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="Введите пароль"
            :disabled="authStore.isLoading"
          />
        </div>

        <div v-if="authStore.error" class="error-message">
          {{ authStore.error }}
        </div>

        <button type="submit" :disabled="authStore.isLoading" class="login-btn">
          {{ authStore.isLoading ? 'Вход...' : 'Войти' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')

const handleLogin = async () => {
  const success = await authStore.login(username.value, password.value)
  if (success) {
    router.push('/')
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/views/Login';
</style>