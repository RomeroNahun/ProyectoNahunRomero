import { Text, View, StyleSheet } from "react-native";
import { EstadoSolicitud, ESTADO_SOLICITUD_LABELS } from "../utils/types/Recoleccion";

type EstadoBadgeProps = {
  estado: EstadoSolicitud;
};

// color de fondo segun el estado de la solicitud
const ESTADO_COLORS: Record<EstadoSolicitud, string> = {
  pendiente: "#f59e0b",
  programada: "#3b82f6",
  en_ruta: "#22c55e",
  recolectada: "#15803d",
  cancelada: "#ef4444",
};

export default function EstadoBadge({ estado }: EstadoBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: ESTADO_COLORS[estado] }]}>
      <Text style={styles.text}>{ESTADO_SOLICITUD_LABELS[estado]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  text: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
});
