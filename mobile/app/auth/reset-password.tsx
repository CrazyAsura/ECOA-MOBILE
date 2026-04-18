import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Motion } from '@legendapp/motion';
import { Mail, ChevronLeft, Send, CheckCircle2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ResetPasswordScreen() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <ChevronLeft color="#00FF9C" size={30} />
      </TouchableOpacity>

      {sent ? (
        <Motion.View initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={styles.successBox}>
          <CheckCircle2 size={80} color="#00FF9C" strokeWidth={1} />
          <Text style={styles.title}>E-mail Enviado!</Text>
          <Text style={styles.subtitle}>Verifique sua caixa de entrada para as instruções de recuperação.</Text>
          <TouchableOpacity style={styles.backToLogin} onPress={() => router.replace('/auth/login')}>
            <Text style={styles.backToLoginText}>Voltar para o Login</Text>
          </TouchableOpacity>
        </Motion.View>
      ) : (
        <Motion.View initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Text style={styles.title}>Recuperar Senha</Text>
          <Text style={styles.subtitle}>Informe o e-mail associado à sua conta ECOA.</Text>
          
          <View style={styles.inputBox}>
            <Mail size={20} color="#666" />
            <TextInput 
              placeholder="Digite seu e-mail" 
              placeholderTextColor="#666" 
              style={styles.input}
              keyboardType="email-address"
            />
          </View>

          <TouchableOpacity style={styles.actionBtn} onPress={handleReset} disabled={loading}>
            {loading ? <ActivityIndicator color="#000" /> : (
              <>
                <Text style={styles.actionBtnText}>Enviar Instruções</Text>
                <Send color="#000" size={18} />
              </>
            )}
          </TouchableOpacity>
        </Motion.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  content: { padding: 30, paddingTop: 60 },
  backBtn: { marginBottom: 40 },
  title: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  subtitle: { color: '#888', fontSize: 16, marginTop: 10, marginBottom: 40 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161616', borderRadius: 18, height: 65, paddingHorizontal: 20, gap: 15, marginBottom: 30 },
  input: { flex: 1, color: '#FFF', fontSize: 16 },
  actionBtn: { backgroundColor: '#00FF9C', height: 65, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  actionBtnText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  successBox: { alignItems: 'center', paddingTop: 50 },
  backToLogin: { marginTop: 40 },
  backToLoginText: { color: '#00FF9C', fontWeight: 'bold', fontSize: 16 },
});
