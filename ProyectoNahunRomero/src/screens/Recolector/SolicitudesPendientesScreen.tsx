import { Text, StyleSheet } from "react-native";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = CompositeScreenProps<
  BottomTabScreenProps<RecolectorTabsParamList, "Pendientes">,
  NativeStackScreenProps<RootStackParamList>
>;

export default function SolicitudesPendientesScreen({ navigation }: Props) {
  const solicitudes = useAppSelector((state) => state.solicitudes.solicitudes);
  const { colors } = useTheme();

  // el recolector solo necesita ver las que faltan por recolectar
  const pendientes = solicitudes.filter(
    (s) =>
      s.estado === "pendiente" ||
      s.estado === "programada" ||
      s.estado === "en_ruta",
  );

  return (
    <ScreenWrapper>
      <SectionTitle
        title="Solicitudes pendientes"
        subtitle="Vecinos que necesitan recolección"
      />

      {pendientes.length === 0 ? (
        <Text style={[styles.empty, { color: colors.textSecondary }]}>
          No hay solicitudes pendientes por ahora.
        </Text>
      ) : (
        pendientes.map((solicitud) => (
          <SolicitudCard
            key={solicitud.id}
            solicitud={solicitud}
            onPress={() =>
              navigation.navigate("DetalleSolicitud", { solicitudId: solicitud.id })
            }
          />
        ))
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  empty: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
});
