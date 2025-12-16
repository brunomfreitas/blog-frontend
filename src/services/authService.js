import api from "./api";

export async function loginRequest(login, password) {
  const { data } = await api.post("/auth/login", { login, password });
  return data; // { token, user: { id, login, personId } }
}

export async function meRequest() {
  const { data } = await api.get("/auth/me");
  return data; // dados do usuário (valida token)
}
