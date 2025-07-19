import React from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';


import { Award, Users, Target, Shield } from 'lucide-react';

export default function SobrePage() {
  const values = [
    {
      icon: Award,
      title: 'Qualidade',
      description: 'Produtos de procedência confiável e qualidade internacional'
    },
    {
      icon: Shield,
      title: 'Segurança',
      description: 'Processos seguros e garantia total em todas as entregas'
    },
    {
      icon: Target,
      title: 'Resultados',
      description: 'Foco em resultados reais e transformações duradouras'
    },
    {
      icon: Users,
      title: 'Comunidade',
      description: 'Uma comunidade de atletas e entusiastas do fitness'
    }
  ];

  const stats = [
    { number: '10+', label: 'Anos de Experiência' },
    { number: '50k+', label: 'Clientes Satisfeitos' },
    { number: '100+', label: 'Produtos Disponíveis' },
    { number: '99%', label: 'Satisfação dos Clientes' }
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white py-20">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Sobre a Rx Pharmaceuticals Brazil
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Alta Performance em evidência. Evolua com inteligência e consistência.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-6">Nossa História</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  A Rx Pharmaceuticals Brazil nasceu da paixão por resultados reais e da necessidade
                  de oferecer produtos de alta qualidade para atletas e entusiastas do fitness que
                  buscam a excelência em seus objetivos.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Nossa Missão</h3>
                  <p className="text-gray-600 mb-6">
                    Proporcionar aos nossos clientes acesso aos melhores produtos farmacêuticos
                    para performance esportiva, com qualidade internacional, segurança garantida
                    e resultados comprovados.
                  </p>

                  <h3 className="text-2xl font-semibold mb-4">Nossa Visão</h3>
                  <p className="text-gray-600">
                    Ser a referência nacional em produtos farmacêuticos para performance,
                    reconhecida pela qualidade, inovação e compromisso com os resultados
                    dos nossos clientes.
                  </p>
                </div>

                <div className="bg-gray-100 p-8 rounded-lg">
                  <h3 className="text-2xl font-semibold mb-4">Nossos Valores</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span>Transparência em todos os processos</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span>Qualidade sem compromissos</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span>Atendimento personalizado</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span>Inovação constante</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span>Responsabilidade social</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">O que nos move</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Nossos pilares fundamentais que guiam cada decisão e ação da empresa
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className="text-center bg-white p-6 rounded-lg shadow-sm">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                      <Icon size={32} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-primary text-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Números que falam por nós</h2>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto">
                Resultados que comprovam nossa dedicação e compromisso com a excelência
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold mb-2">{stat.number}</div>
                  <div className="text-primary-foreground/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Nossa Equipe</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Profissionais especializados e apaixonados por performance esportiva
              </p>
            </div>

            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gray-50 p-8 rounded-lg">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Nossa equipe é composta por profissionais com vasta experiência em farmacologia esportiva,
                  nutrição e treinamento. Trabalhamos em conjunto para oferecer não apenas produtos de qualidade,
                  mas também orientação especializada para nossos clientes.
                </p>
                <p className="text-gray-600">
                  Contamos com farmacêuticos, nutricionistas esportivos e consultores especializados
                  que estão sempre disponíveis para tirar dúvidas e orientar sobre o uso correto
                  dos nossos produtos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-4">Fale Conosco</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Tem alguma dúvida ou precisa de orientação? Nossa equipe está pronta para ajudar
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cart px-8 py-3 rounded-lg inline-block"
              >
                WhatsApp
              </a>
              <a
                href="mailto:contato@rxpharmaceuticals.com.br"
                className="px-8 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
              >
                E-mail
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />


    </>
  );
}
