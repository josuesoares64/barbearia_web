"use client";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import Menu from "./menu";
import { FiLogOut } from "react-icons/fi";

const Header = ({ shop }: { shop?: any }) => {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const slug = params?.slug as string;

  const isDashboard = pathname.includes("/dashboard");
  const displayName = shop?.name || "Barbearia";
  
  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full h-[70px] bg-black/95 backdrop-blur-md text-white flex items-center justify-between px-4 sm:px-8 z-[100] border-b border-zinc-900">
      
      {/* NOME À ESQUERDA */}
      <div className="flex items-center min-w-0 flex-1">
        <Link href={slug ? `/${slug}` : "/"} className="truncate">
          <h1 className="text-sm sm:text-xl text-white font-black uppercase tracking-tighter italic truncate group-hover:text-amber-500 transition-colors">
            {displayName}
          </h1>
        </Link>
      </div>

      {/* AÇÕES À DIREITA */}
      <div className="flex items-center gap-3 sm:gap-6 ml-4">
        {!isDashboard ? (
          <Link 
            href={`/${slug}/agendamento`} 
            className="whitespace-nowrap px-4 py-2 bg-amber-500 text-black font-black rounded-sm uppercase text-[10px] tracking-widest active:scale-95 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            Agendar
          </Link>
        ) : (
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 font-black text-red-500 border border-red-500/30 text-[10px] uppercase"
          >
            <FiLogOut size={16} />
          </button>
        )}

        {/* COMPONENTE DE MENU */}
        {!isDashboard && <Menu slug={slug} />}
      </div>
    </header>
  );
};

export default Header;