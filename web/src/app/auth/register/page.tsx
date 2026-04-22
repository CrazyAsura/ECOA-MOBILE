'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { motion } from 'framer-motion';
import Link from 'next/link';

const registerSchema = z.object({
  name: z.string().min(3, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter 6+ carateres"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"],
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: RegisterValues) => {
    console.log('Register Data:', data);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass border-white/5">
          <CardHeader className="text-center py-8">
            <CardTitle className="text-3xl font-black italic uppercase tracking-tighter">Criar <span className="text-primary">Conta</span></CardTitle>
            <CardDescription className="uppercase tracking-widest text-[10px] font-bold">Junte-se à revolução comunitária</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-[10px] font-bold tracking-widest">Nome Completo</FormLabel>
                    <FormControl><Input placeholder="João Silva" {...field} className="h-11 bg-black/20 border-white/5" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-[10px] font-bold tracking-widest">E-mail</FormLabel>
                    <FormControl><Input placeholder="joao@exemplo.com" {...field} className="h-11 bg-black/20 border-white/5" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-[10px] font-bold tracking-widest">Senha</FormLabel>
                    <FormControl><Input type="password" placeholder="••••••••" {...field} className="h-11 bg-black/20 border-white/5" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-[10px] font-bold tracking-widest">Confirmar Senha</FormLabel>
                    <FormControl><Input type="password" placeholder="••••••••" {...field} className="h-11 bg-black/20 border-white/5" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full h-12 uppercase font-black tracking-widest glow-green mt-4">Registrar</Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-white/5 py-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Já tem conta? <Link href="/auth/login" className="text-primary font-bold">Entrar</Link></p>
          </CardFooter>
        </Card>
      </motion.div>
    </main>
  );
}
