import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as authApi from "../api/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      setIsLoading(false);
      return;
    }

    // Always attempt a silent refresh on mount to verify/renew the session.
    // This prevents stale access tokens from causing cascading 401s.
    authApi.refresh()
      .then(({ accessToken }) => {
        try {
          const userData = JSON.parse(savedUser);
          setToken(accessToken);
          setUser(userData);
          setIsAuth(true);
          localStorage.setItem("accessToken", accessToken);
        } catch {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
        }
      })
      .catch(() => {
        // Refresh token invalid/expired — force a clean logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = useCallback((userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    setIsAuth(true);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  const logout = useCallback(async () => {
    if (window.confirm("¿Seguro que quieres salir?")) {
      try { await authApi.logout(); } catch { /* ignore */ }
      setUser(null);
      setToken(null);
      setIsAuth(false);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, token, isAuth, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
