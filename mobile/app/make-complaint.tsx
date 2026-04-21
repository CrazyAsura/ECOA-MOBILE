import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Motion } from '@legendapp/motion';
import { ChevronLeft, Camera, Shield, ChevronDown, CheckCircle2, ShieldCheck, ShieldAlert, Zap } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import api from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { PollutionType, ComplaintPrivacy } from '@/constants/enums';
import { useTheme } from '@/context/ThemeContext';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';

// Gluestack Components
import { Input, InputField } from '@/components/ui/input';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { 
  Select, SelectTrigger, SelectInput, SelectIcon, 
  SelectPortal, SelectBackdrop, SelectContent, 
  SelectItem 
} from '@/components/ui/select';

export default function MakeComplaint() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<PollutionType>(PollutionType.URBANO);
  const [privacy, setPrivacy] = useState<ComplaintPrivacy>(ComplaintPrivacy.PUBLICO);

  const { analyzeImage, analyzing, result: aiResult, config: deviceLimits } = useAIAnalysis();

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      // Trigger AI Analysis automatically (Inspiration from PWA project)
      analyzeImage(uri);
    }
  };

  const handleSubmit = async () => {
    if (!description || !location) {
      Alert.alert(t('error'), t('fill_all'));
      return;
    }

    if (aiResult?.isFake) {
      Alert.alert(
        "Aviso de Autenticidade", 
        "Nossa IA detectou possíveis manipulações nesta imagem. Deseja continuar?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Continuar", onPress: postComplaint }
        ]
      );
    } else {
      postComplaint();
    }
  };

  const postComplaint = async () => {
    setLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const user = JSON.parse(storedUser || '{}');

      const payload = {
        type,
        description,
        location,
        privacy,
        imageUrl: image || '',
        userId: user.id,
        aiAnalysis: aiResult // Persist AI results
      };

      await api.post('/complaints', payload);
      Alert.alert("Sucesso", "Queixa enviada com sucesso!");
      router.replace('/history');
    } catch (e) {
      Alert.alert("Erro", "Falha ao enviar queixa.");
    } finally {
      setLoading(false);
    }
  };

  const theme = {
    bg: isDark ? '#0A0A0A' : '#F8F9FA',
    card: isDark ? '#161616' : '#FFF',
    input: isDark ? '#222' : '#EEE',
    border: isDark ? '#222' : '#DDD',
    text: isDark ? '#FFF' : '#333',
    subtext: isDark ? '#666' : '#888'
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: theme.card }]}>
          <ChevronLeft color="#00FF9C" size={30} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>{t('complaint')}</Text>
      </View>

      <Motion.View initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        
        {/* Device Optimization Indicator */}
        <View style={styles.optimizerBadge}>
          <Zap size={12} color="#00FF9C" />
          <Text style={styles.optimizerTxt}>
            {deviceLimits.modelSize === 'small' ? 'Modo Otimizado (Lite AI)' : 'Modo Alta Performance (Full AI)'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{t('pollution_type')}</Text>
          <Select onValueChange={(v) => setType(v as PollutionType)} defaultValue={PollutionType.URBANO}>
            <SelectTrigger style={[styles.gluestackSelect, { backgroundColor: theme.input, borderColor: theme.border }]}>
              <SelectInput placeholder={t('pollution_type')} style={{ color: theme.text }} />
              <SelectIcon style={{ marginLeft: 'auto' }} as={ChevronDown} />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent style={{ backgroundColor: theme.card }}>
                {Object.values(PollutionType).map(v => (
                  <SelectItem key={v} label={v} value={v} />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{t('location')}</Text>
          <Input style={[styles.inputBase, { backgroundColor: theme.input, borderColor: theme.border }]}>
             <InputField 
                placeholder={t('city')} 
                style={{ color: theme.text }} 
                value={location} 
                onChangeText={setLocation} 
             />
          </Input>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{t('description')}</Text>
          <Textarea style={[styles.textareaBase, { backgroundColor: theme.input, borderColor: theme.border }]}>
             <TextareaInput 
                placeholder={t('description')} 
                style={{ color: theme.text }} 
                multiline 
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
             />
          </Textarea>
        </View>

        <TouchableOpacity style={[styles.photoBox, { backgroundColor: theme.input, borderColor: theme.border }]} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.preview} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Camera color="#666" size={40} />
              <Text style={styles.photoTxt}>{t('photo_required')}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* AI Analysis Feedback (NEW) */}
        {image && (
          <View style={[styles.aiFeedback, { backgroundColor: aiResult?.isFake ? 'rgba(255, 75, 75, 0.1)' : 'rgba(0, 255, 156, 0.1)' }]}>
            {analyzing ? (
              <View style={styles.aiLoading}>
                <ActivityIndicator color="#00FF9C" />
                <Text style={styles.aiLoadingTxt}>Análise avançada MediaPipe/FFT em curso...</Text>
              </View>
            ) : aiResult ? (
              <View style={styles.aiResult}>
                <View style={styles.aiHeader}>
                  {aiResult.isFake ? <ShieldAlert color="#FF4B4B" size={20} /> : <ShieldCheck color="#00FF9C" size={20} />}
                  <Text style={[styles.aiStatus, { color: aiResult.isFake ? '#FF4B4B' : '#00FF9C' }]}>
                    {aiResult.message}
                  </Text>
                </View>
                <Text style={styles.aiConfidence}>Nível de Confiança: {(aiResult.confidence * 100).toFixed(1)}%</Text>
              </View>
            ) : null}
          </View>
        )}

        <View style={styles.section}>
            <Text style={styles.label}>{t('visibility')}</Text>
            <Select onValueChange={(v) => setPrivacy(v as ComplaintPrivacy)} defaultValue={ComplaintPrivacy.PUBLICO}>
              <SelectTrigger style={[styles.gluestackSelect, { backgroundColor: theme.input, borderColor: theme.border }]}>
                <SelectInput placeholder={t('visibility')} style={{ color: theme.text }} />
                <SelectIcon style={{ marginLeft: 'auto' }} as={ChevronDown} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent style={{ backgroundColor: theme.card }}>
                  <SelectItem label={t('public')} value={ComplaintPrivacy.PUBLICO} />
                  <SelectItem label={t('private')} value={ComplaintPrivacy.PRIVADO} />
                  <SelectItem label={t('mixed')} value={ComplaintPrivacy.MISTO} />
                </SelectContent>
              </SelectPortal>
            </Select>
            <Text style={styles.infoTxt}>{privacy === ComplaintPrivacy.MISTO ? t('anonymous_desc') : ''}</Text>
        </View>

        <TouchableOpacity style={styles.publishBtn} onPress={handleSubmit} disabled={loading || analyzing}>
          {loading ? <ActivityIndicator color="#000" /> : (
            <>
              <CheckCircle2 color="#000" size={20} />
              <Text style={styles.publishBtnTxt}>{t('publish')}</Text>
            </>
          )}
        </TouchableOpacity>
      </Motion.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, gap: 15, marginBottom: 30 },
  backBtn: { width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  card: { borderRadius: 30, padding: 25, borderWidth: 1 },
  optimizerBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(0, 255, 156, 0.05)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, alignSelf: 'flex-end', marginBottom: 15 },
  optimizerTxt: { color: '#00FF9C', fontSize: 9, fontWeight: 'bold' },
  section: { marginBottom: 25 },
  label: { color: '#666', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 10, letterSpacing: 1 },
  gluestackSelect: { height: 60, borderRadius: 15, borderWidth: 1, paddingHorizontal: 15 },
  inputBase: { height: 60, borderRadius: 15, borderWidth: 1, paddingHorizontal: 10 },
  textareaBase: { borderRadius: 15, borderWidth: 1, padding: 15, minHeight: 120 },
  photoBox: { width: '100%', height: 200, borderRadius: 20, overflow: 'hidden', marginBottom: 25, borderStyle: 'dashed', borderWidth: 1 },
  photoPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  photoTxt: { color: '#666', fontSize: 12, marginTop: 10, textAlign: 'center' },
  preview: { flex: 1, width: '100%', height: '100%' },
  aiFeedback: { padding: 15, borderRadius: 15, marginBottom: 25, borderLeftWidth: 4 },
  aiLoading: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  aiLoadingTxt: { color: '#666', fontSize: 12 },
  aiResult: { gap: 5 },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  aiStatus: { fontSize: 14, fontWeight: 'bold' },
  aiConfidence: { fontSize: 11, color: '#666', marginLeft: 28 },
  infoTxt: { color: '#00FF9C', fontSize: 11, marginTop: 8 },
  publishBtn: { backgroundColor: '#00FF9C', height: 65, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 10 },
  publishBtnTxt: { color: '#000', fontSize: 18, fontWeight: 'bold' }
});
