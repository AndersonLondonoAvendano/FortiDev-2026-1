/**
 * AuthContext.jsx
 * Reemplaza: LoginGuardarNombre.js + CerrarSesion.js + DashboardLeerNombre.js
 *
 * Provee:
 *  - usuario  → nombre guardado en localStorage
 *  - login()  → guarda nombre y actualiza estado
 *  - logout() → pide confirmación, limpia localStorage y redirige al inicio
 */

import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(
    () => localStorage.getItem("nombre") || null
  );

  const login = useCallback((nombre) => {
    localStorage.setItem("nombre", nombre);
    setUsuario(nombre);
  }, []);

  const logout = useCallback(() => {
    if (window.confirm("¿Seguro que quieres salir?")) {
      localStorage.removeItem("nombre");
      setUsuario(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
