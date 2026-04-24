'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Smartphone, Apple, PlayCircle, QrCode, Shield, Zap, Bell, CheckCircle2 } from 'lucide-react';

const appFeatures = [
  { icon: Shield, title: "Envio Seguro", desc: "Denúncias verificadas por IA contra deepfakes." },
  { icon: Bell, title: "Alertas Reais", desc: "Notificações via GPS para incidentes próximos." },
  { icon: Zap, title: "Fórum Agil", desc: "Interface otimizada para discussões rápidas." },
];

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden mesh-gradient pb-20">
      <Header />
      
      {/* Dynamic Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto pt-40 px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-20">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-8">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
               </span>
               <span className="text-[9px] uppercase font-black tracking-widest text-primary">Disponível para iOS & Android</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.9] mb-8">
              A Voz da sua <br /> <span className="text-primary text-glow font-black">Comunidade</span>
            </h1>
            
            <p className="text-muted-foreground text-xl italic mb-12 max-w-lg">
              Transformamos seu smartphone em uma ferramenta poderosa de fiscalização e mudança social. 
              Instale o ECOA e comece a impactar seu bairro agora mesmo.
            </p>

            {/* Store Buttons */}
            <div className="flex flex-wrap gap-4 mb-16">
               <Button className="h-16 px-8 gap-3 bg-white text-black hover:bg-zinc-200 transition-all rounded-xl group">
                  <Apple className="w-6 h-6 fill-black" />
                  <div className="text-left">
                     <p className="text-[9px] uppercase font-bold opacity-70">Download na</p>
                     <p className="text-lg font-black uppercase tracking-tight">App Store</p>
                  </div>
               </Button>

               <Button className="h-16 px-8 gap-3 bg-zinc-900 border border-white/5 hover:border-primary/50 transition-all rounded-xl group">
                  <PlayCircle className="w-6 h-6 text-primary" />
                  <div className="text-left">
                     <p className="text-[9px] uppercase font-bold text-muted-foreground">Disponível no</p>
                     <p className="text-lg font-black uppercase tracking-tight">Google Play</p>
                  </div>
               </Button>
            </div>

            {/* Micro Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {appFeatures.map((f, i) => (
                 <div key={i} className="flex flex-col gap-2">
                    <f.icon className="w-5 h-5 text-primary mb-2" />
                    <h4 className="text-xs font-black uppercase tracking-widest">{f.title}</h4>
                    <p className="text-[10px] text-muted-foreground italic leading-relaxed">{f.desc}</p>
                 </div>
               ))}
            </div>
          </motion.div>

          {/* Right Content - Phone Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "circOut" }}
            className="flex-1 relative"
          >
             {/* Glowing Halo */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-[500px] bg-primary/20 blur-[100px] rounded-full animate-pulse" />
             
             {/* Phone Body */}
             <div className="w-[320px] h-[640px] mx-auto bg-zinc-950 border-10 border-zinc-900 rounded-[3.5rem] shadow-2xl relative overflow-hidden ring-1 ring-white/5">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-900 rounded-b-2xl z-20" />
                
                {/* App Content Preview */}
                <div className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center">
                   <div className="w-24 h-24 mb-10 p-4 glass rounded-3xl flex items-center justify-center shadow-lg shadow-primary/20">
                      <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                   </div>
                   
                   <div className="p-6 glass border-white/5 rounded-2xl w-full">
                      <QrCode className="w-32 h-32 text-primary mx-auto mb-6" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4">Escaneie para Instalar</p>
                      <div className="flex items-center justify-center gap-2 text-primary">
                         <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                         <span className="text-[9px] font-bold uppercase">v1.2.5 - Stable</span>
                      </div>
                   </div>
                </div>
                
                {/* Bottom Bar */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full" />
             </div>

             {/* Floating Info */}
             <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="absolute top-20 -right-10 glass p-4 border-primary/20 rounded-xl flex items-center gap-4 hidden lg:flex"
             >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                   <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase">Segurança IA</p>
                   <p className="text-[9px] text-muted-foreground">Filtro de Deepfake Ativo</p>
                </div>
             </motion.div>
          </motion.div>
          
        </div>
      </div>

      {/* Trust Footer */}
      <div className="container mx-auto px-6 mt-32 text-center">
         <p className="text-[10px] uppercase font-bold tracking-[0.6em] text-muted-foreground opacity-30">Padrão de Segurança SOC2 & LGPD Compliance</p>
      </div>
    </main>
  );
}


