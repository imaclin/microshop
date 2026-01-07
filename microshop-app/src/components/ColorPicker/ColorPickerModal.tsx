import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store';

interface ColorPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onColorSelect: (color: string) => void;
  initialColor?: string;
}

export const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  visible,
  onClose,
  onColorSelect,
  initialColor = '#FFFFFF',
}) => {
  const { theme, getContrastColor } = useThemeStore();
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [hexInput, setHexInput] = useState(initialColor);

  const presetColors = [
    '#FFFFFF', // White
    '#000000', // Black
    '#F5F5F5', // Light Gray
    '#1A1A1A', // Dark Gray
    '#E3F2FD', // Light Blue
    '#1565C0', // Blue
    '#E8F5E8', // Light Green
    '#2E7D32', // Green
    '#FFF3E0', // Light Orange
    '#E65100', // Orange
    '#FCE4EC', // Light Pink
    '#C2185B', // Pink
    '#F3E5F5', // Light Purple
    '#6A1B9A', // Purple
    '#FFEBEE', // Light Red
    '#D32F2F', // Red
    '#E0F2F1', // Light Teal
    '#00695C', // Teal
    '#FFF8E1', // Light Amber
    '#FF8F00', // Amber
  ];

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setHexInput(color);
  };

  const handleHexInputChange = (text: string) => {
    setHexInput(text);
    // Validate hex color format
    const hexRegex = /^#?[0-9A-Fa-f]{6}$/;
    if (hexRegex.test(text)) {
      const color = text.startsWith('#') ? text : `#${text}`;
      handleColorSelect(color);
    }
  };

  const handleConfirm = () => {
    if (hexInput && /^#[0-9A-Fa-f]{6}$/.test(hexInput)) {
      onColorSelect(hexInput);
      onClose();
    } else {
      Alert.alert('Invalid Color', 'Please enter a valid hex color code (e.g., #FF5733)');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]}>Choose Color</Text>
          <TouchableOpacity onPress={handleConfirm}>
            <Text style={[styles.confirmButton, { color: theme.colors.primary }]}>Done</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Current Color Preview */}
          <View style={styles.previewSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Preview</Text>
            <View style={styles.colorPreview}>
              <View
                style={[
                  styles.colorBox,
                  { backgroundColor: selectedColor, borderColor: theme.colors.border },
                ]}
              >
                <Text style={[styles.colorText, { color: getContrastColor(selectedColor) }]}>
                  {selectedColor}
                </Text>
              </View>
              <View
                style={[
                  styles.containerPreview,
                  { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                ]}
              >
                <Text style={[styles.containerText, { color: theme.colors.text }]}>
                  Container (10% lighter)
                </Text>
              </View>
            </View>
          </View>

          {/* Preset Colors */}
          <View style={styles.presetSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Preset Colors</Text>
            <View style={styles.colorGrid}>
              {presetColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color, borderColor: theme.colors.border },
                    selectedColor === color && { borderColor: theme.colors.primary, borderWidth: 2 }
                  ]}
                  onPress={() => handleColorSelect(color)}
                />
              ))}
            </View>
          </View>

          {/* Hex Input */}
          <View style={styles.hexSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Hex Color Code</Text>
            <View style={styles.hexInputContainer}>
              <Text style={[styles.hashSymbol, { color: theme.colors.text }]}>#</Text>
              <TextInput
                style={[
                  styles.hexInput,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                  },
                ]}
                placeholder="FF5733"
                placeholderTextColor={theme.colors.textSecondary}
                value={hexInput.replace('#', '')}
                onChangeText={handleHexInputChange}
                maxLength={6}
                autoCapitalize="characters"
              />
            </View>
            <Text style={[styles.hexHelper, { color: theme.colors.textSecondary }]}>
              Enter a 6-digit hex color code
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: { fontSize: 18, fontWeight: '600' },
  confirmButton: { fontSize: 16, fontWeight: '500' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20 },
  previewSection: { marginBottom: 32 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  colorPreview: {
    gap: 16,
  },
  colorBox: {
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorText: {
    fontSize: 16,
    fontWeight: '600',
  },
  containerPreview: {
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  presetSection: { marginBottom: 32 },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
  },
  hexSection: { marginBottom: 32 },
  hexInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  hashSymbol: {
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 12,
  },
  hexInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  hexHelper: {
    fontSize: 12,
  },
});
