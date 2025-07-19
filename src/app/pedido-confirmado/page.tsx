'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import MobileBottomNav from '@/components/layout/mobile-bottom-nav';
import {
  CheckCircle, Package, Copy, ArrowRight, Home,
  FileText, AlertCircle
} from 'lucide-react';

function PedidoConfirmadoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get('order');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderNumber) {
      router.push('/');
    }
  }, [orderNumber, router]);

  const copyOrderNumber = async () => {
    if (orderNumber) {
      try {
        await navigator.clipboard.writeText(orderNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        alert('Erro ao copiar número do pedido');
      }
    }
  };

  if (!orderNumber) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8 md:py-16 pb-20 md:pb-8">
        <div className="container-custom px-4">
          <div className="max-w-2xl mx-auto">
            {/* Success Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
              {/* Success Icon */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                  <CheckCircle className="text-green-600" size={48} />
                </div>
              </div>

              {/* Success Message */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Pedido Confirmado!
              </h1>

              <p className="text-gray-600 mb-8 text-lg">
                Obrigado por sua compra! Seu pedido foi recebido com sucesso.
              </p>

              {/* Order Number */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <p className="text-sm text-gray-600 mb-2">Número do pedido:</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl font-bold text-primary">{orderNumber}</span>
                  <button
                    onClick={copyOrderNumber}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Copiar número do pedido"
                  >
                    {copied ? (
                      <CheckCircle size={20} className="text-green-600" />
                    ) : (
                      <Copy size={20} className="text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
                <h2 className="font-semibold text-lg mb-3 flex items-center gap-2 text-blue-900">
                  <AlertCircle size={20} />
                  Próximos Passos
                </h2>
                <ol className="space-y-2 text-sm text-blue-800">
                  <li>1. Aguarde a confirmação do pagamento PIX</li>
                  <li>2. Você receberá um e-mail com os detalhes do pedido</li>
                  <li>3. Acompanhe o status do seu pedido na área do cliente</li>
                  <li>4. Você será notificado quando seu pedido for enviado</li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/minha-conta/pedidos"
                  className="btn-primary px-6 py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <Package size={20} />
                  Ver Meus Pedidos
                </Link>

                <Link
                  href="/"
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Home size={20} />
                  Voltar ao Início
                </Link>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              {/* Payment Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText size={20} className="text-primary" />
                  Informações de Pagamento
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Seu comprovante PIX foi recebido e está sendo processado.
                </p>
                <p className="text-sm text-gray-600">
                  A confirmação do pagamento ocorre em até 2 horas úteis.
                </p>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-3">Precisa de Ajuda?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Nossa equipe está disponível para esclarecer qualquer dúvida.
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>E-mail:</strong>{' '}
                    <a href="mailto:contato@rxpharmaceuticals.com.br" className="text-primary hover:underline">
                      contato@rxpharmaceuticals.com.br
                    </a>
                  </p>
                  <p>
                    <strong>WhatsApp:</strong>{' '}
                    <a href="https://wa.me/5511999999999" className="text-primary hover:underline">
                      (11) 99999-9999
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

// Loading component
function OrderConfirmationLoading() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8 md:py-16 pb-20 md:pb-8">
        <div className="container-custom px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 text-center">
              <div className="animate-pulse">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-6"></div>
                <div className="h-8 bg-gray-200 rounded mx-auto mb-4 w-64"></div>
                <div className="h-4 bg-gray-200 rounded mx-auto mb-8 w-80"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

// Main component with Suspense boundary
export default function PedidoConfirmadoPage() {
  return (
    <Suspense fallback={<OrderConfirmationLoading />}>
      <PedidoConfirmadoContent />
    </Suspense>
  );
}
