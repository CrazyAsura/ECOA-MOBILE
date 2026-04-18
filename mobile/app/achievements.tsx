import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Award, Star, Zap, ShieldCheck, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function AchievementsScreen() {
  const router = useRouter();

  const BADGES = [
    { icon: Zap, label: 'Primeira Denúncia', status: 'Conquistado', date: '10 Jan' },
    { icon: Star, label: 'Eco Guerreiro', status: 'Em progresso (8/10)', progress: 0.8 },
    { icon: ShieldCheck, label: 'Protector Local', status: 'Bloqueado', lock: true },
    { icon: Award, label: 'Mestre da Reciclagem', status: 'Conquistado', date: '05 Mar' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color="#00FF9C" size={30} />
        </TouchableOpacity>
        <Text style={styles.title}>Minhas Conquistas</Text>
      </View>

      <View style={styles.levelCard}>
        <Text style={styles.levelLabel}>NÍVEL 04</Text>
        <Text style={styles.points}>1.250 <Text style={styles.xpText}>XP</Text></Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '65%' }]} />
        </View>
        <Text style={styles.progressSub}>Mais 250 XP para o Nível 05</Text>
      </View>

      <View style={styles.grid}>
        {BADGES.map((item, index) => (
          <View key={index} style={[styles.badgeCard, item.lock && styles.badgeLocked]}>
            <View style={[styles.iconCircle, { backgroundColor: item.lock ? '#111' : 'rgba(0, 255, 156, 0.1)' }]}>
              <item.icon size={30} color={item.lock ? '#444' : '#00FF9C'} />
            </View>
            <Text style={[styles.badgeLabel, item.lock && { color: '#666' }]}>{item.label}</Text>
            <Text style={styles.badgeStatus}>{item.status}</Text>
            {item.progress && (
              <View style={styles.badgeProgress}><View style={[styles.badgeFill, { width: '80%' }]} /></View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  content: { paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, gap: 15, marginBottom: 30 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  levelCard: { margin: 24, padding: 30, backgroundColor: '#161616', borderRadius: 30, borderWidth: 1, borderColor: '#222' },
  levelLabel: { color: '#00FF9C', fontWeight: 'bold', fontSize: 13, letterSpacing: 2, marginBottom: 10 },
  points: { fontSize: 40, fontWeight: '900', color: '#FFF' },
  xpText: { fontSize: 16, color: '#666' },
  progressBar: { height: 8, backgroundColor: '#222', borderRadius: 4, marginTop: 25, marginBottom: 10, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#00FF9C' },
  progressSub: { color: '#666', fontSize: 12 },
  grid: { paddingHorizontal: 24, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 15 },
  badgeCard: { width: (width - 63) / 2, backgroundColor: '#161616', padding: 20, borderRadius: 25, alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  badgeLocked: { opacity: 0.6 },
  iconCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  badgeLabel: { color: '#FFF', fontWeight: 'bold', fontSize: 14, textAlign: 'center', marginBottom: 6 },
  badgeStatus: { color: '#666', fontSize: 11, fontWeight: 'bold' },
  badgeProgress: { width: '80%', height: 4, backgroundColor: '#222', borderRadius: 2, marginTop: 10 },
  badgeFill: { height: '100%', backgroundColor: '#00FF9C' }
});
