import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SellStackParamList } from '../types';
import { MyProductsScreen } from '../screens/Sell/MyProductsScreen';
import { AddProductScreen } from '../screens/Sell/AddProductScreen';

const Stack = createNativeStackNavigator<SellStackParamList>();

export const SellNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#000000' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MyProducts" component={MyProductsScreen} />
      <Stack.Screen name="AddProduct" component={AddProductScreen} />
    </Stack.Navigator>
  );
};
