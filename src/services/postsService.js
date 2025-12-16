// src/services/postsService.js
import api from "./api";

export async function getPublicPosts(page = 1, limit = 10, categoryId = null) {
  const params = { page, limit };
  if (categoryId) params.category = categoryId; // ou categoryId, depende do backend

  const resp = await api.get("/post", { params });
  return resp;
}

export async function searchPublicPosts(q, page = 1, limit = 10) {
  const { data } = await api.get("/post/search", { params: { q, page, limit } });
  return data;
}

// export async function getAdminPosts( page = 1, limit = 10) {
//   const { data } = await api.get("/post/all", { params: { page, limit } });
//   return data;
// }

export async function getAdminPosts(token, page = 1, limit = 15) {
  const resp =  await api.get('/post/all', {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, limit },
  });
  return resp;
}

export async function createPost(payload) {
  const { data } = await api.post("/post", payload);
  return data;
}

export async function updatePost(id, payload) {
  const { data } = await api.put(`/post/${id}`, payload);
  return data;
}

export async function getPostById(id) {
  const { data } = await api.get(`/post/${id}`);
  return data;
}

export async function deletePost(id) {
  const { data } = await api.delete(`/post/${id}`);
  return data;
}
