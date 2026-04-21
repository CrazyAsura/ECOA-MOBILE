import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Motion } from '@legendapp/motion';
import { 
  Settings, Shield, Award, 
  ChevronRight, LogOut, Star, Edit3, Zap 
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

// Components
import { ProfileFrame } from '@/components/profile/profile-frame';
import { CustomizationModal } from '@/components/profile/customization-modal';

// Gluestack Components
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';

import { useTheme } from '@/context/ThemeContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isDark, toggleColorMode } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unlockedItems, setUnlockedItems] = useState([]);
  const [user, setUser] = useState({
    id: '',
    name: '...',
    level: 1,
    xp: 0,
    title: '...',
    frame: '',
  });

  const fetchProfile = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) {
        router.replace('/auth/login');
        return;
      }
      const userData = JSON.parse(storedUser);
      
      const response = await api.get(`/users/profile/${userData.id}`);
      const data = response.data;

      setUser({
        id: data.id,
        name: data.realName || data.name || 'Usuário ECOA',
        level: data.level || 1,
        xp: data.xp || 0,
        title: data.activeTitle || 'Recruta Ambiental',
        frame: data.avatarFrame || '',
      });
      setUnlockedItems(data.unlockedItems || []);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      Alert.alert("Erro", "Não foi possível carregar os dados do perfil.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSelectCustomization = (item: any) => {
    if (item.type === 'title') setUser(prev => ({ ...prev, title: item.value }));
    if (item.type === 'frame') setUser(prev => ({ ...prev, frame: item.value }));
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace('/auth/login');
  };

  const xpProgress = (user.xp % 1000) / 10;

  const menuItems = [
    { icon: Zap, label: t('reward_pass'), route: '/reward-pass', color: '#FFD700' },
    { icon: Award, label: t('my_achievements'), route: '/achievements', color: '#00FF9C' },
    { icon: Shield, label: t('security_privacy'), route: '/security', color: '#00FF9C' },
    { icon: Settings, label: t('settings'), route: '/settings', color: '#00FF9C' },
  ];

  if (loading) {
    return (
      <Box className={`flex-1 ${isDark ? 'bg-[#0A0A0A]' : 'bg-[#F8F9FA]'} items-center justify-center`}>
        <ActivityIndicator color="#00FF9C" size="large" />
      </Box>
    );
  }

  return (
    <Box className={`flex-1 ${isDark ? 'bg-[#0A0A0A]' : 'bg-[#F8F9FA]'}`}>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchProfile(); }} tintColor="#00FF9C" />}
      >
        <VStack className="items-center pt-16 px-6 mb-10">
          <Box className="relative">
            <ProfileFrame photoUrl="https://i.pravatar.cc/300" frameUrl={user.frame} size={140} />
            <TouchableOpacity 
              style={{ position: 'absolute', bottom: 5, right: 5, width: 32, height: 32, borderRadius: 16, backgroundColor: '#00FF9C', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: isDark ? '#0A0A0A' : '#F8F9FA' }} 
              onPress={() => setModalVisible(true)}
            >
              <Edit3 size={16} color="#000" />
            </TouchableOpacity>
          </Box>
          
          <Motion.View initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ alignItems: 'center', marginTop: 20 }}>
            <Heading className={`${isDark ? 'text-white' : 'text-black'} text-2xl font-bold text-center`}>{user.name}</Heading>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
               <HStack className="items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-xl mt-2">
                <Star size={12} color="#00FF9C" fill="#00FF9C" />
                <Text className="text-[#00FF9C] text-xs font-bold tracking-wider">{user.title}</Text>
              </HStack>
            </TouchableOpacity>
          </Motion.View>

          <Box className={`w-full mt-8 ${isDark ? 'bg-[#161616] border-[#222]' : 'bg-white border-[#EEE] shadow-sm'} p-5 rounded-[24px] border`}>
            <HStack className="justify-between mb-3">
              <Text className={`${isDark ? 'text-white' : 'text-black'} font-bold text-base`}>{t('level')} {user.level}</Text>
              <Text className={`${isDark ? 'text-[#666]' : 'text-[#888]'} text-sm`}>{user.xp} {t('xp_total')}</Text>
            </HStack>
            <Progress value={xpProgress} className={`${isDark ? 'bg-[#222]' : 'bg-[#EEE]'} h-2`}>
              <ProgressFilledTrack className="bg-[#00FF9C]" />
            </Progress>
          </Box>
        </VStack>

        <VStack className="px-6 gap-4">
          <Text className={`${isDark ? 'text-[#666]' : 'text-[#999]'} text-xs font-bold uppercase tracking-widest ml-1 mb-2`}>{t('account_rewards')}</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              onPress={() => router.push(item.route as any)}
            >
              <Box className={`flex-row items-center ${isDark ? 'bg-[#161616] border-[#222]' : 'bg-white border-[#EEE] shadow-sm'} p-4 rounded-[20px] border`}>
                <Box className="w-11 h-11 rounded-xl bg-emerald-500/5 items-center justify-center mr-4">
                  <item.icon size={22} color={item.color} />
                </Box>
                <Text className={`flex-1 ${isDark ? 'text-[#DDD]' : 'text-[#333]'} text-lg font-semibold`}>{item.label}</Text>
                <ChevronRight size={20} color="#333" />
              </Box>
            </TouchableOpacity>
          ))}
        </VStack>

        <TouchableOpacity onPress={handleLogout}>
          <HStack className="items-center justify-center gap-2 mt-12 p-5">
            <LogOut size={20} color="#FF4B4B" />
            <Text className="text-[#FF4B4B] text-lg font-bold">{t('logout')}</Text>
          </HStack>
        </TouchableOpacity>

        <CustomizationModal 
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          unlockedItems={unlockedItems as any}
          activeTitle={user.title}
          activeFrame={user.frame}
          onSelect={handleSelectCustomization}
        />
      </ScrollView>
    </Box>
  );
}
