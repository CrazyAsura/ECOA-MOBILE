'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  MapPin,
  ArrowUpRight,
  TrendingUp,
  Inbox
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const GeolocationMap = dynamic(() => import('@/components/GeolocationMap'), { ssr: false });

export default function ContractorDashboard() {
  const [complaints, setComplaints] = React.useState([
    { id: '1', site: 'Setor Norte - Obras', issue: 'Atraso de Materiais', status: 'Em Resolução', assigned: '2 horas atrás' },
    { id: '2', site: 'Setor Sul - Manutenção', issue: 'Falha Elétrica', status: 'Recebido', assigned: '5 horas atrás' },
  ]);

  return (
    <DashboardLayout title="Terminal do Prestador" role="contractor">
      <div className="space-y-8">
        {/* Metric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <MetricCard 
             icon={<TrendingUp className="text-[#f59e0b]" />} 
             label="Total de Queixas Atribuídas" 
             value="128" 
             subValue="+14 este mês"
           />
           <MetricCard 
             icon={<CheckCircle2 className="text-green-500" />} 
             label="Queixas Resolvidas" 
             value="94" 
             subValue="73.4% de eficácia"
           />
           <MetricCard 
             icon={<Clock className="text-blue-500" />} 
             label="Tempo Médio de Resposta" 
             value="4h 20m" 
             subValue="-30m vs última semana"
           />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Direct Complaints Inbox */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="lg:col-span-2 bg-[#080808] border border-white/5 rounded-3xl p-8"
           >
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#f59e0b]/10 text-[#f59e0b] rounded-2xl">
                       <Inbox size={24} />
                    </div>
                    <div>
                       <h3 className="text-lg font-black uppercase tracking-tight">Queixas <span className="text-[#f59e0b]">Direcionadas</span></h3>
                       <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Chamados atribuídos para sua equipe</p>
                    </div>
                 </div>
                 <Button variant="outline" className="border-white/10 text-[10px] font-black uppercase tracking-widest h-10 px-4 rounded-xl">Histórico Completo</Button>
              </div>

              <div className="space-y-4">
                 {complaints.map((item) => (
                    <div key={item.id} className="p-6 bg-white/2 border border-white/5 rounded-2xl hover:bg-white/4 transition-all group">
                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex items-start gap-4">
                             <div className="mt-1 p-2 bg-slate-900 rounded-lg text-slate-400 group-hover:text-[#f59e0b] transition-colors">
                                <ClipboardList size={20} />
                             </div>
                             <div>
                                <h4 className="text-sm font-bold text-white mb-1">{item.issue}</h4>
                                <div className="flex items-center gap-3">
                                   <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                                      <MapPin size={12} /> {item.site}
                                   </div>
                                   <span className="text-[10px] text-slate-700">•</span>
                                   <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                                      <Clock size={12} /> {item.assigned}
                                   </div>
                                </div>
                             </div>
                          </div>
                          <div className="flex items-center gap-4 justify-between md:justify-end">
                             <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                item.status === 'Recebido' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' : 'bg-green-500/10 text-green-500'
                             }`}>
                                {item.status}
                             </span>
                             <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#f59e0b] hover:underline underline-offset-4">
                                Ver Detalhes <ArrowUpRight size={14} />
                             </button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </motion.div>

           {/* Quick Stats & Map Link */}
           <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#080808] border border-white/5 rounded-3xl p-8"
              >
                 <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6">Resumo de Atividade</h3>
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <span className="text-xs text-slate-400 font-medium">Queixas em Campo</span>
                       <span className="text-sm font-black">42</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full w-[65%] bg-[#f59e0b] rounded-full" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                       <span className="text-xs text-slate-400 font-medium">Chamados Feitos p/ Equipe</span>
                       <span className="text-sm font-black">18</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full w-[30%] bg-blue-500 rounded-full" />
                    </div>
                 </div>
              </motion.div>

              <div className="h-[250px] rounded-3xl overflow-hidden border border-white/5 relative group">
                 <GeolocationMap center={[-23.5505, -46.6333]} zoom={12} />
                 <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center pointer-events-none">
                    <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                       <MapPin size={14} className="text-[#f59e0b]" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Mapa de Obras</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function MetricCard({ icon, label, value, subValue }: { icon: React.ReactNode, label: string, value: string, subValue: string }) {
  return (
    <div className="bg-[#080808] border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
       <div className="absolute top-0 right-0 p-8 opacity-5 -mr-4 -mt-4 group-hover:scale-110 transition-transform">
          {icon}
       </div>
       <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">{label}</p>
       <h4 className="text-3xl font-black mb-2">{value}</h4>
       <p className="text-[10px] text-slate-400 font-bold">{subValue}</p>
    </div>
  );
}


