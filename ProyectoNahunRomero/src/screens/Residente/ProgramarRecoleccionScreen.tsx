import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import ScreenWrapper from "../../components/ScreenWrapper";
import SectionTitle from "../../components/SectionTitle";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch } from "../../store/hooks";
import { addSolicitud } from "../../store/slices/solicitudesSlice";
import { RootStackParamList } from "../../navigation/StackNavigator";
import {
  TipoResiduo,
  TIPOS_RESIDUO,
  TIPO_RESIDUO_LABELS,
} from "../../utils/types/Recoleccion";

type Props = NativeStackScreenProps<RootStackParamList, "ProgramarRecoleccion">;

export default function ProgramarRecoleccionScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();

  const [direccion, setDireccion] = useState("");
  const [tipoResiduo, setTipoResiduo] = useState<TipoResiduo>("organica");
  const [horaProgramada, setHoraProgramada] = useState("");
  const [notas, setNotas] = useState("");

  const [guardando, setGuardando] = useState(false);

  const handleProgramar = async () => {
    if (!direccion.trim() || !horaProgramada.trim()) return;
    setGuardando(true);
    try {
      // prioridad programada: se recolecta a la hora indicada
      await dispatch(
        addSolicitud({
          direccion: direccion.trim(),
          tipoResiduo,
          prioridad: "programada",
          horaProgramada: horaProgramada.trim(),
          notas: notas.trim(),
        }),
      ).unwrap();
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", "No se pudo programar la recolección. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ScreenWrapper>
      <SectionTitle
        title="Programar recolección"
        subtitle="Elige la hora a la que quieres que pasen a recoger tu basura"
      />

      <Text style={[styles.label, { color: colors.primary }]}>Dirección</Text>
      <CustomInput
        placeholder="Ej: Barrio El Centro, casa #12"
        value={direccion}
        onChange={setDireccion}
      />

      <Text style={[styles.label, { color: colors.primary }]}>Hora programada</Text>
      <CustomInput
        placeholder="Ej: 08:00 AM"
        value={horaProgramada}
        onChange={setHoraProgramada}
      />

      <Text style={[styles.label, { color: colors.primary }]}>Tipo de residuo</Text>
      <View style={styles.row}>
        {TIPOS_RESIDUO.map((tipo) => (
          <CustomButton
            key={tipo}
            title={TIPO_RESIDUO_LABELS[tipo]}
            onPress={() => setTipoResiduo(tipo)}
            variant={tipoResiduo === tipo ? "primary" : "tertiary"}
          />
        ))}
      </View>

      <Text style={[styles.label, { color: colors.primary }]}>Notas (opcional)</Text>
      <CustomInput
        placeholder="Ej: dejar en el portón"
        value={notas}
        onChange={setNotas}
      />

      <View style={styles.actions}>
        <CustomButton
          title={guardando ? "Programando..." : "Programar"}
          onPress={handleProgramar}
        />
        <CustomButton
          title="Cancelar"
          onPress={() => navigation.goBack()}
          variant="secondary"
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actions: {
    marginTop: 16,
    gap: 10,
  },
});
