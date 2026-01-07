import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ShopStackParamList } from '../types';
import { ProductFeedScreen } from '../screens/Shop/ProductFeedScreen';
import { ProductDetailScreen } from '../screens/Shop/ProductDetailScreen';
import { CheckoutScreen } from '../screens/Shop/CheckoutScreen';

const Stack = createNativeStackNavigator<ShopStackParamList>();

export const ShopNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#000000' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="ProductFeed" component={ProductFeedScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
};
