'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Placeholder testimonials
  const testimonials = [
    { id: 1, name: 'Cliente 1', content: 'Produtos de excelente qualidade!' },
    { id: 2, name: 'Cliente 2', content: 'Resultados incríveis em poucas semanas!' },
    { id: 3, name: 'Cliente 3', content: 'Atendimento perfeito e entrega rápida!' },
    { id: 4, name: 'Cliente 4', content: 'Recomendo para todos os atletas!' },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          QUEM USA RX PHARMACEUTICALS APROVA!
        </h2>

        <p className="text-center max-w-3xl mx-auto mb-12 text-gray-600">
          Não basta apenas falarmos a todo o momento o quanto nossos produtos são os mais
          diferenciados do mercado, que trazem uma qualidade ímpar e resultados garantidos.
          Então para provarmos isso para você, selecionamos alguns de milhares de feedbacks
          de pessoas que utilizam nossos produtos e estão tendo resultados de verdade!
        </p>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center justify-center">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="mx-8 flex-1">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-semibold text-lg mb-2">
                    {testimonials[currentSlide].name}
                  </h3>
                  <p className="text-gray-600">
                    {testimonials[currentSlide].content}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
