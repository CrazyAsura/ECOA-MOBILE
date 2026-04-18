import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import { Motion } from '@legendapp/motion';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TopBarProps {
  colorMode: 'light' | 'dark';
  toggleColorMode: () => void;
}

export const TopBar = ({ colorMode, toggleColorMode }: TopBarProps) => {
  const insets = useSafeAreaInsets();
  const isDark = colorMode === 'dark';

  return (
    <Motion.View 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'timing', duration: 800 }}
      style={[
        styles.container, 
        { 
          paddingTop: insets.top + 10,
          backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF',
          borderBottomColor: isDark ? '#333' : '#EEE'
        }
      ]}
    >
      <View style={styles.content}>
        <Motion.View
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 300 }}
        >
          <Text style={[styles.logo, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            ECOA<Text style={styles.dot}>.</Text>
          </Text>
        </Motion.View>

        <TouchableOpacity 
          onPress={toggleColorMode}
          activeOpacity={0.7}
          style={[styles.toggleBtn, { backgroundColor: isDark ? '#1A1A1A' : '#F5F5F5' }]}
        >
          <Motion.View
            key={colorMode}
            initial={{ opacity: 0, rotate: '90deg', scale: 0.5 }}
            animate={{ opacity: 1, rotate: '0deg', scale: 1 }}
            transition={{ type: 'spring' }}
          >
            {isDark ? (
              <Sun size={20} color="#00FF9C" />
            ) : (
              <Moon size={20} color="#00FF9C" />
            )}
          </Motion.View>
        </TouchableOpacity>
      </View>
    </Motion.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 0.5,
    zIndex: 100,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
  },
  dot: {
    color: '#00FF9C',
  },
  toggleBtn: {
    padding: 10,
    borderRadius: 12,
  }
});
