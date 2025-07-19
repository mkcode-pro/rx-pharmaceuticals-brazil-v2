'use client';

import React from 'react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, #101010 0%, #0A2558 100%)'
    }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10 py-20 md:py-32">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: '#FFFFFF' }}>
            Chega de &apos;Nacional&apos;. O Padrão é Outro.
          </h1>
          <p className="text-lg md:text-xl mb-8" style={{ color: '#B0B0B0' }}>
            Você sabe a diferença que a origem faz. Acesso direto ao padrão paraguaio que constrói físicos de verdade.
          </p>
          <Link
            href="/loja"
            className="inline-block px-8 py-4 text-lg font-bold border-2 transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: 'transparent',
              borderColor: '#00BFFF',
              color: '#00BFFF'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#00BFFF';
              e.currentTarget.style.color = '#101010';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#00BFFF';
            }}
          >
            EXPLORAR O ARSENAL
          </Link>
        </div>
      </div>

      {/* Product Showcase - You can add product images here */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="relative w-96 h-96">
          {/* Add product images here */}
        </div>
      </div>
    </section>
  );
}
