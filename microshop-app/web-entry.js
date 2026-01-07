// Web entry point that avoids import.meta issues
import { AppRegistry } from 'react-native';
import App from './App';
import { registerRootComponent } from 'expo';

AppRegistry.registerComponent('main', () => App);
registerRootComponent(App);
