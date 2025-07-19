import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function TelegramCTA() {
  return (
    <section className="py-12 bg-blue-600">
      <div className="container-custom text-center text-white">
        <MessageCircle size={48} className="mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Acesse nosso canal do Telegram
        </h2>
        <p className="text-lg mb-8 opacity-90">
          Sorteios e promoções exclusivas, relatos e resultados diários e troca de informações.
        </p>
        <a
          href="https://t.me/rxpharmaceuticals"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-all hover:scale-105"
        >
          ENTRAR NO GRUPO
        </a>
      </div>
    </section>
  );
}
