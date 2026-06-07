import { Text, StyleSheet } from "react-native";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import SolicitudCard from "../../components/SolicitudCard";
import CustomButton from "../../components/CustomButton";
import { RootStackParamList } from "../../navigation/StackNavigator";
import { ResidenteTabsParamList } from "../../navigation/ResidenteTabsNavigator";

type Props = CompositeScreenProps<
  BottomTabScreenProps<ResidenteTabsParamList, "Solicitudes">,
  NativeStackScreenProps<RootStackParamList>
>;



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
