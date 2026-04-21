import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationAIService, { SmartNotification } from '@/services/notification-ai.service';

const SOCKET_URL = 'http://localhost:3000'; // Ajustar para o IP do seu servidor se necessário

export function useNotifications() {
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const initSocket = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      
      const newSocket = io(SOCKET_URL);

      newSocket.on('connect', () => {
        console.log('Conectado ao servidor de notificações');
        if (user?.id) {
          newSocket.emit('join_room', user.id);
        }
      });

      newSocket.on('notification', async (data: { title: string, message: string }) => {
        // [AI INSPIRED] Processamento em borda usando Transformer Lite / TFLite
        const smartNotif = await NotificationAIService.processNotification(data.title, data.message);
        
        setNotifications((prev) => [smartNotif, ...prev]);
      });

      setSocket(newSocket);
    };

    initSocket();

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    clearNotifications,
    isConnected: socket?.connected || false,
  };
}
