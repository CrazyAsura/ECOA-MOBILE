'use client';

import React from 'react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Map as MapIcon, 
  Bell,
  Search,
  Menu,
  X,
  BookOpen,
  History,
  AlertTriangle,
  MessageSquare,
  ClipboardList
} from 'lucide-react';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  role: UserRole;
}

export default function DashboardLayout({ children, title, role }: DashboardLayoutProps) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Redirect to login based on intended role if not logged in
        switch (role) {
          case 'super-admin': router.push('/auth/super-admin/login'); break;
          case 'admin': router.push('/auth/admin/login'); break;
          case 'contractor': router.push('/auth/contractors/login'); break;
          case 'super-contractor': router.push('/auth/super-contractors/login'); break;
          default: router.push('/');
        }
      } else if (user.role !== role) {
        // Unauthorized role for this section
        router.push('/');
      }
    }
  }, [user, isLoading, role, router]);

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  if (isLoading || !user || user.role !== role) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary animate-pulse">Verificando Acesso...</p>
        </div>
      </div>
    );
  }

  const roleConfigs = {
    'super-admin': {
      items: [
        { icon: <LayoutDashboard size={20} />, label: 'Overview', href: '/superadmin' },
        { icon: <Users size={20} />, label: 'Admins', href: '/superadmin/admins' },
        { icon: <History size={20} />, label: 'System Logs', href: '/superadmin/logs' },
      ]
    },
    'admin': {
      items: [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/admin' },
        { icon: <BookOpen size={20} />, label: 'Cursos', href: '/admin/courses' },
        { icon: <AlertTriangle size={20} />, label: 'Queixas', href: '/admin/complaints' },
        { icon: <MessageSquare size={20} />, label: 'Fórum', href: '/admin/forum' },
      ]
    },
    'contractor': {
      items: [
        { icon: <LayoutDashboard size={20} />, label: 'Overview', href: '/contractors' },
        { icon: <ClipboardList size={20} />, label: 'Minhas Missões', href: '/contractors/complaints' },
      ]
    },
    'super-contractor': {
      items: [
        { icon: <LayoutDashboard size={20} />, label: 'Overview', href: '/super-contractors' },
        { icon: <AlertTriangle size={20} />, label: 'Alertas SLA', href: '/super-contractors/alerts' },
      ]
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-[#080808] border-r border-white/5 flex flex-col z-50 relative"
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-black uppercase tracking-[0.3em] text-primary text-xs"
            >
              ECOA Panel
            </motion.span>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
           {roleConfigs[role]?.items.map((item, idx) => (
             <SidebarItem key={idx} {...item} isOpen={isSidebarOpen} />
           ))}
        </nav>

        <div className="p-4 border-t border-white/5">
           <button 
             onClick={logout}
             className="w-full flex items-center gap-4 p-4 text-red-500 hover:bg-red-500/10 rounded-xl transition-all font-bold text-sm"
           >
             <LogOut size={20} />
             {isSidebarOpen && <span>Sair do Sistema</span>}
           </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-40">
           <div className="flex items-center gap-4">
              <h1 className="text-xl font-black uppercase tracking-tight">{title}</h1>
              <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                 <span className="text-[10px] font-black uppercase text-primary tracking-widest">{role}</span>
              </div>
           </div>

           <div className="flex items-center gap-6">
              <div className="relative hidden md:block">
                 <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                 <input 
                   type="text" 
                   placeholder="Pesquisar no sistema..." 
                   className="bg-white/5 border border-white/10 rounded-full h-10 pl-12 pr-6 text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-all w-64"
                 />
              </div>
              <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                 <Bell size={20} />
                 <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#050505]" />
              </button>
              <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                 <div className="text-right">
                    <p className="text-xs font-black uppercase tracking-tight">{user?.name || 'Administrador'}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ID: {user?.id?.slice(0, 5) || '---'}</p>
                 </div>
                 <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center font-black text-primary">
                    {user?.name?.[0] || 'A'}
                 </div>
              </div>
           </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
           {children}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, href = "#", active = false, isOpen }: { icon: React.ReactNode, label: string, href?: string, active?: boolean, isOpen: boolean }) {
  return (
    <Link href={href} className={`
      flex items-center gap-4 p-4 rounded-xl transition-all group
      ${active ? 'bg-primary text-black' : 'text-slate-400 hover:bg-white/5 hover:text-white'}
    `}>
      <div className={`${active ? 'text-black' : 'group-hover:scale-110 transition-transform'}`}>
        {icon}
      </div>
      {isOpen && <span className="text-sm font-bold">{label}</span>}
    </Link>
  );
}
