import { View, Text, StyleSheet } from "react-native";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomButton from "../../components/CustomButton";
import ScreenWrapper from "../../components/ScreenWrapper";
import SectionTitle from "../../components/SectionTitle";

type Props = CompositeScreenProps<
  BottomTabScreenProps<ResidenteTabsParamList, "Inicio">,
  NativeStackScreenProps<RootStackParamList>
>;

export default function HomeScreen({ navigation }: Props) {
  const solicitudes = useAppSelector((state) => state.solicitudes.solicitudes);
  const profile = useAppSelector((state) => state.userProfile);

  const { user } = useAuth();
  const { colors } = useTheme();

  const pendientes = solicitudes.filter(
    (s) => s.estado === "pendiente" || s.estado === "programada",
  );
  const recolectadas = solicitudes.filter((s) => s.estado === "recolectada");

  return (
    <ScreenWrapper>
      <Text style={[styles.greeting, { color: colors.primary }]}>
        {i18n.t("welcome")}, {profile.nombre || user?.email}
      </Text>
      <Text style={[styles.subGreeting, { color: colors.textSecondary }]}>
        Gestiona la recolección de tu basura
      </Text>

      <View style={styles.statsRow}>
        <View style={[styles.stat, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
          <Text style={[styles.statNum, { color: colors.secondary }]}>
            {solicitudes.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Solicitudes
          </Text>
        </View>
        <View style={[styles.stat, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
          <Text style={[styles.statNum, { color: colors.secondary }]}>
            {pendientes.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Pendientes
          </Text>
        </View>
        <View style={[styles.stat, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
          <Text style={[styles.statNum, { color: colors.secondary }]}>
            {recolectadas.length}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Recolectadas
          </Text>
        </View>
      </View>

      <SectionTitle title="Acciones rápidas" />
      <View style={styles.actions}>
        <CustomButton
          title="Reportar basura"
          onPress={() => navigation.navigate("Reportar")}
        />
        <CustomButton
          title="Programar recolección"
          onPress={() => navigation.navigate("ProgramarRecoleccion")}
          variant="secondary"
        />
      </View>

      <SectionTitle title="Solicitudes recientes" />
      {solicitudes.length === 0 ? (
        <Text style={[styles.empty, { color: colors.textSecondary }]}>
          Aún no tienes solicitudes. Reporta tu basura para que pasen a recogerla.
        </Text>
      ) : (
        solicitudes
          .slice(-3)
          .reverse()
          .map((solicitud) => (
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
  greeting: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  stat: {
    flex: 1,
    borderRadius: 9,
    borderWidth: 1,
    padding: 12,
    alignItems: "center",
  },
  statNum: {
    fontSize: 22,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  actions: {
    gap: 10,
    marginBottom: 8,
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
});
