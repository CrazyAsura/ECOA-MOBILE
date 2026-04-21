import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Send, Image as ImageIcon } from 'lucide-react-native';
import api from '../../services/api';
import { useTheme } from '@/context/ThemeContext';

export default function CreatePostScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      await api.post('/forum', { content, category: 'Comunidade' });
      Alert.alert('Sucesso', 'Seu post foi publicado!');
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível publicar seu post.');
    } finally {
      setLoading(false);
    }
  };

  const dynamicStyles = {
    container: { backgroundColor: isDark ? '#0A0A0A' : '#F8F9FA' },
    headerTitle: { color: isDark ? '#FFF' : '#000' },
    input: { backgroundColor: isDark ? '#161616' : '#FFF', color: isDark ? '#FFF' : '#000', borderColor: isDark ? '#222' : '#EEE' },
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView style={[styles.container, dynamicStyles.container]} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft color="#00FF9C" size={30} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, dynamicStyles.headerTitle]}>Novo Post</Text>
          <TouchableOpacity 
            onPress={handlePost} 
            disabled={loading || !content.trim()}
            style={[styles.postBtn, (loading || !content.trim()) && { opacity: 0.5 }]}
          >
            {loading ? <ActivityIndicator size="small" color="#000" /> : <Send size={20} color="#000" />}
          </TouchableOpacity>
        </View>

        <TextInput
          multiline
          placeholder="O que você está pensando sobre o meio ambiente?"
          placeholderTextColor="#666"
          style={[styles.input, dynamicStyles.input]}
          value={content}
          onChangeText={setContent}
          autoFocus
        />

        <View style={styles.toolbar}>
           <TouchableOpacity style={styles.toolBtn}>
              <ImageIcon size={24} color="#666" />
              <Text style={styles.toolText}>Adicionar Imagem</Text>
           </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingHorizontal: 24, marginBottom: 30 },
  backBtn: { width: 44, height: 44, borderRadius: 15, backgroundColor: 'rgba(0, 255, 156, 0.1)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  postBtn: { width: 50, height: 50, borderRadius: 15, backgroundColor: '#00FF9C', justifyContent: 'center', alignItems: 'center' },
  input: { flex: 1, minHeight: 150, padding: 20, fontSize: 18, borderRadius: 24, borderWidth: 1, textAlignVertical: 'top', marginHorizontal: 24 },
  toolbar: { marginHorizontal: 24, marginTop: 20 },
  toolBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 15, backgroundColor: 'rgba(102,102,102,0.1)', borderRadius: 15 },
  toolText: { color: '#666', fontWeight: 'bold' }
});
