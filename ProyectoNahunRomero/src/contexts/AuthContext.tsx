import { createContext, useContext, useState } from "react";
import { Rol } from "../utils/types/Recoleccion";

// 1. Tipado del objeto principal del contexto
type User = {
  email: string;
  rol: Rol;
} | null;

type AuthContextType = {
  user: User;
  login: (email: string, rol: Rol) => boolean;
  logout: () => void;
};

// 2. Creacion del contexto
const AuthContext = createContext<AuthContextType | null>(null);

// 4. Exposicion del contexto como hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};

// 3. Provider: maneja el estado global de la sesion
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);

  const login = (email: string, rol: Rol): boolean => {
    // validacion simple: el correo debe contener un @
    const allowed = email.includes("@");
    if (allowed) {
      setUser({ email, rol });
    }
    return allowed;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
