const Localizacao = () => {
    return (
        <section id="localizacao" className="w-full h-full py-20 px-6 bg-gray-100 flex flex-col items-center gap-10">
            <h2 className="text-3xl font-bold text-center">Nossa Localização</h2>
            <div className="w-full max-w-4xl h-96 shadow-lg">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15906.965155864578!2d-40.42109006000108!3d-4.640174837849593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x795c75d70fcc8f1%3A0xbd27c8e695d86fb1!2sBoa%20Esperan%C3%A7a%2C%20Tamboril%20-%20CE%2C%2063750-000!5e0!3m2!1spt-BR!2sbr!4v1765549890234!5m2!1spt-BR!2sbr"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                ></iframe>
            </div>
        </section>

        
    )
}

export default Localizacao;