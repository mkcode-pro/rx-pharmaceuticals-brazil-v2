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
import { Search, Filter, Grid, List, ChevronDown, Shield, Award, Clock, Users, Star, Pill, CheckCircle } from 'lucide-react';

function OraisContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(searchParams?.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams?.get('sort') || 'name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState({
    min: searchParams?.get('minPrice') || '',
    max: searchParams?.get('maxPrice') || ''
  });

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
  }, [currentPage, sortBy, searchTerm, priceRange]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        sort: sortBy,
        category: 'orais',
        ...(searchTerm && { search: searchTerm }),
        ...(priceRange.min && { minPrice: priceRange.min }),
        ...(priceRange.max && { maxPrice: priceRange.max }),
      });

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      setProducts(data.products || []);
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProducts();
  };

  const handlePriceFilter = () => {
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
      <main className="min-h-screen bg-gray-50 py-4 md:py-8 pb-20 md:pb-0">
        <div className="container-custom px-4">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl p-6 md:p-12 mb-8 overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 text-white">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-4xl font-bold mb-4">
                    Produtos Orais
                  </h1>
                  <p className="text-lg md:text-xl mb-6 opacity-90">
                    Suplementos orais de alta performance que combinam conveniência com eficácia para todos os seus objetivos.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      <span className="text-sm md:text-base">Fácil Administração</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      <span className="text-sm md:text-base">Máxima Praticidade</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      <span className="text-sm md:text-base">Resultados Consistentes</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-48 h-48 md:w-64 md:h-64 bg-white/10 rounded-full flex items-center justify-center">
                    <Pill className="w-24 h-24 md:w-32 md:h-32 text-white/80" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Praticidade Total</h3>
              <p className="text-sm text-gray-600">
                Administração simples e conveniente, ideal para rotina diária
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Absorção Otimizada</h3>
              <p className="text-sm text-gray-600">
                Fórmulas desenvolvidas para máxima absorção e eficácia
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Comprovada Eficácia</h3>
              <p className="text-sm text-gray-600">
                Escolha preferida de atletas e entusiastas do fitness
              </p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Buscar produtos orais..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>

              {/* Price Range */}
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <span className="text-gray-500 self-center">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <button
                  onClick={handlePriceFilter}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  Filtrar
                </button>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
                  className={`p-2 ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-green-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <List size={20} />
                </button>
              </div>

              {/* Reset Filters */}
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                Limpar
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {products.length > 0 ? (
                <>
                  <div className={`grid gap-4 md:gap-6 ${
                    viewMode === 'grid'
                      ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                      : 'grid-cols-1'
                  }`}>
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          Anterior
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 border rounded-lg ${
                              currentPage === page
                                ? 'bg-green-600 text-white border-green-600'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          Próximo
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Nenhum produto encontrado</h3>
                  <p className="text-gray-600 mb-4">
                    Tente ajustar os filtros ou termos de busca
                  </p>
                  <button
                    onClick={resetFilters}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                  >
                    Limpar Filtros
                  </button>
                </div>
              )}
            </>
          )}

          {/* Educational Section */}
          <div className="mt-12 bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Vantagens dos produtos orais
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Por que escolher orais?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Administração simples e conveniente</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Ideal para iniciantes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Absorção gradual e sustentada</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Facilita a adesão ao tratamento</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Melhores Práticas</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Tome sempre no mesmo horário</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Preferencialmente com o estômago vazio</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Mantenha regularidade na dosagem</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Combine com uma dieta adequada</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Dica:</strong> Para maximizar a absorção dos produtos orais, tome com o estômago vazio
                (30-60 minutos antes das refeições) e mantenha sempre o mesmo horário de administração.
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Perguntas Frequentes - Produtos Orais
            </h2>

            <div className="space-y-6">
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">
                  Qual o melhor horário para tomar suplementos orais?
                </h3>
                <p className="text-sm text-gray-600">
                  O ideal é tomar com o estômago vazio, 30-60 minutos antes das refeições.
                  Isso garante melhor absorção dos nutrientes.
                </p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">
                  Posso combinar diferentes produtos orais?
                </h3>
                <p className="text-sm text-gray-600">
                  Sim, mas sempre consulte um profissional de saúde para evitar interações
                  e garantir que as dosagens sejam adequadas para seus objetivos.
                </p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">
                  Quanto tempo para ver resultados com produtos orais?
                </h3>
                <p className="text-sm text-gray-600">
                  Os resultados variam de acordo com o produto e objetivo, mas geralmente
                  podem ser percebidos entre 2-6 semanas de uso consistente.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">
                  Produtos orais têm efeitos colaterais?
                </h3>
                <p className="text-sm text-gray-600">
                  Quando usados conforme recomendado, os efeitos colaterais são mínimos.
                  Sempre siga as instruções de dosagem e consulte um profissional se necessário.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

export default function OraisPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    }>
      <OraisContent />
    </Suspense>
  );
}
