import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import {
  Solicitud,
  TIPO_RESIDUO_LABELS,
  PRIORIDAD_LABELS,
} from "../utils/types/Recoleccion";
import EstadoBadge from "./EstadoBadge";

type SolicitudCardProps = {
  solicitud: Solicitud;
  onPress: () => void;
};

export default function SolicitudCard({ solicitud, onPress }: SolicitudCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={[styles.direccion, { color: colors.buttonTertiaryText }]}>
            {solicitud.direccion}
          </Text>
          <Text style={[styles.tipo, { color: colors.secondary }]}>
            {TIPO_RESIDUO_LABELS[solicitud.tipoResiduo]} ·{" "}
            {PRIORIDAD_LABELS[solicitud.prioridad]}
          </Text>
          {solicitud.horaProgramada ? (
            <Text style={[styles.hora, { color: colors.textSecondary }]}>
              Hora: {solicitud.horaProgramada}
            </Text>
          ) : null}
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.secondary} />
      </View>
      <View style={styles.footer}>
        <EstadoBadge estado={solicitud.estado} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 9,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  info: {
    flex: 1,
  },
  direccion: {
    fontSize: 16,
    fontWeight: "600",
  },
  tipo: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  hora: {
    fontSize: 12,
    marginTop: 2,
  },
  footer: {
    marginTop: 10,
  },
});
