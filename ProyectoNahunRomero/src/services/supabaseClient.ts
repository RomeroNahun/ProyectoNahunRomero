import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { AppState } from "react-native";
import { env } from "../config/env";

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    // guarda la sesion en el dispositivo para que persista al reabrir la app
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    // en React Native no hay URL del navegador que detectar
    detectSessionInUrl: false,
  },
});

// refresca el token automaticamente solo mientras la app esta en primer plano
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
