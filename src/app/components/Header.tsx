import Image from "next/image";
import Link from "next/link";
import Menu from "./menu";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full h-[70px] bg-black text-white flex items-center justify-between sm:px-6 px-2 z-50 shadow-md">
      {/* ESQUERDA */}
      <div className="flex items-center gap-3">
        <Image src="/logo.png" alt="Logo da Barbearia" width={40} height={40} />
        <h1 className="text-lg text-white font-bold">Barbearia</h1>
      </div>

      {/* DIREITA */}
      <div className="flex items-center gap-3">
        <Menu />

        <button className="relative px-5 py-2 overflow-hidden font-semibold text-white rounded-md border border-white group">
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-200 to-white translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>

          <span className="relative text-white group-hover:text-black transition-colors duration-300">
            <Link href="/agendamento">Agendar</Link>
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
