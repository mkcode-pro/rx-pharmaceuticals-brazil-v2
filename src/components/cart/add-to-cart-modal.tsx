'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/store/cart-context';
import { CheckCircle, ShoppingCart, ArrowRight, X } from 'lucide-react';
import { Product } from '@/types';

export default function AddToCartModal() {
  const { state, dispatch, getCartTotal } = useCart();
  const { isModalOpen, modalProduct } = state;

  if (!isModalOpen || !modalProduct) {
    return null;
  }

  const closeModal = () => {
    dispatch({ type: 'CLOSE_MODAL' });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md animate-slide-up">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute -top-3 -right-3 bg-white p-1 rounded-full shadow-lg text-gray-500 hover:text-gray-800 hover:scale-110 transition-transform"
        >
          <X size={24} />
        </button>

        <div className="p-6 text-center">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckCircle className="text-green-500" size={28} />
            <h2 className="text-xl font-bold text-gray-800">Produto Adicionado!</h2>
          </div>

          {/* Product Info */}
          <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-4 mb-5">
            <div className="relative w-20 h-20 bg-white rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={modalProduct.image}
                alt={modalProduct.name}
                fill
                className="object-contain"
              />
            </div>
            <div className="text-left flex-grow">
              <h3 className="font-semibold text-gray-900 line-clamp-2">
                {modalProduct.name}
              </h3>
              <p className="text-lg font-bold text-primary mt-1">
                {formatPrice(modalProduct.price)}
              </p>
            </div>
          </div>

          {/* Cart Subtotal */}
          <div className="mb-6">
            <p className="text-gray-600">
              Subtotal no carrinho:
              <span className="font-bold text-gray-800 ml-1">
                {formatPrice(getCartTotal())}
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={closeModal}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              Continuar Comprando
            </button>
            <Link
              href="/carrinho"
              onClick={closeModal}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-bold text-center flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
            >
              <ShoppingCart size={18} />
              Ir para o Carrinho
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
