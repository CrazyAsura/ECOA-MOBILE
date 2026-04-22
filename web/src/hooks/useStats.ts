import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export function useStats() {
  return useQuery({
    queryKey: ['stats-summary'],
    queryFn: async () => {
      const { data } = await api.get('/stats/summary');
      
      return {
        totalUsers: data.totalUsers || 0,
        totalComplaints: data.totalComplaints || 0,
        recentComplaints: data.recentComplaints || [],
        userGrowth: '+12%',
        complaintTrend: 'high',
      };
    },
  });
}
