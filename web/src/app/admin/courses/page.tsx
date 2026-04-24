'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Plus, 
  Search, 
  MoreVertical, 
  GraduationCap, 
  ArrowLeft,
  Calendar,
  Users,
  Eye,
  Trash2,
  Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { encryptParam } from '@/lib/crypto';
import { redis } from '@/lib/redis';

export default function CoursesManagementPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      const cached = await redis.get('courses_list');
      if (cached) {
        setCourses(cached);
        setLoading(false);
        return;
      }

      setTimeout(async () => {
        const data = [
          { id: '101', title: 'Introdução ao Impacto Social', category: 'Base', students: 124, date: '12 Abr 2026', status: 'Ativo' },
          { id: '102', title: 'Gestão de Crises em Campo', category: 'Avançado', students: 85, date: '15 Abr 2026', status: 'Ativo' },
          { id: '103', title: 'Primeiros Socorros Comunitários', category: 'Saúde', students: 210, date: '18 Abr 2026', status: 'Ativo' },
          { id: '104', title: 'Monitoramento Digital Avançado', category: 'Tecnologia', students: 56, date: '20 Abr 2026', status: 'Rascunho' },
        ];
        setCourses(data);
        await redis.set('courses_list', data, 120);
        setLoading(false);
      }, 600);
    }
    loadCourses();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Deseja remover este curso?')) {
      const updated = courses.filter(c => c.id !== id);
      setCourses(updated);
      await redis.set('courses_list', updated, 120);
      alert('Curso removido.');
    }
  };

  return (
    <DashboardLayout title="Gestão de Cursos" role="admin">
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex items-center gap-4">
              <Link href="/admin" className="p-2 hover:bg-white/5 rounded-full text-slate-500 transition-colors">
                 <ArrowLeft size={20} />
              </Link>
              <div>
                 <h2 className="text-2xl font-black uppercase italic tracking-tighter">Academia <span className="text-primary text-glow">Ecoa</span></h2>
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Criação e monitoramento de conteúdo educacional</p>
              </div>
           </div>
           
           <Button asChild className="bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest text-[10px] h-12 rounded-xl px-6">
              <Link href="/admin/courses/create">
                <Plus size={18} className="mr-2" /> Criar Novo Curso
              </Link>
           </Button>
        </header>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
           {loading ? (
             Array.from({ length: 4 }).map((_, i) => (
               <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse" />
             ))
           ) : (
             courses.map((course) => (
               <motion.div 
                 key={course.id}
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="bg-[#080808] border border-white/5 rounded-3xl p-6 hover:border-primary/20 transition-all group"
               >
                  <div className="flex justify-between items-start mb-6">
                     <div className="p-3 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-black transition-all">
                        <BookOpen size={24} />
                     </div>
                     <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                        course.status === 'Ativo' ? 'bg-primary/10 text-primary' : 'bg-slate-800 text-slate-500'
                     }`}>
                        {course.status}
                     </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 min-h-14 leading-tight">{course.title}</h3>
                  
                  <div className="flex items-center gap-4 mb-6">
                     <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        <Users size={12} className="text-primary" /> {course.students} Alunos
                     </div>
                     <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        <Calendar size={12} /> {course.date}
                     </div>
                  </div>

                  <div className="flex items-center gap-2 pt-6 border-t border-white/5">
                     <Link 
                       href={`/admin/courses/view?cid=${encryptParam(course.id)}`}
                       className="flex-1 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest transition-all"
                     >
                        <Eye size={14} className="mr-2" /> Ver
                     </Link>
                     <button className="w-10 h-10 bg-white/5 hover:bg-primary/10 hover:text-primary rounded-xl flex items-center justify-center transition-all">
                        <Edit3 size={14} />
                     </button>
                     <button 
                       onClick={() => handleDelete(course.id)}
                       className="w-10 h-10 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-xl flex items-center justify-center transition-all text-slate-600"
                     >
                        <Trash2 size={14} />
                     </button>
                  </div>
               </motion.div>
             ))
           )}
        </div>
      </div>
    </DashboardLayout>
  );
}

