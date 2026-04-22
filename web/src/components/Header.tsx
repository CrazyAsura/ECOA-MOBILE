'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export const Header = () => {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 glass h-20"
    >
      <div className="flex items-center gap-2">
        <span className="text-xl font-black tracking-tighter uppercase italic text-glow">Ecoa</span>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-muted-foreground">
        <Link href="/" className="hover:text-primary transition-colors cursor-pointer">Início</Link>
        <Link href="/about" className="hover:text-primary transition-colors cursor-pointer">Sobre</Link>
        <Link href="/services" className="hover:text-primary transition-colors cursor-pointer">Serviços</Link>
        <Link href="/faq" className="hover:text-primary transition-colors cursor-pointer">FAQ</Link>
      </nav>

      <div className="flex items-center gap-4">
        <Link href="/download">
          <Button className="uppercase text-xs font-extrabold tracking-widest glow-green">Baixar App</Button>
        </Link>
      </div>
    </motion.header>
  );
};
