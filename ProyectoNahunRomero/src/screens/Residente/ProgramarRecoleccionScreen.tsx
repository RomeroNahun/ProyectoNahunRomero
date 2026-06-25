import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
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
type PickerMode = "date" | "time";

const formatFechaProgramada = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export default function ProgramarRecoleccionScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();

  const [direccion, setDireccion] = useState("");
  const [tipoResiduo, setTipoResiduo] = useState<TipoResiduo>("organica");
  const [fechaProgramada, setFechaProgramada] = useState<Date | null>(null);
  const [pickerMode, setPickerMode] = useState<PickerMode | null>(null);
  const [notas, setNotas] = useState("");

  const [guardando, setGuardando] = useState(false);

  const handleProgramar = async () => {
    if (!direccion.trim()) {
      Alert.alert("Dirección requerida", "Ingresa la dirección de recolección.");
      return;
    }

    if (!fechaProgramada) {
      Alert.alert(
        "Fecha y hora requeridas",
        "Selecciona la fecha y la hora de recolección.",
      );
      return;
    }

    if (fechaProgramada.getTime() <= Date.now()) {
      Alert.alert(
        "Fecha inválida",
        "Selecciona una fecha y hora posterior al momento actual.",
      );
      return;
    }

    setGuardando(true);
    try {
      // prioridad programada: se recolecta a la hora indicada
      await dispatch(
        addSolicitud({
          direccion: direccion.trim(),
          tipoResiduo,
          prioridad: "programada",
          horaProgramada: formatFechaProgramada(fechaProgramada),
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

  const handlePickerChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (event.type === "dismissed") {
      setPickerMode(null);
      return;
    }

    if (!selectedDate) return;

    setFechaProgramada((current) => {
      const next = current ? new Date(current) : new Date();

      if (pickerMode === "date") {
        next.setFullYear(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
        );
      } else {
        next.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
      }

      return next;
    });
    setPickerMode(null);
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

      <Text style={[styles.label, { color: colors.primary }]}>Fecha y hora</Text>
      <View
        style={[
          styles.dateBox,
          {
            backgroundColor: colors.inputBackground,
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.dateValue,
            {
              color: fechaProgramada
                ? colors.buttonTertiaryText
                : colors.textSecondary,
            },
          ]}
        >
          {fechaProgramada
            ? formatFechaProgramada(fechaProgramada)
            : "Selecciona la fecha y hora"}
        </Text>
        <View style={styles.dateActions}>
          <CustomButton
            title="Fecha"
            onPress={() => setPickerMode("date")}
            variant="tertiary"
            style={styles.dateButton}
          />
          <CustomButton
            title="Hora"
            onPress={() => setPickerMode("time")}
            variant="tertiary"
            style={styles.dateButton}
          />
        </View>
      </View>

      {pickerMode && (
        <DateTimePicker
          value={fechaProgramada ?? new Date()}
          mode={pickerMode}
          display="default"
          minimumDate={new Date()}
          onChange={handlePickerChange}
        />
      )}

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
  dateBox: {
    borderRadius: 9,
    borderWidth: 1,
    padding: 12,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  dateActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  dateButton: {
    width: 120,
  },
  actions: {
    marginTop: 16,
    gap: 10,
  },
});
