'use client';

import React from 'react';
import { Shield, Star, Truck } from 'lucide-react';

const benefits = [
  {
    icon: Truck,
    title: 'Envio Seguro',
    description: 'Despachamos seu pedido em até 7 dias úteis. O mais seguro do mercado!',
  },
  {
    icon: Star,
    title: 'Qualidade',
    description: 'Qualidade internacional de matéria prima com tecnologia avançada.',
  },
  {
    icon: Shield,
    title: 'Entrega Garantida',
    description: 'Acompanhamento do rastreio no WhatsApp e seguro grátis!',
  },
];

export default function Benefits() {
  // No longer need scroll functionality since we're showing all cards at once
  return (
    <section className="py-12 bg-white">
      <div className="container-custom">
        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-5">
                  <Icon size={40} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mobile Cards - 3 side by side */}
        <div className="md:hidden">
          <div className="grid grid-cols-3 gap-2">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-center w-14 h-14 bg-blue-50 rounded-full mb-3">
                    <Icon size={28} className="text-primary" />
                  </div>
                  <h3 className="text-sm font-bold mb-1 text-center">{benefit.title}</h3>
                  <p className="text-xs text-gray-600 text-center leading-tight">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
