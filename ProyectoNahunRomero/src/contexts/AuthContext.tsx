import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../services/supabaseClient";
import { upsertProfile } from "../services/recoleccionService";
import { Rol } from "../utils/types/Recoleccion";

// 1. Tipado del objeto principal del contexto
type User = {
  id: string;
  email: string;
  rol: Rol;
} | null;

// resultado uniforme para login/register: lo usan las pantallas para decidir el ruteo
type AuthResult = {
  rol: Rol | null;
  error?: string;
  needsConfirmation?: boolean;
};

type RegisterParams = {
  email: string;
  password: string;
  nombre: string;
  telefono: string;
  rol: Rol;
};

type AuthContextType = {
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (params: RegisterParams) => Promise<AuthResult>;
  logout: () => Promise<void>;
};

// 2. Creacion del contexto
const AuthContext = createContext<AuthContextType | null>(null);

// 4. Exposicion del contexto como hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};

// extrae el rol guardado en los metadatos del usuario de Supabase Auth
const getRol = (session: Session | null): Rol => {
  const rol = session?.user?.user_metadata?.rol;
  return rol === "recolector" ? "recolector" : "residente";
};

// arma el objeto User a partir de la sesion de Supabase
const buildUser = (session: Session | null): User => {
  if (!session?.user) return null;
  return {
    id: session.user.id,
    email: session.user.email ?? "",
    rol: getRol(session),
  };
};

// 3. Provider: maneja el estado global de la sesion
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  // al montar: restaura la sesion guardada y escucha cambios de auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(buildUser(data.session));
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(buildUser(session));
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { rol: null, error: error.message };
    return { rol: getRol(data.session) };
  };

  const register = async ({
    email,
    password,
    nombre,
    telefono,
    rol,
  }: RegisterParams): Promise<AuthResult> => {
    // el rol y los datos basicos viajan en los metadatos; un trigger en la DB
    // crea la fila en la tabla profiles automaticamente
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { rol, full_name: nombre, phone: telefono },
      },
    });
    if (error) return { rol: null, error: error.message };

    // si la confirmacion de correo esta activada, no hay sesion todavia
    if (!data.session) return { rol, needsConfirmation: true };

    // con sesion activa, escribimos el perfil desde la app para no depender
    // del trigger de la DB: asi el nombre, telefono y rol quedan disponibles
    if (data.user) {
      try {
        await upsertProfile(data.user.id, { nombre, telefono, rol });
      } catch {
        // si falla (p. ej. el trigger ya creo la fila) no bloqueamos el registro
      }
    }
    return { rol };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
