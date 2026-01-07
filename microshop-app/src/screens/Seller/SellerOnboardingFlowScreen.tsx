import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useThemeStore, useAuthStore } from '../../store';

interface OnboardingData {
  // Business Information
  businessName: string;
  businessType: 'individual' | 'company';
  businessDescription: string;
  businessWebsite: string;
  
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Address
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  
  // Bank Account (for testing - in production you'd use Stripe.js)
  accountNumber: string;
  routingNumber: string;
  accountHolderName: string;
}

export const SellerOnboardingFlowScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    businessName: user?.displayName || '',
    businessType: 'individual',
    businessDescription: '',
    businessWebsite: '',
    firstName: user?.displayName?.split(' ')[0] || '',
    lastName: user?.displayName?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    accountNumber: '',
    routingNumber: '',
    accountHolderName: user?.displayName || '',
  });

  const steps = [
    { title: 'Business Info', icon: 'business-outline' },
    { title: 'Personal Info', icon: 'person-outline' },
    { title: 'Address', icon: 'location-outline' },
    { title: 'Bank Account', icon: 'card-outline' },
    { title: 'Review', icon: 'checkmark-circle-outline' },
  ];

  const updateOnboardingData = (field: keyof OnboardingData, value: string) => {
    setOnboardingData(prev => ({ ...prev, [field]: value }));
  };

  const handleBusinessTypeChange = (type: 'individual' | 'company') => {
    updateOnboardingData('businessType', type);
    // Auto-populate description for individuals
    if (type === 'individual') {
      updateOnboardingData('businessDescription', 'Selling items on MicroShop marketplace');
      updateOnboardingData('businessWebsite', ''); // Clear website for individuals
    } else {
      updateOnboardingData('businessDescription', '');
      updateOnboardingData('businessWebsite', '');
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0: // Business Info
        if (!onboardingData.businessName.trim()) {
          Alert.alert('Error', 'Please enter your business name');
          return false;
        }
        // Only require description for companies
        if (onboardingData.businessType === 'company' && !onboardingData.businessDescription.trim()) {
          Alert.alert('Error', 'Please describe your business');
          return false;
        }
        return true;
        
      case 1: // Personal Info
        if (!onboardingData.firstName.trim()) {
          Alert.alert('Error', 'Please enter your first name');
          return false;
        }
        if (!onboardingData.lastName.trim()) {
          Alert.alert('Error', 'Please enter your last name');
          return false;
        }
        if (!onboardingData.email.trim()) {
          Alert.alert('Error', 'Please enter your email');
          return false;
        }
        if (!onboardingData.phone.trim()) {
          Alert.alert('Error', 'Please enter your phone number');
          return false;
        }
        return true;
        
      case 2: // Address
        if (!onboardingData.street.trim()) {
          Alert.alert('Error', 'Please enter your street address');
          return false;
        }
        if (!onboardingData.city.trim()) {
          Alert.alert('Error', 'Please enter your city');
          return false;
        }
        if (!onboardingData.state.trim()) {
          Alert.alert('Error', 'Please enter your state');
          return false;
        }
        if (!onboardingData.zipCode.trim()) {
          Alert.alert('Error', 'Please enter your ZIP code');
          return false;
        }
        return true;
        
      case 3: // Bank Account
        if (!onboardingData.accountNumber.trim()) {
          Alert.alert('Error', 'Please enter your account number');
          return false;
        }
        if (!onboardingData.routingNumber.trim()) {
          Alert.alert('Error', 'Please enter your routing number');
          return false;
        }
        if (!onboardingData.accountHolderName.trim()) {
          Alert.alert('Error', 'Please enter the account holder name');
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // In a real implementation, you would send this data to your backend
      // which would then create the Stripe Connect account
      
      console.log('Submitting onboarding data:', onboardingData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success!',
        'Your seller account has been created. You can now start selling!',
        [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create seller account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Business Info
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
              Tell us about your business
            </Text>
            <Text style={[styles.stepSubtitle, { color: theme.colors.textSecondary }]}>
              This information will appear on your public profile
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                Business Name *
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.background, 
                  borderColor: theme.colors.border,
                  color: theme.colors.text 
                }]}
                placeholder="Enter your business name"
                placeholderTextColor={theme.colors.textSecondary}
                value={onboardingData.businessName}
                onChangeText={(value) => updateOnboardingData('businessName', value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                Business Type *
              </Text>
              <View style={styles.businessTypeButtons}>
                <TouchableOpacity
                  style={[
                    styles.businessTypeButton,
                    onboardingData.businessType === 'individual' && {
                      backgroundColor: theme.colors.primary,
                      borderColor: theme.colors.primary
                    },
                    { borderColor: theme.colors.border }
                  ]}
                  onPress={() => handleBusinessTypeChange('individual')}
                >
                  <Text style={[
                    styles.businessTypeButtonText,
                    { 
                      color: onboardingData.businessType === 'individual' 
                        ? theme.colors.background 
                        : theme.colors.text 
                    }
                  ]}>
                    Individual
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.businessTypeButton,
                    onboardingData.businessType === 'company' && {
                      backgroundColor: theme.colors.primary,
                      borderColor: theme.colors.primary
                    },
                    { borderColor: theme.colors.border }
                  ]}
                  onPress={() => handleBusinessTypeChange('company')}
                >
                  <Text style={[
                    styles.businessTypeButtonText,
                    { 
                      color: onboardingData.businessType === 'company' 
                        ? theme.colors.background 
                        : theme.colors.text 
                    }
                  ]}>
                    Company
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {onboardingData.businessType === 'company' && (
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                  Business Description *
                </Text>
                <TextInput
                  style={[
                    styles.input, 
                    styles.textArea,
                    { 
                      backgroundColor: theme.colors.background, 
                      borderColor: theme.colors.border,
                      color: theme.colors.text 
                    }
                  ]}
                  placeholder="Describe what you sell or do"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={onboardingData.businessDescription}
                  onChangeText={(value) => updateOnboardingData('businessDescription', value)}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            )}

            {onboardingData.businessType === 'company' && (
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                  Business Website
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.colors.background, 
                    borderColor: theme.colors.border,
                    color: theme.colors.text 
                  }]}
                  placeholder="https://your-website.com"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={onboardingData.businessWebsite}
                  onChangeText={(value) => updateOnboardingData('businessWebsite', value)}
                  keyboardType="url"
                />
              </View>
            )}

            <TouchableOpacity
              style={[styles.continueButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleNext}
            >
              <Text style={[styles.continueButtonText, { color: theme.colors.background }]}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 1: // Personal Info
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
              Personal Information
            </Text>
            <Text style={[styles.stepSubtitle, { color: theme.colors.textSecondary }]}>
              This information is required for identity verification
            </Text>
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                  First Name *
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.colors.background, 
                    borderColor: theme.colors.border,
                    color: theme.colors.text 
                  }]}
                  placeholder="First name"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={onboardingData.firstName}
                  onChangeText={(value) => updateOnboardingData('firstName', value)}
                />
              </View>
              
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                  Last Name *
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.colors.background, 
                    borderColor: theme.colors.border,
                    color: theme.colors.text 
                  }]}
                  placeholder="Last name"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={onboardingData.lastName}
                  onChangeText={(value) => updateOnboardingData('lastName', value)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                Email Address *
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.background, 
                  borderColor: theme.colors.border,
                  color: theme.colors.text 
                }]}
                placeholder="your@email.com"
                placeholderTextColor={theme.colors.textSecondary}
                value={onboardingData.email}
                onChangeText={(value) => updateOnboardingData('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                Phone Number *
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.background, 
                  borderColor: theme.colors.border,
                  color: theme.colors.text 
                }]}
                placeholder="(555) 123-4567"
                placeholderTextColor={theme.colors.textSecondary}
                value={onboardingData.phone}
                onChangeText={(value) => updateOnboardingData('phone', value)}
                keyboardType="phone-pad"
              />
            </View>

            <TouchableOpacity
              style={[styles.continueButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleNext}
            >
              <Text style={[styles.continueButtonText, { color: theme.colors.background }]}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 2: // Address
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
              Business Address
            </Text>
            <Text style={[styles.stepSubtitle, { color: theme.colors.textSecondary }]}>
              This is where payments will be processed
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                Street Address *
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.background, 
                  borderColor: theme.colors.border,
                  color: theme.colors.text 
                }]}
                placeholder="123 Main St"
                placeholderTextColor={theme.colors.textSecondary}
                value={onboardingData.street}
                onChangeText={(value) => updateOnboardingData('street', value)}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.flex2]}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                  City *
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.colors.background, 
                    borderColor: theme.colors.border,
                    color: theme.colors.text 
                  }]}
                  placeholder="New York"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={onboardingData.city}
                  onChangeText={(value) => updateOnboardingData('city', value)}
                />
              </View>
              
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                  State *
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.colors.background, 
                    borderColor: theme.colors.border,
                    color: theme.colors.text 
                  }]}
                  placeholder="NY"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={onboardingData.state}
                  onChangeText={(value) => updateOnboardingData('state', value)}
                  maxLength={2}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                  ZIP Code *
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.colors.background, 
                    borderColor: theme.colors.border,
                    color: theme.colors.text 
                  }]}
                  placeholder="10001"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={onboardingData.zipCode}
                  onChangeText={(value) => updateOnboardingData('zipCode', value)}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                  Country
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.colors.background, 
                    borderColor: theme.colors.border,
                    color: theme.colors.text 
                  }]}
                  placeholder="US"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={onboardingData.country}
                  onChangeText={(value) => updateOnboardingData('country', value)}
                  maxLength={2}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.continueButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleNext}
            >
              <Text style={[styles.continueButtonText, { color: theme.colors.background }]}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 3: // Bank Account
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
              Bank Account Information
            </Text>
            <Text style={[styles.stepSubtitle, { color: theme.colors.textSecondary }]}>
              This is where your earnings will be deposited
            </Text>
            
            <View style={[styles.securityNotice, { backgroundColor: theme.colors.warning + '15', borderColor: theme.colors.warning }]}>
              <Ionicons name="shield-checkmark" size={20} color={theme.colors.warning} />
              <Text style={[styles.securityNoticeText, { color: theme.colors.text }]}>
                Your bank information is encrypted and securely transmitted to Stripe
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                Account Holder Name *
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.background, 
                  borderColor: theme.colors.border,
                  color: theme.colors.text 
                }]}
                placeholder="Name on bank account"
                placeholderTextColor={theme.colors.textSecondary}
                value={onboardingData.accountHolderName}
                onChangeText={(value) => updateOnboardingData('accountHolderName', value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                Account Number *
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.background, 
                  borderColor: theme.colors.border,
                  color: theme.colors.text 
                }]}
                placeholder="123456789"
                placeholderTextColor={theme.colors.textSecondary}
                value={onboardingData.accountNumber}
                onChangeText={(value) => updateOnboardingData('accountNumber', value)}
                keyboardType="numeric"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                Routing Number *
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.colors.background, 
                  borderColor: theme.colors.border,
                  color: theme.colors.text 
                }]}
                placeholder="021000021"
                placeholderTextColor={theme.colors.textSecondary}
                value={onboardingData.routingNumber}
                onChangeText={(value) => updateOnboardingData('routingNumber', value)}
                keyboardType="numeric"
                maxLength={9}
              />
            </View>

            <TouchableOpacity
              style={[styles.continueButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleNext}
            >
              <Text style={[styles.continueButtonText, { color: theme.colors.background }]}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        );

      case 4: // Review
        return (
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
              Review Your Information
            </Text>
            <Text style={[styles.stepSubtitle, { color: theme.colors.textSecondary }]}>
              Please review all information before submitting
            </Text>
            
            <View style={[styles.reviewSection, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.reviewSectionTitle, { color: theme.colors.text }]}>
                Business Information
              </Text>
              <View style={styles.reviewItem}>
                <Text style={[styles.reviewLabel, { color: theme.colors.textSecondary }]}>Business Name:</Text>
                <Text style={[styles.reviewValue, { color: theme.colors.text }]}>{onboardingData.businessName}</Text>
              </View>
              <View style={styles.reviewItem}>
                <Text style={[styles.reviewLabel, { color: theme.colors.textSecondary }]}>Type:</Text>
                <Text style={[styles.reviewValue, { color: theme.colors.text }]}>{onboardingData.businessType}</Text>
              </View>
              <View style={styles.reviewItem}>
                <Text style={[styles.reviewLabel, { color: theme.colors.textSecondary }]}>Description:</Text>
                <Text style={[styles.reviewValue, { color: theme.colors.text }]}>{onboardingData.businessDescription}</Text>
              </View>
            </View>

            <View style={[styles.reviewSection, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.reviewSectionTitle, { color: theme.colors.text }]}>
                Personal Information
              </Text>
              <View style={styles.reviewItem}>
                <Text style={[styles.reviewLabel, { color: theme.colors.textSecondary }]}>Name:</Text>
                <Text style={[styles.reviewValue, { color: theme.colors.text }]}>
                  {onboardingData.firstName} {onboardingData.lastName}
                </Text>
              </View>
              <View style={styles.reviewItem}>
                <Text style={[styles.reviewLabel, { color: theme.colors.textSecondary }]}>Email:</Text>
                <Text style={[styles.reviewValue, { color: theme.colors.text }]}>{onboardingData.email}</Text>
              </View>
              <View style={styles.reviewItem}>
                <Text style={[styles.reviewLabel, { color: theme.colors.textSecondary }]}>Phone:</Text>
                <Text style={[styles.reviewValue, { color: theme.colors.text }]}>{onboardingData.phone}</Text>
              </View>
            </View>

            <View style={[styles.reviewSection, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.reviewSectionTitle, { color: theme.colors.text }]}>
                Address
              </Text>
              <Text style={[styles.reviewValue, { color: theme.colors.text }]}>
                {onboardingData.street}
              </Text>
              <Text style={[styles.reviewValue, { color: theme.colors.text }]}>
                {onboardingData.city}, {onboardingData.state} {onboardingData.zipCode}
              </Text>
              <Text style={[styles.reviewValue, { color: theme.colors.text }]}>
                {onboardingData.country}
              </Text>
            </View>

            <View style={[styles.reviewSection, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <Text style={[styles.reviewSectionTitle, { color: theme.colors.text }]}>
                Bank Account
              </Text>
              <View style={styles.reviewItem}>
                <Text style={[styles.reviewLabel, { color: theme.colors.textSecondary }]}>Account Holder:</Text>
                <Text style={[styles.reviewValue, { color: theme.colors.text }]}>{onboardingData.accountHolderName}</Text>
              </View>
              <View style={styles.reviewItem}>
                <Text style={[styles.reviewLabel, { color: theme.colors.textSecondary }]}>Account Number:</Text>
                <Text style={[styles.reviewValue, { color: theme.colors.text }]}>
                  ****{onboardingData.accountNumber.slice(-4)}
                </Text>
              </View>
              <View style={styles.reviewItem}>
                <Text style={[styles.reviewLabel, { color: theme.colors.textSecondary }]}>Routing Number:</Text>
                <Text style={[styles.reviewValue, { color: theme.colors.text }]}>{onboardingData.routingNumber}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.continueButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleNext}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={theme.colors.background} />
              ) : (
                <Text style={[styles.continueButtonText, { color: theme.colors.background }]}>
                  Submit Application
                </Text>
              )}
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Seller Setup
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress Steps */}
      <View style={styles.progressContainer}>
        {steps.map((step, index) => (
          <View key={index} style={styles.progressStep}>
            <View
              style={[
                styles.progressDot,
                index <= currentStep && {
                  backgroundColor: theme.colors.primary
                },
                { borderColor: theme.colors.border }
              ]}
            >
              <Ionicons
                name={index < currentStep ? 'checkmark' : step.icon}
                size={16}
                color={index <= currentStep ? theme.colors.background : theme.colors.textSecondary}
              />
            </View>
            <Text
              style={[
                styles.progressLabel,
                index === currentStep && { color: theme.colors.primary },
                { color: theme.colors.textSecondary }
              ]}
            >
              {step.title}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {renderStepContent()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={[styles.footer, { backgroundColor: theme.colors.background, borderTopColor: theme.colors.border }]}>
        <View style={styles.buttonRow}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: theme.colors.border }]}
              onPress={handlePrevious}
            >
              <Text style={[styles.secondaryButtonText, { color: theme.colors.text }]}>
                Previous
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[
              styles.primaryButton,
              { backgroundColor: theme.colors.primary }
            ]}
            onPress={handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={theme.colors.background} />
            ) : (
              <Text style={[styles.primaryButtonText, { color: theme.colors.background }]}>
                {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  headerSpacer: { width: 24 },
  
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  progressLabel: { fontSize: 10, textAlign: 'center' },
  
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  
  stepContent: {
    minHeight: 400,
  },
  stepTitle: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  stepSubtitle: { fontSize: 16, marginBottom: 24 },
  
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  
  row: { flexDirection: 'row', gap: 12 },
  flex1: { flex: 1 },
  flex2: { flex: 2 },
  
  businessTypeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  businessTypeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  businessTypeButtonText: { fontSize: 14, fontWeight: '500' },
  
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
  },
  securityNoticeText: { flex: 1, fontSize: 14 },
  
  reviewSection: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  reviewSectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewLabel: { fontSize: 14 },
  reviewValue: { fontSize: 14, fontWeight: '500' },
  
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopWidth: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: { fontSize: 16, fontWeight: '600' },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  secondaryButtonText: { fontSize: 14, fontWeight: '500' },

  continueButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  continueButtonText: { fontSize: 16, fontWeight: '600' },
});
