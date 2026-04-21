import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, useRouter, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProviders } from '@/providers/AppProviders';
import '@/i18n';

// Custom Navigation Components
import { TopBar } from '@/components/navigation/TopBar';
import { BottomBar } from '@/components/navigation/BottomBar';
import { FabModal } from '@/components/navigation/FabModal';
import { CookieConsent } from '@/components/navigation/CookieConsent';
import { ThemeProvider as CustomThemeProvider, useTheme } from '@/context/ThemeContext';

export {
  ErrorBoundary
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <CustomThemeProvider>
      <RootLayoutNav />
    </CustomThemeProvider>
  );
}

function RootLayoutNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { colorMode, toggleColorMode, isDark } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const activeTab = pathname === '/' ? 'home' : pathname.replace('/', '');

  const handleTabPress = (tab: string) => {
    if (tab === 'home') router.push('/');
    else router.push(`/${tab}` as any);
  };

  const isAuthScreen = pathname.includes('auth') || pathname === '/';

  return (
    <AppProviders>
      <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <GluestackUIProvider mode={colorMode}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            
            <View style={[styles.mainContainer, { backgroundColor: isDark ? '#0A0A0A' : '#F8F8F8' }]}>
              {!isAuthScreen && <TopBar colorMode={colorMode} toggleColorMode={toggleColorMode} />}

              <View style={[styles.content, isAuthScreen && { paddingBottom: 0 }]}>
                <Slot />
              </View>

              {!isAuthScreen && (
                <BottomBar 
                  colorMode={colorMode} 
                  activeTab={activeTab}
                  onTabPress={handleTabPress}
                  onFabPress={() => setModalVisible(true)}
                />
              )}
            </View>

            {!isAuthScreen && (
              <FabModal 
                isVisible={modalVisible} 
                onClose={() => setModalVisible(false)} 
                colorMode={colorMode}
              />
            )}

            <CookieConsent />
          </GluestackUIProvider>
        </GestureHandlerRootView>
      </NavigationThemeProvider>
    </AppProviders>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: 90, 
  }
});
