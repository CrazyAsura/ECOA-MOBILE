import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, MapPin, Calendar, Shield, Share2 } from 'lucide-react-native';
import { Motion } from '@legendapp/motion';
import api from '../../services/api';

export default function ComplaintDetail() {
  const { id } = useLocalSearchParams();
  const [complaint, setComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api.get(`/complaints/${id}`).then(res => {
      setComplaint(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <View style={styles.centered}><ActivityIndicator color="#00FF9C" /></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft color="#00FF9C" size={30} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes da Queixa</Text>
      </View>

      <Motion.View initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <View style={styles.hero}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{complaint?.status?.toUpperCase() || 'PENDENTE'}</Text>
          </View>
          <Text style={styles.title}>{complaint?.title}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Calendar size={14} color="#666" />
              <Text style={styles.metaText}>{new Date(complaint?.createdAt).toLocaleDateString()}</Text>
            </View>
            <View style={styles.metaItem}>
              <MapPin size={14} color="#666" />
              <Text style={styles.metaText}>{complaint?.location}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DESCRIÇÃO</Text>
          <Text style={styles.description}>{complaint?.description}</Text>
        </View>

        <View style={styles.privacyCard}>
          <Shield size={24} color="#00FF9C" />
          <View style={styles.privacyBody}>
             <Text style={styles.privacyTitle}>Dados Criptografados</Text>
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
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  centered: { flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center', alignItems: 'center' },
  content: { paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, gap: 15, marginBottom: 30 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  hero: { paddingHorizontal: 24, marginBottom: 40 },
  statusBadge: { backgroundColor: 'rgba(0, 255, 156, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 15 },
  statusText: { color: '#00FF9C', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  title: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginBottom: 15 },
  metaRow: { flexDirection: 'row', gap: 20 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { color: '#666', fontSize: 14 },
  section: { paddingHorizontal: 24, marginBottom: 40 },
  sectionLabel: { color: '#00FF9C', fontSize: 11, fontWeight: 'bold', letterSpacing: 2, marginBottom: 15 },
  description: { color: '#BBB', fontSize: 16, lineHeight: 26 },
  privacyCard: { marginHorizontal: 24, padding: 25, backgroundColor: '#111', borderRadius: 24, flexDirection: 'row', alignItems: 'center', gap: 20, borderWidth: 1, borderColor: '#222' },
  privacyBody: { flex: 1 },
  privacyTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  privacySub: { color: '#666', fontSize: 12, lineHeight: 18 },
  shareBtn: { margin: 24, backgroundColor: '#00FF9C', height: 60, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  shareBtnText: { color: '#000', fontSize: 16, fontWeight: 'bold' }
});
