import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";



export default function ReportarBasuraScreen({ navigation }: Props) {


  const [direccion, setDireccion] = useState("");
  const [tipoResiduo, setTipoResiduo] = useState<TipoResiduo>("organica");
  const [notas, setNotas] = useState("");

  const handleReportar = () => {
    if (!direccion.trim()) return;
    // prioridad inmediata: queremos que pasen a la brevedad
    dispatch(
      addSolicitud({
        direccion: direccion.trim(),
        tipoResiduo,
        prioridad: "inmediata",
        horaProgramada: "",
        notas: notas.trim(),
      }),
    );
    setDireccion("");
    setNotas("");
    setTipoResiduo("organica");
    navigation.navigate("Solicitudes");
  };

  return (
    <ScreenWrapper>
      <SectionTitle
        title="Reportar basura"
        subtitle="Llamado inmediato: alguien pasará a la brevedad a recogerla"
      />

      <Text style={[styles.label, { color: colors.primary }]}>Dirección</Text>
      <CustomInput
        placeholder="Ej: Barrio El Centro, casa #12"
        value={direccion}
        onChange={setDireccion}
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
        placeholder="Ej: hay varias bolsas pesadas"
        value={notas}
        onChange={setNotas}
      />

      <View style={styles.actions}>
        <CustomButton title="Solicitar recolección" onPress={handleReportar} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actions: {
    marginTop: 16,
  },
});
