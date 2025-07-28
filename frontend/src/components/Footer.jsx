// components/Footer.jsx
import React from "react";
import Link from "next/link";
import { Instagram, Facebook,  } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-4">Sobre nós</h3>
            <p className="text-gray-400 text-sm">
              A Multi Mídia Outdoor é a maior rede de outdoor em Paracatu,
              atendendo mais de 100 empresas com soluções de alta visibilidade.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Links rápidos</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Início
                </Link>
              </li>
              <li>
                <Link href="#midias" className="hover:text-white transition">
                  Nossas Mídias
                </Link>
              </li>
              <li>
                <Link href="#pontos" className="hover:text-white transition">
                  Pontos de Mídia
                </Link>
              </li>
              <li>
                <Link href="#cases" className="hover:text-white transition">
                  Cases de Sucesso
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-white transition">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contato</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>(38) 1234-5678</li>
              <li>contato@multimidiaoutdoor.com.br</li>
              <li>Rua Principal, 123 - Centro</li>
              <li>Paracatu - MG</li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-700 mb-6" />

        <div className="text-center text-gray-400 text-sm mb-4">
          Copyright © {new Date().getFullYear()} Grupo Multi
          <br />
          All rights reserved
        </div>

        <div className="flex justify-center space-x-4">
          <Link
            href="https://www.instagram.com/outdoorparacatu/"
            className="text-gray-400 hover:text-white transition duration-300"
          >
            <Instagram size={18} />
          </Link>
          <Link
            href="https://www.facebook.com/multimidiaparacatu"
            className="text-gray-400 hover:text-white transition duration-300"
          >
            <Facebook size={18} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
