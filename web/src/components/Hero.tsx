'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';

const slides = [
  { 
    img: "/assets/aracaju_hero_cinematic_1776817029690.png", 
    tag: "Nordeste", 
    title: "Onde Tudo Começou",
    desc: "Monitoramento inteligente na Orla de Atalaia. Transformando o engajamento social em resultados reais para Sergipe."
  },
  { 
    img: "/assets/brazil_rio_cinematic_1776817729224.png", 
    tag: "Sudeste", 
    title: "Vigilância Urbana",
    desc: "A tecnologia protegendo a Cidade Maravilhosa. Segurança comunitária com análise de IA em tempo real."
  },
  { 
    img: "/assets/brazil_brasilia_cinematic_1776818590254.png", 
    tag: "Centro-Oeste", 
    title: "Eixo de Transparência",
    desc: "No coração do poder, a voz do povo ecoa mais forte. Fiscalização pública com precisão absoluta no Distrito Federal."
  },
  { 
    img: "/assets/brazil_amazon_cinematic_1776817751106.png", 
    tag: "Norte", 
    title: "Preservação Ativa",
    desc: "Inteligência artificial servindo ao pulmão do mundo. Protegendo a Amazônia através de alertas geo-espaciais."
  }
];

export const Hero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Carousel 
        opts={{ loop: true }} 
        plugins={[Autoplay({ delay: 6000 })]}
        className="w-full h-full"
      >
        <CarouselContent className="h-screen m-0 border-none">
          {slides.map((slide, i) => (
            <CarouselItem key={i} className="relative h-screen p-0 border-none shrink-0 group">
              {/* Background */}
              <div 
                className="absolute inset-0 bg-cover bg-center scale-105 group-data-[active=true]:scale-100 transition-transform duration-[8000ms] ease-out"
                style={{ backgroundImage: `url(${slide.img})` }}
              />
              {/* Overlays */}
              <div className="absolute inset-0 bg-black/60 z-10" />
              <div className="absolute inset-0 bg-gradient-to-b from-background via-black/20 to-background z-10" />
              
              {/* Content */}
              <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
                 <motion.div
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.8, delay: 0.2 }}
                 >
                    <span className="px-4 py-1.5 border border-primary/30 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.4em] bg-primary/10 mb-8 inline-block shadow-[0_0_15px_-5px_#20c997]">
                       {slide.tag}
                    </span>
                    <h1 className="text-6xl md:text-[10rem] font-black italic uppercase tracking-tighter mb-8 leading-[0.8] drop-shadow-2xl">
                       {slide.title.split(' ')[0]} <br /> 
                       <span className="text-primary text-glow font-black">{slide.title.split(' ').slice(1).join(' ')}</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-muted-foreground text-lg italic mb-12 opacity-80 font-medium leading-relaxed">
                       {slide.desc}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-6">
                       <Link href="/download">
                          <Button size="lg" className="h-16 px-12 text-md font-black uppercase tracking-widest glow-green rounded-none">
                             Baixar Aplicativo
                          </Button>
                       </Link>
                       <Link href="/about">
                          <Button size="lg" variant="ghost" className="text-md font-black uppercase tracking-widest hover:text-primary group border border-transparent hover:border-primary/20">
                             Missão Brasil <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                          </Button>
                       </Link>
                    </div>
                 </motion.div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 z-10 opacity-10 pointer-events-none bg-[radial-gradient(#20c997_1px,transparent_1px)] [background-size:40px_40px]" />
      
      {/* Slide Indicators Teaser */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-12 opacity-30">
         {["01", "02", "03", "04"].map((num) => (
           <span key={num} className="text-[10px] font-black tracking-widest">{num}</span>
         ))}
      </div>
    </section>
  );
};
