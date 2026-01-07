import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore, useAuthStore } from '../../store';

export const SettingsScreen: React.FC = () => {
  const { theme, isDark, toggleDarkMode, customBackgroundColor, setCustomBackgroundColor, getContrastColor } = useThemeStore();
  const { user } = useAuthStore();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [hexColor, setHexColor] = useState(customBackgroundColor);
  const [rgbValues, setRgbValues] = useState({
    r: parseInt(customBackgroundColor.slice(1, 3), 16),
    g: parseInt(customBackgroundColor.slice(3, 5), 16),
    b: parseInt(customBackgroundColor.slice(5, 7), 16),
  });

  const settingsItems = [
    { icon: 'notifications-outline', label: 'Notifications', type: 'link' },
    { icon: 'lock-closed-outline', label: 'Privacy', type: 'link' },
    { icon: 'help-circle-outline', label: 'Help & Support', type: 'link' },
    { icon: 'document-text-outline', label: 'Terms of Service', type: 'link' },
    { icon: 'information-circle-outline', label: 'About', type: 'link' },
  ];

  const handleColorSelect = (color: string) => {
    setCustomBackgroundColor(color);
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const updateColorFromRgb = () => {
    const hex = rgbToHex(rgbValues.r, rgbValues.g, rgbValues.b);
    setHexColor(hex);
    setCustomBackgroundColor(hex);
  };

  const updateColorFromHex = (text: string) => {
    const cleanHex = text.replace('#', '');
    if (/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
      const rgb = hexToRgb('#' + cleanHex);
      setRgbValues(rgb);
      setHexColor('#' + cleanHex);
      setCustomBackgroundColor('#' + cleanHex);
    }
  };

  const handleRgbChange = (color: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgbValues, [color]: value };
    setRgbValues(newRgb);
    updateColorFromRgb();
  };

  const handleSliderPress = (color: 'r' | 'g' | 'b', event: any) => {
    const { locationX } = event.nativeEvent;
    const sliderWidth = 200; // Approximate slider width
    const percentage = Math.max(0, Math.min(1, locationX / sliderWidth));
    const value = Math.round(percentage * 255);
    handleRgbChange(color, value);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>

        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Appearance</Text>
          
          <View style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={22} color={theme.colors.text} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleDarkMode}
              trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="color-palette-outline" size={22} color={theme.colors.text} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Background Color</Text>
            </View>
            <TouchableOpacity
              style={[styles.colorPreview, { backgroundColor: customBackgroundColor, borderColor: theme.colors.border }]}
              onPress={() => setShowColorPicker(true)}
            >
              <Text style={[styles.colorPreviewText, { color: getContrastColor(customBackgroundColor) }]}>
                {customBackgroundColor}
              </Text>
            </TouchableOpacity>
          </View>

                  </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>General</Text>
          
          {settingsItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.settingRow,
                index < settingsItems.length - 1 && { borderBottomColor: theme.colors.border, borderBottomWidth: 1 },
              ]}
            >
              <View style={styles.settingLeft}>
                <Ionicons name={item.icon as any} size={22} color={theme.colors.text} />
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Account Info</Text>
          
          <View style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="person-outline" size={22} color={theme.colors.text} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Name</Text>
            </View>
            <Text style={[styles.settingValue, { color: theme.colors.textSecondary }]}>
              {user?.displayName || 'Not set'}
            </Text>
          </View>

          <View style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="mail-outline" size={22} color={theme.colors.text} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Email</Text>
            </View>
            <Text style={[styles.settingValue, { color: theme.colors.textSecondary }]}>
              {user?.email || 'Not set'}
            </Text>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="finger-print-outline" size={22} color={theme.colors.text} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>User ID</Text>
            </View>
            <Text style={[styles.settingValue, { color: theme.colors.textSecondary }]}>
              {user?.id || 'Not set'}
            </Text>
          </View>
        </View>

        <Text style={[styles.version, { color: theme.colors.textSecondary }]}>
          Version 1.0.0
        </Text>
      </ScrollView>

      <Modal
        visible={showColorPicker}
        animationType="slide"
        presentationStyle="formSheet"
        onRequestClose={() => setShowColorPicker(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
            <TouchableOpacity onPress={() => setShowColorPicker(false)}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Choose Color</Text>
            <View style={styles.modalSpacer} />
          </View>
          
          <ScrollView style={styles.modalScrollView}>
            {/* Color Preview */}
            <View style={[styles.colorPreviewContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <View style={[styles.colorPreviewLarge, { backgroundColor: hexColor }]}>
                <Text style={[styles.colorPreviewText, { color: getContrastColor(hexColor) }]}>
                  {hexColor}
                </Text>
              </View>
            </View>

            {/* RGB Sliders */}
            <View style={[styles.sliderContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.sliderLabel, { color: theme.colors.textSecondary }]}>Red</Text>
              <View style={styles.sliderRow}>
                <Text style={[styles.sliderValue, { color: theme.colors.text }]}>{rgbValues.r}</Text>
                <TouchableOpacity
                  style={[styles.sliderTrack, { backgroundColor: theme.colors.border }]}
                  onPress={(e) => handleSliderPress('r', e)}
                  activeOpacity={0.8}
                >
                  <View 
                    style={[
                      styles.sliderFill, 
                      { backgroundColor: '#FF0000', width: `${(rgbValues.r / 255) * 100}%` }
                    ]}
                  />
                </TouchableOpacity>
                <Text style={[styles.sliderValue, { color: theme.colors.text }]}>255</Text>
              </View>
              
              <Text style={[styles.sliderLabel, { color: theme.colors.textSecondary }]}>Green</Text>
              <View style={styles.sliderRow}>
                <Text style={[styles.sliderValue, { color: theme.colors.text }]}>{rgbValues.g}</Text>
                <TouchableOpacity
                  style={[styles.sliderTrack, { backgroundColor: theme.colors.border }]}
                  onPress={(e) => handleSliderPress('g', e)}
                  activeOpacity={0.8}
                >
                  <View 
                    style={[
                      styles.sliderFill, 
                      { backgroundColor: '#00FF00', width: `${(rgbValues.g / 255) * 100}%` }
                    ]}
                  />
                </TouchableOpacity>
                <Text style={[styles.sliderValue, { color: theme.colors.text }]}>255</Text>
              </View>
              
              <Text style={[styles.sliderLabel, { color: theme.colors.textSecondary }]}>Blue</Text>
              <View style={styles.sliderRow}>
                <Text style={[styles.sliderValue, { color: theme.colors.text }]}>{rgbValues.b}</Text>
                <TouchableOpacity
                  style={[styles.sliderTrack, { backgroundColor: theme.colors.border }]}
                  onPress={(e) => handleSliderPress('b', e)}
                  activeOpacity={0.8}
                >
                  <View 
                    style={[
                      styles.sliderFill, 
                      { backgroundColor: '#0000FF', width: `${(rgbValues.b / 255) * 100}%` }
                    ]}
                  />
                </TouchableOpacity>
                <Text style={[styles.sliderValue, { color: theme.colors.text }]}>255</Text>
              </View>
            </View>

            {/* Hex Input */}
            <View style={[styles.hexContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.hexLabel, { color: theme.colors.textSecondary }]}>Hex Color</Text>
              <View style={styles.hexInputRow}>
                <Text style={[styles.hashSymbol, { color: theme.colors.text }]}>#</Text>
                <TextInput
                  style={[
                    styles.hexInput,
                    { 
                      backgroundColor: theme.colors.background,
                      borderColor: theme.colors.border,
                      color: theme.colors.text,
                    }
                  ]}
                  placeholder="FF5733"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={hexColor.replace('#', '')}
                  onChangeText={updateColorFromHex}
                  maxLength={6}
                  autoCapitalize="characters"
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 120 },
  title: { fontSize: 32, fontWeight: '400', marginBottom: 24 },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: { fontSize: 16 },
  settingValue: { fontSize: 14 },
  colorPreview: {
    width: 60,
    height: 30,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorPreviewText: {
    fontSize: 10,
    fontWeight: '500',
  },
  version: { textAlign: 'center', fontSize: 12, marginTop: 24 },
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 18, fontWeight: '600' },
  modalSpacer: { width: 40 },
  modalScrollView: { flex: 1 },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
  },
  colorPreviewContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  colorPreviewLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorPreviewText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sliderContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sliderValue: {
    fontSize: 12,
    fontWeight: '500',
    width: 30,
    textAlign: 'center',
  },
  sliderTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    borderRadius: 4,
  },
  hexContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  hexLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  hexInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hashSymbol: {
    fontSize: 16,
    fontWeight: '500',
  },
  hexInput: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  quickColorsContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  quickColorsLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  quickColorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickColorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
  },
});
