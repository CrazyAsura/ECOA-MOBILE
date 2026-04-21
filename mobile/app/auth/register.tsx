import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Modal } from 'react-native';
import { Motion } from '@legendapp/motion';
import { User as UserIcon, MapPin, Phone, Lock, ChevronLeft, Calendar as CalendarIcon, Users, Info, Hash, ChevronDown, Mail, Search, Globe } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import api from '../../services/api';
import { UserGender, UserEthnicity } from '../../constants/enums';

// Gluestack Components
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { 
  Select, 
  SelectTrigger, 
  SelectInput, 
  SelectIcon, 
  SelectPortal, 
  SelectBackdrop, 
  SelectContent, 
  SelectDragIndicatorWrapper, 
  SelectDragIndicator, 
  SelectItem,
  SelectItemText 
} from '@/components/ui/select';

type RegStep = 1 | 2 | 3 | 4;

export default function RegisterScreen() {
  const [step, setStep] = useState<RegStep>(1);
  const [countries, setCountries] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    realName: '', identity: '', gender: '' as UserGender, ethnicity: '' as UserEthnicity, birthDate: '',
    zipCode: '', street: '', city: '', state: '', district: '', number: '', country: 'Brasil',
    ddi: '+55', ddd: '', phone: '',
    email: '', password: ''
  });

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags');
      const data = await response.json();
      const formatted = data
        .filter((c: any) => c.idd.root)
        .map((c: any) => ({
          name: c.name.common,
          code: c.cca2,
          ddi: c.idd.root + (c.idd.suffixes?.[0] || ''),
          flag: c.flags.png
        }))
        .sort((a: any, b: any) => a.name.localeCompare(b.name));
      setCountries(formatted);
    } catch (e) {
      console.error("Erro ao buscar países:", e);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);
  
  const [loading, setLoading] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const router = useRouter();

  // Validação simples de e-mail e CPF
  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const maskCPF = (v: string) => {
    v = v.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
  };

  const maskDate = (v: string) => {
    v = v.replace(/\D/g, "");
    if (v.length > 8) v = v.slice(0, 8);
    return v.replace(/(\d{4})(\d{2})(\d{2})/g, "$1-$2-$3");
  };

  const maskCEP = (v: string) => {
    v = v.replace(/\D/g, "");
    if (v.length > 8) v = v.slice(0, 8);
    return v.replace(/(\d{5})(\d{3})/g, "$1-$2");
  };

  const maskPhone = (v: string) => {
    v = v.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    return v.replace(/(\d{2})(\d{4,5})(\d{4})/g, "($1) $2-$3");
  };

  const handleRegister = async () => {
    if (!isValidEmail(formData.email)) {
      Alert.alert("Erro de Validação", "Insira um e-mail válido.");
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert("Erro de Validação", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        realName: formData.realName,
        identity: formData.identity.replace(/\D/g, ""),
        gender: formData.gender,
        ethnicity: formData.ethnicity,
        birthDate: formData.birthDate,
        address: {
          zipCode: formData.zipCode.replace(/\D/g, ""),
          street: formData.street,
          city: formData.city,
          state: formData.state,
          district: formData.district,
          country: formData.country,
          number: formData.number || 'SN'
        },
        phones: [
          { ddi: formData.ddi, ddd: formData.ddd.replace(/\D/g, ""), number: formData.phone.replace(/\D/g, "") }
        ]
      };
      await api.post('/users/register', payload);
      setShowPrivacy(false);
      Alert.alert("Sucesso", "Bem-vindo à ECOA!");
      router.replace('/auth/login');
    } catch (error: any) { 
      const msg = error.response?.data?.message || "Falha no cadastro.";
      Alert.alert("Erro no Servidor", Array.isArray(msg) ? msg[0] : msg);
    } finally { setLoading(false); }
  };

  const handleCEPBlur = async () => {
    const cep = formData.zipCode.replace(/\D/g, "");
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData({
            ...formData,
            street: data.logradouro,
            district: data.bairro,
            city: data.localidade,
            state: data.uf
          });
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.realName || !formData.identity || !formData.gender || !formData.ethnicity || !formData.birthDate) {
        Alert.alert("Campos Obrigatórios", "Por favor, preencha todos os dados pessoais.");
        return false;
      }
    }
    if (step === 2) {
      if (!formData.zipCode || !formData.street || !formData.city || !formData.state || !formData.district || !formData.country) {
        Alert.alert("Campos Obrigatórios", "Por favor, preencha todos os dados de endereço.");
        return false;
      }
    }
    if (step === 3) {
      if (!formData.ddi || !formData.ddd || !formData.phone) {
        Alert.alert("Campos Obrigatórios", "Por favor, insira seu telefone completo (DDI, DDD e Número).");
        return false;
      }
    }
    if (step === 4) {
      if (!formData.email || !formData.password) {
        Alert.alert("Acesso", "E-mail e senha são necessários.");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep((step + 1) as RegStep);
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
            
            <Input className="border-[#222] bg-[#161616] h-[60px] rounded-[18px] mb-4">
              <InputSlot className="pl-4"><InputIcon as={UserIcon} color="#666" /></InputSlot>
              <InputField placeholder="Nome Completo" className="text-white" value={formData.realName} onChangeText={t => setFormData({...formData, realName: t})} />
            </Input>

            <Input className="border-[#222] bg-[#161616] h-[60px] rounded-[18px] mb-4">
              <InputSlot className="pl-4"><InputIcon as={Hash} color="#666" /></InputSlot>
              <InputField placeholder="CPF" keyboardType="numeric" maxLength={14} className="text-white" value={maskCPF(formData.identity)} onChangeText={t => setFormData({...formData, identity: t})} />
            </Input>

            <Input className="border-[#222] bg-[#161616] h-[60px] rounded-[18px] mb-4">
              <InputSlot className="pl-4"><InputIcon as={CalendarIcon} color="#666" /></InputSlot>
              <InputField placeholder="Nascimento (AAAA-MM-DD)" keyboardType="numeric" maxLength={10} className="text-white" value={maskDate(formData.birthDate)} onChangeText={t => setFormData({...formData, birthDate: t})} />
            </Input>
            
            <View style={styles.selectWrapper}>
                <Select onValueChange={(val) => setFormData({...formData, gender: val as UserGender})}>
                    <SelectTrigger variant="outline" size="xl" style={styles.gluestackSelect}>
                        <Users size={18} color="#666" style={{ marginRight: 15 }} />
                        <SelectInput placeholder="Selecione o Gênero" style={{ color: '#FFF' }} />
                        <SelectIcon style={{ marginLeft: 'auto' }} as={ChevronDown} />
                    </SelectTrigger>
                    <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent style={{ backgroundColor: '#161616', borderTopWidth: 1, borderColor: '#333' }}>
                            <SelectDragIndicatorWrapper>
                                <SelectDragIndicator />
                            </SelectDragIndicatorWrapper>
                            {Object.values(UserGender).map(g => (
                                <SelectItem key={g} label={g} value={g} className="px-4 py-3">
                                    <SelectItemText className="text-white">{g}</SelectItemText>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </SelectPortal>
                </Select>
            </View>

            <View style={styles.selectWrapper}>
                <Select onValueChange={(val) => setFormData({...formData, ethnicity: val as UserEthnicity})}>
                    <SelectTrigger variant="outline" size="xl" style={styles.gluestackSelect}>
                        <Info size={18} color="#666" style={{ marginRight: 15 }} />
                        <SelectInput placeholder="Selecione a Etnia" style={{ color: '#FFF' }} />
                        <SelectIcon style={{ marginLeft: 'auto' }} as={ChevronDown} />
                    </SelectTrigger>
                    <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent style={{ backgroundColor: '#161616', borderTopWidth: 1, borderColor: '#333' }}>
                            <SelectDragIndicatorWrapper>
                                <SelectDragIndicator />
                            </SelectDragIndicatorWrapper>
                            {Object.values(UserEthnicity).map(e => (
                                <SelectItem key={e} label={e} value={e} className="px-4 py-3">
                                    <SelectItemText className="text-white">{e}</SelectItemText>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </SelectPortal>
                </Select>
            </View>

            <TouchableOpacity style={styles.nextBtn} onPress={nextStep}><Text style={styles.nextBtnText}>Próximo Passo</Text></TouchableOpacity>
          </Motion.View>
        )}

        {step === 2 && (
          <Motion.View initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Text style={styles.title}>Endereço</Text>
            
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
              <Input className="border-[#222] bg-[#161616] h-[60px] rounded-[18px] flex-1">
                <InputSlot className="pl-4"><InputIcon as={MapPin} color="#00FF9C" /></InputSlot>
                <InputField placeholder="CEP (Brasil)" maxLength={9} keyboardType="numeric" className="text-white" value={maskCEP(formData.zipCode)} onChangeText={t => setFormData({...formData, zipCode: t})} />
              </Input>
              <TouchableOpacity 
                onPress={handleCEPBlur}
                style={{ backgroundColor: '#00FF9C', width: 60, height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center' }}
              >
                <Search color="#000" size={24} />
              </TouchableOpacity>
            </View>

            <Input className="border-[#222] bg-[#161616] h-[60px] rounded-[18px] mb-4">
               <InputSlot className="pl-4"><InputIcon as={Globe} color="#666" /></InputSlot>
               <InputField placeholder="País" className="text-white" value={formData.country} onChangeText={t => setFormData({...formData, country: t})} />
            </Input>

            <Input className="border-[#222] bg-[#161616] h-[60px] rounded-[18px] mb-4">
              <InputField placeholder="Rua" className="text-white px-5" value={formData.street} onChangeText={t => setFormData({...formData, street: t})} />
            </Input>

            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
              <Input className="border-[#222] bg-[#161616] h-[60px] rounded-[18px] flex-1">
                <InputField placeholder="Bairro" className="text-white px-5" value={formData.district} onChangeText={t => setFormData({...formData, district: t})} />
              </Input>
              <Input className="border-[#222] bg-[#161616] h-[60px] rounded-[18px] w-24">
                <InputField placeholder="UF" maxLength={2} autoCapitalize="characters" className="text-white px-5 text-center" value={formData.state} onChangeText={t => setFormData({...formData, state: t})} />
              </Input>
            </View>

            <Input className="border-[#222] bg-[#161616] h-[60px] rounded-[18px] mb-4">
              <InputField placeholder="Cidade" className="text-white px-5" value={formData.city} onChangeText={t => setFormData({...formData, city: t})} />
            </Input>

            <Input className="border-[#222] bg-[#161616] h-[60px] rounded-[18px] mb-4">
              <InputField placeholder="Número (Opcional)" className="text-white px-5" value={formData.number} onChangeText={t => setFormData({...formData, number: t})} />
            </Input>

            <TouchableOpacity style={styles.nextBtn} onPress={nextStep}><Text style={styles.nextBtnText}>Próximo Passo</Text></TouchableOpacity>
          </Motion.View>
        )}

        {step === 3 && (
          <Motion.View initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Text style={styles.title}>Contato</Text>
            
            <View style={styles.selectWrapper}>
                <Select onValueChange={(val) => setFormData({...formData, ddi: val})}>
                    <SelectTrigger variant="outline" size="xl" style={styles.gluestackSelect}>
                        <Globe size={18} color="#666" style={{ marginRight: 15 }} />
                        <SelectInput placeholder="DDI (País)" style={{ color: '#FFF' }} value={formData.ddi} />
                        <SelectIcon style={{ marginLeft: 'auto' }} as={ChevronDown} />
                    </SelectTrigger>
                    <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent style={{ backgroundColor: '#161616', borderTopWidth: 1, borderColor: '#333' }}>
                            <SelectDragIndicatorWrapper>
                                <SelectDragIndicator />
                            </SelectDragIndicatorWrapper>
                            {countries.map(c => (
                                <SelectItem key={c.code + c.ddi} label={`${c.name} (${c.ddi})`} value={c.ddi} className="px-4 py-3">
                                    <SelectItemText className="text-white">{c.name} ({c.ddi})</SelectItemText>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </SelectPortal>
                </Select>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
              <Input className="border-[#222] bg-[#161616] h-[60px] rounded-[18px] w-24">
                <InputField placeholder="DDD" keyboardType="numeric" maxLength={3} className="text-white px-5 text-center" value={formData.ddd} onChangeText={t => setFormData({...formData, ddd: t})} />
              </Input>
              <Input className="border-[#222] bg-[#161616] h-[60px] rounded-[18px] flex-1">
                <InputSlot className="pl-4"><InputIcon as={Phone} color="#666" /></InputSlot>
                <InputField placeholder="Número" keyboardType="phone-pad" className="text-white" value={formData.phone} onChangeText={t => setFormData({...formData, phone: t})} />
              </Input>
            </View>

            <TouchableOpacity style={styles.nextBtn} onPress={nextStep}><Text style={styles.nextBtnText}>Próximo Passo</Text></TouchableOpacity>
          </Motion.View>
        )}

        {step === 4 && (
          <Motion.View initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Text style={styles.title}>Acesso</Text>
            <Input className="border-[#222] bg-[#161616] h-[60px] rounded-[18px] mb-4">
               <InputSlot className="pl-4"><InputIcon as={Mail} color="#666" /></InputSlot>
               <InputField placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" className="text-white" value={formData.email} onChangeText={t => setFormData({...formData, email: t})} />
            </Input>
            <Input className="border-[#222] bg-[#161616] h-[60px] rounded-[18px] mb-4">
               <InputSlot className="pl-4"><InputIcon as={Lock} color="#666" /></InputSlot>
               <InputField placeholder="Senha (Mín. 6 caracteres)" secureTextEntry className="text-white" value={formData.password} onChangeText={t => setFormData({...formData, password: t})} />
            </Input>
            <TouchableOpacity style={styles.finishBtn} onPress={() => setShowPrivacy(true)}><Text style={styles.finishBtnText}>Registrar na ECOA</Text></TouchableOpacity>
          </Motion.View>
        )}
      </ScrollView>

      <Modal visible={showPrivacy} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Privacidade</Text>
            <Text style={styles.modalText}>Seus dados estão protegidos sob a LGPD.</Text>
            <View style={styles.modalFooter}>
               <TouchableOpacity style={styles.btnDecline} onPress={() => setShowPrivacy(false)}><Text style={styles.btnDeclineText}>Recusar</Text></TouchableOpacity>
               <TouchableOpacity style={styles.btnAccept} onPress={handleRegister}>{loading ? <ActivityIndicator color="#000" /> : <Text style={styles.btnAcceptText}>Aceitar</Text>}</TouchableOpacity>
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
  selectWrapper: { marginBottom: 15 },
  gluestackSelect: { height: 60, backgroundColor: '#161616', borderRadius: 18, borderWidth: 1, borderColor: '#222', paddingHorizontal: 20 },
  nextBtn: { backgroundColor: '#00FF9C', height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  nextBtnText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  finishBtn: { backgroundColor: '#00FF9C', height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  finishBtnText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', padding: 25 },
  modalContent: { backgroundColor: '#161616', borderRadius: 30, padding: 30, borderWidth: 1, borderColor: '#333' },
  modalTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  modalText: { color: '#888', marginBottom: 20 },
  modalFooter: { flexDirection: 'row', gap: 15 },
  btnDecline: { flex: 1, height: 55, borderRadius: 15, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center' },
  btnDeclineText: { color: '#FFF', fontWeight: 'bold' },
  btnAccept: { flex: 1, height: 55, borderRadius: 15, backgroundColor: '#00FF9C', justifyContent: 'center', alignItems: 'center' },
  btnAcceptText: { color: '#000', fontWeight: 'bold' }
});
