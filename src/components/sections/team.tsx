import React from 'react';

export default function Team() {
  const teamMembers = [
    { name: 'BRUNO SANTOS', role: 'ATLETA', category: 'FORÇA' },
    { name: 'LETICIA BUFF', role: 'ATLETA', category: 'DEFINIÇÃO' },
    { name: 'TADALA', role: 'ATLETA', category: 'VOLUME' },
  ];

  return (
    <section className="py-16 bg-black text-white">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          CONHEÇA O TIME RX PHARMACEUTICALS
        </h2>

        <p className="text-center max-w-4xl mx-auto mb-12 text-gray-300">
          O nosso time é composto por diversos tipos de pessoas, diversos tipos de mentalidades,
          diversos tipos de culturas, onde inclui desde influencers até atletas. Porém, todos eles
          possuem um único objetivo, elevar ao máximo o nível do seu físico, não sendo a toa, que
          todos eles escolheram fazer parte do time Rx Pharmaceuticals!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="relative group">
              {/* Background with gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent rounded-lg"></div>

              {/* Member info */}
              <div className="relative h-96 bg-gray-800 rounded-lg overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-sm text-blue-500 font-bold mb-1">{member.category}</p>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-sm text-gray-300">{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
