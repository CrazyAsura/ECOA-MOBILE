import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ClipboardList, BookOpen, Plus, MessageSquare, User } from 'lucide-react-native';
import { Motion } from '@legendapp/motion';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface BottomBarProps {
  colorMode: 'light' | 'dark';
  activeTab: string;
  onTabPress: (tab: string) => void;
  onFabPress: () => void;
}

const NAV_ITEMS = [
  { id: 'history', icon: ClipboardList, label: 'Queixas' },
  { id: 'courses', icon: BookOpen, label: 'Cursos' },
  { id: 'fab', isFab: true },
  { id: 'forum', icon: MessageSquare, label: 'Fórum' },
  { id: 'profile', icon: User, label: 'Perfil' },
];

export const BottomBar = ({ colorMode, activeTab, onTabPress, onFabPress }: BottomBarProps) => {
  const insets = useSafeAreaInsets();
  const isDark = colorMode === 'dark';

  return (
    <Motion.View 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom + 10,
          backgroundColor: isDark ? 'rgba(10, 10, 10, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          borderTopColor: isDark ? '#333' : '#EEE',
        }
      ]}
    >
      <View style={styles.content}>
        {NAV_ITEMS.map((item) => {
          if (item.isFab) {
            return (
              <TouchableOpacity
                key="fab"
                onPress={onFabPress}
                activeOpacity={0.8}
                style={styles.fabContainer}
              >
                <Motion.View
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    type: 'timing',
                    duration: 2000,
                  }}
                  // @ts-ignore - legendapp motion handling pulse
                  repeat={Infinity}
                  style={styles.fab}
                >
                  <Plus color="#000" size={32} strokeWidth={2.5} />
                </Motion.View>
              </TouchableOpacity>
            );
          }

          const isActive = activeTab === item.id;
          const Icon = item.icon!;

          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => onTabPress(item.id)}
              style={styles.tabItem}
              activeOpacity={0.6}
            >
              <Motion.View
                animate={{
                  scale: isActive ? 1.2 : 1,
                  y: isActive ? -4 : 0,
                }}
                transition={{ type: 'spring' }}
                style={styles.iconContainer}
              >
                <Icon 
                  size={24} 
                  color={isActive ? '#00FF9C' : (isDark ? '#888' : '#666')} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </Motion.View>
              {isActive && (
                <Motion.View
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={[styles.indicator, { backgroundColor: '#00FF9C' }]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </Motion.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingTop: 15,
    borderTopWidth: 0.5,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 50,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: -8,
  },
  fabContainer: {
    top: -35,
    flex: 1,
    alignItems: 'center',
  },
  fab: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#00FF9C',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#0A0A0A',
    elevation: 10,
    shadowColor: '#00FF9C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
