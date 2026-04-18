import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Motion } from '@legendapp/motion';
import { CheckCircle2, Clock, AlertTriangle, MoreVertical, Trash2, Edit3, ChevronRight } from 'lucide-react-native';
import api from '../services/api';
import { useRouter } from 'expo-router';

interface Complaint {
  id: string;
  title: string;
  location: string;
  status: string;
  createdAt: string;
}

export default function HistoryScreen() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchComplaints = async () => {
    try {
      const response = await api.get('/complaints');
      setComplaints(response.data.items || response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, []);

  const handleDelete = (id: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja remover esta queixa?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/complaints/${id}`);
              setComplaints(prev => prev.filter(c => c.id !== id));
            } catch (e) {
              Alert.alert("Erro", "Não foi possível excluir.");
            }
          }
        }
      ]
    );
  };

  const getStatusProps = (status: string) => {
    switch (status) {
      case 'resolved': return { color: '#00FF9C', label: 'Resolvida', icon: CheckCircle2 };
      case 'analyzing': return { color: '#FFD700', label: 'Em Análise', icon: Clock };
      default: return { color: '#FF4B4B', label: 'Pendente', icon: AlertTriangle };
    }
  };

  if (loading) return <View style={styles.centered}><ActivityIndicator color="#00FF9C" size="large" /></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Minhas Queixas</Text>
      
      <View style={styles.list}>
        {complaints.map((item, index) => {
          const status = getStatusProps(item.status);
          return (
            <Motion.View key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <View style={styles.card}>
                <TouchableOpacity 
                   style={styles.cardMain} 
                   // Force casting to any to satisfy Expo Router strict path typing
                   onPress={() => router.push(`/complaint/${item.id}` as any)}
                >
                  <View style={[styles.statusLine, { backgroundColor: status.color }]} />
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardLocal}>{item.location}</Text>
                    <View style={styles.statusBadge}>
                       <status.icon size={12} color={status.color} />
                       <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <View style={styles.cardActions}>
                   <TouchableOpacity style={styles.actionIcon} onPress={() => {}}>
                      <Edit3 size={18} color="#666" />
                   </TouchableOpacity>
                   <TouchableOpacity style={styles.actionIcon} onPress={() => handleDelete(item.id)}>
                      <Trash2 size={18} color="#FF4B4B" />
                   </TouchableOpacity>
                </View>
              </View>
            </Motion.View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  centered: { flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center', alignItems: 'center' },
  content: { padding: 24, paddingBottom: 150 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FFF', marginBottom: 30, paddingTop: 40 },
  list: { gap: 16 },
  card: { backgroundColor: '#161616', borderRadius: 24, flexDirection: 'row', overflow: 'hidden', borderWidth: 1, borderColor: '#222' },
  cardMain: { flex: 1, flexDirection: 'row', padding: 20 },
  statusLine: { width: 4, height: '100%', position: 'absolute', left: 0 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 4 },
  cardLocal: { fontSize: 13, color: '#666', marginBottom: 12 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.02)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  cardActions: { width: 60, justifyContent: 'center', alignItems: 'center', gap: 15, borderLeftWidth: 1, borderLeftColor: '#222' },
  actionIcon: { padding: 8 }
});
