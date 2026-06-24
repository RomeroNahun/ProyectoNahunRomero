import { useState } from "react";
import { View, Text, StyleSheet, Alert, Image } from "react-native";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import ScreenWrapper from "../../components/ScreenWrapper";
import SectionTitle from "../../components/SectionTitle";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch } from "../../store/hooks";
import { addSolicitud } from "../../store/slices/solicitudesSlice";
import { uploadFotoSolicitud } from "../../services/recoleccionService";
import { RootStackParamList } from "../../navigation/StackNavigator";
import { ResidenteTabsParamList } from "../../navigation/ResidenteTabsNavigator";
import {
  TipoResiduo,
  TIPOS_RESIDUO,
  TIPO_RESIDUO_LABELS,
} from "../../utils/types/Recoleccion";

type Props = CompositeScreenProps<
  BottomTabScreenProps<ResidenteTabsParamList, "Reportar">,
  NativeStackScreenProps<RootStackParamList>
>;

export default function ReportarBasuraScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();

  const [direccion, setDireccion] = useState("");
  const [tipoResiduo, setTipoResiduo] = useState<TipoResiduo>("organica");
  const [notas, setNotas] = useState("");
  // uri local de la foto seleccionada (aun sin subir)
  const [fotoUri, setFotoUri] = useState<string | null>(null);

  const [guardando, setGuardando] = useState(false);

  // abre la galeria para elegir una imagen como evidencia
  const seleccionarFoto = async () => {
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert("Permiso requerido", "Necesitamos acceso a tus fotos para adjuntar una imagen.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.length) {
      setFotoUri(result.assets[0].uri);
    }
  };

  const handleReportar = async () => {
    if (!direccion.trim()) return;
    setGuardando(true);
    try {
      // si hay foto, la subimos primero y guardamos su URL publica
      const fotoUrl = fotoUri ? await uploadFotoSolicitud(fotoUri) : undefined;
      // prioridad inmediata: queremos que pasen a la brevedad
      await dispatch(
        addSolicitud({
          direccion: direccion.trim(),
          tipoResiduo,
          prioridad: "inmediata",
          horaProgramada: "",
          notas: notas.trim(),
          fotoUrl,
        }),
      ).unwrap();
      setDireccion("");
      setNotas("");
      setTipoResiduo("organica");
      setFotoUri(null);
      navigation.navigate("Solicitudes");
    } catch (e) {
      Alert.alert("Error", "No se pudo guardar la solicitud. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
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

      <Text style={[styles.label, { color: colors.primary }]}>
        Fotografía (opcional)
      </Text>
      {fotoUri && (
        <Image source={{ uri: fotoUri }} style={styles.preview} resizeMode="cover" />
      )}
      <CustomButton
        title={fotoUri ? "Cambiar fotografía" : "Adjuntar fotografía"}
        onPress={seleccionarFoto}
        variant="tertiary"
      />
      {fotoUri && (
        <CustomButton
          title="Quitar fotografía"
          onPress={() => setFotoUri(null)}
          variant="tertiary"
        />
      )}

      <View style={styles.actions}>
        <CustomButton
          title={guardando ? "Guardando..." : "Solicitar recolección"}
          onPress={handleReportar}
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
  preview: {
    width: "100%",
    height: 180,
    borderRadius: 9,
    marginTop: 10,
    marginBottom: 4,
  },
  actions: {
    marginTop: 16,
  },
});
