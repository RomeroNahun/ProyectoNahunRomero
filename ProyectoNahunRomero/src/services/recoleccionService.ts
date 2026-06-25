import { decode } from "base64-arraybuffer";
import { File } from "expo-file-system";
import { supabase } from "./supabaseClient";
import { env } from "../config/env";
import {
  EstadoRuta,
  EstadoSolicitud,
  Ruta,
  Solicitud,
  UserProfile,
} from "../utils/types/Recoleccion";

// ============================================================
// Tipos de fila tal como vienen de la base de datos (snake_case)
// ============================================================
// datos del residente embebidos via join con profiles
type SolicitanteRow = {
  nombre: string | null;
  telefono: string | null;
  direccion: string | null;
} | null;

type SolicitudRow = {
  id: string;
  direccion: string;
  tipo_residuo: Solicitud["tipoResiduo"];
  prioridad: Solicitud["prioridad"];
  estado: EstadoSolicitud;
  hora_programada: string;
  notas: string;
  creada_en: string;
  foto_url: string | null;
  residente?: SolicitanteRow;
};

type RutaRow = {
  id: string;
  nombre: string;
  estado: EstadoRuta;
  distancia_km: number;
  combustible_estimado: number;
};

type ProfileRow = {
  nombre: string;
  telefono: string;
  direccion: string;
  rol: UserProfile["rol"];
  vehiculo: string;
};

// ============================================================
// Mapeos fila (DB) <-> tipo de la app (camelCase)
// ============================================================
const mapSolicitud = (r: SolicitudRow): Solicitud => ({
  id: r.id,
  direccion: r.direccion,
  tipoResiduo: r.tipo_residuo,
  prioridad: r.prioridad,
  estado: r.estado,
  horaProgramada: r.hora_programada ?? "",
  notas: r.notas ?? "",
  creadaEn: new Date(r.creada_en).getTime(),
  fotoUrl: r.foto_url ?? undefined,
  solicitante: r.residente
    ? {
        nombre: r.residente.nombre ?? "",
        telefono: r.residente.telefono ?? "",
        direccion: r.residente.direccion ?? "",
      }
    : undefined,
});

const mapRuta = (r: RutaRow, solicitudIds: string[]): Ruta => ({
  id: r.id,
  nombre: r.nombre,
  estado: r.estado,
  solicitudIds,
  distanciaKm: Number(r.distancia_km),
  combustibleEstimado: Number(r.combustible_estimado),
});

// lanza el error de Supabase para que el thunk lo capture con rejectWithValue
const check = <T>(data: T | null, error: { message: string } | null): T => {
  if (error) throw new Error(error.message);
  return data as T;
};

// ============================================================
// SOLICITUDES
// ============================================================
// si se pasa residenteId, devuelve solo las solicitudes de ese usuario;
// si no, devuelve todas (lo usa el recolector)
export const fetchSolicitudes = async (
  residenteId?: string,
): Promise<Solicitud[]> => {
  let query = supabase
    .from("solicitudes")
    .select(
      "*, residente:profiles!residente_id(nombre, telefono, direccion)",
    )
    .order("creada_en", { ascending: true });

  if (residenteId) query = query.eq("residente_id", residenteId);

  const { data, error } = await query;
  return check(data as SolicitudRow[], error).map(mapSolicitud);
};

export const insertSolicitud = async (
  input: Omit<Solicitud, "id" | "estado" | "creadaEn">,
): Promise<Solicitud> => {
  // si es programada queda "programada", si no, "pendiente"
  const estado: EstadoSolicitud =
    input.prioridad === "programada" ? "programada" : "pendiente";

  // asocia la solicitud al usuario autenticado que la crea
  const { data: userData } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("solicitudes")
    .insert({
      direccion: input.direccion,
      tipo_residuo: input.tipoResiduo,
      prioridad: input.prioridad,
      estado,
      hora_programada: input.horaProgramada,
      notas: input.notas,
      foto_url: input.fotoUrl ?? null,
      residente_id: userData.user?.id ?? null,
    })
    .select()
    .single();
  return mapSolicitud(check(data as SolicitudRow, error));
};

// ============================================================
// STORAGE (fotos de solicitudes)
// ============================================================
// Sube una imagen local al bucket configurado y devuelve su URL publica.
// Se lee como base64 y se convierte a ArrayBuffer, que es la forma fiable de
// subir binarios desde React Native.
export const uploadFotoSolicitud = async (uri: string): Promise<string> => {
  const base64 = await new File(uri).base64();
  // conserva la extension original del archivo
  const dot = uri.lastIndexOf(".");
  const ext = dot > -1 ? uri.slice(dot) : ".jpg";
  const random = Math.random().toString(36).slice(2, 8);
  const path = `${Date.now()}-${random}${ext}`;

  const { error } = await supabase.storage
    .from(env.supabaseBucket)
    .upload(path, decode(base64), {
      contentType: "image/jpeg",
      upsert: false,
    });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(env.supabaseBucket).getPublicUrl(path);
  return data.publicUrl;
};

