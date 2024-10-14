import axios from 'axios';

export const client = axios.create({
  baseURL: 'https://mate.academy/students-api',
})

//#region User
export const getUserByEmail = (email: string) => {
  return client.get('/users', {
    params: {
      email,
    }
  })
}

export const createUser = (email: string, name: string) => {
  return client.post('/users', {
    email,
    name,
  })
}
//#endregion

//#region Posts
export const getPostsById = (userId: number) => {
  return client.get('/posts', {
    params: {
      userId,
    }
  })
}

export const createPost = (title: string, body: string, userId: number) => {
  return client.post('/posts', {
    title,
    body,
    userId,
  })
}

export const updatePost = (title: string, body: string, postId: number, userId: number) => {
  return client.patch(`/posts/${postId}`, {
    title,
    body,
    userId,
  })
}

export const deletePost = (postId: number) => {
  return client.delete(`/posts/${postId}`)
}
//#endregion

//#region Comments
export const getCommentsByPostId = (postId: number) => {
  return client.get('/comments', {
    params: {
      postId,
    }
  })
}

export const createComment = (postId: number, name: string, body: string, email: string) => {
  return client.post('/comments', {
    postId,
    name,
    body,
    email,
  })
}

export const deleteComment = (commentId: number) => {
  return client.delete(`/comments/${commentId}`)
}
//#endregion