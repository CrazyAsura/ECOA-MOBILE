import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Motion } from '@legendapp/motion';
import { PlayCircle, Clock, BookOpen, ChevronRight } from 'lucide-react-native';
import api from '../services/api';

interface Course {
  id: string;
  title: string;
  level: string;
  modulesCount: number;
  duration: string;
}

export default function CoursesScreen() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      // Fix: Resposta paginada retorna { items, total... }
      const items = res.data?.items || (Array.isArray(res.data) ? res.data : []);
      setCourses(items);
    } catch (e) {
      console.error('Erro ao buscar cursos:', e);
      setCourses([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  if (loading) return <View style={styles.centered}><ActivityIndicator color="#00FF9C" size="large" /></View>;

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchCourses(); }} tintColor="#00FF9C" />}
    >
      <Text style={styles.title}>Cursos</Text>
      <Text style={styles.subtitle}>Aprenda sobre sustentabilidade e impacto ambiental.</Text>

      <View style={styles.grid}>
        {(courses || []).length === 0 ? (
          <Text style={styles.emptyText}>Nenhum curso disponível no momento.</Text>
        ) : (
          (courses || []).map((course, index) => (
            <Motion.View 
              key={course.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 100 }}
            >
              <TouchableOpacity style={styles.card}>
                <View style={styles.cardVisual}>
                  <PlayCircle size={40} color="#00FF9C" />
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardLevel}>{course.level}</Text>
                  <Text style={styles.cardTitle}>{course.title}</Text>
                  <View style={styles.cardStats}>
                    <View style={styles.statItem}>
                      <BookOpen size={14} color="#666" />
                      <Text style={styles.statText}>{course.modulesCount} módulos</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Clock size={14} color="#666" />
                      <Text style={styles.statText}>{course.duration}</Text>
                    </View>
                  </View>
                </View>
                <ChevronRight color="#333" size={24} style={styles.chevron} />
              </TouchableOpacity>
            </Motion.View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  centered: { flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center', alignItems: 'center' },
  content: { padding: 24, paddingBottom: 120 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FFF', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#888', marginBottom: 40 },
  grid: { gap: 20 },
  card: { backgroundColor: '#161616', borderRadius: 24, padding: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  cardVisual: { width: 80, height: 80, borderRadius: 20, backgroundColor: 'rgba(0, 255, 156, 0.05)', justifyContent: 'center', alignItems: 'center' },
  cardBody: { flex: 1, paddingLeft: 20 },
  cardLevel: { color: '#00FF9C', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  cardTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  cardStats: { flexDirection: 'row', gap: 15 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statText: { color: '#666', fontSize: 12 },
  chevron: { marginRight: 10 },
  emptyText: { color: '#666', textAlign: 'center', marginTop: 40 }
});
