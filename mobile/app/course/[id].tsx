import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Play, BookOpen, Clock, Star, CheckCircle } from 'lucide-react-native';
import { Motion } from '@legendapp/motion';
import api from '../../services/api';
import { useTheme } from '@/context/ThemeContext';

export default function CourseDetail() {
  const { id } = useLocalSearchParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isDark } = useTheme();

  useEffect(() => {
    api.get(`/courses/${id}`).then(res => {
      setCourse(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <View style={[styles.centered, { backgroundColor: isDark ? '#0A0A0A' : '#F8F9FA' }]}>
       <ActivityIndicator color="#00FF9C" size="large" />
    </View>
  );

  const dynamicStyles = {
    container: { backgroundColor: isDark ? '#0A0A0A' : '#F8F9FA' },
    title: { color: isDark ? '#FFF' : '#000' },
    description: { color: isDark ? '#BBB' : '#444' },
    moduleCard: { backgroundColor: isDark ? '#161616' : '#FFF', borderColor: isDark ? '#222' : '#EEE' },
    moduleTitle: { color: isDark ? '#FFF' : '#000' },
  };

  return (
    <ScrollView style={[styles.container, dynamicStyles.container]} contentContainerStyle={styles.content}>
      <View style={styles.heroSection}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft color="#00FF9C" size={30} />
          </TouchableOpacity>
        </View>

        <View style={styles.heroContent}>
           <View style={styles.badge}><Text style={styles.badgeText}>{course?.level || 'INICIANTE'}</Text></View>
           <Text style={styles.heroTitle}>{course?.title || 'Curso de Sustentabilidade'}</Text>
           <View style={styles.heroStats}>
              <View style={styles.heroStat}><Clock size={16} color="#00FF9C" /><Text style={styles.heroStatTxt}>{course?.duration || '2h 30min'}</Text></View>
              <View style={styles.heroStat}><BookOpen size={16} color="#00FF9C" /><Text style={styles.heroStatTxt}>{course?.modulesCount || 5} Módulos</Text></View>
           </View>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre o curso</Text>
          <Text style={[styles.description, dynamicStyles.description]}>
            {course?.description || 'Neste curso, você aprenderá as bases da sustentabilidade e como aplicar práticas ecológicas no seu dia a dia para gerar um impacto positivo no planeta.'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conteúdo Escolar</Text>
          <VStack style={{ gap: 12 }}>
            {[1, 2, 3].map((m) => (
              <TouchableOpacity key={m} style={[styles.moduleCard, dynamicStyles.moduleCard]}>
                <View style={styles.moduleIcon}>
                   <Play size={16} color="#00FF9C" fill="#00FF9C" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.moduleTitle, dynamicStyles.moduleTitle]}>Módulo {m}: Introdução ao Tema</Text>
                  <Text style={styles.moduleSub}>15 minutos • Vídeo aula</Text>
                </View>
                <CheckCircle size={20} color="#222" />
              </TouchableOpacity>
            ))}
          </VStack>
        </View>

        <TouchableOpacity style={styles.startBtn}>
          <Text style={styles.startBtnText}>Iniciar Curso</Text>
          <Play size={20} color="#000" fill="#000" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const VStack = ({ children, style }: any) => <View style={style}>{children}</View>;

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { paddingBottom: 100 },
  heroSection: { height: 350, backgroundColor: '#111', justifyContent: 'flex-end', paddingBottom: 30 },
  header: { position: 'absolute', top: 50, left: 24, zIndex: 10 },
  backBtn: { width: 44, height: 44, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)' },
  heroContent: { paddingHorizontal: 24 },
  badge: { backgroundColor: '#00FF9C', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6, marginBottom: 15 },
  badgeText: { color: '#000', fontSize: 10, fontWeight: 'bold' },
  heroTitle: { color: '#FFF', fontSize: 32, fontWeight: 'bold', marginBottom: 15 },
  heroStats: { flexDirection: 'row', gap: 20 },
  heroStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroStatTxt: { color: '#AAA', fontSize: 13 },
  body: { padding: 24, borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -20, backgroundColor: 'inherit' },
  section: { marginBottom: 35 },
  sectionTitle: { color: '#00FF9C', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 15 },
  description: { fontSize: 16, lineHeight: 26 },
  moduleCard: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 20, borderWidth: 1, gap: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  moduleIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(0, 255, 156, 0.1)', justifyContent: 'center', alignItems: 'center' },
  moduleTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  moduleSub: { color: '#666', fontSize: 12 },
  startBtn: { backgroundColor: '#00FF9C', height: 65, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 10, shadowColor: '#00FF9C', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  startBtnText: { color: '#000', fontSize: 18, fontWeight: 'bold' }
});
