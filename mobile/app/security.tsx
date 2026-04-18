import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Shield, Key, Fingerprint, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function SecurityScreen() {
  const router = useRouter();

  const OPTIONS = [
    { icon: Key, label: 'Alterar Senha', sub: 'Última alteração há 3 meses' },
    { icon: Fingerprint, label: 'Biometria', sub: 'Ativado para Login' },
    { icon: EyeOff, label: 'Privacidade de Dados', sub: 'Gerenciar o que compartilhamos' },
    { icon: Shield, label: 'Verificação em Duas Etapas', sub: 'Aumente sua segurança' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color="#00FF9C" size={30} />
        </TouchableOpacity>
        <Text style={styles.title}>Segurança & Privacidade</Text>
      </View>

      <View style={styles.menu}>
        {OPTIONS.map((item, index) => (
          <TouchableOpacity key={index} style={styles.item}>
            <View style={styles.iconBox}><item.icon size={22} color="#00FF9C" /></View>
            <View style={styles.body}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.sub}>{item.sub}</Text>
            </View>
            <ChevronRight color="#333" size={20} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.infoBox}>
        <Shield size={40} color="#00FF9C" style={{ marginBottom: 15 }} />
        <Text style={styles.infoTitle}>Seus dados estão protegidos</Text>
        <Text style={styles.infoText}>Utilizamos criptografia ponta a ponta (AES-256) em todas as localizações e descrições de queixas enviadas.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  content: { paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, gap: 15, marginBottom: 40 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  menu: { paddingHorizontal: 24, gap: 15 },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161616', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#222' },
  iconBox: { width: 45, height: 45, borderRadius: 14, backgroundColor: 'rgba(0, 255, 156, 0.05)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  body: { flex: 1 },
  label: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  sub: { color: '#666', fontSize: 13 },
  infoBox: { margin: 24, marginTop: 50, padding: 30, backgroundColor: '#0D0D0D', borderRadius: 30, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#00FF9C' },
  infoTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  infoText: { color: '#888', textAlign: 'center', lineHeight: 20, fontSize: 14 }
});
