'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

import MobileBottomNav from '@/components/layout/mobile-bottom-nav';
import ProductCard from '@/components/products/product-card';
import { Product } from '@/types';
import { Search, Filter, Grid, List, ChevronDown } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

function CategoryContent({ categorySlug }: { categorySlug: string }) {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || ''
  });

  const categoryInfo = getCategoryInfo(categorySlug);

  const sortOptions = [
    { value: 'name', label: 'Nome A-Z' },
    { value: 'price-asc', label: 'Menor Preço' },
    { value: 'price-desc', label: 'Maior Preço' },
    { value: 'rating', label: 'Mais Avaliados' },
    { value: 'newest', label: 'Mais Recentes' },
  ];

  const itemsPerPage = 12;

  useEffect(() => {
    fetchProducts();
  }, [categorySlug, currentPage, sortBy, searchTerm, priceRange]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('category', categorySlug);
      if (searchTerm) params.append('search', searchTerm);
      if (sortBy) params.append('sort', sortBy);
      if (priceRange.min) params.append('minPrice', priceRange.min);
      if (priceRange.max) params.append('maxPrice', priceRange.max);
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();

      setProducts(data.products || []);
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setPriceRange({ min: '', max: '' });
    setSortBy('name');
    setCurrentPage(1);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        {/* Category Hero Banner */}
        <section className="bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] text-white">
          <div className="container-custom py-12 md:py-16">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <nav className="flex items-center gap-2 text-sm mb-4 opacity-80">
                  <Link href="/" className="hover:text-[#00BFFF]">Início</Link>
                  <span>/</span>
                  <Link href="/loja" className="hover:text-[#00BFFF]">Loja</Link>
                  <span>/</span>
                  <span>{categoryInfo.name}</span>
                </nav>

                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {categoryInfo.name}
                </h1>
                <p className="text-lg opacity-90 mb-6 max-w-2xl">
                  {categoryInfo.description}
                </p>

                <div className="flex flex-wrap gap-4">
                  {categoryInfo.benefits.map((benefit: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                      <span className="text-[#00BFFF]">✓</span>
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {categoryInfo.image && (
                <div className="hidden lg:block">
                  <Image
                    src={categoryInfo.image}
                    alt={categoryInfo.name}
                    width={160}
                    height={160}
                    className="h-32 md:h-40 object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="bg-white border-b sticky top-0 z-40">
          <div className="container-custom py-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder={`Buscar em ${categoryInfo.name}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary px-6 py-2 rounded-lg"
                >
                  Buscar
                </button>
              </form>

              {/* Filters */}
              <div className="flex gap-4 items-center">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Mode */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mt-4 flex gap-4 items-center">
              <span className="text-sm font-medium">Faixa de Preço:</span>
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                className="w-24 px-3 py-1 border border-gray-300 rounded text-sm"
              />
              <span>até</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                className="w-24 px-3 py-1 border border-gray-300 rounded text-sm"
              />
              <button
                onClick={resetFilters}
                className="text-sm text-primary hover:underline"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </section>

        {/* Results Summary */}
        <section className="container-custom py-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              {loading ? 'Carregando...' : `${products.length} produtos encontrados`}
            </p>
            <p className="text-sm text-gray-500">
              Página {currentPage} de {totalPages}
            </p>
          </div>
        </section>

        {/* Products */}
        <section className="container-custom pb-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className={`grid gap-4 ${
                viewMode === 'grid'
                  ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                  : 'grid-cols-1'
              }`}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Anterior
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg ${
                            currentPage === page
                              ? 'bg-primary text-white'
                              : 'bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Filter size={32} className="text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum produto encontrado
              </h2>
              <p className="text-gray-600 mb-6">
                Tente ajustar os filtros ou fazer uma nova busca
              </p>
              <button
                onClick={resetFilters}
                className="btn-primary px-6 py-2 rounded-lg"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </section>

        {/* Category Information */}
        <section className="bg-white border-t">
          <div className="container-custom py-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Sobre {categoryInfo.name}</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {categoryInfo.longDescription}
                </p>

                {categoryInfo.faq && categoryInfo.faq.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Perguntas Frequentes</h3>
                    <div className="space-y-4">
                      {categoryInfo.faq.map((item: any, index: number) => (
                        <details key={index} className="border border-gray-200 rounded-lg p-4">
                          <summary className="font-medium cursor-pointer">{item.question}</summary>
                          <p className="mt-2 text-gray-600">{item.answer}</p>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <MobileBottomNav />
    </>
  );
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [categorySlug, setCategorySlug] = useState<string>('');

  useEffect(() => {
    const getSlug = async () => {
      const resolvedParams = await params;
      setCategorySlug(resolvedParams.slug);
    };
    getSlug();
  }, [params]);

  if (!categorySlug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <CategoryContent categorySlug={categorySlug} />
    </Suspense>
  );
}

// Category information helper function
function getCategoryInfo(slug: string) {
  const categories: Record<string, any> = {
    'injetaveis': {
      name: 'Produtos Injetáveis',
      description: 'Linha completa de produtos injetáveis de alta qualidade para máxima performance e resultados.',
      image: 'https://i.postimg.cc/1RH191gC/inject-rx.png',
      benefits: ['Absorção Rápida', 'Máxima Eficácia', 'Qualidade Farmacêutica'],
      longDescription: 'Nossa linha de produtos injetáveis oferece a mais alta qualidade e pureza para atletas e entusiastas do fitness que buscam resultados superiores. Todos os produtos passam por rigorosos testes de qualidade e são fabricados seguindo os mais altos padrões farmacêuticos.',
      faq: [
        {
          question: 'Como aplicar produtos injetáveis com segurança?',
          answer: 'Sempre consulte um profissional de saúde antes de usar produtos injetáveis. Siga as instruções de dosagem e técnica de aplicação recomendadas.'
        },
        {
          question: 'Qual a diferença entre produtos injetáveis e orais?',
          answer: 'Produtos injetáveis geralmente têm absorção mais rápida e direta, proporcionando efeitos mais imediatos em comparação aos produtos orais.'
        }
      ]
    },
    'orais': {
      name: 'Produtos Orais',
      description: 'Suplementos orais de alta performance para todos os seus objetivos de treino.',
      image: 'https://i.postimg.cc/1RH191gC/inject-rx.png',
      benefits: ['Fácil Administração', 'Dosagem Precisa', 'Resultados Comprovados'],
      longDescription: 'Nossa linha de produtos orais combina conveniência com eficácia. Desenvolvidos para oferecer resultados consistentes e confiáveis, nossos suplementos orais são a escolha ideal para quem busca praticidade sem abrir mão da qualidade.',
      faq: [
        {
          question: 'Qual o melhor horário para tomar suplementos orais?',
          answer: 'O horário ideal varia conforme o produto. Consulte as instruções específicas de cada produto ou um profissional de saúde.'
        }
      ]
    },
    'combos': {
      name: 'Combos e Kits',
      description: 'Combinações especiais de produtos com preços exclusivos para maximizar seus resultados.',
      image: 'https://i.postimg.cc/1RH191gC/inject-rx.png',
      benefits: ['Economia Garantida', 'Sinergia Perfeita', 'Resultados Otimizados'],
      longDescription: 'Nossos combos são cuidadosamente formulados para criar sinergia entre diferentes produtos, potencializando os resultados enquanto oferece economia significativa. Cada kit é desenvolvido por especialistas para atender objetivos específicos.',
      faq: []
    },
    'tpc': {
      name: 'TPC (Terapia Pós-Ciclo)',
      description: 'Produtos essenciais para terapia pós-ciclo e manutenção da saúde hormonal.',
      image: 'https://i.postimg.cc/1RH191gC/inject-rx.png',
      benefits: ['Recuperação Hormonal', 'Manutenção dos Ganhos', 'Saúde em Primeiro Lugar'],
      longDescription: 'A TPC é fundamental para manter os ganhos obtidos e restaurar o equilíbrio hormonal natural. Nossa linha TPC oferece produtos de alta qualidade para uma recuperação segura e eficaz.',
      faq: [
        {
          question: 'Quando iniciar a TPC?',
          answer: 'O timing da TPC deve ser determinado com base no tipo de ciclo realizado. Consulte sempre um profissional especializado.'
        }
      ]
    },
    'perda-de-gordura': {
      name: 'Perda de Gordura',
      description: 'Produtos especializados para queima de gordura e definição corporal.',
      image: 'https://i.postimg.cc/1RH191gC/inject-rx.png',
      benefits: ['Queima Acelerada', 'Preservação Muscular', 'Definição Extrema'],
      longDescription: 'Nossa linha para perda de gordura foi desenvolvida para acelerar o metabolismo e promover a queima de gordura, sempre preservando a massa muscular conquistada. Produtos seguros e eficazes para sua transformação.',
      faq: []
    }
  };

  return categories[slug] || {
    name: 'Categoria',
    description: 'Produtos de alta qualidade para seus objetivos.',
    image: '',
    benefits: [],
    longDescription: 'Explore nossa seleção de produtos de alta qualidade.',
    faq: []
  };
}
