import api from './api';

export interface ForumPost {
  id: string;
  userName: string;
  content: string;
  category: string;
  likes: number;
  dislikes: number;
  views: number;
  commentsCount: number;
  comments?: ForumComment[];
  createdAt: string;
}

export interface ForumComment {
  id: string;
  userName: string;
  content: string;
  likes: number;
  dislikes: number;
  reportCount: number;
  createdAt: string;
}

const ForumService = {
  getPost: async (id: string) => {
    const res = await api.get<ForumPost>(`/forum/${id}`);
    return res.data;
  },

  incrementView: async (id: string) => {
    return api.patch(`/forum/${id}/view`);
  },

  likePost: async (id: string) => {
    return api.patch(`/forum/${id}/like`);
  },

  dislikePost: async (id: string) => {
    return api.patch(`/forum/${id}/dislike`);
  },

  addComment: async (id: string, content: string, userName: string) => {
    const res = await api.post<ForumComment>(`/forum/${id}/comments`, { content, userName });
    return res.data;
  },

  likeComment: async (commentId: string) => {
    return api.patch(`/forum/comments/${commentId}/like`);
  },

  dislikeComment: async (commentId: string) => {
    return api.patch(`/forum/comments/${commentId}/dislike`);
  },

  reportComment: async (commentId: string) => {
    return api.patch(`/forum/comments/${commentId}/report`);
  }
};

export default ForumService;
