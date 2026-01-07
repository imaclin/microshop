import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';

// Import polyfills first
import './src/polyfills';

import App from './App';

// Fix for web platform - gesture handler needs to be imported but not required
if (Platform.OS === 'web') {
  // Gesture handler is already imported via App.tsx, no need to require it here
}

registerRootComponent(App);
