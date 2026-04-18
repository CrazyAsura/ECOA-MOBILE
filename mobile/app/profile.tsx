import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Motion } from '@legendapp/motion';
import { 
  Settings, Shield, Award, MapPin, 
  ChevronRight, LogOut, Trash2, Camera, 
  Leaf, Zap, Star, Edit3
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ProfileFrame } from '../components/profile/ProfileFrame';
import { CustomizationModal } from '../components/profile/CustomizationModal';

export default function ProfileScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState({
    name: 'Matheus Leon',
    level: 12,
    xp: 850,
    title: 'Sentinela da Natureza',
    frame: 'https://i.ibb.co/L5TFrv7/eco-frame-gold.png',
  });

  // Mock de itens desbloqueados (viria do backend na integração real)
  const UNLOCKED_ITEMS = [
    { id: '1', name: 'Título Iniciante', type: 'title', value: 'Eco-Iniciante' },
    { id: '2', name: 'Sentinela', type: 'title', value: 'Sentinela da Natureza' },
    { id: '3', name: 'Guerreiro', type: 'title', value: 'Eco-Guerreiro' },
    { id: '4', name: 'Borda Ouro', type: 'frame', value: 'https://i.ibb.co/L5TFrv7/eco-frame-gold.png' },
    { id: '5', name: 'Borda Neon', type: 'frame', value: 'https://cdn-icons-png.flaticon.com/512/3699/3699516.png' },
  ];

  const handleSelectCustomization = (item: any) => {
    if (item.type === 'title') setUser(prev => ({ ...prev, title: item.value }));
    if (item.type === 'frame') setUser(prev => ({ ...prev, frame: item.value }));
  };

  const xpProgress = (user.xp / 1000) * 100;

  const menuItems = [
    { icon: Zap, label: 'Passe de Recompensas', route: '/reward-pass', color: '#FFD700' },
    { icon: Award, label: 'Minhas Conquistas', route: '/achievements', color: '#00FF9C' },
    { icon: Shield, label: 'Segurança & Privacidade', route: '/security', color: '#00FF9C' },
    { icon: Settings, label: 'Configurações', route: '/settings', color: '#00FF9C' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.profileHeader}>
        <View>
          <ProfileFrame frameUrl={user.frame} size={140} />
          <TouchableOpacity 
            style={styles.editAvatarBtn} 
            onPress={() => setModalVisible(true)}
          >
            <Edit3 size={16} color="#000" />
          </TouchableOpacity>
        </View>
        
        <Motion.View initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.titleBadge}>
            <Star size={12} color="#00FF9C" fill="#00FF9C" />
            <Text style={styles.titleTxt}>{user.title}</Text>
          </TouchableOpacity>
        </Motion.View>

        <View style={styles.statsRow}>
          <View style={styles.xpContainer}>
            <View style={styles.xpHeader}>
              <Text style={styles.levelTxt}>Nível {user.level}</Text>
              <Text style={styles.xpTxt}>{user.xp}/1000 XP</Text>
            </View>
            <View style={styles.xpBarBackground}>
              <Motion.View 
                initial={{ width: 0 }} 
                animate={{ width: `${xpProgress}%` }} 
                style={styles.xpBarFill} 
              />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.menuList}>
        <Text style={styles.sectionTitle}>Conta & Recompensas</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.menuItem}
            onPress={() => router.push(item.route as any)}
          >
            <View style={[styles.iconBox, { backgroundColor: 'rgba(0,255,156,0.05)' }]}>
              <item.icon size={22} color={item.color} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <ChevronRight size={20} color="#333" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/auth/login')}>
        <LogOut size={20} color="#FF4B4B" />
        <Text style={styles.logoutTxt}>Sair do Aplicativo</Text>
      </TouchableOpacity>

      <CustomizationModal 
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        unlockedItems={UNLOCKED_ITEMS as any}
        activeTitle={user.title}
        activeFrame={user.frame}
        onSelect={handleSelectCustomization}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  content: { paddingBottom: 120 },
  profileHeader: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, marginBottom: 40 },
  editAvatarBtn: { position: 'absolute', bottom: 5, right: 5, width: 32, height: 32, borderRadius: 16, backgroundColor: '#00FF9C', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#0A0A0A' },
  userInfo: { alignItems: 'center', marginTop: 20 },
  userName: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
  titleBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,255,156,0.1)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10, marginTop: 8 },
  titleTxt: { color: '#00FF9C', fontSize: 13, fontWeight: 'bold', letterSpacing: 0.5 },
  statsRow: { width: '100%', marginTop: 30 },
  xpContainer: { backgroundColor: '#161616', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#222' },
  xpHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  levelTxt: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  xpTxt: { color: '#666', fontSize: 13 },
  xpBarBackground: { height: 8, backgroundColor: '#222', borderRadius: 4, overflow: 'hidden' },
  xpBarFill: { height: '100%', backgroundColor: '#00FF9C', shadowColor: '#00FF9C', shadowRadius: 10, shadowOpacity: 0.5 },
  menuList: { paddingHorizontal: 24, gap: 15 },
  sectionTitle: { color: '#444', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10, marginLeft: 5 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161616', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#222' },
  iconBox: { width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuLabel: { flex: 1, color: '#DDD', fontSize: 16, fontWeight: '600' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 50, padding: 20 },
  logoutTxt: { color: '#FF4B4B', fontSize: 16, fontWeight: 'bold' }
});
