import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { EstadoRuta, Ruta } from "../../utils/types/Recoleccion";
import * as api from "../../services/recoleccionService";

type RutasState = {
  rutas: Ruta[];
  loading: boolean;
  error: string | null;
};

const initialState: RutasState = {
  rutas: [],
  loading: false,
  error: null,
};

// trae todas las rutas (con sus solicitudIds) desde Supabase
export const cargarRutas = createAsyncThunk(
  "rutas/cargar",
  async () => await api.fetchRutas(),
);

// crea una ruta nueva (vacia o con solicitudes ya asignadas)
export const crearRuta = createAsyncThunk(
  "rutas/crear",
  async (input: Omit<Ruta, "id" | "estado">) => await api.insertRuta(input),
);

// agrega una solicitud a una ruta
export const agregarSolicitudARuta = createAsyncThunk(
  "rutas/agregarSolicitud",
  async ({ rutaId, solicitudId }: { rutaId: string; solicitudId: string }) => {
    await api.addSolicitudARuta(rutaId, solicitudId);
    return { rutaId, solicitudId };
  },
);

export const quitarSolicitudDeRuta = createAsyncThunk(
  "rutas/quitarSolicitud",
  async ({ rutaId, solicitudId }: { rutaId: string; solicitudId: string }) => {
    await api.quitarSolicitudDeRuta(rutaId, solicitudId);
    return { rutaId, solicitudId };
  },
);

export const cambiarEstadoRuta = createAsyncThunk(
  "rutas/cambiarEstado",
  async ({ rutaId, estado }: { rutaId: string; estado: EstadoRuta }) => {
    await api.setEstadoRuta(rutaId, estado);
    return { rutaId, estado };
  },
);

export const deleteRuta = createAsyncThunk("rutas/delete", async (rutaId: string) => {
  await api.deleteRuta(rutaId);
  return rutaId;
});

const rutasSlice = createSlice({
  name: "rutas",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(cargarRutas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cargarRutas.fulfilled, (state, action) => {
        state.loading = false;
        state.rutas = action.payload;
      })
      .addCase(cargarRutas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error al cargar rutas";
      })
      .addCase(crearRuta.fulfilled, (state, action) => {
        state.rutas.push(action.payload);
      })
      .addCase(agregarSolicitudARuta.fulfilled, (state, action) => {
        const { rutaId, solicitudId } = action.payload;
        const ruta = state.rutas.find((r) => r.id === rutaId);
        if (ruta && !ruta.solicitudIds.includes(solicitudId)) {
          ruta.solicitudIds.push(solicitudId);
        }
      })
      .addCase(quitarSolicitudDeRuta.fulfilled, (state, action) => {
        const { rutaId, solicitudId } = action.payload;
        const ruta = state.rutas.find((r) => r.id === rutaId);
        if (ruta) {
          ruta.solicitudIds = ruta.solicitudIds.filter((id) => id !== solicitudId);
        }
      })
      .addCase(cambiarEstadoRuta.fulfilled, (state, action) => {
        const { rutaId, estado } = action.payload;
        const ruta = state.rutas.find((r) => r.id === rutaId);
        if (ruta) ruta.estado = estado;
      })
      .addCase(deleteRuta.fulfilled, (state, action) => {
        state.rutas = state.rutas.filter((r) => r.id !== action.payload);
      });
  },
});

export default rutasSlice.reducer;
