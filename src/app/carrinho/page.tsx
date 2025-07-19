'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import MobileBottomNav from '@/components/layout/mobile-bottom-nav';
import TrustBar from '@/components/sections/trust-pillars';
import { useCart } from '@/store/cart-context';
import { useAuth } from '@/store/auth-context';
import { Plus, Minus, X, ShoppingBag, ArrowLeft, ArrowRight, Truck, Shield, MapPin, Percent } from 'lucide-react';
import { couponService, shippingService } from '@/services/firebase-services';
import { Coupon } from '@/types';

export default function CarrinhoPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const {
    state,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  } = useCart();

  // Shipping Calculator State
  const [cep, setCep] = useState('');
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<any>(null);
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  const [shippingZones, setShippingZones] = useState<any[]>([]);

  // Coupon System State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Load shipping zones on mount
  useEffect(() => {
    loadShippingZones();
  }, []);

  const loadShippingZones = async () => {
    try {
      const zones = await shippingService.getAll();
      setShippingZones(zones);
    } catch (error) {
      console.error('Error loading shipping zones:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const calculateShipping = async () => {
    if (!cep || cep.length !== 8) {
      alert('Digite um CEP válido (8 dígitos)');
      return;
    }

    setCalculatingShipping(true);
    try {
      // Check which shipping zone this CEP belongs to
      const cepNumber = parseInt(cep);
      const matchingZone = shippingZones.find(zone => {
        const ranges = zone.cepRanges || [];
        return ranges.some((range: any) =>
          cepNumber >= parseInt(range.start) && cepNumber <= parseInt(range.end)
        );
      });

      if (matchingZone) {
        const options = [
          {
            id: 'standard',
            name: 'Entrega Padrão',
            price: matchingZone.standardPrice || 15.99,
            days: matchingZone.standardDays || '5-7 dias úteis',
            description: 'Correios - PAC'
          },
          {
            id: 'express',
            name: 'Entrega Expressa',
            price: matchingZone.expressPrice || 29.99,
            days: matchingZone.expressDays || '2-3 dias úteis',
            description: 'Correios - SEDEX'
          }
        ];
        setShippingOptions(options);
      } else {
        // Default shipping options if no zone matches
        const defaultOptions = [
          {
            id: 'standard',
            name: 'Entrega Padrão',
            price: 19.99,
            days: '7-10 dias úteis',
            description: 'Correios - PAC'
          },
          {
            id: 'express',
            name: 'Entrega Expressa',
            price: 39.99,
            days: '3-5 dias úteis',
            description: 'Correios - SEDEX'
          }
        ];
        setShippingOptions(defaultOptions);
      }

      setSelectedShipping(null); // Reset selection
    } catch (error) {
      alert('Erro ao calcular frete. Tente novamente.');
    } finally {
      setCalculatingShipping(false);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Digite um código de cupom');
      return;
    }

    setApplyingCoupon(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      // Get all coupons from Firebase
      const coupons = await couponService.getAll();

      // Find matching coupon
      const coupon = coupons.find((c: Coupon) =>
        c.code.toUpperCase() === couponCode.toUpperCase() && c.active
      );

      if (coupon) {
        // Check if coupon is expired
        if (coupon.expiresAt && new Date(coupon.expiresAt.seconds * 1000) < new Date()) {
          setCouponError('Cupom expirado');
          return;
        }

        // Check minimum value
        const subtotal = getCartTotal();
        if (coupon.minValue && subtotal < coupon.minValue) {
          setCouponError(`Valor mínimo para este cupom: ${formatPrice(coupon.minValue)}`);
          return;
        }

        setAppliedCoupon({
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
          description: coupon.description || `${coupon.value}${coupon.type === 'percentage' ? '%' : ''} de desconto`
        });
        setCouponSuccess(`Cupom aplicado: ${coupon.description || coupon.code}`);
        setCouponCode('');
      } else {
        setCouponError('Cupom inválido ou expirado');
      }
    } catch (error) {
      setCouponError('Erro ao aplicar cupom. Tente novamente.');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  const subtotal = getCartTotal();
  const discountAmount = appliedCoupon ?
    appliedCoupon.type === 'percentage' ?
      subtotal * (appliedCoupon.value / 100) :
      appliedCoupon.value
    : 0;
  const shippingPrice = selectedShipping ? selectedShipping.price : 0;
  const total = subtotal - discountAmount + shippingPrice;

  const handleCheckout = () => {
    // Preserve cart data (coupon and shipping) in sessionStorage
    if (typeof window !== 'undefined') {
      const checkoutData = {
        coupon: appliedCoupon,
        shipping: selectedShipping,
      };
      sessionStorage.setItem('checkout-data', JSON.stringify(checkoutData));
    }

    if (!isAuthenticated) {
      router.push('/minha-conta?message=login-required&returnUrl=/checkout');
    } else {
      router.push('/checkout');
    }
  };

  if (state.items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-4 md:py-12 pb-20 md:pb-0">
          <div className="container-custom px-4">
            <div className="max-w-md mx-auto text-center">
              <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
                <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4 md:mb-6" />
                <h1 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Seu carrinho está vazio</h1>
                <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
                  Adicione produtos ao seu carrinho para continuar comprando
                </p>
                <Link
                  href="/loja"
                  className="btn-primary px-6 md:px-8 py-3 rounded-lg inline-block text-sm md:text-base"
                >
                  Continuar Comprando
                </Link>
              </div>
            </div>
          </div>
        </main>
        <TrustBar />
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
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Carrinho de Compras</h1>
            <p className="text-gray-600 text-sm md:text-base">
              {getCartCount()} item{getCartCount() !== 1 ? 's' : ''} no seu carrinho
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Cart Items - Compact Design */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header */}
                <div className="p-4 md:p-6 border-b">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <h2 className="text-lg md:text-xl font-semibold">Itens do Carrinho</h2>
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-700 text-sm font-medium self-start sm:self-auto"
                    >
                      Limpar Carrinho
                    </button>
                  </div>
                </div>

                {/* Compact Items List */}
                <div className="divide-y">
                  {state.items.map((item: any) => (
                    <div key={item.product.id} className="p-4">
                      <div className="flex items-center gap-3">
                        {/* Compact Product Image - 60x60px */}
                        <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>

                        {/* Product Details Inline */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm md:text-base line-clamp-1 mb-1">
                            <Link
                              href={`/produto/${item.product.slug}`}
                              className="hover:text-primary transition-colors"
                            >
                              {item.product.name}
                            </Link>
                          </h3>

                          <div className="flex flex-wrap gap-1 mb-2">
                            {item.product.tags?.slice(0, 2).map((tag: string, index: number) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="text-sm text-gray-600">
                            {formatPrice(item.product.price)} cada
                          </div>
                        </div>

                        {/* Quantity Controls & Price - Right Side */}
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                          {/* Quantity Controls - Compact */}
                          <div className="flex items-center border border-gray-300 rounded">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-50 disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-3 py-1 font-medium text-sm min-w-[2.5rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-50"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Price & Remove */}
                          <div className="text-right">
                            <div className="font-bold text-primary text-sm md:text-base">
                              {formatPrice(item.product.price * item.quantity)}
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-red-600 hover:text-red-700 text-xs mt-1 flex items-center gap-1"
                            >
                              <X size={12} />
                              Remover
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="mt-4 md:mt-6">
                <Link
                  href="/loja"
                  className="flex items-center justify-center sm:justify-start gap-2 text-primary hover:text-primary/80 font-medium"
                >
                  <ArrowLeft size={20} />
                  Continuar Comprando
                </Link>
              </div>
            </div>

            {/* Order Summary & Calculations */}
            <div className="lg:col-span-1 space-y-6">
              {/* Shipping Calculator */}
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-blue-500" />
                  Calcular Frete
                </h3>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Digite seu CEP"
                      value={cep}
                      onChange={(e) => setCep(e.target.value.replace(/\D/g, '').slice(0, 8))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                      maxLength={8}
                    />
                    <button
                      onClick={calculateShipping}
                      disabled={calculatingShipping}
                      className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                      {calculatingShipping ? 'Calculando...' : 'Calcular'}
                    </button>
                  </div>

                  {shippingOptions.length > 0 && (
                    <div className="space-y-2">
                      {shippingOptions.map((option) => (
                        <label key={option.id} className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name="shipping"
                            value={option.id}
                            checked={selectedShipping?.id === option.id}
                            onChange={() => setSelectedShipping(option)}
                            className="text-primary"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{option.name}</div>
                            <div className="text-xs text-gray-600">{option.description} - {option.days}</div>
                          </div>
                          <div className="font-bold text-primary">
                            {formatPrice(option.price)}
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Coupon System */}
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Percent size={20} className="text-green-500" />
                  Cupom de Desconto
                </h3>

                {!appliedCoupon ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Digite seu cupom"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                      <button
                        onClick={applyCoupon}
                        disabled={applyingCoupon}
                        className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                      >
                        {applyingCoupon ? 'Aplicando...' : 'Aplicar'}
                      </button>
                    </div>

                    {couponError && (
                      <div className="text-red-600 text-sm">{couponError}</div>
                    )}
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-green-800">
                          Cupom {appliedCoupon.code} aplicado
                        </div>
                        <div className="text-sm text-green-600">
                          {appliedCoupon.description}
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {couponSuccess && (
                  <div className="text-green-600 text-sm mt-2">{couponSuccess}</div>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6 sticky top-8">
                <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Resumo do Pedido</h2>

                {/* Summary Items */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-sm md:text-base">Subtotal ({getCartCount()} {getCartCount() === 1 ? 'item' : 'itens'})</span>
                    <span className="font-medium text-sm md:text-base">{formatPrice(subtotal)}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span className="text-sm md:text-base">Desconto ({appliedCoupon.code})</span>
                      <span className="font-medium text-sm md:text-base">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-sm md:text-base">Frete</span>
                    <span className="font-medium text-sm md:text-base">
                      {selectedShipping ? formatPrice(shippingPrice) : 'A calcular'}
                    </span>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between text-base md:text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full btn-primary py-3 md:py-4 rounded-lg font-bold text-center flex items-center justify-center gap-2 mb-4 text-sm md:text-base"
                >
                  CONFIRMAR CARRINHO
                  <ArrowRight size={18} />
                </button>

                {/* Security Info */}
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600 mb-3">
                    <Shield size={16} className="text-green-500 flex-shrink-0" />
                    <span>Compra 100% segura e protegida</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600">
                    <Truck size={16} className="text-blue-500 flex-shrink-0" />
                    <span>Entrega garantida ou reenvio grátis</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-medium mb-3 text-sm md:text-base">Formas de Pagamento</h3>
                  <div className="text-xs md:text-sm text-gray-600 space-y-1">
                    <div>• PIX (5% desconto)</div>
                    <div>• Cartão de Crédito</div>
                    <div>• Boleto Bancário</div>
                    <div>• Transferência Bancária</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <TrustBar />
      <Footer />
      <MobileBottomNav />
    </>
  );
}
