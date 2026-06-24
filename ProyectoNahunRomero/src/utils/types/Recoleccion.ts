// Rol del usuario dentro de la app.
export type Rol = "residente" | "recolector";

// Tipo de residuo que se desea recolectar
export type TipoResiduo =
  | "organica"
  | "inorganica"
  | "reciclable"
  | "electronica"
  | "voluminosa"
  | "otro";

// Prioridad de la solicitud: llamado inmediato o programado para cierta hora
export type Prioridad = "inmediata" | "programada";

// Estado en el que se encuentra una solicitud de recoleccion
export type EstadoSolicitud =
  | "pendiente"
  | "programada"
  | "en_ruta"
  | "recolectada"
  | "cancelada";

// Estado de una ruta del recolector
export type EstadoRuta = "planificada" | "en_curso" | "completada";

// Entidad central: una solicitud para que pasen a recolectar la basura
export type Solicitud = {
  id: string;
  direccion: string;
  tipoResiduo: TipoResiduo;
  prioridad: Prioridad;
  estado: EstadoSolicitud;
  horaProgramada: string;
  notas: string;
  creadaEn: number;
  // URL publica de la foto adjunta en Supabase Storage (opcional)
  fotoUrl?: string;
};

// Ruta optimizada que agrupa varias solicitudes para ahorrar combustible
export type Ruta = {
  id: string;
  nombre: string;
  estado: EstadoRuta;
  solicitudIds: string[];
  distanciaKm: number;
  combustibleEstimado: number; // litros estimados
};

// Perfil del usuario (residente o recolector)
export type UserProfile = {
  nombre: string;
  telefono: string;
  direccion: string;
  rol: Rol;
  vehiculo: string; // solo aplica para recolectores
};

// ---- Listas utilitarias para iterar en formularios ----
export const TIPOS_RESIDUO: TipoResiduo[] = [
  "organica",
  "inorganica",
  "reciclable",
  "electronica",
  "voluminosa",
  "otro",
];

export const ROLES: Rol[] = ["residente", "recolector"];

// ---- Diccionarios de etiquetas legibles (en español) ----
export const TIPO_RESIDUO_LABELS: Record<TipoResiduo, string> = {
  organica: "Orgánica",
  inorganica: "Inorgánica",
  reciclable: "Reciclable",
  electronica: "Electrónica",
  voluminosa: "Voluminosa",
  otro: "Otro",
};

export const PRIORIDAD_LABELS: Record<Prioridad, string> = {
  inmediata: "Inmediata",
  programada: "Programada",
};

export const ESTADO_SOLICITUD_LABELS: Record<EstadoSolicitud, string> = {
  pendiente: "Pendiente",
  programada: "Programada",
  en_ruta: "En ruta",
  recolectada: "Recolectada",
  cancelada: "Cancelada",
};

export const ESTADO_RUTA_LABELS: Record<EstadoRuta, string> = {
  planificada: "Planificada",
  en_curso: "En curso",
  completada: "Completada",
};

export const ROL_LABELS: Record<Rol, string> = {
  residente: "Residente",
  recolector: "Recolector",
};
