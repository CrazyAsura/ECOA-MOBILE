'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'super-admin' | 'admin' | 'contractor' | 'super-contractor';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole, password?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SEEDED_USERS = [
  { email: 'admin@ecoa.br', password: 'admin123', role: 'admin' as UserRole, name: 'ADMINISTRADOR GERAL' },
  { email: 'super@ecoa.br', password: 'super123', role: 'super-admin' as UserRole, name: 'SISTEMAS ECOA' },
  { email: 'prestador@ecoa.br', password: 'field123', role: 'contractor' as UserRole, name: 'TECNICO DE CAMPO' },
  { email: 'supervisor@ecoa.br', password: 'boss123', role: 'super-contractor' as UserRole, name: 'SUPERVISOR GERAL' },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('ecoa_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, role: UserRole, password?: string) => {
    setIsLoading(true);
    console.log(`Tentativa de login: ${email} como ${role}`);
    
    // Check against seeds
    const seeded = SEEDED_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
    
    if (seeded && password === seeded.password) {
      console.log('Login bem-sucedido para:', seeded.name);
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: seeded.name,
        email: seeded.email,
        role: seeded.role,
      };
      
      setUser(mockUser);
      localStorage.setItem('ecoa_user', JSON.stringify(mockUser));
      
      // Redirect based on role
      switch (role) {
        case 'super-admin': router.push('/superadmin'); break;
        case 'admin': router.push('/admin'); break;
        case 'contractor': router.push('/contractors'); break;
        case 'super-contractor': router.push('/super-contractors'); break;
      }
    } else {
      console.error('Falha na autenticação: Credenciais incorretas ou cargo incompatível');
      setIsLoading(false);
      throw new Error('Credenciais inválidas para este nível de acesso.');
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecoa_user');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
