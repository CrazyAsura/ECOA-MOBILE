import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Motion } from '@legendapp/motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import api from '../../services/api';

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/users/login', { email, password });
      
      if (response.data.error) {
        Alert.alert("Erro", "Credenciais inválidas.");
      } else {
        // Sucesso: Redireciona para o app
        router.replace('/history');
      }
    } catch (error) {
      Alert.alert("Erro", "Falha na conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Motion.View initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={styles.header}>
        <Text style={styles.logoText}>ECOA</Text>
        <Text style={styles.title}>Bem-vindo!</Text>
      </Motion.View>

      <View style={styles.form}>
        <View style={styles.inputBox}>
          <Mail size={20} color="#666" />
          <TextInput 
            placeholder="E-mail" 
            placeholderTextColor="#666" 
            style={styles.input} 
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputBox}>
          <Lock size={20} color="#666" />
          <TextInput 
            placeholder="Senha" 
            placeholderTextColor="#666" 
            secureTextEntry={!showPassword} 
            style={styles.input} 
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push('/auth/reset-password')} style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.loginBtnText}>Entrar</Text>}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Novo por aqui? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/register')}>
            <Text style={styles.signupText}>Criar Conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  content: { padding: 30, paddingTop: 100 },
  header: { marginBottom: 50 },
  logoText: { color: '#00FF9C', fontSize: 28, fontWeight: '900', letterSpacing: 4, marginBottom: 20 },
  title: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  form: { gap: 20 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161616', borderRadius: 18, height: 65, paddingHorizontal: 20, gap: 15, borderWidth: 1, borderColor: '#222' },
  input: { flex: 1, color: '#FFF', fontSize: 16 },
  forgotBtn: { alignSelf: 'flex-end' },
  forgotText: { color: '#00FF9C', fontSize: 14 },
  loginBtn: { backgroundColor: '#00FF9C', height: 65, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  loginBtnText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { color: '#666' },
  signupText: { color: '#00FF9C', fontWeight: 'bold' },
});
