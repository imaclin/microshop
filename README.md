# MicroShop React Native App

A modern e-commerce mobile application built with React Native and Expo, featuring inventory management, user profiles, and a beautiful responsive design.

## 🚀 Features

- **📱 Cross-Platform**: Works on iOS, Android, and Web
- **🛒 E-commerce**: Product listings, inventory management, and checkout
- **👤 User Profiles**: Public profiles, seller dashboards, and authentication
- **🎨 Modern UI**: Clean design with floating tab bars and responsive layouts
- **🌐 Web Support**: Optimized web experience with 800px max-width layout
- **💾 Persistent Storage**: Local storage with web compatibility
- **🔐 Authentication**: User login and registration system

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### For Mobile Development
- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **Expo Go app** (from App Store or Google Play)
- **Expo CLI** (`npm install -g @expo/cli`)

### For Web Development
- **Node.js** (version 18 or higher)
- **npm** or **yarn`
- A modern web browser (Chrome, Firefox, Safari, Edge)

### For iOS Development (Optional)
- **Xcode** (latest version)
- **iOS Simulator** (included with Xcode)
- **CocoaPods** (`sudo gem install cocoapods`)

### For Android Development (Optional)
- **Android Studio** (latest version)
- **Android SDK** (API level 33 or higher)
- **Android Virtual Device (AVD)**

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/microshop.git
cd microshop/microshop-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

#### For Mobile (Expo Go)
```bash
npm start
```
This will start the Expo development server and show a QR code. Scan it with the Expo Go app on your phone.

#### For Web
```bash
npm run web
```
This will open the app in your default web browser at `http://localhost:8081`.

#### For iOS Simulator
```bash
npm run ios
```

#### For Android Emulator
```bash
npm run android
```

## 🎯 Quick Start

1. **Install the app**: Follow the installation steps above
2. **Launch the app**: Use `npm start` for mobile or `npm run web` for web
3. **Create an account**: Sign up with email and password
4. **Explore features**:
   - Browse inventory in the "Inventory" tab
   - Create new products in the "Product" tab
   - View your profile and public profile
   - Access settings and seller dashboard

## 📱 Platform-Specific Features

### Mobile (iOS/Android)
- Native navigation and gestures
- Camera integration for product photos
- Push notifications support
- Biometric authentication (where available)

### Web
- Responsive design with 800px max-width
- Floating tab bar with rounded corners
- Keyboard-friendly navigation
- Desktop-optimized layouts

## 🔧 Development Commands

```bash
# Start development server
npm start

# Clear cache and start
npm start -- --clear

# Run on specific platforms
npm run ios          # iOS Simulator
npm run android      # Android Emulator
npm run web          # Web browser

# Build for production
npm run build        # Web build
expo build:ios       # iOS build
expo build:android   # Android build
```

## 📁 Project Structure

```
microshop-app/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # App screens
│   ├── navigation/     # Navigation configuration
│   ├── store/          # State management (Zustand)
│   ├── utils/          # Utility functions
│   └── types/          # TypeScript definitions
├── assets/             # Images and fonts
├── App.tsx             # Main app component
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## 🎨 Key Technologies

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and tooling
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation library
- **Zustand** - State management
- **React Query** - Data fetching and caching
- **Expo Vector Icons** - Icon library
- **React Native Gesture Handler** - Gesture handling

## 🔐 Environment Variables

Create a `.env.local` file in the root directory for environment-specific variables:

```env
# API Configuration
EXPO_PUBLIC_API_URL=https://your-api-url.com

# Stripe (for payments)
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key

# Other configuration
EXPO_PUBLIC_APP_NAME=MicroShop
```

## 🐛 Troubleshooting

### Common Issues

#### Black Screen on Mobile
- Ensure all dependencies are installed: `npm install`
- Clear the cache: `npm start -- --clear`
- Check for missing dependencies: `npx expo-doctor`

#### Metro Bundler Issues
- Reset Metro cache: `npx expo start -- --reset-cache`
- Clear node_modules: `rm -rf node_modules && npm install`

#### Web Build Issues
- Ensure web dependencies are installed
- Check browser console for errors
- Verify platform-specific code is properly conditionally rendered

#### Navigation Issues
- Check navigation stack configuration
- Verify screen names match between navigator and screens
- Ensure proper TypeScript types are defined

### Getting Help

1. Check the [Expo documentation](https://docs.expo.dev/)
2. Review [React Native documentation](https://reactnative.dev/)
3. Check the console output for specific error messages
4. Ensure all dependencies are up to date

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Search existing GitHub issues
3. Create a new issue with detailed information
4. Include your environment details (OS, Node version, Expo CLI version)

---

**Happy coding! 🚀**
