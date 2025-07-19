'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import MobileBottomNav from '@/components/layout/mobile-bottom-nav';
import CheckoutSteps from '@/components/checkout/checkout-steps';
import { useAuth } from '@/store/auth-context';
import { useCart } from '@/store/cart-context';
import {
  ArrowLeft, Check, Loader2, User, MapPin, CreditCard, Package,
  Shield, AlertCircle
} from 'lucide-react';
import { orderService, storageService } from '@/services/firebase-services';

export default function CheckoutResumoPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { state, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [checkoutData, setCheckoutData] = useState<any>(null);

  // Load all checkout data
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/minha-conta?message=login-required&returnUrl=/checkout');
      } else if (state.items.length === 0) {
        router.push('/carrinho');
      } else {
        // Load all data from sessionStorage
        const data = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('checkout-data') || '{}') : {};
        if (!data.personal || !data.address || !data.payment) {
          router.push('/checkout');
        } else {
          setCheckoutData(data);
        }
      }
    }
  }, [authLoading, isAuthenticated, state.items.length, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      // Upload PIX proof if exists
      let pixProofUrl = '';
      if (checkoutData.payment.pixProofBase64) {
        // Convert base64 back to file for upload
        const base64ToFile = (base64: string, fileName: string): File => {
          const arr = base64.split(',');
          const mime = arr[0].match(/:(.*?);/)?.[1] || '';
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          return new File([u8arr], fileName, { type: mime });
        };

        const pixProofFile = base64ToFile(
          checkoutData.payment.pixProofBase64,
          checkoutData.payment.pixProofName || 'comprovante.jpg'
        );

        pixProofUrl = await storageService.uploadProductImage(pixProofFile, `pix-proofs/${Date.now()}`);
      }

      // Create order object
      const orderData = {
        orderNumber: 'RX' + Date.now(),
        userId: user?.id || '',
        userEmail: checkoutData.personal.email,
        status: 'pending_payment', // aguardando pagamento
        personal: {
          name: checkoutData.personal.name,
          cpf: checkoutData.personal.cpf,
          email: checkoutData.personal.email,
          phone: checkoutData.personal.phone,
        },
        address: {
          street: checkoutData.address.street,
          number: checkoutData.address.number,
          complement: checkoutData.address.complement,
          district: checkoutData.address.district,
          city: checkoutData.address.city,
          state: checkoutData.address.state,
          cep: checkoutData.address.cep,
        },
        payment: {
          method: checkoutData.payment.method,
          pixProofUrl,
          total: checkoutData.payment.total,
          subtotal: checkoutData.payment.subtotal,
          couponDiscount: checkoutData.payment.couponDiscount,
          pixDiscount: checkoutData.payment.pixDiscount,
          shippingPrice: checkoutData.payment.shippingPrice,
          notes: checkoutData.payment.notes,
        },
        items: state.items.map((item: any) => ({
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.image,
          quantity: item.quantity,
          price: item.product.price,
          total: item.product.price * item.quantity,
        })),
        coupon: checkoutData.coupon || null,
        shipping: checkoutData.shipping || null,
        newsletter,
      };

      // Save order to Firebase
      const orderId = await orderService.create(orderData);

      // Clear cart and preserved data
      clearCart();
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('checkout-data');
      }

      // Redirect to success page
      router.push('/pedido-confirmado?order=' + orderData.orderNumber);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Erro ao processar pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (authLoading || !checkoutData) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center pb-20 md:pb-0">
          <div className="text-center">
            <Loader2 className="animate-spin mx-auto mb-4" size={48} />
            <p className="text-gray-600">Carregando...</p>
          </div>
        </main>
        <Footer />
        <MobileBottomNav />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-4 md:py-8 pb-20 md:pb-0">
        <div className="container-custom px-4">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <Link href="/checkout/pagamento" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4 text-sm md:text-base">
              <ArrowLeft size={20} />
              Voltar
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold">Resumo do Pedido</h1>
          </div>

          {/* Steps Component */}
          <div className="mb-6 md:mb-8">
            <CheckoutSteps currentStep={4} />
          </div>

          {/* Order Summary */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Order Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Personal Info */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <User className="text-primary" size={20} />
                      Dados Pessoais
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Nome:</span>
                        <p className="font-medium">{checkoutData.personal.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">CPF:</span>
                        <p className="font-medium">{checkoutData.personal.cpf}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">E-mail:</span>
                        <p className="font-medium">{checkoutData.personal.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Telefone:</span>
                        <p className="font-medium">{checkoutData.personal.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="text-primary" size={20} />
                      Endereço de Entrega
                    </h2>
                    <div className="text-sm space-y-1">
                      <p className="font-medium">
                        {checkoutData.address.street}, {checkoutData.address.number}
                        {checkoutData.address.complement && ` - ${checkoutData.address.complement}`}
                      </p>
                      <p>
                        {checkoutData.address.district}, {checkoutData.address.city}/{checkoutData.address.state}
                      </p>
                      <p>CEP: {checkoutData.address.cep}</p>
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <CreditCard className="text-primary" size={20} />
                      Pagamento
                    </h2>
                    <div className="text-sm space-y-2">
                      <p>
                        <span className="text-gray-600">Forma de pagamento:</span>{' '}
                        <span className="font-medium">PIX (5% desconto aplicado)</span>
                      </p>
                      <p>
                        <span className="text-gray-600">Valor total:</span>{' '}
                        <span className="font-bold text-primary text-lg">
                          {formatPrice(checkoutData.payment.total)}
                        </span>
                      </p>
                      {checkoutData.payment.pixProofName && (
                        <p className="text-green-600">
                          ✓ Comprovante anexado: {checkoutData.payment.pixProofName}
                        </p>
                      )}
                      {checkoutData.payment.notes && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-gray-600">Observações:</p>
                          <p className="font-medium">{checkoutData.payment.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Products */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Package className="text-primary" size={20} />
                      Produtos ({state.items.length})
                    </h2>
                    <div className="space-y-4">
                      {state.items.map((item: any) => (
                        <div key={item.product.id} className="flex gap-4 pb-4 border-b last:border-0">
                          <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">{item.product.name}</h3>
                            <p className="text-sm text-gray-600">
                              Quantidade: {item.quantity} x {formatPrice(item.product.price)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatPrice(item.product.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="newsletter"
                          checked={newsletter}
                          onChange={(e) => setNewsletter(e.target.checked)}
                          className="mt-1 text-primary"
                        />
                        <label htmlFor="newsletter" className="text-sm text-gray-600">
                          Quero receber ofertas e novidades por e-mail
                        </label>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-600">
                          Ao finalizar a compra, você concorda com nossos{' '}
                          <Link href="#" className="text-primary hover:underline">Termos de Uso</Link>{' '}
                          e{' '}
                          <Link href="#" className="text-primary hover:underline">Política de Privacidade</Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                    <h3 className="text-lg font-semibold mb-4">Valores</h3>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>{formatPrice(checkoutData.payment.subtotal)}</span>
                      </div>

                      {checkoutData.payment.couponDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Cupom</span>
                          <span>-{formatPrice(checkoutData.payment.couponDiscount)}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-green-600">
                        <span>Desconto PIX (5%)</span>
                        <span>-{formatPrice(checkoutData.payment.pixDiscount)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Frete</span>
                        <span>{formatPrice(checkoutData.payment.shippingPrice)}</span>
                      </div>

                      <div className="border-t pt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span className="text-primary">
                            {formatPrice(checkoutData.payment.total)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Important Notice */}
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="text-yellow-600 mt-0.5 flex-shrink-0" size={16} />
                        <div className="text-xs text-yellow-800">
                          <p className="font-semibold mb-1">Atenção:</p>
                          <p>Após a confirmação, você não poderá alterar os dados do pedido.</p>
                          <p className="mt-1">O processamento será iniciado após a confirmação do pagamento PIX.</p>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary py-4 rounded-lg font-bold text-center flex items-center justify-center gap-2 mt-6"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          Finalizando...
                        </>
                      ) : (
                        <>
                          <Check size={20} />
                          FINALIZAR COMPRA
                        </>
                      )}
                    </button>

                    {/* Security */}
                    <div className="mt-6 pt-6 border-t">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Shield size={16} className="text-green-500" />
                        <span>Compra 100% segura e protegida</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
