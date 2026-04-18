import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Motion } from '@legendapp/motion';
import { Globe, MapPin, AlertCircle, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import api from '../services/api';

export default function GlobalComplaintsScreen() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api.get('/complaints')
      .then(res => {
        // Fix for pagination: res.data.items contains the array
        const items = res.data?.items || (Array.isArray(res.data) ? res.data : []);
        setComplaints(items);
      })
      .catch(err => {
        console.error('Erro ao buscar queixas globais:', err);
        setComplaints([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color="#00FF9C" size={30} />
        </TouchableOpacity>
        <Text style={styles.title}>Queixas Globais</Text>
      </View>

      <Text style={styles.subtitle}>Veja o que está acontecendo na sua região e ajude a monitorar.</Text>

      {loading ? (
        <ActivityIndicator color="#00FF9C" size="large" style={{ marginTop: 50 }} />
      ) : (
        <View style={styles.list}>
          {complaints.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma queixa pública encontrada.</Text>
          ) : (
            complaints.map((item, index) => (
              <Motion.View 
                key={item.id} 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 50 }}
              >
                <TouchableOpacity 
                  style={styles.card}
                  onPress={() => router.push(`/complaint/${item.id}` as any)}
                >
                  <View style={styles.cardHeader}>
                    <Globe size={16} color="#00FF9C" />
                    <Text style={styles.publicTag}>PÚBLICO</Text>
                    <Text style={styles.date}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}</Text>
                  </View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <View style={styles.locationRow}>
                     <MapPin size={14} color="#666" />
                     <Text style={styles.locationTxt}>{item.location}</Text>
                  </View>
                </TouchableOpacity>
              </Motion.View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  content: { paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, gap: 15, marginBottom: 15 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  subtitle: { color: '#666', fontSize: 15, paddingHorizontal: 24, marginBottom: 30 },
  list: { paddingHorizontal: 24, gap: 16 },
  card: { backgroundColor: '#161616', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#222' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  publicTag: { color: '#00FF9C', fontSize: 10, fontWeight: 'bold', flex: 1 },
  date: { color: '#444', fontSize: 12 },
  cardTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationTxt: { color: '#888', fontSize: 13 },
  emptyText: { color: '#666', textAlign: 'center', marginTop: 40 }
});
