import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Image, Alert, Modal, Pressable } from 'react-native';
import { Motion } from '@legendapp/motion';
import { User as UserIcon, MapPin, Phone, Lock, ChevronLeft, Check, Calendar, Users, Eye, Info } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import api from '../../services/api';

type RegStep = 1 | 2 | 3 | 4;

export default function RegisterScreen() {
  const [step, setStep] = useState<RegStep>(1);
  const [formData, setFormData] = useState({
    realName: '', identity: '', gender: '', ethnicity: '', birthDate: '',
    zipCode: '', street: '', city: '', state: '', district: '', number: '',
    ddi: '+55', ddd: '', phone: '', countryFlag: 'https://flagcdn.com/w40/br.png',
    email: '', password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const router = useRouter();

  const validateAge = (dateString: string) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    if (isNaN(birthDate.getTime())) return false;
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 18;
  };

  const fetchAddress = async () => {
    if (formData.zipCode.length === 8) {
      setLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${formData.zipCode}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setFormData({ ...formData, street: data.logradouro, city: data.localidade, state: data.uf, district: data.bairro });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRegister = async () => {
    if (!validateAge(formData.birthDate)) {
      Alert.alert("Atenção", "Você deve ser maior de 18 anos para se cadastrar.");
      setStep(1);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        realName: formData.realName,
        identity: formData.identity,
        gender: formData.gender,
        ethnicity: formData.ethnicity,
        birthDate: formData.birthDate,
        address: {
          zipCode: formData.zipCode,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          district: formData.district,
          number: formData.number || 'SN'
        },
        phones: [
          { ddi: formData.ddi, ddd: formData.ddd || '00', number: formData.phone }
        ]
      };

      await api.post('/users/register', payload);
      setShowPrivacy(false);
      Alert.alert("Sucesso", "Seu cadastro na ECOA foi realizado!");
      router.replace('/auth/login');
    } catch (error) {
       Alert.alert("Erro", "Falha ao realizar cadastro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step > 1 ? setStep((step - 1) as RegStep) : router.back()}>
          <ChevronLeft color="#00FF9C" size={30} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cadastro ECOA</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.progressRow}>
        {[1, 2, 3, 4].map(s => <View key={s} style={[styles.progressDot, { backgroundColor: step >= s ? '#00FF9C' : '#333' }]} />)}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {step === 1 && (
          <Motion.View initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Text style={styles.title}>Dados Pessoais</Text>
            <View style={styles.inputBox}><UserIcon size={20} color="#666" /><TextInput placeholder="Nome Completo" placeholderTextColor="#666" style={styles.input} value={formData.realName} onChangeText={t => setFormData({...formData, realName: t})} /></View>
            <View style={styles.inputBox}><Calendar size={20} color="#666" /><TextInput placeholder="Data de Nasc (AAAA-MM-DD)" placeholderTextColor="#666" style={styles.input} value={formData.birthDate} onChangeText={t => setFormData({...formData, birthDate: t})} /></View>
            
            <View style={styles.dropdownRow}>
               <View style={[styles.inputBox, { flex: 1 }]}><Users size={18} color="#666" /><TextInput placeholder="Gênero" placeholderTextColor="#666" style={styles.input} value={formData.gender} onChangeText={t => setFormData({...formData, gender: t})} /></View>
            </View>
            <View style={styles.inputBox}><Info size={18} color="#666" /><TextInput placeholder="Etnia" placeholderTextColor="#666" style={styles.input} value={formData.ethnicity} onChangeText={t => setFormData({...formData, ethnicity: t})} /></View>

            <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(2)}><Text style={styles.nextBtnText}>Próximo Passo</Text></TouchableOpacity>
          </Motion.View>
        )}

        {step === 2 && (
          <Motion.View initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Text style={styles.title}>Endereço</Text>
            <View style={styles.inputBox}><MapPin size={20} color="#00FF9C" /><TextInput placeholder="CEP" placeholderTextColor="#666" maxLength={8} keyboardType="numeric" style={styles.input} value={formData.zipCode} onBlur={fetchAddress} onChangeText={t => setFormData({...formData, zipCode: t})} /></View>
            <View style={styles.inputBox}><TextInput placeholder="Rua" placeholderTextColor="#444" style={styles.input} value={formData.street} onChangeText={t => setFormData({...formData, street: t})} /></View>
            <View style={styles.inputBox}><TextInput placeholder="Número" placeholderTextColor="#666" style={styles.input} value={formData.number} onChangeText={t => setFormData({...formData, number: t})} /></View>
            <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(3)}><Text style={styles.nextBtnText}>Próximo Passo</Text></TouchableOpacity>
          </Motion.View>
        )}

        {/* ... Passos 3 e 4 ... */}
        {step === 3 && (
          <Motion.View initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Text style={styles.title}>Contato</Text>
            <View style={styles.phoneGrid}>
               <View style={styles.ddiSelector}><Text style={styles.ddiText}>{formData.ddi}</Text></View>
               <View style={[styles.inputBox, { flex: 1 }]}><TextInput placeholder="Celular" placeholderTextColor="#666" style={styles.input} keyboardType="phone-pad" value={formData.phone} onChangeText={t => setFormData({...formData, phone: t})} /></View>
            </View>
            <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(4)}><Text style={styles.nextBtnText}>Próximo Passo</Text></TouchableOpacity>
          </Motion.View>
        )}

        {step === 4 && (
          <Motion.View initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Text style={styles.title}>Acesso</Text>
            <View style={styles.inputBox}><TextInput placeholder="E-mail" placeholderTextColor="#666" autoCapitalize="none" style={styles.input} value={formData.email} onChangeText={t => setFormData({...formData, email: t})} /></View>
            <View style={styles.inputBox}><Lock size={20} color="#666" /><TextInput placeholder="Senha" placeholderTextColor="#666" secureTextEntry style={styles.input} value={formData.password} onChangeText={t => setFormData({...formData, password: t})} /></View>
            <TouchableOpacity style={styles.finishBtn} onPress={() => setShowPrivacy(true)}>
              <Text style={styles.finishBtnText}>Registrar na ECOA</Text>
            </TouchableOpacity>
          </Motion.View>
        )}
      </ScrollView>

      <Modal visible={showPrivacy} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Política de Privacidade</Text>
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalText}>
                Ao se cadastrar na ECOA, você concorda com o processamento de seus dados ambientais e geográficos.
                {"\n\n"}
                Coletamos seu gênero e etnia para fins estatísticos de impacto social, garantindo total anonimato.
              </Text>
            </ScrollView>
            <View style={styles.modalFooter}>
               <TouchableOpacity style={styles.btnDecline} onPress={() => setShowPrivacy(false)}><Text style={styles.btnDeclineText}>Recusar</Text></TouchableOpacity>
               <TouchableOpacity style={styles.btnAccept} onPress={handleRegister}>
                  {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnAcceptText}>Aceitar e Criar</Text>}
               </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  progressRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginVertical: 30 },
  progressDot: { width: 40, height: 4, borderRadius: 2 },
  scrollContent: { paddingHorizontal: 30, paddingBottom: 50 },
  title: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginBottom: 30 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161616', borderRadius: 18, height: 60, paddingHorizontal: 20, gap: 15, marginBottom: 15, borderWidth: 1, borderColor: '#222' },
  input: { flex: 1, color: '#FFF', fontSize: 16 },
  dropdownRow: { flexDirection: 'row', gap: 10 },
  nextBtn: { backgroundColor: '#00FF9C', height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  nextBtnText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  finishBtn: { backgroundColor: '#00FF9C', height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  finishBtnText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  phoneGrid: { flexDirection: 'row', gap: 10 },
  ddiSelector: { width: 70, backgroundColor: '#161616', borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  ddiText: { color: '#FFF', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', padding: 25 },
  modalContent: { backgroundColor: '#161616', borderRadius: 30, padding: 30, maxHeight: '80%', borderWidth: 1, borderColor: '#333' },
  modalTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  modalScroll: { marginBottom: 20 },
  modalText: { color: '#888', lineHeight: 22, fontSize: 15 },
  modalFooter: { flexDirection: 'row', gap: 15 },
  btnDecline: { flex: 1, height: 55, borderRadius: 15, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center' },
  btnDeclineText: { color: '#FFF', fontWeight: 'bold' },
  btnAccept: { flex: 1, height: 55, borderRadius: 15, backgroundColor: '#00FF9C', justifyContent: 'center', alignItems: 'center' },
  btnAcceptText: { color: '#000', fontWeight: 'bold' }
});
