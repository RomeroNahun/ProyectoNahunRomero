import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { EstadoSolicitud, Solicitud } from "../../utils/types/Recoleccion";
import * as api from "../../services/recoleccionService";

type SolicitudesState = {
  solicitudes: Solicitud[];
  loading: boolean;
  error: string | null;
};

const initialState: SolicitudesState = {
  solicitudes: [],
  loading: false,
  error: null,
};

// trae las solicitudes desde Supabase; si se pasa un residenteId, trae solo
// las de ese usuario (residente). Sin argumento las trae todas (recolector).
export const cargarSolicitudes = createAsyncThunk(
  "solicitudes/cargar",
  async (residenteId: string | undefined = undefined) =>
    await api.fetchSolicitudes(residenteId),
);

// crea una solicitud; el id, la fecha y el estado los define el servicio/DB
export const addSolicitud = createAsyncThunk(
  "solicitudes/add",
  async (input: Omit<Solicitud, "id" | "estado" | "creadaEn">) =>
    await api.insertSolicitud(input),
);

// actualiza propiedades arbitrarias de una solicitud
export const updateSolicitud = createAsyncThunk(
  "solicitudes/update",
  async ({ id, updates }: { id: string; updates: Partial<Solicitud> }) =>
    await api.updateSolicitud(id, updates),
);

// cambia unicamente el estado
export const cambiarEstado = createAsyncThunk(
  "solicitudes/cambiarEstado",
  async ({ id, estado }: { id: string; estado: EstadoSolicitud }) =>
    await api.setEstadoSolicitud(id, estado),
);

export const deleteSolicitud = createAsyncThunk(
  "solicitudes/delete",
  async (id: string) => {
    await api.deleteSolicitud(id);
    return id;
  },
);

// reemplaza una solicitud en el arreglo por su id
const reemplazar = (state: SolicitudesState, solicitud: Solicitud) => {
  const index = state.solicitudes.findIndex((s) => s.id === solicitud.id);
  if (index !== -1) state.solicitudes[index] = solicitud;
};

const solicitudesSlice = createSlice({
  name: "solicitudes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(cargarSolicitudes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cargarSolicitudes.fulfilled, (state, action) => {
        state.loading = false;
        state.solicitudes = action.payload;
      })
      .addCase(cargarSolicitudes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error al cargar solicitudes";
      })
      .addCase(addSolicitud.fulfilled, (state, action) => {
        state.solicitudes.push(action.payload);
      })
      .addCase(updateSolicitud.fulfilled, (state, action) => {
        reemplazar(state, action.payload);
      })
      .addCase(cambiarEstado.fulfilled, (state, action) => {
        reemplazar(state, action.payload);
      })
      .addCase(
        deleteSolicitud.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.solicitudes = state.solicitudes.filter(
            (s) => s.id !== action.payload,
          );
        },
      );
  },
});

export default solicitudesSlice.reducer;
