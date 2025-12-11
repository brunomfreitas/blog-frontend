// src/services/postsService.js
import api from './api';

export async function getPublicPosts() {
  const response = await api.get('/posts');
  return response.data;
}

export async function getPostById(id) {
  const response = await api.get(`/posts/${id}`);
  return response.data;
}

export async function getAdminPosts(token) {
  const response = await api.get('/admin/posts', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function createPost(token, payload) {
  const response = await api.post('/admin/posts', payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function updatePost(token, id, payload) {
  const response = await api.put(`/admin/posts/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function deletePost(token, id) {
  const response = await api.delete(`/admin/posts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
