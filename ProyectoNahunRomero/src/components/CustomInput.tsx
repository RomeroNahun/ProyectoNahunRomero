import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  KeyboardTypeOptions,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";

type Props = {
  type?: "text" | "email" | "password" | "number";
  placeholder: string;
  value: string;
  onChange: (text: string) => void;
};

export default function CustomInput({
  type = "text",
  placeholder,
  value,
  onChange,
}: Props) {
  const { colors } = useTheme();
  const [isSecureText, setIsSecureText] = useState(type === "password");
  const isPasswordField = type === "password";

  const icon: (typeof MaterialIcons)["name"] | undefined =
    type === "email" ? "alternate-email" : type === "password" ? "lock" : undefined;

  const keyboardType: KeyboardTypeOptions =
    type === "email"
      ? "email-address"
      : type === "number"
        ? "phone-pad"
        : "default";

  const getError = () => {
    if (type === "email" && !value.includes("@")) return "Correo inválido";
    if (type === "password" && value.length < 4) return "La contraseña es muy débil";
    if (type === "number" && (value.length != 8 || value.includes("-")))
      return "Número de teléfono inválido";
  };
  const error = getError();

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.inputBackground,
            borderColor: error ? colors.error : colors.border,
          },
        ]}
      >
        <MaterialIcons name={icon as any} size={22} color={colors.textSecondary} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChange}
          style={[styles.input, { color: colors.text }]}
          secureTextEntry={isSecureText}
          keyboardType={keyboardType}
        />
        {isPasswordField && (
          <TouchableOpacity
            onPress={() => {
              setIsSecureText(!isSecureText);
            }}
          >
            <Ionicons
              name={isSecureText ? "eye" : "eye-off"}
              size={22}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={[styles.inputError, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 9,
    paddingLeft: 20,
  },
  input: {
    width: "80%",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  inputError: {
    marginTop: 4,
  },
});
