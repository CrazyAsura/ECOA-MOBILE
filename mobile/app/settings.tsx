import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { Motion } from '@legendapp/motion';
import { Bell, Moon, Languages, Smartphone, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(true);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color="#00FF9C" size={30} />
        </TouchableOpacity>
        <Text style={styles.title}>Configurações</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferências</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.iconBox}><Bell size={20} color="#00FF9C" /></View>
          <Text style={styles.settingLabel}>Notificações Push</Text>
          <Switch 
            value={notifications} 
            onValueChange={setNotifications}
            trackColor={{ false: '#333', true: 'rgba(0, 255, 156, 0.3)' }}
            thumbColor={notifications ? '#00FF9C' : '#666'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.iconBox}><Moon size={20} color="#00FF9C" /></View>
          <Text style={styles.settingLabel}>Modo Escuro</Text>
          <Switch 
            value={darkMode} 
            onValueChange={setDarkMode}
             trackColor={{ false: '#333', true: 'rgba(0, 255, 156, 0.3)' }}
            thumbColor={darkMode ? '#00FF9C' : '#666'}
          />
        </View>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.iconBox}><Languages size={20} color="#00FF9C" /></View>
          <Text style={styles.settingLabel}>Idioma</Text>
          <Text style={styles.settingVal}>Português (BR)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aplicativo</Text>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.iconBox}><Smartphone size={20} color="#00FF9C" /></View>
          <Text style={styles.settingLabel}>Versão</Text>
          <Text style={styles.settingVal}>1.0.4v</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  content: { paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: 24, gap: 15, marginBottom: 30 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  section: { paddingHorizontal: 24, marginBottom: 30 },
  sectionTitle: { color: '#666', fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 15, letterSpacing: 1 },
  settingItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161616', padding: 18, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: '#222' },
  iconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(0, 255, 156, 0.05)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  settingLabel: { flex: 1, color: '#DDD', fontSize: 16, fontWeight: '500' },
  settingVal: { color: '#666', fontSize: 14 }
});
