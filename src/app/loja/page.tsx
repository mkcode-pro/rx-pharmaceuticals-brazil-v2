'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';


import MobileBottomNav from '@/components/layout/mobile-bottom-nav';
import ProductCard from '@/components/products/product-card';
import { Product } from '@/types';
import { Search, Filter, Grid, List } from 'lucide-react';

function LojaContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoria') || '');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const categories = [
    { value: '', label: 'Todas as Categorias' },
    { value: 'injetaveis', label: 'Injetáveis' },
    { value: 'orais', label: 'Orais' },
    { value: 'tpc', label: 'TPC' },
    { value: 'perda-de-gordura', label: 'Perda de Gordura' },
    { value: 'combos', label: 'Combos' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Nome A-Z' },
    { value: 'price-asc', label: 'Menor Preço' },
    { value: 'price-desc', label: 'Maior Preço' },
    { value: 'rating', label: 'Mais Avaliados' },
    { value: 'newest', label: 'Mais Recentes' },
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy, searchTerm, priceRange]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);
      if (sortBy) params.append('sort', sortBy);
      if (priceRange.min) params.append('minPrice', priceRange.min);
      if (priceRange.max) params.append('maxPrice', priceRange.max);

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        {/* Page Header */}
        <section className="bg-white border-b">
          <div className="container-custom py-8">
            <h1 className="text-3xl font-bold mb-4">Loja</h1>
            <p className="text-gray-600">
              Encontre os melhores produtos para seus objetivos
            </p>
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
                    placeholder="Buscar produtos..."
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
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>

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
                onClick={() => setPriceRange({ min: '', max: '' })}
                className="text-sm text-primary hover:underline"
              >
                Limpar
              </button>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="container-custom py-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : products.length > 0 ? (
            <div className={`grid gap-4 ${
              viewMode === 'grid'
                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                : 'grid-cols-1'
            }`}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setPriceRange({ min: '', max: '' });
                }}
                className="mt-4 btn-primary px-6 py-2 rounded-lg"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />


      <MobileBottomNav />
    </>
  );
}

export default function LojaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <LojaContent />
    </Suspense>
  );
}
