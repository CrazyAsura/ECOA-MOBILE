import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, ActivityIndicator, Alert } from 'react-native';
import { Motion } from '@legendapp/motion';
import { Award, Lock, CheckCircle2, Crown, ChevronLeft, Zap } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

export default function RewardPassScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState([]);
  const [user, setUser] = useState({ level: 1, isPremium: false });

  const fetchData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const userResp = await api.get(`/users/${parsed.id}`);
        setUser(userResp.data);
      }

      const rewardsResp = await api.get('/users/reward-pass/levels');
      setRewards(rewardsResp.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao carregar o Passe.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#00FF9C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft color="#FFF" size={24} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>{t('reward_pass')}</Text>
          <Text style={styles.subtitle}>{t('season1')}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!user.isPremium && (
          <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1542601906-973ad30ed289?q=80&w=1000&auto=format&fit=crop' }}
            style={styles.heroCard}
            imageStyle={{ borderRadius: 30, opacity: 0.6 }}
          >
            <View style={styles.heroOverlay}>
              <Crown color="#FFD700" size={32} fill="#FFD700" />
              <Text style={styles.heroTitle}>{t('upgrade_premium')}</Text>
              <Text style={styles.heroDesc}>{t('upgrade_desc')}</Text>
              <TouchableOpacity style={styles.premiumBtn}>
                  <Text style={styles.premiumBtnTxt}>{t('be_premium')}</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        )}

        <View style={styles.trackTop}>
          <Text style={styles.trackTitle}>{t('pass_progress')}</Text>
          <View style={styles.levelBadgeBox}>
            {user.isPremium && <Crown size={12} color="#FFD700" fill="#FFD700" />}
            <Text style={styles.levelBadge}>{t('level')} {user.level}</Text>
          </View>
        </View>

        <View style={styles.levelsList}>
          {rewards.map((item: any, index: number) => {
            const isReached = user.level >= item.level;
            return (
              <Motion.View 
                key={item.level} 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 100 }}
                style={[styles.levelRow, !isReached && styles.lockedRow]}
              >
                <View style={styles.levelMarker}>
                  <Text style={styles.levelNum}>{item.level}</Text>
                  <View style={[styles.connector, index === rewards.length - 1 && { height: 0 } ]} />
                </View>

                <View style={styles.rewardsBox}>
                  <View style={styles.rewardCard}>
                    <View style={styles.rewardInfo}>
                      <Text style={styles.rewardLabel}>{t('free')}</Text>
                      <Text style={styles.rewardName}>{item.free}</Text>
                    </View>
                    {isReached ? <CheckCircle2 color="#00FF9C" size={20} /> : <Lock color="#333" size={18} />}
                  </View>

                  <View style={[styles.rewardCard, styles.premiumCard]}>
                    <View style={styles.rewardInfo}>
                      <View style={styles.premiumRow}>
                        <Crown color="#FFD700" size={10} fill="#FFD700" />
                        <Text style={[styles.rewardLabel, { color: '#FFD700' }]}>{t('premium')}</Text>
                      </View>
                      <Text style={styles.rewardName}>{item.premium}</Text>
                    </View>
                    {isReached && user.isPremium ? <CheckCircle2 color="#FFD700" size={20} /> : <Lock color="#FFD700" size={18} opacity={0.5} />}
                  </View>
                </View>
              </Motion.View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070707' },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, gap: 15, marginBottom: 20 },
  backBtn: { width: 45, height: 45, borderRadius: 15, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  subtitle: { fontSize: 13, color: '#00FF9C', fontWeight: 'bold' },
  content: { padding: 24, paddingBottom: 100 },
  heroCard: { height: 200, marginBottom: 40, overflow: 'hidden' },
  heroOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', padding: 25, justifyContent: 'center', alignItems: 'center' },
  heroTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  heroDesc: { color: '#CCC', fontSize: 13, textAlign: 'center', marginBottom: 20 },
  premiumBtn: { backgroundColor: '#FFD700', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 15 },
  premiumBtnTxt: { color: '#000', fontWeight: 'bold' },
  trackTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  trackTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  levelBadgeBox: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1A1A1A', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8 },
  levelBadge: { color: '#00FF9C', fontWeight: 'bold' },
  levelsList: { gap: 0 },
  levelRow: { flexDirection: 'row', marginBottom: 35 },
  lockedRow: { opacity: 0.5 },
  levelMarker: { alignItems: 'center', marginRight: 20, width: 40 },
  levelNum: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1A1A1A', color: '#FFF', textAlign: 'center', lineHeight: 40, fontWeight: 'bold', borderWidth: 1, borderColor: '#333' },
  connector: { width: 2, flex: 1, backgroundColor: '#1A1A1A', marginTop: 5 },
  rewardsBox: { flex: 1, gap: 10 },
  rewardCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161616', padding: 15, borderRadius: 20, borderWidth: 1, borderColor: '#222' },
  premiumCard: { borderColor: 'rgba(255, 215, 0, 0.2)', backgroundColor: 'rgba(255, 215, 0, 0.05)' },
  rewardInfo: { flex: 1 },
  rewardLabel: { fontSize: 10, fontWeight: 'bold', color: '#666', marginBottom: 4 },
  premiumRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  rewardName: { color: '#FFF', fontSize: 15, fontWeight: '600' }
});
