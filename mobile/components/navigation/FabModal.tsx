import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import { Motion } from '@legendapp/motion';
import { X, ClipboardList, PenTool, Globe } from 'lucide-react-native';
import { useRouter as useExpoRouter } from 'expo-router';

interface FabModalProps {
  isVisible: boolean;
  onClose: () => void;
  colorMode: 'light' | 'dark';
}

export const FabModal = ({ isVisible, onClose, colorMode }: FabModalProps) => {
  const isDark = colorMode === 'dark';
  const router = useExpoRouter();

  const actions = [
    { 
      icon: ClipboardList, 
      label: 'Fazer Queixa', 
      color: '#00FF9C',
      onPress: () => {
        onClose();
        router.push('/make-complaint');
      }
    },
    { 
      icon: PenTool, 
      label: 'Fazer Resenha', 
      color: '#00FF9C',
      onPress: () => onClose() 
    },
    { 
      icon: Globe, 
      label: 'Queixas Globais', 
      color: '#00FF9C',
      onPress: () => {
        onClose();
        router.push('/global-complaints');
      }
    },
  ];

  if (!isVisible) return null;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Motion.View
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          style={[
            styles.modalContainer,
            { backgroundColor: isDark ? '#1A1A1A' : '#FFF' }
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>Ações ECOA</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={isDark ? '#888' : '#666'} />
            </TouchableOpacity>
          </View>

          <View style={styles.actionsGrid}>
            {actions.map((action, index) => (
              <Motion.View
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 100 * index }}
              >
                <TouchableOpacity 
                  style={[styles.actionItem, { borderLeftColor: action.color }]}
                  activeOpacity={0.7}
                  onPress={action.onPress}
                >
                  <View style={[styles.iconWrapper, { backgroundColor: isDark ? '#333' : '#F5F5F5' }]}>
                    <action.icon size={24} color={action.color} />
                  </View>
                  <Text style={[styles.actionLabel, { color: isDark ? '#EEE' : '#333' }]}>
                    {action.label}
                  </Text>
                </TouchableOpacity>
              </Motion.View>
            ))}
          </View>
        </Motion.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContainer: { width: '100%', maxWidth: 400, borderRadius: 30, padding: 24, borderWidth: 1, borderColor: '#333', elevation: 25 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', letterSpacing: 0.5 },
  closeBtn: { padding: 5 },
  actionsGrid: { gap: 15 },
  actionItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 20, borderLeftWidth: 4, backgroundColor: 'rgba(255,255,255,0.03)' },
  iconWrapper: { width: 45, height: 45, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  actionLabel: { fontSize: 16, fontWeight: '600' },
});
