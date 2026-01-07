import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RootNavigator } from './src/navigation';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  navigator: {
    flex: 1,
  },
  webNavigator: {
    width: '100%',
    maxWidth: 800,
    minHeight: 1000,
    paddingHorizontal: 16,
  },
});

export default function App() {
  return (
    <GestureHandlerRootView style={Platform.OS === 'web' ? styles.webContainer : styles.container}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <StatusBar style="light" />
          <View style={Platform.OS === 'web' ? styles.webNavigator : styles.navigator}>
            <RootNavigator />
          </View>
        </NavigationContainer>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
