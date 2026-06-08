import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EstadoRuta, Ruta } from "../../utils/types/Recoleccion";

type RutasState = {
  rutas: Ruta[];
};

const initialState: RutasState = {
  rutas: [
    {
      id: "default-1",
      nombre: "Ruta por la Mañana",
      estado: "planificada",
      solicitudIds: [],
      distanciaKm: 10.5,
      combustibleEstimado: 5,
    },
    {
      id: "default-2",
      nombre: "Ruta por la Tarde",
      estado: "planificada",
      solicitudIds: [],
      distanciaKm: 15.2,
      combustibleEstimado: 8,
    },
  ],
};

const rutasSlice = createSlice({
  name: "rutas",
  initialState,
  reducers: {
    // crea una ruta nueva (vacia o con solicitudes ya asignadas)
    crearRuta: (
      state,
      action: PayloadAction<Omit<Ruta, "id" | "estado">>,
    ) => {
      const nueva: Ruta = {
        ...action.payload,
        id: Date.now().toString(),
        estado: "planificada",
      };
      state.rutas.push(nueva);
    },
    // agrega una solicitud a una ruta si aun no esta incluida
    agregarSolicitudARuta: (
      state,
      action: PayloadAction<{ rutaId: string; solicitudId: string }>,
    ) => {
      const { rutaId, solicitudId } = action.payload;
      const ruta = state.rutas.find((r) => r.id === rutaId);
      if (ruta && !ruta.solicitudIds.includes(solicitudId)) {
        ruta.solicitudIds.push(solicitudId);
      }
    },
    quitarSolicitudDeRuta: (
      state,
      action: PayloadAction<{ rutaId: string; solicitudId: string }>,
    ) => {
      const { rutaId, solicitudId } = action.payload;
      const ruta = state.rutas.find((r) => r.id === rutaId);
      if (ruta) {
        ruta.solicitudIds = ruta.solicitudIds.filter((id) => id !== solicitudId);
      }
    },
    cambiarEstadoRuta: (
      state,
      action: PayloadAction<{ rutaId: string; estado: EstadoRuta }>,
    ) => {
      const { rutaId, estado } = action.payload;
      const ruta = state.rutas.find((r) => r.id === rutaId);
      if (ruta) {
        ruta.estado = estado;
      }
    },
    deleteRuta: (state, action: PayloadAction<string>) => {
      state.rutas = state.rutas.filter((r) => r.id !== action.payload);
    },
  },
});

export const {
  crearRuta,
  agregarSolicitudARuta,
  quitarSolicitudDeRuta,
  cambiarEstadoRuta,
  deleteRuta,
} = rutasSlice.actions;

export default rutasSlice.reducer;
