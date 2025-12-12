import React from 'react';
// Presumindo que você está usando o componente Image do Next.js
import Image from 'next/image'; 
// Importação dos ícones do React Icons
import { MdEmail } from 'react-icons/md';
import { FaPhone, FaSquareInstagram, FaLocationDot, FaClock } from 'react-icons/fa6';

const Footer = () => {
    return (
        // 1. Footer Principal: Cor preta, padding vertical e sombra superior
        <footer id='contato' className="w-full bg-black text-white shadow-inner">
            
            {/* Div centralizadora e Responsiva (Grid) */}
            <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 gap-10 
                            md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                
                {/* 1. Logotipo e Copyright (Primeira Coluna) */}
                <div className="flex flex-col items-start space-y-4">
                    {/* Presume que o logo está na pasta /public */}
                    <Image src="/logo.png" alt="Barbearia Logo" width={120} height={40} className="mb-2" />
                    <p className="text-sm text-gray-400">
                        &copy; 2025 Barbearia — Todos os direitos reservados.
                    </p>
                </div>

                {/* 2. Contato (Segunda Coluna) */}
                <div className="space-y-3">
                    <h3 className="text-xl font-semibold mb-2 text-amber-700">Contato</h3>
                    
                    {/* Email */}
                    <a className="flex items-center space-x-2 text-gray-300 hover:text-amber-700 transition" href="mailto:josue.bezerra.2020@gmail.com">
                        <MdEmail className="text-xl" />
                        <p>josue.bezerra.2020@gmail.com</p>
                    </a>
                    
                    {/* Telefone/WhatsApp */}
                    <a className="flex items-center space-x-2 text-gray-300 hover:text-amber-700 transition" href="https://wa.me/5588999999999" target="_blank" rel="noopener noreferrer">
                        <FaPhone className="text-xl" />
                        <p>(88) 9 9999-9999</p>
                    </a>
                    
                    {/* Instagram */}
                    <a className="flex items-center space-x-2 text-gray-300 hover:text-amber-700 transition" href="https://www.instagram.com/josue_soares64?igsh=MWJsd2lqcGZrbmszbg%3D%3D" target="_blank" rel="noopener noreferrer">
                        <FaSquareInstagram className="text-xl" />
                        <p>@josuesoares64</p>
                    </a>
                </div>

                {/* 3. Localização (Terceira Coluna) */}
                <div className="space-y-3">
                    <h3 className="text-xl font-semibold mb-2 text-amber-700">Localização</h3>
                    <a 
                        className="flex space-x-2 text-gray-300 hover:text-amber-700 transition" 
                        href="https://www.google.com/maps/place/Holanda,+Tamboril+-+CE,+63750-000/@-4.7248284,-40.3713061,12z/data=!3m1!4b1!4m6!3m5!1s0x795c39f10f04bb1:0x95cd0b6a5ea3dec2!8m2!3d-4.7114008!4d-40.3700923!16s%2Fg%2F11nns7t6d_?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D"
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        <FaLocationDot className="text-xl flex-shrink-0 mt-1" />
                        <p>R. José Arteiro Farias, 39 - Boa Esperança, Tamboril-CE, 63750-000</p>
                    </a>
                </div>

                {/* 4. Horários de Funcionamento (Quarta Coluna) */}
                <div className="space-y-3">
                    <h3 className="text-xl font-semibold mb-2 flex items-center space-x-2 text-amber-700">
                        <FaClock className="text-xl" />
                        <span>Horários</span>
                    </h3>
                    
                    <p className="text-gray-300"><span className="font-semibold">Segunda a Sexta:</span> 08:00 - 18:00</p>
                    <p className="text-gray-300"><span className="font-semibold">Sábado:</span> 08:00 - 14:00</p>
                    <p className="text-gray-300"><span className="font-semibold">Domingo:</span> Fechado</p>
                </div>
            </div>
            
            {/* Linha Divisória Inferior */}
            <div className="w-full border-t border-gray-800 py-3 text-center">
                 <a href="https://josuesoaresdev.vercel.app/" target="_blank"><p className="text-xs text-gray-500">Desenvolvido por Josué Soares</p></a>
            </div>
        </footer>
    );
};

export default Footer;