'use client';

import React, { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <section className="py-12 bg-primary">
      <div className="container-custom">
        <div className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ganhe 5% desconto na sua primeira compra agora!
          </h2>
          <p className="text-gray-600 mb-8">
            Cadastre seu melhor e-mail e garanta seu cupom!
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail aqui"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="submit"
                className="px-8 py-3 bg-[hsl(var(--rx-green))] text-white font-bold rounded-lg hover:bg-[hsl(var(--rx-green))]/90 transition-all hover:scale-105"
              >
                ENVIAR AGORA
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
