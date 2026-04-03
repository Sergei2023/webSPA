import apiClient from './client'

export const getPostComments = async (postId: number) => {
  const response = await apiClient.get(`/comment/post/${postId}`)
  return response.data
}

export const createComment = async (data: any, postId: number) => {
  const response = await apiClient.post(`/comment?postId=${postId}`, {
    email: data.email,
    textComment: data.textComment,
    userInfo: data.userInfo
  })
  return response.data
}

export const deleteComment = async (id: number) => {
  await apiClient.delete(`/comment/${id}`)
}