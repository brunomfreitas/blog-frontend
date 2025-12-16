// src/services/categoryService.js
import api from "./api";

export async function getCategories() {
  const resp = await api.get("/category");
  return resp;
}