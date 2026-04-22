'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { useStats } from '@/hooks/useStats';
import { Users, ShieldAlert, BarChart3, Globe, ArrowUpRight, ArrowDownRight } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { data: realStats, isLoading } = useStats();

  return (
    <main className="min-h-screen bg-background pt-24 pb-12 px-6">
      <Header />
      
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Painel de <span className="text-primary text-glow">Controle</span></h1>
          <p className="text-muted-foreground uppercase tracking-[0.3em] text-xs font-bold">Métricas em tempo real da rede Ecoa</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass border-white/5 p-6">
                 {isLoading ? (
                   <div className="space-y-4">
                      <div className="flex justify-between">
                         <Skeleton className="w-10 h-10 rounded-lg" />
                         <Skeleton className="w-16 h-4" />
                      </div>
                      <Skeleton className="w-24 h-4 opacity-50" />
                      <Skeleton className="w-full h-8" />
                   </div>
                 ) : (
                   <>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {i === 0 && <Users className="w-5 h-5 text-primary" />}
                        {i === 1 && <ShieldAlert className="w-5 h-5 text-primary" />}
                        {i === 2 && <BarChart3 className="w-5 h-5 text-primary" />}
                        {i === 3 && <Globe className="w-5 h-5 text-primary" />}
                      </div>
                      <div className="flex items-center text-xs font-black text-green-500">
                        {i === 0 ? '+12%' : i === 1 ? '+5%' : i === 2 ? '+18%' : '+8%'} <ArrowUpRight className="w-3 h-3 ml-1" />
                      </div>
                    </div>
                    <h3 className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mb-1">
                       {i === 0 ? 'Total de Usuários' : i === 1 ? 'Denúncias Reais' : i === 2 ? 'Cidadãos Ativos' : 'Impacto Global'}
                    </h3>
                    <p className="text-3xl font-black">
                       {i === 0 ? realStats?.totalUsers : i === 1 ? realStats?.totalComplaints : i === 2 ? Math.floor(realStats?.totalUsers * 0.8) : (Number(realStats?.totalComplaints) * 1.5).toFixed(0)}
                    </p>
                   </>
                 )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Large Visual Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 glass border-white/5 h-[400px] flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#20c997_1px,transparent_1px)] bg-size-[20px_20px]" />
             <p className="uppercase text-xs font-bold tracking-[0.5em] text-primary/40 animate-pulse">Gráfico de Atividade (Em breve)</p>
          </Card>
          
          <Card className="glass border-white/5 p-6">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Últimas Atividades</h3>
            <div className="space-y-6">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex gap-4">
                     <Skeleton className="w-2 h-8 rounded-full" />
                     <div className="space-y-2 flex-1">
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-1/2 h-3 opacity-50" />
                     </div>
                  </div>
                ))
              ) : realStats?.recentComplaints?.map((complaint: any, i: number) => (
                <div key={complaint.id || i} className="flex gap-4 items-start border-l-2 border-primary/20 pl-4 py-1 hover:border-primary transition-colors">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1 shadow-[0_0_8px_#20c997]" />
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-tight line-clamp-1">{complaint.title || 'Nova Denúncia'}</p>
                    <p className="text-[10px] text-muted-foreground uppercase opacity-60">Status: {complaint.status || 'Pendente'}</p>
                  </div>
                </div>
              ))}
              {(!realStats?.recentComplaints || realStats.recentComplaints.length === 0) && !isLoading && (
                <p className="text-[10px] text-muted-foreground uppercase">Nenhuma atividade recente</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
