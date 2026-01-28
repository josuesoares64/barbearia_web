"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const Menu = ({ slug }: { slug?: string }) => {
  const [open, setOpen] = useState(false);
  const getLink = (anchor: string) => slug ? `/${slug}${anchor}` : `${anchor}`;

  // Bloqueia o scroll quando o menu está aberto
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [open]);

  const navLinks = [
    { name: "Sobre", href: "#sobre" },
    { name: "Serviços", href: "#servicos" },
    { name: "Onde Estamos", href: "#localizacao" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <nav className="flex items-center justify-center">
      {/* BOTÃO HAMBÚRGUER */}
      <button 
        onClick={() => setOpen(!open)} 
        className="md:hidden flex flex-col justify-center items-end gap-1.5 w-8 h-8 z-[120] relative"
        aria-label="Abrir Menu"
      >
        <span className={`h-[2px] bg-white transition-all duration-300 ${open ? "w-8 rotate-45 translate-y-2" : "w-8"}`}></span>
        <span className={`h-[2px] bg-amber-500 transition-all duration-300 ${open ? "opacity-0" : "w-5"}`}></span>
        <span className={`h-[2px] bg-white transition-all duration-300 ${open ? "w-8 -rotate-45 -translate-y-2" : "w-6"}`}></span>
      </button>

      {/* MENU DESKTOP */}
      <ul className="hidden md:flex md:gap-8 text-[10px] uppercase text-zinc-500 font-black tracking-widest">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link href={getLink(link.href)} className="hover:text-amber-500 transition-colors">
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* MENU MOBILE OVERLAY - TOTALMENTE CENTRALIZADO */}
      <div 
        className={`fixed inset-0 w-full h-screen bg-black/98 backdrop-blur-2xl z-[110] flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
          open ? "translate-y-0 opacity-100 visible" : "-translate-y-full opacity-0 invisible"
        }`}
      >
        <ul className="flex flex-col items-center gap-10">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link 
                href={getLink(link.href)} 
                onClick={() => setOpen(false)}
                className="text-white font-black text-3xl uppercase italic tracking-tighter hover:text-amber-500 transition-colors"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="absolute bottom-12 text-amber-500/40 text-[10px] font-black uppercase tracking-[0.4em]">
           {slug?.replace('-', ' ')}
        </div>
      </div>
    </nav>
  );
};

export default Menu;