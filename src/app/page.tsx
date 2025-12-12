import Hero from "./components/sections/Hero";
import Servicos from "./components/sections/servicos";
import Sobre from "./components/sections/Sobre";
import Localizacao from "./components/sections/localizacao";
import PerguntasFrequentes from "./components/sections/PerguntasFrequentes";


export default function Home() {
  return (
    <main>
      <Hero />
      <Sobre />
      <Servicos />
      <PerguntasFrequentes />
      <Localizacao />
    </main>
  );
}
