// app/page.js
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import Hero from "../assets/Hero.png";
import cemig from "../assets/cemig.png";
import domelizeu from "../assets/DomElizeu.jpeg";
import govMinas from "../assets/GovMinas.png";
import ifood from "../assets/ifood.png";
import sebrae from "../assets/sebrae.png";
import paracatu from "../assets/paracatu.jpeg";
import outdoor from "../assets/outdoor.png";
import outdoorLight from "../assets/outdoorLight.png";
import pointVermelho from "../assets/pointVermelho.png";
import pointVerde from "../assets/pointVerde.png";
import outdoor4 from "../assets/cases/4.png";
import outdoor7 from "../assets/cases/7.png";
import outdoor8 from "../assets/cases/8.jpeg";
import outdoor11 from "../assets/cases/11.jpeg";
import outdoor22 from "../assets/cases/22.jpeg";
import outdoor33 from "../assets/cases/33.jpeg";
import outdoor36 from "../assets/cases/36.jpeg";
import outdoor43 from "../assets/cases/43.png";
import outdoor54 from "../assets/cases/54.jpeg";
export const metadata = {
  title: "Multi Mídia Outdoor - A maior cobertura em Outdoor de Paracatu",
  description:
    "Grandes ideias merecem Grandes Formatos para atingir seu público-alvo. Conheça a maior rede de mídia outdoor de Paracatu.",
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 ">
      <Header />
      <section className="py-8 bg-gray-50 py-12">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
          {/* Texto */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl font-bold text-gray-700 mb-2">
                A maior cobertura
                <br />
                em Outdoor de
                <br />
                <span className="text-green-500">Paracatu</span>
              </h1>
              <p className="text-gray-600 mb-6">
                Grandes ideias merecem Grandes Formatos para atingir seu
                público-alvo.
              </p>
              <Link href="https://wa.me/5538988091010" className="btn-primary">
                Fale Conosco Agora! →
              </Link>
            </div>
          </div>
          {/* Imagem */}
          <div className="w-full md:w-1/2 flex justify-center">
            <Image
              src={Hero}
              alt="Outdoor em Paracatu"
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-2">
            Nossos clientes
          </h2>
          <p className="text-center text-gray-500 text-sm mb-8">
            Orgulhamo-nos de atender +100 empresas em Paracatu
          </p>

          <div className="flex flex-wrap justify-center items-center gap-16">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <Image
                src={cemig}
                alt="CEMIG"
                className="object-cover rounded-full"
                width={64}
                height={64}
              />
            </div>
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <Image
                src={domelizeu}
                alt="Dom Elizeu"
                className="object-cover rounded-full"
                width={64}
                height={64}
              />
            </div>
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <Image
                src={govMinas}
                alt="Governo de Minas"
                className="object-cover rounded-full"
                width={64}
                height={64}
              />
            </div>
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <Image
                src={ifood}
                alt="iFood"
                className="object-cover rounded-full"
                width={64}
                height={64}
              />
            </div>
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <Image
                src={sebrae}
                alt="SEBRAE"
                className="object-cover rounded-full"
                width={64}
                height={64}
              />
            </div>
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <Image
                src={paracatu}
                alt="Paracatu"
                className="object-cover rounded-full"
                width={64}
                height={64}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Media Types Section */}
      <section id="midias" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-2">
            Nossas Mídias
          </h2>
          <p className="text-center text-gray-500 text-sm mb-12">
            Escolha seu próximo investimento!
          </p>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Primeiro card */}
            <div className="flex flex-col items-center h-full">
              <div className="flex flex-col items-center flex-grow justify-between h-full">
                <div className="flex flex-col items-center">
                  <Image
                    src={outdoor}
                    alt="Outdoor"
                    width={150}
                    height={150}
                    className="mb-4"
                  />
                  <h3 className="text-xl font-medium text-gray-700 mb-3">
                    Outdoor
                  </h3>
                </div>
                <p className="text-gray-500 text-center text-sm mt-auto">
                  Visibilidade incomparável em pontos estratégicos da cidade.
                  Nossos outdoors oferecem alto impacto visual 24 horas por dia,
                  garantindo exposição massiva da sua marca. Um investimento
                  certeiro para campanhas que precisam alcançar um público amplo
                  e diversificado.
                </p>
              </div>
            </div>

            {/* Segundo card */}
            <div className="flex flex-col items-center h-full">
              <div className="flex flex-col items-center flex-grow justify-between h-full">
                <div className="flex flex-col items-center">
                  <Image
                    src={outdoorLight}
                    alt="Outdoor Light"
                    width={150}
                    height={150}
                    className="mb-4"
                  />
                  <h3 className="text-xl font-medium text-gray-700 mb-3">
                    Painel Front Light
                  </h3>
                </div>
                <p className="text-gray-500 text-center text-sm mt-auto">
                  Comunicação iluminada com brilho que marca dia e noite. Com
                  iluminação frontal que realça cores e detalhes, nossos painéis
                  front light proporcionam visibilidade premium em vias de alto
                  fluxo. Ideal para campanhas de médio e longo prazo que desejam
                  impactar o público em horários noturnos e ambiente urbano.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section id="pontos" className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <div className="bg-gray-200 rounded-lg w-full h-96 overflow-hidden relative">
                <iframe
                  src="https://www.google.com/maps/d/u/0/embed?mid=13fvNPoDkNAj8x6bqXhO-UhBbpFu5ViM&ehbc=2E312F&noprof=1"
                  width="100%"
                  height="100%"
                ></iframe>
              </div>
            </div>

            <div className="md:w-1/2">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Nossos pontos de mídia
              </h2>
              <p className="text-gray-500 text-sm mb-4">
                Estrategicamente distribuídos nas principais vias de Paracatu.
                Nossa rede de mídia auxillar cobre as principais corredores
                urbanos, zonas comerciais de alto fluxo e áreas residenciais da
                região.
              </p>
              <p className="text-gray-500 text-sm mb-6">
                Explore o mapa ao lado para descobrir a localização exata de
                cada ponto. Verifique se atendem perfeitamente para sua campanha
                ou entre em contato para uma consultoria.
              </p>
              {/* <p className="text-gray-500 text-sm mb-6">
                <Image
                  src={pointVerde}
                  alt="Ponto Verde"
                  width={20}
                  height={20}
                  className="inline-block mr-2"
                />
                Pontos Verdes - Disponiveis
              </p>
              <p className="text-gray-500 text-sm mb-6">
                <Image
                  src={pointVermelho}
                  alt="Ponto Vermelho"
                  width={20}
                  height={20}
                  className="inline-block mr-2"
                />
                Pontos Vermelhos - Indisponiveis
              </p> */}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="cases" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
            Galeria de Cases
          </h2>
          <p className="text-center text-gray-500 text-sm mb-12">
            Resultados que falam por si. Nossa galeria reúne campanhas que
            transformaram visibilidade em resultados concretos para marcas de
            diversos segmentos em Paracatu e região.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="relative w-full h-40">
                <Image
                  src={outdoor4}
                  alt={
                    "Av Olegário Maciel - Sentido Centro - descendo Próximo a Rodoviária"
                  }
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-800 text-center mb-1">
                  Av Olegário Maciel - Sentido Centro
                </h3>
                <p className="text-gray-500 text-xs text-center">
                  descendo Próximo a Rodoviária
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="relative w-full h-40">
                <Image
                  src={outdoor7}
                  alt={
                    "Início da Av. Olegário Maciel - Ponte do Cidade Nova - Sentido Centro"
                  }
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-800 text-center mb-1">
                  Início da Av. Olegário Maciel - Ponte do Cidade Nova - Sentido
                  Centro -
                </h3>
                <p className="text-gray-500 text-xs text-center">
                  Subindo esquerda quebra mola
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="relative w-full h-40">
                <Image
                  src={outdoor22}
                  alt={
                    "R. Joaqium M. Brochado - Entrada da Cidade - Próx ao Portal de Minas - Frente a Secretaria de Saúde /  Ao lado da Clínica da Mulher"
                  }
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-800 text-center mb-1">
                  R. Joaqium M. Brochado - Entrada da Cidade - Próx ao Portal de
                  Minas
                </h3>
                <p className="text-gray-500 text-xs text-center">
                  Frente a Secretaria de Saúde / Ao lado da Clínica da Mulher
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="relative w-full h-40">
                <Image
                  src={outdoor36}
                  alt={
                    "Entrada da Cidade - Ao lado Hipermercado Villerfort - Esquina com a Rua Salgado Filho"
                  }
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-800 text-center mb-1">
                  Entrada da Cidade - Ao lado Hipermercado Villerfort
                </h3>
                <p className="text-gray-500 text-xs text-center">
                  Esquina com a Rua Salgado Filho
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="relative w-full h-40">
                <Image
                  src={outdoor43}
                  alt={"Praça Magalhães Pinto - Frente ao Estadual"}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-800 text-center mb-1">
                  Praça Magalhães Pinto
                </h3>
                <p className="text-gray-500 text-xs text-center">
                  Frente ao Estadual
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="relative w-full h-40">
                <Image
                  src={outdoor54}
                  alt={
                    "BR 040 - Próximo ao Trevo da MG 188 - Galpão do Produtor"
                  }
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-800 text-center mb-1">
                  BR 040 - Próximo ao Trevo da MG 188
                </h3>
                <p className="text-gray-500 text-xs text-center">
                  Galpão do Produtor
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="relative w-full h-40">
                <Image
                  src={outdoor8}
                  alt={
                    "Av Almir Porto Adjuto - De frente para a Entrada do Supermercado Bretas"
                  }
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-800 text-center mb-1">
                  Av Almir Porto Adjuto
                </h3>
                <p className="text-gray-500 text-xs text-center">
                  De frente para a Entrada do Supermercado Bretas
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="relative w-full h-40">
                <Image
                  src={outdoor11}
                  alt={
                    "Esquina da Avenida Almir Porto Adjuto - Sentido Rua Padre Manoel - Entrada da Feira - Academia Garden Gold / Loteamento Jóquei"
                  }
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-800 text-center mb-1">
                  Esquina da Avenida Almir Porto Adjuto
                </h3>
                <p className="text-gray-500 text-xs text-center">
                  Sentido Rua Padre Manoel - Entrada da Feira - Academia Garden
                  Gold / Loteamento Jóquei
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="relative w-full h-40">
                <Image
                  src={outdoor33}
                  alt={
                    "Rua Orlando Batista Ulhoa - Esquina Faculdade Tecsoma e Colégio Soma"
                  }
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-800 text-center mb-1">
                  Rua Orlando Batista Ulhoa
                </h3>
                <p className="text-gray-500 text-xs text-center">
                  Esquina Faculdade Tecsoma e Colégio Soma
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-700 mb-8">
            Sua marca no horizonte da
            <br />
            cidade!
          </h2>
          <Link href="https://wa.me/5538988091010" className="btn-primary">
            Fale conosco →
          </Link>
        </div>
      </section>

      <Footer />
      <script src="https://whatsa.me/bt-min.js?link=https://wa.me/5538988091010"></script>
    </div>
  );
}
