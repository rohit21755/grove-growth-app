import { FontFamily } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export type DropdownOption = { label: string; value: string };

type DropdownProps = {
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  value: string | null;
  onSelect: (value: string) => void;
};

export function Dropdown({
  label,
  placeholder = "Select...",
  options,
  value,
  onSelect,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? placeholder;

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(query));
  }, [options, searchQuery]);

  const handleClose = () => {
    setOpen(false);
    setSearchQuery("");
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Pressable style={styles.trigger} onPress={() => setOpen(true)}>
        <Text
          style={[styles.triggerText, !value && styles.placeholder]}
          numberOfLines={1}
        >
          {selectedLabel}
        </Text>
        <Text style={styles.chevron}>▼</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <Pressable style={styles.modalOverlay} onPress={handleClose}>
          <View style={styles.modalContent}>
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={styles.searchContainer}>
                <Ionicons
                  name="search"
                  size={20}
                  color="#9BA1A6"
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search..."
                  placeholderTextColor="#666"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
                {searchQuery.length > 0 && (
                  <Pressable
                    onPress={() => setSearchQuery("")}
                    style={styles.clearButton}
                  >
                    <Ionicons name="close-circle" size={20} color="#9BA1A6" />
                  </Pressable>
                )}
              </View>
              <ScrollView
                style={styles.optionsList}
                keyboardShouldPersistTaps="handled"
              >
                {filteredOptions.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No results found</Text>
                  </View>
                ) : (
                  filteredOptions.map((opt) => (
                    <Pressable
                      key={opt.value}
                      style={({ pressed }) => [
                        styles.option,
                        pressed && styles.optionPressed,
                        value === opt.value && styles.optionSelected,
                      ]}
                      onPress={() => {
                        onSelect(opt.value);
                        handleClose();
                      }}
                    >
                      <Text style={styles.optionText}>{opt.label}</Text>
                    </Pressable>
                  ))
                )}
              </ScrollView>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    color: "rgba(191, 191, 191, 1)",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    fontFamily: FontFamily.semiBold,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    minHeight: 32,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#3a3a3a",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#2a2a2a",
  },
  triggerText: {
    color: "#FFFFFF",
    fontSize: 14,
    flex: 1,
    fontFamily: FontFamily.regular,
  },
  placeholder: {
    color: "#666",
  },
  chevron: {
    color: "#9BA1A6",
    fontSize: 10,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    maxHeight: 400,
    overflow: "hidden",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#3a3a3a",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: FontFamily.regular,
    paddingVertical: 4,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  optionsList: {
    padding: 8,
    maxHeight: 320,
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: "center",
  },
  emptyText: {
    color: "#9BA1A6",
    fontSize: 14,
    fontFamily: FontFamily.regular,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  optionPressed: {
    backgroundColor: "#3a3a3a",
  },
  optionSelected: {
    backgroundColor: "#33167F",
  },
  optionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: FontFamily.regular,
  },
});
