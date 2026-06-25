import { useState } from "react";
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomButton from "../../components/CustomButton";
import ScreenWrapper from "../../components/ScreenWrapper";
import SectionTitle from "../../components/SectionTitle";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  agregarSolicitudARuta,
  cambiarEstadoRuta,
} from "../../store/slices/rutasSlice";
import {
  cambiarEstado,
  updateSolicitud,
} from "../../store/slices/solicitudesSlice";
import { RootStackParamList } from "../../navigation/StackNavigator";
import {
  ESTADO_RUTA_LABELS,
  Solicitud,
  TIPO_RESIDUO_LABELS,
} from "../../utils/types/Recoleccion";

type Props = NativeStackScreenProps<RootStackParamList, "DetalleRuta">;

const RAZONES_NO_RECOLECCION = [
  "No se encontro el desecho",
  "Direccion inaccesible",
  "Residuo no permitido",
  "Residente no disponible",
  "Otra",
];

const isSolicitud = (value: Solicitud | undefined): value is Solicitud =>
  value !== undefined;

export default function DetalleRutaScreen({ route, navigation }: Props) {
  const dispatch = useAppDispatch();
  const { rutaId } = route.params;
  const { colors, isDark } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [solicitudNoRecolectada, setSolicitudNoRecolectada] =
    useState<Solicitud | null>(null);
  const [razonSeleccionada, setRazonSeleccionada] = useState(
    RAZONES_NO_RECOLECCION[0],
  );
  const [razonOtra, setRazonOtra] = useState("");

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
    .filter(isSolicitud);

  // solicitudes pendientes que aun no estan en ninguna ruta-> disponibles para agregar
  const disponibles = solicitudes.filter(
    (s) =>
      (s.estado === "pendiente" || s.estado === "programada") &&
      !ruta.solicitudIds.includes(s.id),
  );

  const abrirModalNoRecolectada = (solicitud: Solicitud) => {
    setSolicitudNoRecolectada(solicitud);
    setRazonSeleccionada(RAZONES_NO_RECOLECCION[0]);
    setRazonOtra("");
    setModalVisible(true);
  };

  const cerrarModalNoRecolectada = () => {
    setModalVisible(false);
    setSolicitudNoRecolectada(null);
    setRazonOtra("");
  };

  const toggleRecolectada = (solicitud: Solicitud) => {
    const siguienteEstado =
      solicitud.estado === "recolectada" ? "en_ruta" : "recolectada";
    dispatch(cambiarEstado({ id: solicitud.id, estado: siguienteEstado }));
  };

  const toggleNoRecolectada = (solicitud: Solicitud) => {
    if (solicitud.estado === "cancelada") {
      dispatch(cambiarEstado({ id: solicitud.id, estado: "en_ruta" }));
      return;
    }

    abrirModalNoRecolectada(solicitud);
  };

  const confirmarNoRecolectada = () => {
    if (!solicitudNoRecolectada) return;

    const razon =
      razonSeleccionada === "Otra" ? razonOtra.trim() : razonSeleccionada;
    if (!razon) {
      Alert.alert("Razón requerida", "Especifica por qué no se recolectó.");
      return;
    }

    const notasActuales = solicitudNoRecolectada.notas.trim();
    const notas = notasActuales
      ? `${notasActuales}\nNo recolectada: ${razon}`
      : `No recolectada: ${razon}`;

    dispatch(
      updateSolicitud({
        id: solicitudNoRecolectada.id,
        updates: { estado: "cancelada", notas },
      }),
    );
    cerrarModalNoRecolectada();
  };

  const getEstadoVisual = (solicitud: Solicitud) => {
    if (solicitud.estado === "recolectada") {
      return {
        icon: "checkmark-circle" as const,
        label: "Recolectada",
        color: "#16a34a",
      };
    }

    if (solicitud.estado === "cancelada") {
      return {
        icon: "close-circle" as const,
        label: "No recolectada",
        color: colors.error,
      };
    }

    return {
      icon: "time-outline" as const,
      label: "En ruta\nPendiente",
      color: "#f59e0b",
    };
  };

  const noRecolectadaBg = isDark ? "#3b161a" : "#fee2e2";
  const noRecolectarButtonBg = isDark ? "#341a1d" : "#fef2f2";

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
            key={s.id}
            style={[
              styles.parada,
              {
                backgroundColor:
                  s.estado === "cancelada" ? noRecolectadaBg : colors.inputBackground,
                borderColor:
                  s.estado === "cancelada" ? colors.error : colors.border,
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
                {s.direccion}
              </Text>
              <Text
                style={[styles.paradaTipo, { color: colors.textSecondary }]}
              >
                {TIPO_RESIDUO_LABELS[s.tipoResiduo]}
              </Text>
              <View style={styles.paradaButtons}>
                <TouchableOpacity
                  disabled={s.estado === "cancelada"}
                  onPress={() => toggleRecolectada(s)}
                  style={[
                    styles.estadoButton,
                    {
                      backgroundColor:
                        s.estado === "recolectada"
                          ? colors.secondary
                          : colors.buttonTertiaryBg,
                      opacity: s.estado === "cancelada" ? 0.45 : 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.estadoButtonText,
                      {
                        color:
                          s.estado === "recolectada"
                            ? colors.onSecondary
                            : colors.buttonTertiaryText,
                      },
                    ]}
                  >
                    {s.estado === "recolectada" ? "Recolectado" : "Recolectar"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => toggleNoRecolectada(s)}
                  style={[
                    styles.estadoButton,
                    styles.noRecolectarButton,
                    {
                      backgroundColor:
                        s.estado === "cancelada" ? colors.error : noRecolectarButtonBg,
                      borderColor:
                        s.estado === "cancelada" ? colors.error : "#fecaca",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.estadoButtonText,
                      {
                        color:
                          s.estado === "cancelada" ? "#ffffff" : colors.error,
                      },
                    ]}
                  >
                    {s.estado === "cancelada" ? "Recolectar" : "No recolectar"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.estadoVisual}>
              {(() => {
                const estadoVisual = getEstadoVisual(s);
                return (
                  <>
                    <Ionicons
                      name={estadoVisual.icon}
                      size={26}
                      color={estadoVisual.color}
                    />
                    <Text
                      style={[
                        styles.estadoVisualText,
                        { color: estadoVisual.color },
                      ]}
                    >
                      {estadoVisual.label}
                    </Text>
                  </>
                );
              })()}
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

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={cerrarModalNoRecolectada}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Motivo de no recolección
            </Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Selecciona una razón para dejar registro.
            </Text>

            <View style={styles.reasonList}>
              {RAZONES_NO_RECOLECCION.map((razon) => (
                <TouchableOpacity
                  key={razon}
                  onPress={() => setRazonSeleccionada(razon)}
                  style={[
                    styles.reasonOption,
                    {
                      backgroundColor:
                        razonSeleccionada === razon
                          ? colors.buttonPrimaryBg
                          : colors.buttonTertiaryBg,
                      borderColor:
                        razonSeleccionada === razon
                          ? colors.buttonPrimaryBg
                          : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.reasonText,
                      {
                        color:
                          razonSeleccionada === razon
                            ? colors.buttonPrimaryText
                            : colors.buttonTertiaryText,
                      },
                    ]}
                  >
                    {razon}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {razonSeleccionada === "Otra" && (
              <TextInput
                value={razonOtra}
                onChangeText={setRazonOtra}
                placeholder="Especifica la razón"
                placeholderTextColor={colors.textSecondary}
                style={[
                  styles.reasonInput,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
              />
            )}

            <View style={styles.modalActions}>
              <CustomButton
                title="Cancelar"
                onPress={cerrarModalNoRecolectada}
                variant="tertiary"
                style={styles.modalButton}
              />
              <CustomButton
                title="Guardar"
                onPress={confirmarNoRecolectada}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  paradaButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  estadoButton: {
    minWidth: 108,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  noRecolectarButton: {
    borderWidth: 1,
  },
  estadoButtonText: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  estadoVisual: {
    width: 76,
    alignItems: "center",
    gap: 4,
  },
  estadoVisualText: {
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 12,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 10,
    borderWidth: 1,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  modalSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  reasonList: {
    gap: 8,
    marginTop: 14,
  },
  reasonOption: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  reasonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  reasonInput: {
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 14,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 16,
  },
  modalButton: {
    width: 120,
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
