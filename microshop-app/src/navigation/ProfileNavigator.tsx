import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../types';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';
import { SettingsScreen } from '../screens/Settings/SettingsScreen';
import { PublicProfileScreen } from '../screens/Public/PublicProfileScreen';
import { SellerOnboardingScreen, SellerDashboardScreen, SellerOnboardingFlowScreen } from '../screens/Seller';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFFFF' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="PublicProfile" component={PublicProfileScreen} />
      <Stack.Screen name="SellerOnboarding" component={SellerOnboardingScreen} />
      <Stack.Screen name="SellerOnboardingFlow" component={SellerOnboardingFlowScreen} />
      <Stack.Screen name="SellerDashboard" component={SellerDashboardScreen} />
    </Stack.Navigator>
  );
};
