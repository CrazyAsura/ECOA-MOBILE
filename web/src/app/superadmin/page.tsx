'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { 
  Users, 
  History, 
  Plus, 
  Trash2, 
  Edit3, 
  MoreVertical,
  Activity,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const GeolocationMap = dynamic(() => import('@/components/GeolocationMap'), { ssr: false });

export default function SuperAdminDashboard() {
  const [admins, setAdmins] = React.useState([
    { id: '1', name: 'Ricardo Santos', email: 'ricardo@ecoa.br', status: 'Ativo', lastLogin: '10 min atrás' },
    { id: '2', name: 'Ana Oliveira', email: 'ana@ecoa.br', status: 'Ativo', lastLogin: '2 horas atrás' },
    { id: '3', name: 'Marcos Lima', email: 'marcos@ecoa.br', status: 'Inativo', lastLogin: '3 dias atrás' },
  ]);

  const [logs, setLogs] = React.useState([
    { id: '1', user: 'Ricardo Santos', action: 'Criou novo curso', time: '14:20', date: '24 Abr' },
    { id: '2', user: 'Ana Oliveira', action: 'Aprovou queixa #442', time: '13:15', date: '24 Abr' },
    { id: '3', user: 'Admin System', action: 'Backup de segurança concluído', time: '04:00', date: '24 Abr' },
  ]);

  return (
    <DashboardLayout title="Terminal Super-Admin" role="super-admin">
      <div className="space-y-8">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <StatCard icon={<ShieldCheck className="text-primary" />} label="Sistemas Ativos" value="98.2%" trend="+1.2%" />
           <StatCard icon={<Users className="text-blue-500" />} label="Total Administradores" value={admins.length.toString()} />
           <StatCard icon={<Activity className="text-red-500" />} label="Logs Hoje" value="1,284" trend="+42" />
           <StatCard icon={<History className="text-purple-500" />} label="Uptime Servidores" value="99.99%" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Admin Management CRUD */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-[#080808] border border-white/5 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
               <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">Gestão de <span className="text-primary">Administradores</span></h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Controle de acesso e privilégios</p>
               </div>
               <Button className="bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl">
                 <Plus size={16} className="mr-2" /> Novo Admin
               </Button>
            </div>
            
            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead className="bg-white/2 text-[10px] uppercase font-black tracking-widest text-slate-500">
                     <tr>
                        <th className="px-8 py-4 text-left">Nome</th>
                        <th className="px-8 py-4 text-left">E-mail</th>
                        <th className="px-8 py-4 text-left">Status</th>
                        <th className="px-8 py-4 text-left">Último Acesso</th>
                        <th className="px-8 py-4 text-right">Ações</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {admins.map((admin) => (
                        <tr key={admin.id} className="group hover:bg-white/1 transition-colors">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-xs text-slate-300">
                                    {admin.name[0]}
                                 </div>
                                 <span className="text-sm font-bold text-white">{admin.name}</span>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-sm text-slate-400 font-medium">{admin.email}</td>
                           <td className="px-8 py-6">
                              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                 admin.status === 'Ativo' ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-500'
                              }`}>
                                 {admin.status}
                              </span>
                           </td>
                           <td className="px-8 py-6 text-xs text-slate-500 font-medium">{admin.lastLogin}</td>
                           <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                 <button className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-all text-slate-500">
                                    <Edit3 size={16} />
                                 </button>
                                 <button className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all text-slate-500">
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </motion.div>

          {/* Activity Logs */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#080808] border border-white/5 rounded-3xl p-8 flex flex-col"
          >
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black uppercase tracking-tight">Logs de <span className="text-primary">Atividade</span></h3>
                <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500"><Eye size={18} /></button>
             </div>
             
             <div className="flex-1 space-y-6">
                {logs.map((log) => (
                   <div key={log.id} className="relative pl-6 border-l border-white/10 group">
                      <div className="absolute left-[-5px] top-1 w-2 h-2 bg-primary rounded-full group-hover:scale-150 transition-transform shadow-[0_0_10px_#20c997]" />
                      <div className="flex items-center justify-between mb-1">
                         <span className="text-[10px] font-black uppercase text-primary tracking-widest">{log.user}</span>
                         <span className="text-[9px] text-slate-600 font-bold">{log.time}</span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium">{log.action}</p>
                   </div>
                ))}
             </div>
             
             <Button variant="outline" className="w-full mt-8 border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest h-12 rounded-xl">
                Ver Todos os Logs
             </Button>
          </motion.div>
        </div>

        {/* Geolocation Map */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-[500px] w-full"
        >
           <div className="mb-6 flex items-center justify-between">
              <div>
                 <h3 className="text-lg font-black uppercase tracking-tight">Mapa de <span className="text-primary">Geolocalização</span></h3>
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Distribuição geográfica de administradores e ocorrências</p>
              </div>
           </div>
           <GeolocationMap 
             markers={[
               { position: [-23.5505, -46.6333], label: "Admin SP - Ricardo" },
               { position: [-22.9068, -43.1729], label: "Admin RJ - Ana" },
               { position: [-19.9167, -43.9345], label: "Admin MG - Marcos" },
             ]}
           />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string, trend?: string }) {
  return (
    <div className="bg-[#080808] border border-white/5 p-6 rounded-3xl shadow-xl">
       <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/3 rounded-2xl">{icon}</div>
          {trend && (
             <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-full">{trend}</span>
          )}
       </div>
       <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{label}</p>
       <h4 className="text-2xl font-black">{value}</h4>
    </div>
  );
}


