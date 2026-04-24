'use client';

import React from 'react';
import { motion } from 'framer-motion';

const images = [
  { src: "/assets/rio_de_janeiro.jpg", title: "Rio de Janeiro", location: "Sudeste" },
  { src: "/assets/amazon_forest.jpg", title: "Amazonas", location: "Norte" },
  { src: "/assets/salvador_bahia.jpg", title: "Salvador", location: "Nordeste" },
  { src: "/assets/iguazu_falls.jpg", title: "Foz do Iguaçu", location: "Sul" },
  { src: "/assets/sao_paulo.jpg", title: "São Paulo", location: "Sudeste" },
  { src: "/assets/pantanal.jpg", title: "Pantanal", location: "Centro-Oeste" },
  { src: "/assets/brasilia.jpg", title: "Brasília", location: "Centro-Oeste" },
  { src: "/assets/lencois.jpg", title: "Lençóis Maranhenses", location: "Nordeste" },
];

export const BrazilGallery = () => {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">
            Brasil em <span className="text-primary text-glow">Foco</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl italic">
            Nossa tecnologia de monitoramento alcança os lugares mais remotos e icônicos do país, garantindo segurança e transparência em escala nacional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative aspect-4/5 overflow-hidden rounded-xl bg-muted"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${img.src})` }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">
                  {img.location}
                </p>
                <h3 className="text-xl font-bold text-white uppercase italic">
                  {img.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
