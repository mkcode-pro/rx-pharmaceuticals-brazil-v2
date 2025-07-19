'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import MobileBottomNav from '@/components/layout/mobile-bottom-nav';
import CheckoutSteps from '@/components/checkout/checkout-steps';
import { useAuth } from '@/store/auth-context';
import { useCart } from '@/store/cart-context';
import { ArrowLeft, ArrowRight, CreditCard, Loader2, AlertCircle, Copy, CheckCircle } from 'lucide-react';

export default function CheckoutPagamentoPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { state, getCartTotal } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [pixCopied, setPixCopied] = useState(false);

  const [formData, setFormData] = useState({
    paymentMethod: 'pix',
    pixProof: null as File | null,
    notes: '',
  });

  // Calculate total with preserved data
  const [cartData, setCartData] = useState<any>({});
  const subtotal = getCartTotal();
  const couponDiscount = cartData.coupon ?
    cartData.coupon.type === 'percentage' ?
      subtotal * (cartData.coupon.value / 100) :
      cartData.coupon.value
    : 0;
  const pixDiscount = subtotal * 0.05; // PIX sempre tem 5% desconto
  const shippingPrice = cartData.shipping?.price || 0;
  const total = subtotal - couponDiscount - pixDiscount + shippingPrice;

  // Load cart data from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = JSON.parse(sessionStorage.getItem('checkout-data') || '{}');
      setCartData(data);
    }
  }, []);

  // Check authentication and previous steps
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/minha-conta?message=login-required&returnUrl=/checkout');
      } else if (state.items.length === 0) {
        router.push('/carrinho');
      } else if (typeof window !== 'undefined') {
        // Check if previous data exists
        const checkoutData = JSON.parse(sessionStorage.getItem('checkout-data') || '{}');
        if (!checkoutData.personal || !checkoutData.address) {
          router.push('/checkout');
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setValidationErrors(prev => ({ ...prev, pixProof: 'Arquivo muito grande. Máximo 5MB.' }));
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setValidationErrors(prev => ({ ...prev, pixProof: 'Tipo de arquivo não permitido. Use JPG, PNG ou PDF.' }));
        return;
      }

      setFormData(prev => ({ ...prev, pixProof: file }));
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.pixProof;
        return newErrors;
      });
    }
  };

  const copyPixKey = async () => {
    try {
      await navigator.clipboard.writeText('00020101021126580014BR.GOV.BCB.PIX013612345678900152040000530398654041000.005802BR5925RX PHARMACEUTICALS LTDA6009SAO PAULO62070503***6304ABCD');
      setPixCopied(true);
      setTimeout(() => setPixCopied(false), 3000);
    } catch (err) {
      alert('Erro ao copiar chave PIX');
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.pixProof) {
      errors.pixProof = 'Comprovante PIX é obrigatório';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Convert file to base64 to store in sessionStorage
      const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
      };

      const pixProofBase64 = formData.pixProof ? await fileToBase64(formData.pixProof) : null;

      // Save payment data to sessionStorage
      if (typeof window !== 'undefined') {
        const checkoutData = JSON.parse(sessionStorage.getItem('checkout-data') || '{}');
        checkoutData.payment = {
          method: formData.paymentMethod,
          pixProof: formData.pixProof, // Keep the File object
          pixProofBase64, // Also store base64 for display
          pixProofName: formData.pixProof?.name,
          notes: formData.notes,
          total,
          subtotal,
          couponDiscount,
          pixDiscount,
          shippingPrice,
        };
        sessionStorage.setItem('checkout-data', JSON.stringify(checkoutData));
      }

      // Navigate to order summary
      router.push('/checkout/resumo');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (authLoading) {
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
            <Link href="/checkout/entrega" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4 text-sm md:text-base">
              <ArrowLeft size={20} />
              Voltar
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold">Pagamento</h1>
          </div>

          {/* Steps Component */}
          <div className="mb-6 md:mb-8">
            <CheckoutSteps currentStep={3} />
          </div>

          {/* Form */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-semibold mb-6 flex items-center gap-2">
                <CreditCard className="text-primary" size={24} />
                Pagamento via PIX
              </h2>

              <div className="space-y-6">
                {/* Payment Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Resumo do Valor</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Cupom</span>
                        <span>-{formatPrice(couponDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-green-600">
                      <span>Desconto PIX (5%)</span>
                      <span>-{formatPrice(pixDiscount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frete</span>
                      <span>{formatPrice(shippingPrice)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold text-base">
                        <span>Total</span>
                        <span className="text-primary">{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PIX Instructions */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">
                    Como fazer o pagamento PIX
                  </h3>

                  <div className="space-y-4">
                    {/* Step 1 */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">1</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Copie a chave PIX abaixo</p>
                        <div className="mt-2 bg-white border border-gray-300 rounded-lg p-3">
                          <code className="text-xs text-gray-800 break-all">
                            00020101021126580014BR.GOV.BCB.PIX013612345678900152040000530398654041000.005802BR5925RX PHARMACEUTICALS LTDA6009SAO PAULO62070503***6304ABCD
                          </code>
                        </div>
                        <button
                          type="button"
                          onClick={copyPixKey}
                          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          {pixCopied ? (
                            <>
                              <CheckCircle size={16} />
                              Copiado!
                            </>
                          ) : (
                            <>
                              <Copy size={16} />
                              Copiar Chave PIX
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Faça o pagamento no valor exato</p>
                        <p className="text-2xl font-bold text-green-700 mt-1">{formatPrice(total)}</p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Anexe o comprovante abaixo</p>
                        <p className="text-sm text-gray-600">
                          O pagamento será confirmado em até 2 horas úteis
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Proof Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comprovante de Pagamento PIX *
                  </label>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".jpg,.jpeg,.png,.pdf"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 ${
                      validationErrors.pixProof ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    Formatos aceitos: JPG, PNG, PDF | Máximo: 5MB
                  </p>

                  {validationErrors.pixProof && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.pixProof}</p>
                  )}

                  {formData.pixProof && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        ✓ Arquivo anexado: {formData.pixProof.name}
                      </p>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações (opcional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    placeholder="Alguma observação sobre seu pedido"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Important Notice */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={16} />
                    <div className="text-sm text-red-800">
                      <p className="font-semibold">Importante:</p>
                      <p>Seu pedido só será processado após a confirmação do pagamento PIX.</p>
                      <p>Certifique-se de anexar o comprovante correto para acelerar o processo.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-8 pt-6 border-t flex justify-between">
                <Link
                  href="/checkout/entrega"
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft size={20} />
                  Voltar
                </Link>

                <button
                  type="submit"
                  disabled={!formData.pixProof || isSubmitting}
                  className={`px-8 py-3 rounded-lg font-medium flex items-center gap-2 ${
                    formData.pixProof && !isSubmitting
                      ? 'btn-primary hover:bg-primary/90'
                      : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Processando...
                    </>
                  ) : (
                    <>
                      Continuar
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
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
