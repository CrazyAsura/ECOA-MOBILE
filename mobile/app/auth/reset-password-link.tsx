import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Motion } from '@legendapp/motion';
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ResetPasswordLinkScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const router = useRouter();

  const handleFinish = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCompleted(true);
    }, 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {completed ? (
        <Motion.View initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={styles.successWrapper}>
           <CheckCircle color="#00FF9C" size={100} strokeWidth={1} />
           <Text style={styles.title}>Senha Alterada!</Text>
           <Text style={styles.subtitle}>Sua nova senha foi definida com sucesso. Use-a para entrar na sua conta.</Text>
           <TouchableOpacity style={styles.finishBtn} onPress={() => router.replace('/auth/login')}>
             <Text style={styles.finishBtnText}>Ir para o Login</Text>
           </TouchableOpacity>
        </Motion.View>
      ) : (
        <Motion.View initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Text style={styles.title}>Nova Senha</Text>
          <Text style={styles.subtitle}>Crie uma nova senha forte para proteger sua conta ECOA.</Text>

          <View style={styles.form}>
            <View style={styles.inputBox}>
              <Lock size={20} color="#666" />
              <TextInput 
                placeholder="Nova Senha" 
                placeholderTextColor="#666" 
                secureTextEntry={!showPassword}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
              </TouchableOpacity>
            </View>

            <View style={styles.inputBox}>
              <Lock size={20} color="#666" />
              <TextInput 
                placeholder="Confirmar Nova Senha" 
                placeholderTextColor="#666" 
                secureTextEntry={!showPassword}
                style={styles.input}
              />
            </View>

            <TouchableOpacity style={styles.actionBtn} onPress={handleFinish} disabled={loading}>
                {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.actionBtnText}>Redefinir Senha</Text>}
            </TouchableOpacity>
          </View>
        </Motion.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  content: { padding: 30, paddingTop: 100 },
  title: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  subtitle: { color: '#888', fontSize: 16, marginTop: 10, marginBottom: 50 },
  form: { gap: 20 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161616', borderRadius: 18, height: 65, paddingHorizontal: 20, gap: 15 },
  input: { flex: 1, color: '#FFF', fontSize: 16 },
  actionBtn: { backgroundColor: '#00FF9C', height: 65, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  actionBtnText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  successWrapper: { alignItems: 'center', paddingTop: 40 },
  finishBtn: { backgroundColor: '#00FF9C', height: 65, borderRadius: 20, width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  finishBtnText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
});
