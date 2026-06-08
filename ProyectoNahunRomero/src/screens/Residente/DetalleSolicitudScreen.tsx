import { View, Text, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomButton from "../../components/CustomButton";
import ScreenWrapper from "../../components/ScreenWrapper";
import SectionTitle from "../../components/SectionTitle";
import EstadoBadge from "../../components/EstadoBadge";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { cambiarEstado, deleteSolicitud } from "../../store/slices/solicitudesSlice";
import { RootStackParamList } from "../../navigation/StackNavigator";
import {
  TIPO_RESIDUO_LABELS,
  PRIORIDAD_LABELS,
} from "../../utils/types/Recoleccion";

type Props = NativeStackScreenProps<RootStackParamList, "DetalleSolicitud">;

export default function DetalleSolicitudScreen({ route, navigation }: Props) {
  const dispatch = useAppDispatch();
  const { solicitudId } = route.params;
  const { colors } = useTheme();

  const solicitud = useAppSelector((state) =>
    state.solicitudes.solicitudes.find((s) => s.id === solicitudId),
  );

  if (!solicitud) {
    return (
      <ScreenWrapper>
        <Text style={{ color: colors.textSecondary }}>Solicitud no encontrada</Text>
        <CustomButton
          title="Volver"
          onPress={() => navigation.goBack()}
          variant="secondary"
        />
      </ScreenWrapper>
    );
  }

  const handleCancelar = () => {
    dispatch(cambiarEstado({ id: solicitud.id, estado: "cancelada" }));
  };

  const handleEliminar = () => {
    dispatch(deleteSolicitud(solicitud.id));
    navigation.goBack();
  };

  return (
    <ScreenWrapper>
      <View style={[styles.header, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
        <Text style={[styles.direccion, { color: colors.buttonTertiaryText }]}>
          {solicitud.direccion}
        </Text>
        <EstadoBadge estado={solicitud.estado} />
      </View>

      <SectionTitle title="Detalle" />
      <View style={[styles.box, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
        <Row label="Tipo de residuo" value={TIPO_RESIDUO_LABELS[solicitud.tipoResiduo]} />
        <Row label="Prioridad" value={PRIORIDAD_LABELS[solicitud.prioridad]} />
        {solicitud.horaProgramada ? (
          <Row label="Hora programada" value={solicitud.horaProgramada} />
        ) : null}
        <Row label="Notas" value={solicitud.notas || "Sin notas"} />
      </View>

      <View style={styles.actions}>
        <CustomButton
          title="Cancelar solicitud"
          onPress={handleCancelar}
          variant="secondary"
        />
        <CustomButton
          title="Eliminar"
          onPress={handleEliminar}
          variant="tertiary"
        />
      </View>
    </ScreenWrapper>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: colors.buttonTertiaryText }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    borderRadius: 9,
    borderWidth: 1,
    padding: 16,
    marginBottom: 8,
    gap: 8,
  },
  direccion: {
    fontSize: 20,
    fontWeight: "700",
  },
  box: {
    borderRadius: 9,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  rowLabel: {
    fontSize: 13,
  },
  rowValue: {
    fontSize: 13,
    fontWeight: "600",
    flexShrink: 1,
    textAlign: "right",
    marginLeft: 12,
  },
  actions: {
    gap: 10,
  },
});
