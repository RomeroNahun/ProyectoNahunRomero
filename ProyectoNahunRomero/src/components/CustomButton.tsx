import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { ThemeColors } from "../utils/types/ThemeColors";

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  // union de literales para el estilo del boton
  variant?: "primary" | "secondary" | "tertiary";
};

export default function CustomButton({
  title,
  onPress,
  variant = "primary",
}: CustomButtonProps) {
  const { colors } = useTheme();
  const styles = getStyles(variant, colors);

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const getStyles = (
  variant: "primary" | "secondary" | "tertiary",
  colors: ThemeColors,
) =>
  StyleSheet.create({
    button: {
      borderRadius: 6,
      // operador ternario para elegir el color de fondo segun la variante
      backgroundColor:
        variant === "primary"
          ? colors.buttonPrimaryBg
          : variant === "secondary"
            ? colors.buttonSecondaryBg
            : colors.buttonTertiaryBg,
      padding: 12,
      width: 150,
    },
    buttonText: {
      color:
        variant === "primary"
          ? colors.buttonPrimaryText
          : variant === "secondary"
            ? colors.buttonSecondaryText
            : colors.buttonTertiaryText,
      textAlign: "center",
    },
  });
