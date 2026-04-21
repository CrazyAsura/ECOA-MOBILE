import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Motion } from '@legendapp/motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import api from '../../services/api';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';

// Gluestack Components
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';

import { useTheme } from '@/context/ThemeContext';

export default function LoginScreen() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('welcome'), 'Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/users/login', { email, password });
      const { user, token } = response.data;

      if (!user) {
        Alert.alert('Erro', 'Credenciais inválidas.');
      } else {
        dispatch(setCredentials({ user, token }));
        router.replace('/history');
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Falha na conexão.';
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  };

  const dynamicStyles = {
    container: { backgroundColor: isDark ? '#0A0A0A' : '#F8F9FA' },
    title: { color: isDark ? '#FFF' : '#000' },
    inputBg: isDark ? 'bg-[#161616]' : 'bg-white',
    inputBorder: isDark ? 'border-[#222]' : 'border-[#EEE]',
    inputText: isDark ? 'text-white' : 'text-black',
  };

  return (
    <ScrollView style={[styles.container, dynamicStyles.container]} contentContainerStyle={styles.content}>

      <Motion.View initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={styles.header}>
        <Text style={styles.logoText}>ECOA</Text>
        <Text style={[styles.title, dynamicStyles.title]}>{t('welcome')}</Text>
      </Motion.View>

      <View style={styles.form}>
        <Input className={`${dynamicStyles.inputBorder} ${dynamicStyles.inputBg} h-[65px] rounded-[20px] border shadow-sm`}>
          <InputSlot className="pl-4"><InputIcon as={Mail} color="#666" /></InputSlot>
          <InputField 
            placeholder={t('email')} 
            className={`${dynamicStyles.inputText} placeholder:text-[#666]`} 
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </Input>

        <Input className={`${dynamicStyles.inputBorder} ${dynamicStyles.inputBg} h-[65px] rounded-[20px] border shadow-sm`}>
          <InputSlot className="pl-4"><InputIcon as={Lock} color="#666" /></InputSlot>
          <InputField 
            placeholder={t('password')} 
            className={`${dynamicStyles.inputText} placeholder:text-[#666]`} 
            secureTextEntry={!showPassword} 
            value={password}
            onChangeText={setPassword}
          />
          <InputSlot className="pr-4" onPress={() => setShowPassword(!showPassword)}>
             <InputIcon as={showPassword ? EyeOff : Eye} color="#666" />
          </InputSlot>
        </Input>

        <TouchableOpacity onPress={() => router.push('/auth/reset-password')} style={styles.forgotBtn}>
          <Text style={styles.forgotText}>{t('forgot_password')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.loginBtnText}>{t('enter')}</Text>}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('new_here')} </Text>
          <TouchableOpacity onPress={() => router.push('/auth/register')}>
            <Text style={styles.signupText}>{t('create_account')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 30, paddingTop: 100 },
  header: { marginBottom: 50 },
  logoText: { color: '#00FF9C', fontSize: 28, fontWeight: '900', letterSpacing: 4, marginBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold' },
  form: { gap: 20 },
  forgotBtn: { alignSelf: 'flex-end' },
  forgotText: { color: '#00FF9C', fontSize: 14 },
  loginBtn: { backgroundColor: '#00FF9C', height: 65, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowColor: '#00FF9C', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  loginBtnText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { color: '#666' },
  signupText: { color: '#00FF9C', fontWeight: 'bold' },
});
