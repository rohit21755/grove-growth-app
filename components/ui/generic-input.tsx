import { FontFamily } from "@/constants/theme";
import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
} from "react-native";

interface GenericInputProps extends TextInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
}

export const GenericInput: React.FC<GenericInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder = "Enter text",
  secureTextEntry = false,
  keyboardType = "default",
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#666"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginBottom: 24,
  },
  label: {
    color: "rgba(191, 191, 191, 1)",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    fontFamily: FontFamily.semiBold,
  },
  input: {
    width: "100%",
    minHeight: 32,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#3a3a3a",
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#FFFFFF",
    fontSize: 14,
    backgroundColor: "#2a2a2a",
  },
});
