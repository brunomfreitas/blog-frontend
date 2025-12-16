// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, meRequest } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [booting, setBooting] = useState(true);

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  useEffect(() => {
    (async () => {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        setBooting(false);
        return;
      }

      try {
        // valida token no backend
        const me = await meRequest();
        setToken(savedToken);
        setUser(me);
        localStorage.setItem("user", JSON.stringify(me));
      } catch (e) {
        logout();
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  async function login(loginValue, password) {
    const data = await loginRequest(loginValue, password);
    setToken(data.token);

    // você pode usar data.user OU chamar /auth/me logo após
    // (recomendo /auth/me pra manter padrão)
    localStorage.setItem("token", data.token);

    const me = await meRequest();
    setUser(me);
    localStorage.setItem("user", JSON.stringify(me));
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, booting }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
