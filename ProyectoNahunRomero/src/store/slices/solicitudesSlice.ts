import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EstadoSolicitud, Solicitud } from "../../utils/types/Recoleccion";

type SolicitudesState = {
  solicitudes: Solicitud[];
};

const initialState: SolicitudesState = {
  solicitudes: [],
};

const solicitudesSlice = createSlice({
  name: "solicitudes",
  initialState,
  reducers: {
    // crea una nueva solicitud; el id y la fecha se generan aqui
    addSolicitud: (
      state,
      action: PayloadAction<Omit<Solicitud, "id" | "estado" | "creadaEn">>,
    ) => {
      const nueva: Solicitud = {
        ...action.payload,
        id: Date.now().toString(),
        // si es inmediata queda pendiente, si lleva hora queda programada
        estado: action.payload.prioridad === "programada" ? "programada" : "pendiente",
        creadaEn: Date.now(),
      };
      state.solicitudes.push(nueva);
    },
    // actualiza propiedades de una solicitud por su id (posicion en el arreglo)
    updateSolicitud: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Solicitud> }>,
    ) => {
      const { id, updates } = action.payload;
      const index = state.solicitudes.findIndex((s) => s.id === id);
      if (index !== -1) {
        state.solicitudes[index] = { ...state.solicitudes[index], ...updates };
      }
    },
    // cambia unicamente el estado de la solicitud
    cambiarEstado: (
      state,
      action: PayloadAction<{ id: string; estado: EstadoSolicitud }>,
    ) => {
      const { id, estado } = action.payload;
      const index = state.solicitudes.findIndex((s) => s.id === id);
      if (index !== -1) {
        state.solicitudes[index].estado = estado;
      }
    },
    deleteSolicitud: (state, action: PayloadAction<string>) => {
      state.solicitudes = state.solicitudes.filter((s) => s.id !== action.payload);
    },
  },
});

export const { addSolicitud, updateSolicitud, cambiarEstado, deleteSolicitud } =
  solicitudesSlice.actions;

export default solicitudesSlice.reducer;
