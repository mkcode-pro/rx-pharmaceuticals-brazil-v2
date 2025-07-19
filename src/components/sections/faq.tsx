'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Políticas de entrega:',
      answer: `Achamos inadmissível esperar vários dias para receber o rastreio de um pedido feito.

É comum muitos vendedores demorarem dias para enviar os rastreios (quando enviam), tratando isso como se fosse algo normal.

Na Rx Pharmaceuticals o pedido é rastreado desde a postagem.

Você pode ver em tempo real onde a encomenda está sem precisar ficar consultando no site dos correios/transportadora, pois o código de rastreamento chega via whatsapp e, a cada local novo que a encomenda passa, você recebe uma mensagem nova.

Após a confirmação do pagamento, postamos nossos produtos em até 7 dias úteis. Para pedidos em atacado são em até 7 dias úteis.

Não cobramos seguro. Caso ocorra qualquer problema durante o processo de entrega, enviamos novamente o produto até chegar.`,
    },
    {
      question: 'Extravio e Apreensões:',
      answer: `Se sua mercadoria for extraviada ou apreendida, garantimos o reenvio de 100% da sua encomenda sem custo adicional.

Não trabalhamos com trocas e devoluções.

Antes de confirmar sua compra, é importante que leia atentamente a descrição do produto, verifique se é o que deseja antes de finalizar a compra e revise o endereço de entrega.`,
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-4 text-primary">
          Principais dúvidas
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Principais dúvidas de nosso clientes
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-lg">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="text-gray-500" />
                ) : (
                  <ChevronDown className="text-gray-500" />
                )}
              </button>

              {openIndex === index && (
                <div className="px-6 pb-4">
                  <div className="prose max-w-none text-gray-600 whitespace-pre-line">
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Para ver todas as perguntas de nossos clientes{' '}
            <Link href="/faq" className="text-primary hover:underline font-semibold">
              clique aqui
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
