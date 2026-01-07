import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { InventoryScreen } from '../screens/Inventory/InventoryScreen';
import { InventoryDetailsScreen } from '../screens/Inventory/InventoryDetailsScreen';
import { CreateInventoryScreen } from '../screens/Inventory/CreateInventoryScreen';
import { EditInventoryScreen } from '../screens/Inventory/EditInventoryScreen';

const Stack = createNativeStackNavigator();

export const InventoryNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFFFF' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Inventory" component={InventoryScreen} />
      <Stack.Screen name="InventoryDetails" component={InventoryDetailsScreen} />
      <Stack.Screen name="CreateInventory" component={CreateInventoryScreen} />
      <Stack.Screen name="EditInventory" component={EditInventoryScreen} />
    </Stack.Navigator>
  );
};
