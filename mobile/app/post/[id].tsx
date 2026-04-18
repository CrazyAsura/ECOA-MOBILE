import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, MessageSquare, Heart, Send } from 'lucide-react-native';
import { Motion } from '@legendapp/motion';
import api from '../../services/api';

export default function PostDetail() {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api.get(`/forum/${id}`).then(res => {
      setPost(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <View style={styles.centered}><ActivityIndicator color="#00FF9C" /></View>;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft color="#00FF9C" size={30} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Discussão</Text>
        </View>

        <Motion.View initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.postBody}>
          <View style={styles.userRow}>
             <View style={styles.avatar}><Text style={styles.avatarTxt}>{post?.userName?.[0]}</Text></View>
             <View>
               <Text style={styles.userName}>{post?.userName}</Text>
               <Text style={styles.userSub}>{post?.category || 'Comunidade'}</Text>
             </View>
          </View>

          <Text style={styles.mainText}>{post?.content}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.stat}><Heart size={16} color="#666" /><Text style={styles.statTxt}>{post?.likes}</Text></View>
            <View style={styles.stat}><MessageSquare size={16} color="#666" /><Text style={styles.statTxt}>{post?.commentsCount}</Text></View>
          </View>
        </Motion.View>

        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Comentários (0)</Text>
          <View style={styles.emptyComments}>
             <MessageSquare size={40} color="#222" />
             <Text style={styles.emptyText}>Ainda não há comentários. Seja o primeiro a responder!</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput 
          placeholder="Escreva sua resposta..." 
          placeholderTextColor="#666" 
          style={styles.textInput}
        />
        <TouchableOpacity style={styles.sendBtn}>
          <Send color="#000" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  centered: { flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center', alignItems: 'center' },
  content: { paddingBottom: 150 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, gap: 15, marginBottom: 30 },
  backBtn: { width: 44, height: 44, borderRadius: 15, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  postBody: { paddingHorizontal: 24, marginBottom: 40 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 25 },
  avatar: { width: 50, height: 50, borderRadius: 18, backgroundColor: '#161616', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#00FF9C' },
  avatarTxt: { color: '#00FF9C', fontWeight: 'bold', fontSize: 20 },
  userName: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  userSub: { color: '#666', fontSize: 12 },
  mainText: { color: '#DDD', fontSize: 17, lineHeight: 28, marginBottom: 30 },
  statsRow: { flexDirection: 'row', gap: 20, borderTopWidth: 1, borderTopColor: '#222', paddingTop: 20 },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statTxt: { color: '#666', fontSize: 14 },
  commentsSection: { paddingHorizontal: 24 },
  commentsTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 20 },
  emptyComments: { alignItems: 'center', marginTop: 30 },
  emptyText: { color: '#333', textAlign: 'center', marginTop: 15, fontSize: 14, paddingHorizontal: 40 },
  inputArea: { position: 'absolute', bottom: 30, left: 24, right: 24, height: 65, backgroundColor: '#161616', borderRadius: 20, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, borderWidth: 1, borderColor: '#333' },
  textInput: { flex: 1, color: '#FFF', fontSize: 15 },
  sendBtn: { width: 45, height: 45, borderRadius: 15, backgroundColor: '#00FF9C', justifyContent: 'center', alignItems: 'center' }
});
