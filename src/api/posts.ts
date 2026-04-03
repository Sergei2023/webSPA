import apiClient from './client'

export const getAllPosts = async () => {
  try {
    const response = await apiClient.get('/userInfo/findAll')
    const users = response.data
    
    let allPosts: any[] = []
    users.forEach((user: any) => {
      if (user.post && user.post.length) {
        const postsWithAuthor = user.post.map((post: any) => ({
          ...post,
          author: user.fullName || user.blogName,
          userInfoId: user.id
        }))
        allPosts = [...allPosts, ...postsWithAuthor]
      }
    })
    
    allPosts.sort((a, b) => {
      return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
    })
    
    return allPosts
  } catch (error) {
    console.error('Error fetching posts:', error)
    throw error
  }
}

export const getPostById = async (id: number) => {
  const response = await apiClient.get(`/post/${id}`)
  return response.data
}

export const createPost = async (data: any, userInfoId: number) => {
  const response = await apiClient.post(`/post?userInfoId=${userInfoId}`, {
    title: data.title,
    briefDescription: data.briefDescription,
    fullDescription: data.fullDescription
  })
  return response.data
}

export const updatePost = async (data: any) => {
  const response = await apiClient.put('/post', {
    id: data.id,
    title: data.title,
    briefDescription: data.briefDescription,
    fullDescription: data.fullDescription
  })
  return response.data
}

export const deletePost = async (id: number) => {
  await apiClient.delete(`/post/${id}`)
}