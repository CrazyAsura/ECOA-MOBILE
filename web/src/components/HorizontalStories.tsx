'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const stories = [
  { city: "Manaus", action: "Monitoramento Ambiental", result: "20% Redução Incêndios", img: "/assets/brazil_amazon_cinematic_1776817751106.png" },
  { city: "Rio de Janeiro", action: "Segurança Comunitária", result: "Resposta em < 10min", img: "/assets/brazil_rio_cinematic_1776817729224.png" },
  { city: "Brasília", action: "Fiscalização Pública", result: "Transparência 100%", img: "/assets/brazil_brasilia_cinematic_1776818590254.png" },
  { city: "Aracaju", action: "Manutenção Urbana", result: "Orla 100% Iluminada", img: "/assets/aracaju_hero_cinematic_1776817029690.png" },
];

export function HorizontalStories() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-black">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="container mx-auto px-6 mb-12">
           <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter">Histórias de <br /><span className="text-primary text-glow">Impacto Brasil</span></h2>
        </div>
        
        <motion.div style={{ x }} className="flex gap-8 px-6">
          {stories.map((story, i) => (
            <div key={i} className="group relative w-[400px] h-[500px] flex-shrink-0 glass overflow-hidden border-white/5">
                <img src={story.img} className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" alt={story.city} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-10 left-10">
                   <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-2">{story.city}</p>
                   <h3 className="text-2xl font-bold uppercase mb-2">{story.action}</h3>
                   <p className="text-muted-foreground italic text-sm">{story.result}</p>
                </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
