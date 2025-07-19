'use client';

import React from 'react';
import Image from 'next/image';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/store/cart-context';
import Link from 'next/link';

export default function CartDrawer() {
  const {
    state,
    toggleCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart,
  } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <ShoppingBag size={20} />
              Carrinho ({state.items.length})
            </h2>
            <button
              onClick={toggleCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <ShoppingBag size={48} className="text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">Seu carrinho está vazio</p>
                <button
                  onClick={toggleCart}
                  className="btn-primary px-6 py-2 rounded"
                >
                  Continuar Comprando
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {state.items.map((item: any) => (
                  <div key={item.product.id} className="flex gap-4 p-4 border rounded-lg">
                    <div className="relative w-20 h-20 bg-gray-100 rounded">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm line-clamp-2">
                        {item.product.name}
                      </h3>
                      <p className="text-primary font-bold">
                        {formatPrice(item.product.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-3 py-1 bg-gray-100 rounded">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="ml-auto text-red-500 hover:text-red-600 text-sm"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-primary">{formatPrice(getCartTotal())}</span>
              </div>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  className="btn-primary w-full py-3 rounded text-center block"
                  onClick={toggleCart}
                >
                  FINALIZAR COMPRA
                </Link>
                <button
                  onClick={toggleCart}
                  className="w-full py-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Continuar Comprando
                </button>
              </div>

              <button
                onClick={clearCart}
                className="w-full text-sm text-red-500 hover:text-red-600"
              >
                Limpar Carrinho
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
