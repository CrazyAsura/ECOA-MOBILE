'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Camera,
  MessageSquare,
  Navigation
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { decryptParam } from '@/lib/crypto';
import { redis } from '@/lib/redis';
import dynamic from 'next/dynamic';

const GeolocationMap = dynamic(() => import('@/components/GeolocationMap'), { ssr: false });

export default function ComplaintDetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idEncoded = searchParams.get('id');
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idEncoded) {
      router.push('/contractors/complaints');
      return;
    }

    const decryptedId = decryptParam(idEncoded);

    async function fetchDetail() {
      const all = await redis.get('contractor_complaints') || [];
      const found = all.find((c: any) => c.id === decryptedId);
      
      if (found) {
        setItem(found);
      } else {
        setItem({ id: decryptedId, title: 'Chamado Externo', address: 'Local Desconhecido', status: 'Pendente', priority: 'Média' });
      }
      setLoading(false);
    }
    fetchDetail();
  }, [idEncoded, router]);

  const handleResolve = () => {
    alert('Ordem de serviço marcada como CONCLUÍDA.');
    router.push('/contractors/complaints');
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-[#f59e0b] font-black uppercase tracking-widest">LOADING_MISSION_DATA...</div>;

  return (
    <DashboardLayout title="Detalhes da Missão" role="contractor">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
           <div className="flex items-center gap-6">
              <Link href="/contractors/complaints" className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 transition-all">
                 <ArrowLeft size={24} />
              </Link>
              <div>
                 <h2 className="text-3xl font-black uppercase tracking-tighter">Missão <span className="text-[#f59e0b]">#{item.id}</span></h2>
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{item.title}</p>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <Button className="h-12 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] px-6 rounded-xl">
                 <Navigation size={16} className="mr-2" /> Abrir no Waze
              </Button>
              <Button 
                onClick={handleResolve}
                className="h-12 bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-widest text-[10px] px-6 rounded-xl"
              >
                 <CheckCircle2 size={16} className="mr-2" /> Finalizar Missão
              </Button>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Left Info Column */}
           <div className="lg:col-span-1 space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#080808] border border-white/5 rounded-3xl p-8 space-y-8"
              >
                 <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-white/5 pb-2">Localização</h3>
                    <div className="flex items-start gap-3">
                       <MapPin className="text-[#f59e0b] shrink-0" size={18} />
                       <p className="text-sm font-bold text-slate-200">{item.address}</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-white/5 pb-2">Status & Prioridade</h3>
                    <div className="flex items-center gap-3">
                       <div className="px-3 py-1 bg-[#f59e0b]/10 text-[#f59e0b] rounded-full text-[9px] font-black uppercase tracking-widest">{item.status}</div>
                       <div className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-[9px] font-black uppercase tracking-widest">{item.priority}</div>
                    </div>
                 </div>

                 <div className="pt-6">
                    <Button variant="outline" className="w-full h-12 border-white/5 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest rounded-xl">
                       <Camera size={16} className="mr-2" /> Anexar Foto de Conclusão
                    </Button>
                 </div>
              </motion.div>

              <div className="bg-[#080808] border border-white/5 rounded-3xl p-8">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                    <MessageSquare size={14} /> Histórico de Atualizações
                 </h3>
                 <div className="space-y-6">
                    <HistoryItem time="14:20" text="Equipe técnica em rota para o local." />
                    <HistoryItem time="12:05" text="Ocorrência validada via IA (Deepfake Negative)." />
                    <HistoryItem time="11:50" text="Denúncia recebida pelo canal ECOA Web." />
                 </div>
              </div>
           </div>

           {/* Right Map Column */}
           <div className="lg:col-span-2 space-y-8">
              <div className="bg-[#080808] border border-white/5 rounded-[2.5rem] overflow-hidden h-[500px] shadow-2xl relative">
                 <GeolocationMap 
                   markers={[
                     { position: [-23.5505, -46.6333], label: item.title }
                   ]}
                 />
                 <div className="absolute bottom-6 left-6 right-6 p-4 glass rounded-2xl flex items-center justify-between z-1000">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-[#f59e0b]/20 rounded-lg"><AlertTriangle className="text-[#f59e0b]" size={16} /></div>
                       <p className="text-[10px] font-black uppercase tracking-widest">Risco de Alagamento Detectado na Área</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function HistoryItem({ time, text }: { time: string, text: string }) {
  return (
    <div className="flex gap-4">
       <span className="text-[9px] font-black text-slate-600 tabular-nums">{time}</span>
       <p className="text-xs text-slate-400 font-medium">{text}</p>
    </div>
  );
}

