'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/products/product-card';
import { Product } from '@/types';

type TabType = 'combos' | 'destaque' | 'mais-vendidos';

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<TabType>('combos');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'combos' as TabType, label: 'COMBOS' },
    { id: 'destaque' as TabType, label: 'DESTAQUE' },
    { id: 'mais-vendidos' as TabType, label: 'MAIS VENDIDOS' },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'combos':
        return products.filter(p => p.category === 'combos');
      case 'destaque':
        return products.filter(p => p.discount && p.discount > 0);
      case 'mais-vendidos':
        return products.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)).slice(0, 4);
      default:
        return products.slice(0, 4);
    }
  };

  const filteredProducts = getFilteredProducts();

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container-custom">
        {/* Botões de Categorias */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Botão Injetáveis */}
            <button
              className="group bg-[#1A1A1A] border-2 border-[#00BFFF] rounded-lg p-4 md:p-6 flex items-center justify-between hover:border-[#00FFFF] transition-all duration-300 transform hover:scale-[1.02] w-full"
              onClick={() => {
                // Navegar para página de injetáveis
                window.location.href = '/injetaveis';
              }}
            >
              <div className="text-left">
                <h2 className="text-white text-lg md:text-base lg:text-lg font-normal mb-1">
                  PRODUTOS
                </h2>
                <h1 className="text-white text-2xl md:text-2xl lg:text-3xl font-bold">
                  INJETÁVEIS
                </h1>
              </div>
              <img
                src="https://i.postimg.cc/1RH191gC/inject-rx.png"
                alt="Produtos Injetáveis RX"
                className="h-20 md:h-20 lg:h-24 ml-4 transition-transform duration-300 group-hover:scale-105"
              />
            </button>

            {/* Botão Orais */}
            <button
              className="group bg-[#1A1A1A] border-2 border-[#00BFFF] rounded-lg p-4 md:p-6 flex items-center justify-between hover:border-[#00FFFF] transition-all duration-300 transform hover:scale-[1.02] w-full"
              onClick={() => {
                // Navegar para página de orais
                window.location.href = '/orais';
              }}
            >
              <div className="text-left">
                <h2 className="text-white text-lg md:text-base lg:text-lg font-normal mb-1">
                  PRODUTOS
                </h2>
                <h1 className="text-white text-2xl md:text-2xl lg:text-3xl font-bold">
                  ORAIS
                </h1>
              </div>
              <img
                src="https://i.postimg.cc/1RH191gC/inject-rx.png"
                alt="Produtos Orais RX"
                className="h-20 md:h-20 lg:h-24 ml-4 transition-transform duration-300 group-hover:scale-105"
              />
            </button>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Descontos e Promoções
        </h2>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-lg shadow-sm p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
