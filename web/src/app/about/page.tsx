'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { motion } from 'framer-motion';
import { Shield, Users, Target, Globe } from 'lucide-react';

const values = [
  { icon: Shield, title: "Segurança Absoluta", desc: "Criptografia de ponta a ponta e detecção de deepfakes." },
  { icon: Users, title: "Comunidade Ativa", desc: "Empoderamos o cidadão para ser o protagonista da mudança." },
  { icon: Target, title: "Precisão de Dados", desc: "Transformamos denúncias em dados acionáveis para gestão pública." },
  { icon: Globe, title: "Escala Nacional", desc: "Uma rede conectada de Manaus ao Chuí." },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background mesh-gradient relative pb-20">
      <Header />
      
      {/* Cinematic Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/brazil_amazon_cinematic_1776817751106.png')] bg-cover bg-center brightness-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center px-6"
        >
          <h4 className="text-primary font-black uppercase tracking-[0.5em] text-xs mb-4">Nossa Essência</h4>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-glow">ECOA <span className="text-primary font-black">Brasil</span></h1>
        </motion.div>
      </section>

      <div className="container mx-auto px-6 -mt-20 relative z-20">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
             <h2 className="text-4xl font-black uppercase italic mb-8 border-l-4 border-primary pl-6">Redefinindo o <br />Engajamento Social</h2>
             <p className="text-muted-foreground text-lg leading-relaxed italic mb-6">
                Fundada em Sergipe e expandida para todo o território nacional, a ECOA nasceu de um propósito simples: 
                dar voz ao que o silêncio da burocracia oculta. 
             </p>
             <p className="text-muted-foreground text-lg leading-relaxed italic">
                Utilizamos inteligência artificial e análise geo-espacial para garantir que cada incidente relatado 
                seja verificado, priorizado e resolvido. Somos o abraço tecnológico entre a sociedade civil e a 
                eficiência pública.
             </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-square bg-zinc-900 overflow-hidden rounded-2xl border border-white/5 rotate-3 hover:rotate-0 transition-transform duration-700">
               <img src="/assets/brazil_rio_cinematic_1776817729224.png" className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all" />
            </div>
            <div className="absolute -bottom-10 -left-10 glass p-8 border-primary/20 max-w-[250px] animate-float">
               <p className="text-3xl font-black text-primary mb-1">100%</p>
               <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Compromisso com a Transparência</p>
            </div>
          </motion.div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-10 glass border-white/5 hover:border-primary/30 transition-all flex flex-col items-center text-center"
            >
              <v.icon className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-xl font-bold uppercase mb-4 tracking-tight">{v.title}</h3>
              <p className="text-muted-foreground text-sm italic">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
