// src/services/postStatusService.js
import api from "./api";

export async function getPostStatus() {
  const resp = await api.get("/post-status" ); 
  return resp; // lista de Post[]
}
