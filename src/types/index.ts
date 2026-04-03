export interface GetPostDto {
  id: number
  title: string
  briefDescription: string
  fullDescription: string
  dateTime: string
  userInfoId: number
  comments: CommentDto[]
}

export interface Post {
  id: number
  title: string
  briefDescription: string
  fullDescription: string
  dateTime: string
  comments: CommentDto[]
}

export interface CommentDto {
  id: number
  textComment: string
  email: string
  userInfo: string
  dateTime: string
}

export interface UserInfo {
  id: number
  blogName: string
  fullName: string
  post: GetPostDto[]
}

export interface SavePostDto {
  title: string
  briefDescription: string
  fullDescription: string
}

export interface UpdatePostDto {
  id: number
  title: string
  briefDescription: string
  fullDescription: string
}

export interface SaveCommentDto {
  textComment: string
  email: string
  userInfo: string
}

export interface SaveUserInfoDto {
  blogName: string
  fullName: string
}

export interface CreatePostData {
  title: string
  briefDescription: string
  fullDescription: string
}

export interface CreateCommentData {
  textComment: string
  email: string
  userInfo: string
  postId: number
}