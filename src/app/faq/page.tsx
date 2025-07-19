'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';


import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { faqData } from '@/data/products';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    { value: '', label: 'Todas as Categorias' },
    { value: 'Entrega', label: 'Entrega' },
    { value: 'Garantias', label: 'Garantias' },
    { value: 'Pagamento', label: 'Pagamento' },
    { value: 'Produtos', label: 'Produtos' },
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white border-b">
          <div className="container-custom py-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Perguntas Frequentes</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Encontre respostas para as dúvidas mais comuns sobre nossos produtos e serviços
            </p>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="bg-white border-b">
          <div className="container-custom py-6">
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar nas perguntas frequentes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="container-custom py-12">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length > 0 ? (
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <div key={faq.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <button
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-2">
                          {faq.category}
                        </span>
                        <h3 className="font-semibold text-lg">{faq.question}</h3>
                      </div>
                      {openIndex === index ? (
                        <ChevronUp className="text-gray-500 flex-shrink-0 ml-4" />
                      ) : (
                        <ChevronDown className="text-gray-500 flex-shrink-0 ml-4" />
                      )}
                    </button>

                    {openIndex === index && (
                      <div className="px-6 pb-6">
                        <div className="prose max-w-none text-gray-600 whitespace-pre-line">
                          {faq.answer}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">
                  Nenhuma pergunta encontrada para sua busca
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                  }}
                  className="btn-primary px-6 py-2 rounded-lg"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Quick Contact */}
        <section className="bg-white border-t py-12">
          <div className="container-custom text-center">
            <h2 className="text-2xl font-bold mb-4">Não encontrou sua resposta?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Nossa equipe de suporte está pronta para ajudar com qualquer dúvida específica
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
                className="px-8 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                E-mail
              </a>
            </div>
          </div>
        </section>

        {/* Categories Overview */}
        <section className="bg-gray-100 py-12">
          <div className="container-custom">
            <h2 className="text-2xl font-bold text-center mb-8">Categorias de Ajuda</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.slice(1).map((category) => (
                <div
                  key={category.value}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedCategory(category.value)}
                >
                  <h3 className="font-semibold mb-2">{category.label}</h3>
                  <p className="text-sm text-gray-600">
                    {faqData.filter(faq => faq.category === category.value).length} perguntas
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Info */}
        <section className="bg-primary text-white py-12">
          <div className="container-custom text-center">
            <h2 className="text-2xl font-bold mb-4">Informações Importantes</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div>
                <h3 className="font-semibold mb-2">Horário de Atendimento</h3>
                <p className="opacity-90">Segunda a Sexta: 8h às 18h</p>
                <p className="opacity-90">Sábado: 8h às 14h</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Canais de Suporte</h3>
                <p className="opacity-90">WhatsApp, E-mail e Telegram</p>
                <p className="opacity-90">Resposta em até 2 horas</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Garantias</h3>
                <p className="opacity-90">100% de garantia</p>
                <p className="opacity-90">Reenvio gratuito</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />


    </>
  );
}
