import { Text, StyleSheet } from "react-native";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import ScreenWrapper from "../../components/ScreenWrapper";
import SectionTitle from "../../components/SectionTitle";
import SolicitudCard from "../../components/SolicitudCard";
import CustomButton from "../../components/CustomButton";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppSelector } from "../../store/hooks";
import { RootStackParamList } from "../../navigation/StackNavigator";
import { ResidenteTabsParamList } from "../../navigation/ResidenteTabsNavigator";

type Props = CompositeScreenProps<
  BottomTabScreenProps<ResidenteTabsParamList, "Solicitudes">,
  NativeStackScreenProps<RootStackParamList>
>;

export default function MisSolicitudesScreen({ navigation }: Props) {
  const solicitudes = useAppSelector((state) => state.solicitudes.solicitudes);
  const { colors } = useTheme();

  return (
    <ScreenWrapper>
      <SectionTitle
        title="Mis solicitudes"
        subtitle="Historial de tus recolecciones"
      />

      <CustomButton
        title="Reportar basura"
        onPress={() => navigation.navigate("Reportar")}
      />

      <SectionTitle title={`Solicitudes (${solicitudes.length})`} />

      {solicitudes.length === 0 ? (
        <Text style={[styles.empty, { color: colors.textSecondary }]}>
          Aún no tienes solicitudes registradas.
        </Text>
      ) : (
        [...solicitudes].reverse().map((solicitud) => (
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