export const updateSolicitud = async (
  id: string,
  updates: Partial<Solicitud>,
): Promise<Solicitud> => {
  const patch: Record<string, unknown> = {};
  if (updates.direccion !== undefined) patch.direccion = updates.direccion;
  if (updates.tipoResiduo !== undefined) patch.tipo_residuo = updates.tipoResiduo;
  if (updates.prioridad !== undefined) patch.prioridad = updates.prioridad;
  if (updates.estado !== undefined) patch.estado = updates.estado;
  if (updates.horaProgramada !== undefined)
    patch.hora_programada = updates.horaProgramada;
  if (updates.notas !== undefined) patch.notas = updates.notas;

  const { data, error } = await supabase
    .from("solicitudes")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  return mapSolicitud(check(data as SolicitudRow, error));
};

export const setEstadoSolicitud = async (
  id: string,
  estado: EstadoSolicitud,
): Promise<Solicitud> => updateSolicitud(id, { estado });

export const deleteSolicitud = async (id: string): Promise<void> => {
  const { error } = await supabase.from("solicitudes").delete().eq("id", id);
  if (error) throw new Error(error.message);
};

// ============================================================
// RUTAS
// ============================================================
export const fetchRutas = async (): Promise<Ruta[]> => {
  const [{ data: rutas, error: errRutas }, { data: rel, error: errRel }] =
    await Promise.all([
      supabase.from("rutas").select("*").order("created_at", { ascending: true }),
      supabase.from("ruta_solicitudes").select("ruta_id, solicitud_id"),
    ]);

  const filas = check(rutas as RutaRow[], errRutas);
  const relaciones = check(
    rel as { ruta_id: string; solicitud_id: string }[],
    errRel,
  );

  return filas.map((r) =>
    mapRuta(
      r,
      relaciones.filter((x) => x.ruta_id === r.id).map((x) => x.solicitud_id),
    ),
  );
};

export const insertRuta = async (
  input: Omit<Ruta, "id" | "estado">,
): Promise<Ruta> => {
  const { data: userData } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("rutas")
    .insert({
      nombre: input.nombre,
      distancia_km: input.distanciaKm,
      combustible_estimado: input.combustibleEstimado,
      recolector_id: userData.user?.id ?? null,
    })
    .select()
    .single();

  const ruta = mapRuta(check(data as RutaRow, error), []);

  // vincula las solicitudes iniciales (si las hubiera)
  for (const solicitudId of input.solicitudIds) {
    await addSolicitudARuta(ruta.id, solicitudId);
  }
  return { ...ruta, solicitudIds: input.solicitudIds };
};

export const addSolicitudARuta = async (
  rutaId: string,
  solicitudId: string,
): Promise<void> => {
  const { error } = await supabase
    .from("ruta_solicitudes")
    .upsert(
      { ruta_id: rutaId, solicitud_id: solicitudId },
      { onConflict: "ruta_id,solicitud_id", ignoreDuplicates: true },
    );
  if (error) throw new Error(error.message);
};

export const quitarSolicitudDeRuta = async (
  rutaId: string,
  solicitudId: string,
): Promise<void> => {
  const { error } = await supabase
    .from("ruta_solicitudes")
    .delete()
    .eq("ruta_id", rutaId)
    .eq("solicitud_id", solicitudId);
  if (error) throw new Error(error.message);
};

export const setEstadoRuta = async (
  rutaId: string,
  estado: EstadoRuta,
): Promise<void> => {
  const { error } = await supabase
    .from("rutas")
    .update({ estado })
    .eq("id", rutaId);
  if (error) throw new Error(error.message);
};

export const deleteRuta = async (rutaId: string): Promise<void> => {
  const { error } = await supabase.from("rutas").delete().eq("id", rutaId);
  if (error) throw new Error(error.message);
};

// ============================================================
// PERFIL
// ============================================================
export const fetchProfile = async (
  userId: string,
): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("nombre, telefono, direccion, rol, vehiculo")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const r = data as ProfileRow;
  return {
    nombre: r.nombre ?? "",
    telefono: r.telefono ?? "",
    direccion: r.direccion ?? "",
    rol: r.rol,
    vehiculo: r.vehiculo ?? "",
  };
};

export const upsertProfile = async (
  userId: string,
  profile: Partial<UserProfile>,
): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from("profiles")
    .upsert({ id: userId, ...profile })
    .select("nombre, telefono, direccion, rol, vehiculo")
    .single();
  const r = check(data as ProfileRow, error);
  return {
    nombre: r.nombre ?? "",
    telefono: r.telefono ?? "",
    direccion: r.direccion ?? "",
    rol: r.rol,
    vehiculo: r.vehiculo ?? "",
  };
};

// Garantiza que el perfil tenga datos: si no existe o esta vacio, lo rellena
// con los valores de respaldo (que vienen de los metadatos de Auth). No pisa
// un nombre ya guardado, para respetar lo que el usuario haya editado.
export const ensureProfile = async (
  userId: string,
  fallback: { nombre: string; telefono: string; rol: UserProfile["rol"] },
): Promise<void> => {
  const existing = await fetchProfile(userId);
  if (existing?.nombre) return; // ya tiene datos, no tocamos nada
  await upsertProfile(userId, {
    nombre: existing?.nombre || fallback.nombre,
    telefono: existing?.telefono || fallback.telefono,
    rol: fallback.rol,
  });
};
