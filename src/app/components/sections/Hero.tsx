import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative bg-[url('/hero-barbearia.jpg')] bg-cover bg-center mt-15 h-screen flex items-center justify-center">
      {/* Overlay escuro e transparente */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Conteúdo */}
      <div className="relative px-5 z-10">
        <h2 className="text-4xl text-white font-bold">
          barbearia Shop da mais alta qualidade
        </h2>
        <p className="text-white text-1xl lg:text-2xl mt-2 max-w-lg">
          Fundada com paixão pela arte da barbearia, temos muito orgulho do
          nosso trabalho e nos esforçamos para criar um ambiente acolhedor.
        </p>
        <div className="mt-4 flex gap-6 px-4">
          <button className="relative bg-black px-5 py-2 overflow-hidden font-semibold text-white rounded-md border border-white group">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-200 to-white translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>

            <span className="relative text-white group-hover:text-black transition-colors lg:text-3xl duration-300">
              <Link href="#">Agendar horário</Link>
            </span>
          </button>
          <button className="relative bg-black px-5 py-2 overflow-hidden font-semibold text-white rounded-md border border-white group">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-200 to-white translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>

            <span className="relative text-white group-hover:text-black transition-colors lg:text-3xl duration-300">
              <Link href="#">Ver serviços</Link>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
