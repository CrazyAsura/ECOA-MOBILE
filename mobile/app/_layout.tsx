import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, useRouter, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProviders } from '@/providers/AppProviders';

// Custom Navigation Components
import { TopBar } from '@/components/navigation/TopBar';
import { BottomBar } from '@/components/navigation/BottomBar';
import { FabModal } from '@/components/navigation/FabModal';
import { CookieConsent } from '@/components/navigation/CookieConsent';

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

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('dark');
  const [modalVisible, setModalVisible] = useState(false);

  const toggleColorMode = () => {
    setColorMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const activeTab = pathname === '/' ? 'home' : pathname.replace('/', '');

  const handleTabPress = (tab: string) => {
    if (tab === 'home') router.push('/');
    else router.push(`/${tab}` as any); // Cast to any to satisfy Expo Router dynamic routing
  };

  const isDark = colorMode === 'dark';

  return (
    <AppProviders>
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <GluestackUIProvider mode={colorMode}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            
            <View style={[styles.mainContainer, { backgroundColor: isDark ? '#0A0A0A' : '#F8F8F8' }]}>
              <TopBar colorMode={colorMode} toggleColorMode={toggleColorMode} />

              <View style={styles.content}>
                <Slot />
              </View>

              <BottomBar 
                colorMode={colorMode} 
                activeTab={activeTab}
                onTabPress={handleTabPress}
                onFabPress={() => setModalVisible(true)}
              />
            </View>

            <FabModal 
              isVisible={modalVisible} 
              onClose={() => setModalVisible(false)} 
              colorMode={colorMode}
            />

            <CookieConsent />
          </GluestackUIProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
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
