import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import RutaCard from "../../components/RutaCard";
import ScreenWrapper from "../../components/ScreenWrapper";
import SectionTitle from "../../components/SectionTitle";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { crearRuta } from "../../store/slices/rutasSlice";
import { RootStackParamList } from "../../navigation/StackNavigator";
import { RecolectorTabsParamList } from "../../navigation/RecolectorTabsNavigator";

type Props = CompositeScreenProps<
  BottomTabScreenProps<RecolectorTabsParamList, "Rutas">,
  NativeStackScreenProps<RootStackParamList>
>;

export default function RutasScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const rutas = useAppSelector((state) => state.rutas.rutas);
  const { colors } = useTheme();

  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [distancia, setDistancia] = useState("");
  const [combustible, setCombustible] = useState("");

  const handleCrearRuta = () => {
    if (!nombre.trim()) return;
    dispatch(
      crearRuta({
        nombre: nombre.trim(),
        solicitudIds: [],
        distanciaKm: parseFloat(distancia) || 0,
        combustibleEstimado: parseFloat(combustible) || 0,
      }),
    );
    setNombre("");
    setDistancia("");
    setCombustible("");
    setShowForm(false);
  };

  return (
    <ScreenWrapper>
      <SectionTitle
        title="Rutas de recolección"
        subtitle="Agrupa solicitudes para ahorrar combustible"
      />

      <CustomButton
        title={showForm ? "Cancelar" : "Crear ruta"}
        onPress={() => setShowForm(!showForm)}
        variant={showForm ? "secondary" : "primary"}
      />

      {showForm && (
        <View style={[styles.form, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
          <Text style={[styles.formLabel, { color: colors.primary }]}>Nueva ruta</Text>
          <CustomInput placeholder="Nombre de la ruta" value={nombre} onChange={setNombre} />
          <CustomInput
            placeholder="Distancia estimada (km)"
            value={distancia}
            onChange={setDistancia}
          />
          <CustomInput
            placeholder="Combustible estimado (L)"
            value={combustible}
            onChange={setCombustible}
          />
          <CustomButton title="Guardar ruta" onPress={handleCrearRuta} />
        </View>
      )}

      <SectionTitle title={`Rutas (${rutas.length})`} />

      {rutas.length === 0 ? (
        <Text style={[styles.empty, { color: colors.textSecondary }]}>
          Aún no has creado rutas. Crea una para organizar tu recorrido.
        </Text>
      ) : (
        rutas.map((ruta) => (
          <RutaCard
            key={ruta.id}
            ruta={ruta}
            onPress={() => navigation.navigate("DetalleRuta", { rutaId: ruta.id })}
          />
        ))
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  form: {
    borderRadius: 9,
    borderWidth: 1,
    padding: 14,
    marginTop: 12,
    marginBottom: 8,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
});
