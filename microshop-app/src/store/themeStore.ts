import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Theme, LiquidGlassTheme } from '../types';
import { lightTheme, darkTheme, defaultLiquidGlassTheme } from '../theme';
import { storage } from '../utils/storage';

interface ThemeState {
  theme: Theme;
  liquidGlass: LiquidGlassTheme;
  isDark: boolean;
  isLiquidGlassEnabled: boolean;
  customBackgroundColor: string;

  setTheme: (theme: Theme) => void;
  toggleDarkMode: () => void;
  setLiquidGlass: (liquidGlass: LiquidGlassTheme) => void;
  toggleLiquidGlass: () => void;
  updateColors: (colors: Partial<Theme['colors']>) => void;
  setCustomBackgroundColor: (color: string) => void;
  getContrastColor: (backgroundColor: string) => string;
  adjustColorBrightness: (color: string, amount: number) => string;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: lightTheme,
      liquidGlass: defaultLiquidGlassTheme,
      isDark: false,
      isLiquidGlassEnabled: false,
      customBackgroundColor: '#FFFFFF',

      setTheme: (theme) => set({ theme, isDark: theme.mode === 'dark' }),

      toggleDarkMode: () => {
        const { isDark } = get();
        set({
          theme: isDark ? lightTheme : darkTheme,
          isDark: !isDark,
        });
      },

      setLiquidGlass: (liquidGlass) => set({ liquidGlass }),

      toggleLiquidGlass: () => set({ 
        isLiquidGlassEnabled: !get().isLiquidGlassEnabled 
      }),

      updateColors: (colors) => {
        const { theme } = get();
        set({
          theme: {
            ...theme,
            colors: { ...theme.colors, ...colors },
          },
        });
      },

      setCustomBackgroundColor: (color) => {
        const { theme } = get();
        const contrastColor = get().getContrastColor(color);
        const containerColor = get().adjustColorBrightness(color, 25); // 10% lighter (255 * 0.1 = 25.5, rounded to 25)
        set({
          customBackgroundColor: color,
          theme: {
            ...theme,
            colors: {
              ...theme.colors,
              background: color,
              surface: containerColor,
              text: contrastColor,
              textSecondary: get().adjustColorBrightness(contrastColor, -30),
              primary: get().getContrastColor(containerColor),
              accent: get().getContrastColor(containerColor),
            },
          },
        });
      },

      getContrastColor: (backgroundColor) => {
        // Convert hex to RGB
        const hex = backgroundColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        // Return black for light backgrounds, white for dark backgrounds
        return luminance > 0.5 ? '#000000' : '#FFFFFF';
      },

      adjustColorBrightness: (color, amount) => {
        const hex = color.replace('#', '');
        const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
        const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
        const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        isDark: state.isDark,
        isLiquidGlassEnabled: state.isLiquidGlassEnabled,
      }),
    }
  )
);
