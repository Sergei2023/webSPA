import apiClient from './client'
import type { UserInfo, SaveUserInfoDto } from '@/types'

export const getAllUsers = async (): Promise<UserInfo[]> => {
  const response = await apiClient.get('/userInfo/findAll')
  return response.data
}

export const getUserById = async (id: number): Promise<UserInfo> => {
  const response = await apiClient.get(`/userInfo/${id}`)
  return response.data
}

export const saveUserInfo = async (data: SaveUserInfoDto): Promise<UserInfo> => {
  const response = await apiClient.post('/userInfo', data)
  return response.data
}

export const deleteUserInfo = async (id: number): Promise<void> => {
  await apiClient.delete(`/userInfo/${id}`)
}