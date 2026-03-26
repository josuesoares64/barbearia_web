"use client";

import { usePathname } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import { LayoutDashboard, Package, Scissors, Clock, Globe } from "lucide-react";

type Props = {
  children: React.ReactNode;
  shop: any;
  custom: any;
  hours: any[];
};

function SidebarLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 hover:text-white transition-all text-sm font-semibold">
      {icon} <span>{label}</span>
    </Link>
  );
}

function MobileNavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-1 px-3 py-1 text-amber-500 hover:text-blue-600 transition-colors">
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </Link>
  );
}

export default function SlugShell({ children, shop, custom, hours }: Props) {
  const pathname = usePathname();
  const isDashboard = pathname.includes("/dashboard");

  if (isDashboard) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc] text-slate-900 font-sans antialiased">
        {/* SIDEBAR - DESKTOP */}
        <aside className="w-64 bg-black text-amber-500 hidden md:flex flex-col shadow-2xl border-r border-white/5 shrink-0">
          <div className="p-8 text-white font-bold text-xl flex items-center gap-3">
            <div className="bg-amber-500 p-2 rounded-lg">
              <Scissors size={20} color="black" />
            </div>
            <span>{shop?.name ?? "Dashboard"}</span>
          </div>
          <nav className="flex-1 px-4 space-y-1">
            <SidebarLink href={`/${shop?.slug}/dashboard`}                  icon={<LayoutDashboard size={18} />} label="Visão geral" />
            <SidebarLink href={`/${shop?.slug}/dashboard/productForm`}       icon={<Package size={18} />}         label="Produtos" />
            <SidebarLink href={`/${shop?.slug}/dashboard/gerencia-unidade`}  icon={<Scissors size={18} />}        label="Gerencia Unidade" />
            <SidebarLink href={`/${shop?.slug}/dashboard/hoursManager`}      icon={<Clock size={18} />}           label="Horários de funcionamento" />
            <SidebarLink href={`/${shop?.slug}/dashboard/pageManager`}       icon={<Globe size={18} />}           label="Página de vendas" />
          </nav>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
          {/* TOPBAR */}
          <header className="h-16 bg-black flex items-center px-6 md:px-8 justify-between shadow-sm sticky top-0 z-20">
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              {shop?.name}
            </span>
          </header>

          <section className="flex-1 overflow-y-auto">
            {children}
          </section>
        </main>

        {/* BOTTOM NAV - MOBILE */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 px-2 py-3 flex justify-around items-center z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <MobileNavLink href={`/${shop?.slug}/dashboard`}                 icon={<LayoutDashboard size={20} />} label="Home" />
          <MobileNavLink href={`/${shop?.slug}/dashboard/productForm`}      icon={<Package size={20} />}         label="Produtos" />
          <MobileNavLink href={`/${shop?.slug}/dashboard/gerencia-unidade`} icon={<Scissors size={20} />}        label="Unidade" />
          <MobileNavLink href={`/${shop?.slug}/dashboard/hoursManager`}     icon={<Clock size={20} />}           label="Horários" />
          <MobileNavLink href={`/${shop?.slug}/dashboard/pageManager`}      icon={<Globe size={20} />}           label="Página" />
        </nav>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header shop={shop} custom={custom} />
      <main className="flex-grow">{children}</main>
      <Footer shop={shop} custom={custom} hours={hours} />
    </div>
  );
}