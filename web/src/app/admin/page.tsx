'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  MessageSquare, 
  AlertTriangle, 
  Plus, 
  Flag,
  CheckCircle2,
  Filter,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const GeolocationMap = dynamic(() => import('@/components/GeolocationMap'), { ssr: false });

export default function AdminDashboard() {
  const [courses, setCourses] = React.useState([
    { id: '1', title: 'Introdução ao Impacto Social', students: 124, category: 'Base' },
    { id: '2', title: 'Gestão de Crises em Campo', students: 85, category: 'Avançado' },
  ]);

  const [complaints, setComplaints] = React.useState([
    { id: '1', title: 'Vazamento na Rua Principal', priority: 'Alta', status: 'Pendente', date: '24/04' },
    { id: '2', title: 'Iluminação Pública Defeituosa', priority: 'Média', status: 'Em Análise', date: '23/04' },
  ]);

  return (
    <DashboardLayout title="Painel Operacional Admin" role="admin">
      <div className="space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <AdminStatCard icon={<AlertTriangle className="text-amber-500" />} label="Queixas Pendentes" value="12" />
           <AdminStatCard icon={<BookOpen className="text-blue-500" />} label="Cursos Ativos" value={courses.length.toString()} />
           <AdminStatCard icon={<MessageSquare className="text-purple-500" />} label="Tópicos Fórum" value="48" />
           <AdminStatCard icon={<BarChart3 className="text-primary" />} label="Média de Resolução" value="2.4 dias" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Complaints Management */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#080808] border border-white/5 rounded-3xl p-8 shadow-2xl"
          >
             <div className="flex items-center justify-between mb-8">
                <div>
                   <h3 className="text-lg font-black uppercase tracking-tight">Central de <span className="text-primary">Queixas</span></h3>
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Monitoramento e triagem de ocorrências</p>
                </div>
                <div className="flex gap-2">
                   <button className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-white"><Filter size={18} /></button>
                   <Button className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest px-4 rounded-xl">Relatórios</Button>
                </div>
             </div>

             <div className="space-y-4">
                {complaints.map((item) => (
                   <div key={item.id} className="p-5 bg-white/2 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            item.priority === 'Alta' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                         }`}>
                            <Flag size={20} />
                         </div>
                         <div>
                            <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{item.title}</h4>
                            <div className="flex gap-4 mt-1">
                               <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">ID: QUE-{item.id}</span>
                               <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Data: {item.date}</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                            item.status === 'Pendente' ? 'bg-slate-800 text-slate-400' : 'bg-primary/10 text-primary'
                         }`}>
                            {item.status}
                         </span>
                         <button className="p-2 text-slate-600 hover:text-primary transition-colors"><CheckCircle2 size={18} /></button>
                      </div>
                   </div>
                ))}
             </div>
          </motion.div>

          {/* Courses CRUD */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#080808] border border-white/5 rounded-3xl p-8"
          >
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black uppercase tracking-tight">Gestão de <span className="text-primary">Cursos</span></h3>
                <Button className="bg-primary text-black font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl">
                   <Plus size={16} className="mr-2" /> Novo Curso
                </Button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((course) => (
                   <div key={course.id} className="p-6 bg-white/2 border border-white/5 rounded-2xl hover:bg-white/4 transition-all cursor-pointer">
                      <div className="flex justify-between items-start mb-4">
                         <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                            <BookOpen size={20} />
                         </div>
                         <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest bg-white/5 px-2 py-1 rounded-md">{course.category}</span>
                      </div>
                      <h4 className="font-bold text-sm mb-2">{course.title}</h4>
                      <div className="flex items-center justify-between">
                         <span className="text-xs text-slate-500">{course.students} Alunos</span>
                         <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white">
                            <Plus size={14} />
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </motion.div>
        </div>

        {/* Map and Forum Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <motion.div className="lg:col-span-2 h-[450px]">
              <h3 className="text-lg font-black uppercase tracking-tight mb-6">Mapa de <span className="text-primary">Ocorrências</span></h3>
              <GeolocationMap 
                markers={[
                  { position: [-23.5505, -46.6333], label: "Queixa #001 - Pendente" },
                  { position: [-23.5405, -46.6433], label: "Queixa #002 - Em Análise" },
                ]}
              />
           </motion.div>
           
           <div className="space-y-6">
              <h3 className="text-lg font-black uppercase tracking-tight">Atividade do <span className="text-primary">Fórum</span></h3>
              <div className="p-6 bg-primary/5 border border-primary/10 rounded-3xl">
                 <p className="text-xs text-primary font-black uppercase tracking-widest mb-4">Novo Comentário Reportado</p>
                 <p className="text-sm italic text-slate-300 font-medium mb-4">"Este usuário está violando os termos de conduta no tópico..."</p>
                 <div className="flex gap-3">
                    <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-widest h-10 rounded-xl">Remover</Button>
                    <Button variant="outline" className="flex-1 border-white/10 text-[10px] font-black uppercase tracking-widest h-10 rounded-xl">Ignorar</Button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function AdminStatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-[#080808] border border-white/5 p-6 rounded-3xl group hover:border-primary/20 transition-all">
       <div className="flex items-center gap-4">
          <div className="p-3 bg-white/3 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
          <div>
             <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-0.5">{label}</p>
             <h4 className="text-xl font-black">{value}</h4>
          </div>
       </div>
    </div>
  );
}


