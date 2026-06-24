import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserProfile } from "../../utils/types/Recoleccion";
import * as api from "../../services/recoleccionService";

const defaultUserProfile: UserProfile = {
  nombre: "",
  telefono: "",
  direccion: "",
  rol: "residente",
  vehiculo: "",
};

// trae el perfil del usuario autenticado desde la tabla profiles
export const cargarPerfil = createAsyncThunk(
  "userProfile/cargar",
  async (userId: string) => await api.fetchProfile(userId),
);

// guarda (upsert) los cambios del perfil en Supabase
export const guardarPerfil = createAsyncThunk(
  "userProfile/guardar",
  async ({
    userId,
    profile,
  }: {
    userId: string;
    profile: Partial<UserProfile>;
  }) => await api.upsertProfile(userId, profile),
);

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState: defaultUserProfile,
  reducers: {
    resetProfile: () => defaultUserProfile,
  },
  extraReducers: (builder) => {
    builder
      .addCase(cargarPerfil.fulfilled, (state, action) => {
        if (action.payload) Object.assign(state, action.payload);
      })
      .addCase(guardarPerfil.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      });
  },
});

export const { resetProfile } = userProfileSlice.actions;

export default userProfileSlice.reducer;
