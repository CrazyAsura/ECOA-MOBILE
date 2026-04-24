'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Upload,
  BookOpen,
  Clock,
  Users,
  FileText,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateCoursePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    duration: '',
    maxStudents: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Course created:', formData);
      setLoading(false);
      router.push('/admin/courses');
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <DashboardLayout title="Criar Novo Curso" role="admin">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin/courses" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-4">
              <ArrowLeft size={16} className="mr-2" />
              <span className="text-xs font-black uppercase tracking-widest">Voltar à Gestão</span>
            </Link>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Criar <span className="text-primary text-glow">Curso</span></h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Desenvolva novo conteúdo educacional</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#080808] border border-white/5 rounded-3xl p-8"
          >
            <h3 className="text-lg font-black uppercase tracking-tight mb-6">Informações <span className="text-primary">Básicas</span></h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Título do Curso</label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ex: Introdução ao Impacto Social"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Categoria</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary"
                  required
                >
                  <option value="" className="bg-[#080808]">Selecione uma categoria</option>
                  <option value="Base" className="bg-[#080808]">Base</option>
                  <option value="Avançado" className="bg-[#080808]">Avançado</option>
                  <option value="Saúde" className="bg-[#080808]">Saúde</option>
                  <option value="Tecnologia" className="bg-[#080808]">Tecnologia</option>
                  <option value="Gestão" className="bg-[#080808]">Gestão</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Duração Estimada</label>
                <Input
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="Ex: 4 semanas"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Máximo de Alunos</label>
                <Input
                  type="number"
                  value={formData.maxStudents}
                  onChange={(e) => handleInputChange('maxStudents', e.target.value)}
                  placeholder="Ex: 50"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Descrição</label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descreva os objetivos e conteúdo do curso..."
                rows={4}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 resize-none"
                required
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#080808] border border-white/5 rounded-3xl p-8"
          >
            <h3 className="text-lg font-black uppercase tracking-tight mb-6">Conteúdo do <span className="text-primary">Curso</span></h3>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Material Educacional</label>
              <Textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Descreva o conteúdo, módulos, aulas, materiais necessários..."
                rows={8}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 resize-none"
                required
              />
            </div>

            {/* File Upload Placeholder */}
            <div className="mt-6 p-8 border-2 border-dashed border-white/10 rounded-2xl text-center">
              <Upload className="mx-auto text-slate-400 mb-4" size={48} />
              <p className="text-sm text-slate-400 mb-2">Arraste arquivos ou clique para fazer upload</p>
              <p className="text-xs text-slate-500">PDF, DOC, PPT, imagens (máx. 10MB cada)</p>
              <Button variant="outline" className="mt-4 border-white/10 text-slate-400 hover:text-white">
                Selecionar Arquivos
              </Button>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-4 justify-end"
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/courses')}
              className="border-white/10 text-slate-400 hover:text-white px-8"
            >
              <X size={16} className="mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest px-8"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  Criando...
                </div>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Criar Curso
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </div>
    </DashboardLayout>
  );
}