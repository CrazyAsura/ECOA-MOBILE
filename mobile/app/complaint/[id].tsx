import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, MapPin, Calendar, Shield, Share2 } from 'lucide-react-native';
import { Motion } from '@legendapp/motion';
import { useTheme } from '@/context/ThemeContext';
import { useComplaintDetail } from '../../hooks/useComplaintDetail';

export default function ComplaintDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isDark } = useTheme();
  
  const { complaint, loading } = useComplaintDetail(id as string);

  if (loading) return (
    <View style={[styles.centered, { backgroundColor: isDark ? '#0A0A0A' : '#F8F9FA' }]}>
      <ActivityIndicator color="#00FF9C" />
    </View>
  );

  const theme = {
    bg: isDark ? '#0A0A0A' : '#F8F9FA',
    card: isDark ? '#111' : '#FFF',
    border: isDark ? '#222' : '#EEE',
    text: isDark ? '#FFF' : '#000',
    subtext: isDark ? '#AAA' : '#666',
    description: isDark ? '#BBB' : '#444'
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={[styles.backBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
        >
          <ChevronLeft color="#00FF9C" size={30} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Detalhes da Queixa</Text>
      </View>

      <Motion.View initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <View style={styles.hero}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{complaint?.status?.toUpperCase() || 'PENDENTE'}</Text>
          </View>
          <Text style={[styles.title, { color: theme.text }]}>{complaint?.type || 'Sem Título'}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Calendar size={14} color="#666" />
              <Text style={styles.metaText}>{complaint?.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : '--/--/----'}</Text>
            </View>
            <View style={styles.metaItem}>
              <MapPin size={14} color="#666" />
              <Text style={styles.metaText}>{complaint?.location || 'Localização não informada'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DESCRIÇÃO</Text>
          <Text style={[styles.description, { color: theme.description }]}>{complaint?.description || 'Nenhuma descrição fornecida.'}</Text>
        </View>

        <View style={[styles.privacyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Shield size={24} color="#00FF9C" />
          <View style={styles.privacyBody}>
             <Text style={[styles.privacyTitle, { color: theme.text }]}>Dados Criptografados</Text>
             <Text style={styles.privacySub}>Esta queixa possui proteção AES-256. Suas informações de identificação estão ocultas.</Text>
          </View>
        </View>
      </Motion.View>

      <TouchableOpacity style={styles.shareBtn}>
        <Share2 color="#000" size={20} />
        <Text style={styles.shareBtnText}>Compartilhar Queixa</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { paddingBottom: 150 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, gap: 15, marginBottom: 30 },
  backBtn: { width: 44, height: 44, borderRadius: 15, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, borderWidth: 1 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  hero: { paddingHorizontal: 24, marginBottom: 40 },
  statusBadge: { backgroundColor: 'rgba(0, 255, 156, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 15 },
  statusText: { color: '#00FF9C', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 15 },
  metaRow: { flexDirection: 'row', gap: 20 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { color: '#666', fontSize: 14 },
  section: { paddingHorizontal: 24, marginBottom: 40 },
  sectionLabel: { color: '#00FF9C', fontSize: 11, fontWeight: 'bold', letterSpacing: 2, marginBottom: 15 },
  description: { fontSize: 16, lineHeight: 26 },
  privacyCard: { marginHorizontal: 24, padding: 25, borderRadius: 24, flexDirection: 'row', alignItems: 'center', gap: 20, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 3 },
  privacyBody: { flex: 1 },
  privacyTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  privacySub: { color: '#666', fontSize: 12, lineHeight: 18 },
  shareBtn: { margin: 24, backgroundColor: '#00FF9C', height: 65, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, shadowColor: '#00FF9C', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  shareBtnText: { color: '#000', fontSize: 18, fontWeight: 'bold' }
});
