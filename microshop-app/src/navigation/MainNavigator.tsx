import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from '../types';
import { useThemeStore } from '../store';
import { CustomTabBar } from '../components/CustomTabBar';

import { InventoryNavigator } from './InventoryNavigator';
import { CreateProductScreen } from '../screens/Products/CreateProductScreen';
import { ProfileNavigator } from './ProfileNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator: React.FC = () => {
  const { theme } = useThemeStore();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: Platform.OS === 'web' ? styles.webTabBar : [styles.tabBar, { 
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        }],
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'OrdersTab':
              iconName = focused ? 'receipt' : 'receipt-outline';
              break;
            case 'CreateOrderTab':
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              break;
            case 'ProfileTab':
              iconName = focused ? 'person' : 'person-outline';
              break;
                        default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBar={Platform.OS === 'web' ? (props) => <CustomTabBar {...props} /> : undefined}
    >
      <Tab.Screen
        name="OrdersTab"
        component={InventoryNavigator}
        options={{ tabBarLabel: 'Inventory' }}
      />
      <Tab.Screen
        name="CreateOrderTab"
        component={CreateProductScreen}
        options={{ tabBarLabel: 'Product' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{ tabBarLabel: 'Profile' }}
      />
          </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 88 : 70,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    paddingTop: 10,
    borderTopWidth: 1,
    elevation: 0,
  },
  webTabBar: {
    display: 'none',
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});
