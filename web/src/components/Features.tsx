'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Eye, Zap, MessageSquare, Map, Database } from 'lucide-react';

const features = [
  { icon: ShieldCheck, title: "Deepfake Detection", desc: "IA de ponta verificando a autenticidade de cada evidência enviada.", size: "lg" },
  { icon: Zap, title: "Alertas em Tempo Real", desc: "Notificações instantâneas para moradores de áreas afetadas.", size: "sm" },
  { icon: Eye, title: "Análise Preditiva", desc: "Mapas de calor que mostram tendências de incidentes urbanos.", size: "sm" },
  { icon: MessageSquare, title: "Fórum Comunitário", desc: "Espaço gamificado para discussões e resoluções coletivas.", size: "lg" },
  { icon: Map, title: "Rede Nacional", desc: "Conectando o Brasil de ponta a ponta.", size: "sm" },
  { icon: Database, title: "Open Data", desc: "Transparência total com dados exportáveis.", size: "sm" },
];

export const Features = () => {
  return (
    <section id="servicos" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <h4 className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4">Core Technology</h4>
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">O Ecossistema <span className="text-primary text-glow">Ecoa</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-8 glass border-white/5 hover:border-primary/50 transition-all group relative overflow-hidden flex flex-col justify-between ${f.size === 'lg' ? 'md:col-span-2 h-[350px]' : 'h-[350px]'}`}
            >
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div>
                 <f.icon className="w-10 h-10 text-primary mb-6 group-hover:animate-float" />
                 <h3 className="text-2xl font-black uppercase italic mb-4 tracking-tightergroup-hover:text-primary transition-colors">{f.title}</h3>
                 <p className="text-muted-foreground text-sm italic leading-relaxed max-w-xs">{f.desc}</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-primary opacity-40 group-hover:opacity-100 mt-4">
                 Explorar Módulo <ChevronRight className="w-3 h-3" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

function ChevronRight(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
}
