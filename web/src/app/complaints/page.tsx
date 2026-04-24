'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, Calendar, User } from 'lucide-react';
import { Grid } from 'react-window';
import { Skeleton } from '@/components/ui/skeleton';

type ComplaintItem = {
  id: string;
  title: string;
  description: string;
  status?: string;
  user?: { realName?: string };
  createdAt: string;
};

export default function ComplaintsPage() {
  const { data: complaints, isLoading } = useQuery({
    queryKey: ['complaints-list'],
    queryFn: async () => {
      const { data } = await api.get('/complaints');
      return data;
    }
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const columnCount = 3;
  const rowCount = Math.ceil((complaints?.items?.length || 0) / columnCount);
  const itemWidth = (containerWidth - 48) / columnCount; // assuming padding 24px total for gaps
  const itemHeight = 250;

  const Cell = ({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: React.CSSProperties }) => {
    const index = rowIndex * columnCount + columnIndex;
    const item = complaints?.items?.[index] as ComplaintItem | undefined;
    if (!item) return null;
    return (
      <div style={style} className="p-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass border-white/5 hover:border-primary/20 transition-all cursor-pointer group h-full">
            <CardContent className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <Badge variant="outline" className="uppercase text-[10px] bg-primary/10 text-primary border-primary/20">
                  {item.status || 'Pendente'}
                </Badge>
                <ShieldAlert className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-lg font-bold uppercase mb-2 line-clamp-1">{item.title}</h3>
              <p className="text-muted-foreground text-sm italic mb-6 line-clamp-2 grow">{item.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5 text-[10px] uppercase font-bold text-muted-foreground mt-auto">
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3" />
                  <span>{item.user?.realName || 'Anônimo'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  };

  return (
    <main className="flex flex-col min-h-screen pt-20">
      <Header />
      <div className="container mx-auto px-6 py-12 grow">
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4 text-glow">Queixas <span className="text-primary">Globais</span></h1>
          <p className="text-muted-foreground uppercase tracking-widest text-xs font-bold">Monitoramento de incidentes em tempo real</p>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="glass p-6 space-y-4 border-white/5">
                 <div className="flex justify-between">
                    <Skeleton className="w-20 h-5" />
                    <Skeleton className="w-5 h-5" />
                 </div>
                 <Skeleton className="w-full h-6" />
                 <Skeleton className="w-full h-12 opacity-50" />
                 <div className="flex justify-between pt-4">
                    <Skeleton className="w-24 h-3" />
                    <Skeleton className="w-24 h-3" />
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <div ref={containerRef} className="w-full mb-20">
            <Grid
              columnCount={columnCount}
              columnWidth={itemWidth}
              rowCount={rowCount}
              rowHeight={itemHeight}
              cellComponent={Cell}
              cellProps={{} as any}
            />
          </div>
        )}
      </div>
    </main>
  );
}


