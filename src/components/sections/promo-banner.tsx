import React from 'react';
import Link from 'next/link';

export default function PromoBanner() {
  return (
    <section className="py-12 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-white mb-6 md:mb-0">
            <h2 className="text-2xl md:text-4xl font-bold mb-2">
              GANHE ATÉ 4 PRODUTOS DE BRINDE
            </h2>
            <p className="text-lg">
              nos <span className="text-yellow-400">combos mais insanos</span> do mercado
            </p>
          </div>
          <Link
            href="/categoria/combos"
            className="px-8 py-3 bg-[hsl(var(--rx-green))] text-white font-bold rounded hover:bg-[hsl(var(--rx-green))]/90 transition-all hover:scale-105"
          >
            SAIBA MAIS
          </Link>
        </div>
      </div>
    </section>
  );
}
