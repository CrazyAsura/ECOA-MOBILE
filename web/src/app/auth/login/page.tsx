'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LoginPage() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log('Login Data:', data);
    // Integration with backend will happen here
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass border-white/5 overflow-hidden">
          <CardHeader className="space-y-1 text-center py-10 bg-white/5">
            <CardTitle className="text-3xl font-black italic uppercase tracking-tighter">Entrar na <span className="text-primary">Ecoa</span></CardTitle>
            <CardDescription className="uppercase tracking-[0.2em] text-[10px] font-bold text-muted-foreground pt-2">
              Sua plataforma de engajamento social
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold tracking-widest">E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="seu@email.com" {...field} className="h-12 bg-black/20 border-white/10 rounded-none focus:border-primary transition-all" />
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-bold" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold tracking-widest">Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} className="h-12 bg-black/20 border-white/10 rounded-none focus:border-primary transition-all" />
                      </FormControl>
                      <FormMessage className="text-[10px] uppercase font-bold" />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full h-14 uppercase font-black tracking-[0.2em] glow-green rounded-none">
                  Acessar Painel
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-white/5 py-6">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              Não tem conta? <Link href="/auth/register" className="text-primary font-bold hover:underline">Registre-se</Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </main>
  );
}
