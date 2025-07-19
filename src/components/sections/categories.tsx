import React from 'react';
import Link from 'next/link';

export default function Categories() {
  const categories = [
    {
      name: 'TPC',
      slug: 'tpc',
      count: 3,
      bgColor: 'from-blue-600 to-blue-800',
    },
    {
      name: 'PERDA DE GORDURA',
      slug: 'perda-de-gordura',
      count: 15,
      bgColor: 'from-orange-600 to-orange-800',
    },
    {
      name: 'ORAIS',
      slug: 'orais',
      count: 18,
      bgColor: 'from-blue-600 to-blue-800',
    },
    {
      name: 'INJETÁVEIS',
      slug: 'injetaveis',
      count: 15,
      bgColor: 'from-green-600 to-green-800',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={category.slug === 'orais' ? '/orais' : category.slug === 'injetaveis' ? '/injetaveis' : `/categoria/${category.slug}`}
              className="group relative h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.bgColor}`}></div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>

              <div className="relative h-full flex flex-col items-center justify-center text-white text-center p-6">
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                <p className="text-sm opacity-90">{category.count} produtos</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
