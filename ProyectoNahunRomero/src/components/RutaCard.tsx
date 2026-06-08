import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { Ruta, ESTADO_RUTA_LABELS } from "../utils/types/Recoleccion";

type RutaCardProps = {
  ruta: Ruta;
  onPress: () => void;
};

export default function RutaCard({ ruta, onPress }: RutaCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={[styles.nombre, { color: colors.buttonTertiaryText }]}>
            {ruta.nombre}
          </Text>
          <Text style={[styles.estado, { color: colors.secondary }]}>
            {ESTADO_RUTA_LABELS[ruta.estado]}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.secondary} />
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Ionicons name="location" size={16} color={colors.textSecondary} />
          <Text style={[styles.statText, { color: colors.textSecondary }]}>
            {ruta.solicitudIds.length} paradas
          </Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="navigate" size={16} color={colors.textSecondary} />
          <Text style={[styles.statText, { color: colors.textSecondary }]}>
            {ruta.distanciaKm} km
          </Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="flame" size={16} color={colors.textSecondary} />
          <Text style={[styles.statText, { color: colors.textSecondary }]}>
            {ruta.combustibleEstimado} L
          </Text>
        </View>
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
  nombre: {
    fontSize: 16,
    fontWeight: "600",
  },
  estado: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  stats: {
    flexDirection: "row",
    marginTop: 10,
    gap: 16,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
  },
});
