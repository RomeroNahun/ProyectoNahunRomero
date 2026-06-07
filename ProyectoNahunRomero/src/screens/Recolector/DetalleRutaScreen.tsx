import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomButton from "../../components/CustomButton";
import ScreenWrapper from "../../components/ScreenWrapper";
import SectionTitle from "../../components/SectionTitle";
import EstadoBadge from "../../components/EstadoBadge";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  agregarSolicitudARuta, quitarSolicitudDeRuta,  cambiarEstadoRuta,
} from "../../store/slices/rutasSlice";
import { cambiarEstado } from "../../store/slices/solicitudesSlice";
import { RootStackParamList } from "../../navigation/StackNavigator";
import {
  ESTADO_RUTA_LABELS,
  TIPO_RESIDUO_LABELS,
} from "../../utils/types/Recoleccion";

type Props = NativeStackScreenProps<RootStackParamList, "DetalleRuta">;

export default function DetalleRutaScreen({ route, navigation }: Props) {
  const dispatch = useAppDispatch();
  const { rutaId } = route.params;
  const { colors } = useTheme();

  const ruta = useAppSelector((state) =>
    state.rutas.rutas.find((r) => r.id === rutaId),
  );
  const solicitudes = useAppSelector((state) => state.solicitudes.solicitudes);

  if (!ruta) {
    return (
      <ScreenWrapper>
        <Text style={{ color: colors.textSecondary }}>Ruta no encontrada</Text>
        <CustomButton
          title="Volver"
          onPress={() => navigation.goBack()}
          variant="secondary"
        />
      </ScreenWrapper>
    );
  }

  // solicitudes que ya pertenecen a esta ruta
  const paradas = ruta.solicitudIds
    .map((id) => solicitudes.find((s) => s.id === id))
    .filter(Boolean);

  // solicitudes pendientes que aun no estan en ninguna ruta-> disponibles para agregar
  const disponibles = solicitudes.filter(
    (s) =>
      (s.estado === "pendiente" || s.estado === "programada") &&
      !ruta.solicitudIds.includes(s.id),
  );

  return (
    <ScreenWrapper>
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.inputBackground,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.nombre, { color: colors.buttonTertiaryText }]}>
          {ruta.nombre}
        </Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          {ESTADO_RUTA_LABELS[ruta.estado]} · {ruta.distanciaKm} km ·{" "}
          {ruta.combustibleEstimado} L
        </Text>
      </View>

      <SectionTitle title="Estado de la ruta" />
      <View style={styles.rolRow}>
        <CustomButton
          title="Iniciar"
          onPress={() =>
            dispatch(cambiarEstadoRuta({ rutaId: ruta.id, estado: "en_curso" }))
          }
          variant={ruta.estado === "en_curso" ? "primary" : "tertiary"}
        />
        <CustomButton
          title="Completar"
          onPress={() =>
            dispatch(
              cambiarEstadoRuta({ rutaId: ruta.id, estado: "completada" }),
            )
          }
          variant={ruta.estado === "completada" ? "primary" : "tertiary"}
        />
      </View>

      <SectionTitle title={`Paradas (${paradas.length})`} />
      {paradas.length === 0 ? (
        <Text style={[styles.empty, { color: colors.textSecondary }]}>
          Esta ruta no tiene paradas todavía.
        </Text>
      ) : (
        paradas.map((s, index) => (
          <View
            key={s!.id}
            style={[
              styles.parada,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[styles.stepBadge, { backgroundColor: colors.secondary }]}
            >
              <Text style={styles.stepNumber}>{index + 1}</Text>
            </View>
            <View style={styles.paradaInfo}>
              <Text
                style={[styles.paradaDir, { color: colors.buttonTertiaryText }]}
              >
                {s!.direccion}
              </Text>
              <Text
                style={[styles.paradaTipo, { color: colors.textSecondary }]}
              >
                {TIPO_RESIDUO_LABELS[s!.tipoResiduo]}
              </Text>
              <EstadoBadge estado={s!.estado} />
            </View>
            <View style={styles.paradaActions}>
              <TouchableOpacity
                onPress={() =>
                  dispatch(cambiarEstado({ id: s!.id, estado: "recolectada" }))
                }
              >
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={colors.secondary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  dispatch(
                    quitarSolicitudDeRuta({
                      rutaId: ruta.id,
                      solicitudId: s!.id,
                    }),
                  )
                }
              >
                <Ionicons name="close-circle" size={24} color={colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}

      {disponibles.length > 0 && (
        <>
          <SectionTitle title="Agregar paradas" />
          {disponibles.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={[styles.addItem, { borderColor: colors.secondary }]}
              onPress={() => {
                dispatch(
                  agregarSolicitudARuta({ rutaId: ruta.id, solicitudId: s.id }),
                );
                dispatch(cambiarEstado({ id: s.id, estado: "en_ruta" }));
              }}
            >
              <Ionicons
                name="add-circle-outline"
                size={20}
                color={colors.secondary}
              />
              <Text
                style={[
                  styles.addItemText,
                  { color: colors.buttonTertiaryText },
                ]}
              >
                {s.direccion} · {TIPO_RESIDUO_LABELS[s.tipoResiduo]}
              </Text>
            </TouchableOpacity>
          ))}
        </>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    borderRadius: 9,
    borderWidth: 1,
    padding: 16,
    marginBottom: 8,
  },
  nombre: {
    fontSize: 20,
    fontWeight: "700",
  },
  meta: {
    fontSize: 13,
    marginTop: 4,
  },
  rolRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  empty: {
    fontSize: 13,
    fontStyle: "italic",
  },
  parada: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 9,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumber: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  paradaInfo: {
    flex: 1,
    gap: 4,
  },
  paradaDir: {
    fontSize: 14,
    fontWeight: "600",
  },
  paradaTipo: {
    fontSize: 11,
  },
  paradaActions: {
    flexDirection: "row",
    gap: 8,
  },
  addItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
    gap: 8,
  },
  addItemText: {
    fontSize: 13,
    flexShrink: 1,
  },
});
