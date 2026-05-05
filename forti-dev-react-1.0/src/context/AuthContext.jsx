/**
 * AuthContext.jsx
 * Contexto de autenticación integrado con el backend
 *
 * Provee:
 *  - user      → datos del usuario (id, nombre, email, rol)
 *  - token     → JWT token del servidor
 *  - isAuth    → indica si el usuario está autenticado
 *  - login()   → guarda token y datos del usuario
 *  - logout()  → pide confirmación, limpia datos locales y redirige a login
 */

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuth, setIsAuth] = useState(false);

  // Inicializar desde localStorage al cargar
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setIsAuth(true);
      } catch (error) {
        console.error("Error al recuperar datos de autenticación:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = useCallback((userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    setIsAuth(true);
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    if (window.confirm("¿Seguro que quieres salir?")) {
      setUser(null);
      setToken(null);
      setIsAuth(false);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  const value = {
    user,
    token,
    isAuth,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
