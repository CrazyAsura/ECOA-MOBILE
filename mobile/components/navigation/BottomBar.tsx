import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Home, History, MessageSquare, User, Plus, BookOpen } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

interface BottomBarProps {
  colorMode: 'light' | 'dark';
  activeTab: string;
  onTabPress: (tab: string) => void;
  onFabPress: () => void;
}

export function BottomBar({ colorMode, activeTab, onTabPress, onFabPress }: BottomBarProps) {
  const { t } = useTranslation();
  const isDark = colorMode === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#111' : '#FFF', borderTopColor: isDark ? '#222' : '#EEE' }]}>
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => onTabPress('history')}
      >
        <History size={24} color={activeTab === 'history' ? '#00FF9C' : '#666'} />
        <Text style={[styles.tabLabel, activeTab === 'history' && styles.activeTabLabel]}>{t('history')}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => onTabPress('courses')}
      >
        <BookOpen size={24} color={activeTab === 'courses' ? '#00FF9C' : '#666'} />
        <Text style={[styles.tabLabel, activeTab === 'courses' && styles.activeTabLabel]}>{t('courses')}</Text>
      </TouchableOpacity> 

      <TouchableOpacity 
        style={styles.fabContainer} 
        onPress={onFabPress}
        activeOpacity={0.8}
      >
        <View style={styles.fab}>
          <Plus color="#000" size={32} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => onTabPress('forum')}
      >
        <MessageSquare size={24} color={activeTab === 'forum' ? '#00FF9C' : '#666'} />
        <Text style={[styles.tabLabel, activeTab === 'forum' && styles.activeTabLabel]}>{t('forum')}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => onTabPress('profile')}
      >
        <User size={24} color={activeTab === 'profile' ? '#00FF9C' : '#666'} />
        <Text style={[styles.tabLabel, activeTab === 'profile' && styles.activeTabLabel]}>{t('profile')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 90,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
    borderTopWidth: 1,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    color: '#666',
  },
  activeTabLabel: {
    color: '#00FF9C',
    fontWeight: 'bold',
  },
  fabContainer: {
    top: -20,
  },
  fab: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#00FF9C',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00FF9C',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
});
