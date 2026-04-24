'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Mail, 
  Shield, 
  ArrowLeft,
  Filter,
  Download,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { encryptParam } from '@/lib/crypto';
import { redis } from '@/lib/redis';

export default function AdminsManagementPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdmins() {
      // Try to get from "Redis"
      const cached = await redis.get('admin_list');
      if (cached) {
        setAdmins(cached);
        setLoading(false);
        return;
      }

      // Simulation of fetch
      setTimeout(async () => {
        const data = [
          { id: '1', name: 'Ricardo Santos', email: 'ricardo@ecoa.br', role: 'Global Admin', lastSeen: 'Agora' },
          { id: '2', name: 'Ana Oliveira', email: 'ana@ecoa.br', role: 'Regional Admin', lastSeen: '2h atrás' },
          { id: '3', name: 'Marcos Lima', email: 'marcos@ecoa.br', role: 'Support Admin', lastSeen: 'Ontem' },
          { id: '4', name: 'Julia Pereira', email: 'julia@ecoa.br', role: 'Audit Admin', lastSeen: '3 dias atrás' },
        ];
        setAdmins(data);
        await redis.set('admin_list', data, 60); // Cache for 60s
        setLoading(false);
      }, 800);
    }
    loadAdmins();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este administrador? Esta ação é irreversível.')) {
      const updated = admins.filter(a => a.id !== id);
      setAdmins(updated);
      await redis.set('admin_list', updated, 60);
      alert('Administrador removido com sucesso.');
    }
  };

  return (
    <DashboardLayout title="Gestão de Administradores" role="super-admin">
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex items-center gap-4">
              <Link href="/superadmin" className="p-2 hover:bg-white/5 rounded-full text-slate-500 transition-colors">
                 <ArrowLeft size={20} />
              </Link>
              <div>
                 <h2 className="text-2xl font-black uppercase italic tracking-tighter">Administradores <span className="text-primary text-glow">Ecoa</span></h2>
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Controle total de permissões e acessos</p>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <Button variant="outline" className="border-white/10 text-[10px] font-black uppercase tracking-widest h-12 rounded-xl">
                 <Download size={16} className="mr-2" /> Exportar
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest text-[10px] h-12 rounded-xl px-6">
                 <Link href="/superadmin/admins/create">
                   <Plus size={18} className="mr-2" /> Novo Admin
                 </Link>
              </Button>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
           {/* Filters Sidebar */}
           <div className="lg:col-span-1 space-y-6">
              <div className="bg-[#080808] border border-white/5 rounded-3xl p-6">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
                    <Filter size={14} /> Filtros Rápidos
                 </h3>
                 <div className="space-y-4">
                    <FilterItem label="Todos" count={admins.length} active />
                    <FilterItem label="Sênior" count={2} />
                    <FilterItem label="Auditores" count={1} />
                    <FilterItem label="Inativos" count={0} />
                 </div>
              </div>
           </div>

           {/* Table Content */}
           <div className="lg:col-span-3">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#080808] border border-white/5 rounded-3xl overflow-hidden shadow-2xl"
              >
                 <div className="p-6 border-b border-white/5 bg-white/1">
                    <div className="relative">
                       <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                       <input 
                         type="text" 
                         placeholder="Buscar por nome, e-mail ou cargo..." 
                         className="w-full bg-black/40 border border-white/5 rounded-xl h-12 pl-12 pr-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                       />
                    </div>
                 </div>

                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-white/2 text-[9px] font-black uppercase tracking-widest text-slate-500">
                          <tr>
                             <th className="px-8 py-5">Perfil</th>
                             <th className="px-8 py-5">Nível de Acesso</th>
                             <th className="px-8 py-5">Atividade</th>
                             <th className="px-8 py-5 text-right">Ações</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                          {loading ? (
                             Array.from({ length: 4 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                   <td colSpan={4} className="px-8 py-8 h-20 bg-white/1" />
                                </tr>
                             ))
                          ) : (
                             admins.map((admin) => (
                                <tr key={admin.id} className="group hover:bg-white/1 transition-colors">
                                   <td className="px-8 py-6">
                                      <div className="flex items-center gap-4">
                                         <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center font-black text-primary">
                                            {admin.name[0]}
                                         </div>
                                         <div>
                                            <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{admin.name}</p>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                                               <Mail size={10} /> {admin.email}
                                            </div>
                                         </div>
                                      </div>
                                   </td>
                                   <td className="px-8 py-6">
                                      <div className="flex items-center gap-2">
                                         <Shield size={14} className="text-blue-500" />
                                         <span className="text-xs text-slate-300 font-medium">{admin.role}</span>
                                      </div>
                                   </td>
                                   <td className="px-8 py-6">
                                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{admin.lastSeen}</span>
                                   </td>
                                   <td className="px-8 py-6 text-right">
                                      <div className="flex items-center justify-end gap-2">
                                         {/* Using Encrypted ID in URL */}
                                         <Link 
                                           href={`/superadmin/admins/edit?uid=${encryptParam(admin.id)}`}
                                           className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-all text-slate-500"
                                         >
                                            <MoreHorizontal size={18} />
                                         </Link>
                                         <button 
                                           onClick={() => handleDelete(admin.id)}
                                           className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all text-slate-500"
                                         >
                                            <Trash2 size={16} />
                                         </button>
                                      </div>
                                   </td>
                                </tr>
                             ))
                          )}
                       </tbody>
                    </table>
                 </div>
              </motion.div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function FilterItem({ label, count, active = false }: { label: string, count: number, active?: boolean }) {
  return (
    <div className={`
       flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all
       ${active ? 'bg-primary/10 border border-primary/20 text-primary' : 'hover:bg-white/5 text-slate-400'}
    `}>
       <span className="text-xs font-bold">{label}</span>
       <span className="text-[10px] font-black bg-white/5 px-2 py-0.5 rounded-full">{count}</span>
    </div>
  );
}

