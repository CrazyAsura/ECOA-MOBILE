import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { ChevronLeft, Bell, Moon, Sun, Languages, Smartphone, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Gluestack Components
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Switch } from '@/components/ui/switch';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Icon } from '@/components/ui/icon';

import { useTheme } from '@/context/ThemeContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { isDark, toggleColorMode } = useTheme();
  const [notifications, setNotifications] = React.useState(true);

  const toggleLanguage = async () => {
    const nextLang = i18n.language === 'pt' ? 'en' : 'pt';
    await i18n.changeLanguage(nextLang);
    await AsyncStorage.setItem('user-language', nextLang);
  };

  const currentLangName = i18n.language === 'pt' ? 'Português (BR)' : 'English (US)';

  return (
    <Box className={`flex-1 ${isDark ? 'bg-[#0A0A0A]' : 'bg-[#F8F9FA]'}`}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <HStack className="pt-16 pb-8 px-6 items-center gap-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Box className={`${isDark ? 'bg-[#161616]' : 'bg-white'} w-11 h-11 rounded-2xl items-center justify-center border ${isDark ? 'border-[#222]' : 'border-[#EEE]'}`}>
              <ChevronLeft color="#00FF9C" size={24} />
            </Box>
          </TouchableOpacity>
          <Heading className={`${isDark ? 'text-white' : 'text-black'} text-2xl font-bold`}>{t('settings')}</Heading>
        </HStack>

        {/* Preferências */}
        <VStack className="px-6 mb-8 gap-4">
          <Text className={`${isDark ? 'text-[#666]' : 'text-[#999]'} text-xs font-bold uppercase tracking-widest ml-1`}>{t('preferences')}</Text>
          
          <Box className={`${isDark ? 'bg-[#161616] border-[#222]' : 'bg-white border-[#EEE]'} p-4 rounded-[20px] border`}>
            <HStack className="items-center justify-between">
              <HStack className="items-center gap-4">
                <Box className="w-10 h-10 rounded-xl bg-emerald-500/10 items-center justify-center">
                   <Bell size={20} color="#00FF9C" />
                </Box>
                <Text className={`${isDark ? 'text-white' : 'text-black'} font-medium text-lg`}>{t('notifications')}</Text>
              </HStack>
              <Switch 
                value={notifications} 
                onValueChange={setNotifications} 
                trackColor={{ false: '#333', true: '#00FF9C' }}
                className="scale-90"
              />
            </HStack>
          </Box>

          <Box className={`${isDark ? 'bg-[#161616] border-[#222]' : 'bg-white border-[#EEE]'} p-4 rounded-[20px] border`}>
            <HStack className="items-center justify-between">
              <HStack className="items-center gap-4">
                <Box className="w-10 h-10 rounded-xl bg-emerald-500/10 items-center justify-center">
                   {isDark ? <Moon size={20} color="#00FF9C" /> : <Sun size={20} color="#00FF9C" />}
                </Box>
                <Text className={`${isDark ? 'text-white' : 'text-black'} font-medium text-lg`}>{t('dark_mode')}</Text>
              </HStack>
              <Switch 
                value={isDark} 
                onValueChange={toggleColorMode}
                trackColor={{ false: '#DDD', true: '#00FF9C' }}
                className="scale-90"
              />
            </HStack>
          </Box>

          <TouchableOpacity onPress={toggleLanguage}>
             <Box className={`${isDark ? 'bg-[#161616] border-[#222]' : 'bg-white border-[#EEE]'} p-4 rounded-[20px] border`}>
                <HStack className="items-center justify-between">
                  <HStack className="items-center gap-4">
                    <Box className="w-10 h-10 rounded-xl bg-emerald-500/10 items-center justify-center">
                       <Languages size={20} color="#00FF9C" />
                    </Box>
                    <Text className={`${isDark ? 'text-white' : 'text-black'} font-medium text-lg`}>{t('language')}</Text>
                  </HStack>
                  <HStack className="items-center gap-2">
                    <Text className={`${isDark ? 'text-[#666]' : 'text-[#888]'} text-sm`}>{currentLangName}</Text>
                    <Check size={14} color="#00FF9C" />
                  </HStack>
                </HStack>
             </Box>
          </TouchableOpacity>
        </VStack>

        {/* Aplicativo */}
        <VStack className="px-6 mb-8 gap-4">
          <Text className={`${isDark ? 'text-[#666]' : 'text-[#999]'} text-xs font-bold uppercase tracking-widest ml-1`}>{t('app')}</Text>
          <Box className={`${isDark ? 'bg-[#161616] border-[#222]' : 'bg-white border-[#EEE]'} p-4 rounded-[20px] border`}>
            <HStack className="items-center justify-between">
              <HStack className="items-center gap-4">
                <Box className="w-10 h-10 rounded-xl bg-emerald-500/10 items-center justify-center">
                   <Smartphone size={20} color="#00FF9C" />
                </Box>
                <Text className={`${isDark ? 'text-white' : 'text-black'} font-medium text-lg`}>{t('version')}</Text>
              </HStack>
              <Text className={`${isDark ? 'text-[#666]' : 'text-[#888]'} text-sm`}>1.0.5v</Text>
            </HStack>
          </Box>
        </VStack>
      </ScrollView>
    </Box>
  );
}
