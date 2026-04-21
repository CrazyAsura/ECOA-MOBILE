import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import { Motion } from '@legendapp/motion';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Gluestack Components
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { NotificationBell } from '@/components/navigation/NotificationBell';

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
    >
      <Box 
        className="px-5 pb-4 border-b-[0.5px] z-100"
        style={{ 
          paddingTop: insets.top + 10,
          backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF',
          borderBottomColor: isDark ? '#222' : '#EEE'
        }}
      >
        <HStack className="justify-between items-center">
          <Motion.View
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 300 }}
          >
            <Text className="text-2xl font-black tracking-widest" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>
              ECOA<Text className="text-[#00FF9C]">.</Text>
            </Text>
          </Motion.View>

          <HStack className="items-center gap-3">
            <NotificationBell isDark={isDark} />

            <TouchableOpacity 
              onPress={toggleColorMode}
              activeOpacity={0.7}
            >
              <Box className="p-2.5 rounded-xl" style={{ backgroundColor: isDark ? '#161616' : '#F5F5F5' }}>
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
              </Box>
            </TouchableOpacity>
          </HStack>
        </HStack>
      </Box>
    </Motion.View>
  );
};
