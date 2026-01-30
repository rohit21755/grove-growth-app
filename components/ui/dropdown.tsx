import { FontFamily } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    LayoutAnimation,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export type DropdownOption = { label: string; value: string };

type DropdownPropsBase = {
  label?: string;
  placeholder?: string;
};

type DropdownPropsSimple = DropdownPropsBase & {
  list: string[];
  selected: string;
  setSelected: (value: string) => void;
  options?: never;
  value?: never;
  onSelect?: never;
};

type DropdownPropsOptions = DropdownPropsBase & {
  list?: never;
  selected?: never;
  setSelected?: never;
  options: DropdownOption[];
  value: string | null;
  onSelect: (value: string) => void;
};

export type DropdownProps = DropdownPropsSimple | DropdownPropsOptions;

function isOptionsProps(props: DropdownProps): props is DropdownPropsOptions {
  return props.options != null;
}

export default function Dropdown(props: DropdownProps) {
  const [open, setOpen] = useState(false);

  const options: DropdownOption[] = isOptionsProps(props)
    ? props.options
    : props.list.map((s) => ({ label: s, value: s }));

  const selectedValue = isOptionsProps(props) ? props.value : props.selected;
  const displayText =
    options.find((o) => o.value === selectedValue)?.label ??
    (isOptionsProps(props) ? (props.placeholder ?? "Select...") : "");

  const toggleDropdown = () => {
    LayoutAnimation.easeInEaseOut();
    setOpen((prev) => !prev);
  };

  const onSelect = (item: DropdownOption) => {
    LayoutAnimation.easeInEaseOut();
    if (isOptionsProps(props)) {
      props.onSelect(item.value);
    } else {
      props.setSelected(item.value);
    }
    setOpen(false);
  };

  return (
    <View style={styles.wrapper}>
      {props.label != null && (
        <Text style={styles.labelText}>{props.label}</Text>
      )}
      {/* Trigger */}
      <Pressable style={styles.container} onPress={toggleDropdown}>
        <Text style={styles.text} numberOfLines={1}>
          {displayText}
        </Text>
        <Ionicons
          name="chevron-down"
          size={18}
          color="#fff"
          style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}
        />
      </Pressable>

      {/* Menu */}
      {open && (
        <View style={styles.menu}>
          {options.map((item) => (
            <Pressable
              key={item.value}
              style={styles.menuItem}
              onPress={() => onSelect(item)}
            >
              <Text style={styles.menuText}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 1000,
  },

  labelText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: FontFamily.regular,
    marginBottom: 4,
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    width: "100%",
    minWidth: 150,
    backgroundColor: "#1D1D1D",
  },

  text: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: FontFamily.regular,
    flex: 1,
  },

  menu: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: 4,
    borderRadius: 14,
    backgroundColor: "#1D1D1D",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    overflow: "hidden",
    zIndex: 1001,
  },

  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  menuText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: FontFamily.regular,
  },
});
