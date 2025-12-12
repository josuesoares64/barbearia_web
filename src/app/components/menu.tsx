"use client";

import Link from "next/link";
import { useState } from "react";

const Menu = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav>
      {/* BOTÃO HAMBÚRGUER (só aparece no mobile) */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden flex flex-col gap-1 w-8"
      >
        <span
          className={`h-[3px] bg-white rounded transition ${open ? "rotate-45 translate-y-2" : ""}`}
        ></span>
        <span
          className={`h-[3px] bg-white rounded transition ${open ? "opacity-0" : ""}`}
        ></span>
        <span
          className={`h-[3px] bg-white rounded transition ${open ? "-rotate-45 -translate-y-2" : ""}`}
        ></span>
      </button>

      {/* MENU DESKTOP (sempre visível em telas médias/grandes) */}
      <ul className="hidden md:flex md:gap-2 lg:gap-6 xl:text-2xl uppercase text-white font-semibold">
        <li><Link href="/#sobre">Sobre</Link></li>
        <li><Link href="/#servicos">Serviços</Link></li>
        <li><Link href="/#localizacao">Localização</Link></li>
        <li><Link href="/#faq">FAQ</Link></li>
        <li><Link href="/#contato">Contato</Link></li>
      </ul>

      {/* MENU MOBILE (abre e fecha com o hambúrguer) */}
      {open && (
        <ul className="absolute top-[70px] right-0 bg-black w-full flex flex-col gap-6 py-6 px-6 uppercase text-white font-semibold md:hidden shadow-lg">
          <li><Link href="/#sobre" onClick={() => setOpen(false)}>Sobre</Link></li>
          <li><Link href="/#servicos" onClick={() => setOpen(false)}>Serviços</Link></li>
          <li><Link href="/#localizacao" onClick={() => setOpen(false)}>Localização</Link></li>
          <li><Link href="/#faq" onClick={() => setOpen(false)}>FAQ</Link></li>
          <li><Link href="/#contato" onClick={() => setOpen(false)}>Contato</Link></li>
        </ul>
      )}
    </nav>
  );
};

export default Menu;
