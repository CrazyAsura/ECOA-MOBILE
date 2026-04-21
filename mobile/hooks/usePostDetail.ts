import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ForumService, { ForumPost, ForumComment } from '../services/forum.service';

export function usePostDetail(id: string) {
  const [post, setPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [sending, setSending] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const data = await ForumService.getPost(id);
      setPost(data);
      setComments(data.comments || []);
      
      // Increment view count in background
      ForumService.incrementView(id).catch(() => {});
    } catch (error) {
      console.error('Error fetching post detail:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchData();
  }, [id, fetchData]);

  const handleLikePost = async () => {
    if (!post) return;
    try {
      await ForumService.likePost(id);
      setPost((prev) => prev ? { ...prev, likes: prev.likes + 1 } : null);
    } catch (e) {}
  };

  const handleDislikePost = async () => {
    if (!post) return;
    try {
      await ForumService.dislikePost(id);
      setPost((prev) => prev ? { ...prev, dislikes: prev.dislikes + 1 } : null);
    } catch (e) {}
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !id) return;
    setSending(true);
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : { name: 'Visitante' };
      const userName = user.realName || user.name || 'Usuário ECOA';
      
      const newComment = await ForumService.addComment(id, commentText, userName);
      
      setComments((prev) => [newComment, ...prev]);
      setPost((prev) => prev ? { ...prev, commentsCount: (prev.commentsCount || 0) + 1 } : null);
      setCommentText('');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível enviar seu comentário.');
    } finally {
      setSending(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      await ForumService.likeComment(commentId);
      setComments((prev) => 
        prev.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c))
      );
    } catch (e) {}
  };

  const handleDislikeComment = async (commentId: string) => {
    try {
      await ForumService.dislikeComment(commentId);
      setComments((prev) => 
        prev.map((c) => (c.id === commentId ? { ...c, dislikes: c.dislikes + 1 } : c))
      );
    } catch (e) {}
  };

  const handleReportComment = (commentId: string) => {
    Alert.alert(
      'Denunciar Comentário',
      'Deseja denunciar este comentário por violar as regras da comunidade?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Denunciar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await ForumService.reportComment(commentId);
              Alert.alert('Sucesso', 'Denúncia enviada para análise.');
            } catch (e) {}
          }
        }
      ]
    );
  };

  return {
    post,
    comments,
    loading,
    commentText,
    setCommentText,
    sending,
    handleLikePost,
    handleDislikePost,
    handleAddComment,
    handleLikeComment,
    handleDislikeComment,
    handleReportComment
  };
}
