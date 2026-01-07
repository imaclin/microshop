import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types';
import { LiquidGlassButton, LiquidGlassCard } from '../../components/LiquidGlass';
import { useThemeStore } from '../../store';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

const { width, height } = Dimensions.get('window');

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useThemeStore();

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🛍️</Text>
            </View>
            <Text style={styles.appName}>MicroShop</Text>
            <Text style={styles.tagline}>Buy & Sell in Seconds</Text>
          </View>

          <View style={styles.featuresContainer}>
            <LiquidGlassCard style={styles.featureCard} interactive={false}>
              <View style={styles.featureRow}>
                <Text style={styles.featureIcon}>⚡</Text>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Lightning Fast</Text>
                  <Text style={styles.featureDesc}>List products in under 60 seconds</Text>
                </View>
              </View>
            </LiquidGlassCard>

            <LiquidGlassCard style={styles.featureCard} interactive={false}>
              <View style={styles.featureRow}>
                <Text style={styles.featureIcon}>💳</Text>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Secure Payments</Text>
                  <Text style={styles.featureDesc}>Powered by Stripe Connect</Text>
                </View>
              </View>
            </LiquidGlassCard>

            <LiquidGlassCard style={styles.featureCard} interactive={false}>
              <View style={styles.featureRow}>
                <Text style={styles.featureIcon}>🎨</Text>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Beautiful Design</Text>
                  <Text style={styles.featureDesc}>iOS 26 Liquid Glass effects</Text>
                </View>
              </View>
            </LiquidGlassCard>
          </View>

          <View style={styles.buttonsContainer}>
            <LiquidGlassButton
              title="Get Started"
              onPress={() => navigation.navigate('Register')}
              variant="primary"
              size="large"
              style={styles.primaryButton}
            />
            <LiquidGlassButton
              title="I already have an account"
              onPress={() => navigation.navigate('Login')}
              variant="glass"
              size="medium"
              style={styles.secondaryButton}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoEmoji: {
    fontSize: 50,
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  featuresContainer: {
    gap: 12,
  },
  featureCard: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  buttonsContainer: {
    gap: 12,
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
  },
});
