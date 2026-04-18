import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import { Motion } from '@legendapp/motion';
import { MessageSquare, Heart, ThumbsDown, Eye, Search, Filter } from 'lucide-react-native';
import api from '../services/api';

interface Post {
  id: string;
  userName: string;
  content: string;
  likes: number;
  dislikes: number;
  views: number;
  commentsCount: number;
  category: string;
  createdAt: string;
}

const CATEGORIES = ['Tudo', 'Informativo', 'Sugestão', 'Dúvida', 'Elogio'];

export default function ForumScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tudo');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (reset = false) => {
    const currentPage = reset ? 1 : page;
    try {
      const categoryParam = selectedCategory === 'Tudo' ? '' : `&category=${selectedCategory}`;
      const searchParam = search ? `&search=${search}` : '';
      
      const res = await api.get(`/forum?page=${currentPage}&limit=5${categoryParam}${searchParam}`);
      
      const newItems = res.data?.items || [];
      // No backend atual lastPage está na raiz do objeto retornado
      const lastPage = res.data?.lastPage || 1;
      
      if (reset) {
        setPosts(newItems);
      } else {
        setPosts(prev => [...(prev || []), ...newItems]);
      }
      
      setHasMore(currentPage < lastPage);
      if (!reset) setPage(currentPage + 1);
      else setPage(2);
      
    } catch (e) {
      console.error('Erro ao buscar posts:', e);
      if (reset) setPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchPosts(true);
  }, [selectedCategory, search]);

  const handleLike = async (id: string) => {
    try {
      await api.patch(`/forum/${id}/like`);
      setPosts(prev => (prev || []).map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    } catch (e) {}
  };

  const handleDislike = async (id: string) => {
    try {
      await api.patch(`/forum/${id}/dislike`);
      setPosts(prev => (prev || []).map(p => p.id === id ? { ...p, dislikes: p.dislikes + 1 } : p));
    } catch (e) {}
  };

  if (loading && page === 1) return <View style={styles.centered}><ActivityIndicator color="#00FF9C" size="large" /></View>;

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchPosts(true)} tintColor="#00FF9C" />}
      >
        <Text style={styles.title}>Comunidade</Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Pesquisar posts..."
            placeholderTextColor="#666"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll} contentContainerStyle={styles.filtersContent}>
           {CATEGORIES.map(cat => (
             <TouchableOpacity 
              key={cat} 
              style={[styles.filterChip, selectedCategory === cat && styles.filterChipActive]}
              onPress={() => setSelectedCategory(cat)}
             >
               <Text style={[styles.filterText, selectedCategory === cat && styles.filterTextActive]}>{cat}</Text>
             </TouchableOpacity>
           ))}
        </ScrollView>

        <View style={styles.feed}>
          {(posts || []).length === 0 && !loading ? (
             <Text style={styles.emptyText}>Nenhum post encontrado nesta categoria.</Text>
          ) : (
            (posts || []).map((post) => (
              <Motion.View key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.avatar}><Text style={styles.avatarTxt}>{post.userName ? post.userName[0] : 'U'}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.userName}>{post.userName || 'Membro ECOA'}</Text>
                    <Text style={styles.postDate}>{post.category || 'Geral'} • {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '--/--/----'}</Text>
                  </View>
                  <View style={styles.viewCount}>
                    <Eye size={14} color="#666" />
                    <Text style={styles.viewTxt}>{post.views || 0}</Text>
                  </View>
                </View>

                <Text style={styles.postContent}>{post.content}</Text>

                <View style={styles.footer}>
                  <View style={styles.actionsBox}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleLike(post.id)}>
                      <Heart size={18} color="#666" />
                      <Text style={styles.actionTxt}>{post.likes || 0}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleDislike(post.id)}>
                      <ThumbsDown size={18} color="#666" />
                      <Text style={styles.actionTxt}>{post.dislikes || 0}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                      <MessageSquare size={18} color="#666" />
                      <Text style={styles.actionTxt}>{post.commentsCount || 0}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Motion.View>
            ))
          )}
        </View>

        {hasMore && !loading && (
          <TouchableOpacity style={styles.loadMore} onPress={() => fetchPosts()}>
             <Text style={styles.loadMoreText}>Ver mais posts</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  centered: { flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center', alignItems: 'center' },
  content: { padding: 24, paddingBottom: 150 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FFF', marginBottom: 20, paddingTop: 40 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161616', borderRadius: 15, paddingHorizontal: 15, height: 55, borderWidth: 1, borderColor: '#222', marginBottom: 20 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: '#FFF', fontSize: 16 },
  filtersScroll: { marginBottom: 25 },
  filtersContent: { gap: 10 },
  filterChip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, backgroundColor: '#161616', borderWidth: 1, borderColor: '#222' },
  filterChipActive: { backgroundColor: '#00FF9C', borderColor: '#00FF9C' },
  filterText: { color: '#888', fontWeight: '600' },
  filterTextActive: { color: '#000' },
  feed: { gap: 16 },
  postCard: { backgroundColor: '#161616', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#222' },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 15 },
  avatar: { width: 44, height: 44, borderRadius: 15, backgroundColor: '#222', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#00FF9C' },
  avatarTxt: { color: '#00FF9C', fontWeight: 'bold', fontSize: 18 },
  userName: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  postDate: { color: '#666', fontSize: 12 },
  viewCount: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  viewTxt: { color: '#666', fontSize: 12 },
  postContent: { color: '#DDD', fontSize: 15, lineHeight: 22, marginBottom: 20 },
  footer: { borderTopWidth: 1, borderTopColor: '#222', paddingTop: 15 },
  actionsBox: { flexDirection: 'row', gap: 20 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionTxt: { color: '#666', fontSize: 14 },
  loadMore: { marginTop: 30, backgroundColor: '#222', height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  loadMoreText: { color: '#00FF9C', fontWeight: 'bold' },
  emptyText: { color: '#666', textAlign: 'center', marginTop: 40, fontSize: 16 }
});
