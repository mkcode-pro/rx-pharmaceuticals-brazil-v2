'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/store/cart-context';
import { categories } from '@/data/products';

// SVG Icons
const HomeIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9 22V12H15V22M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={active ? "currentColor" : "none"}
      opacity={active ? "0.2" : "1"}
    />
  </svg>
);

const ShopIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2 3H4.5L6.5 13H17.5L19.5 6H7M6.5 13L4.5 3M6.5 13L4.19 15.31C3.95 15.55 4.11 16 4.45 16H17.5M17.5 13V13M9 19.5C9.83 19.5 10.5 20.17 10.5 21S9.83 22.5 9 22.5 7.5 21.83 7.5 21 8.17 19.5 9 19.5ZM20 19.5C20.83 19.5 21.5 20.17 21.5 21S20.83 22.5 20 22.5 18.5 21.83 18.5 21 19.17 19.5 20 19.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={active ? "currentColor" : "none"}
      opacity={active ? "0.2" : "1"}
    />
  </svg>
);

const CategoriesIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect
      x="3" y="3" width="7" height="7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={active ? "currentColor" : "none"}
      opacity={active ? "0.2" : "1"}
    />
    <rect
      x="14" y="3" width="7" height="7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={active ? "currentColor" : "none"}
      opacity={active ? "0.2" : "1"}
    />
    <rect
      x="14" y="14" width="7" height="7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={active ? "currentColor" : "none"}
      opacity={active ? "0.2" : "1"}
    />
    <rect
      x="3" y="14" width="7" height="7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={active ? "currentColor" : "none"}
      opacity={active ? "0.2" : "1"}
    />
  </svg>
);

const SearchIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle
      cx="11" cy="11" r="8"
      stroke="currentColor"
      strokeWidth="2"
      fill={active ? "currentColor" : "none"}
      opacity={active ? "0.2" : "1"}
    />
    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CartIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 17.9 19 19 19C20.1 19 21 18.1 21 17C21 15.9 20.1 15 19 15C17.9 15 17 15.9 17 17ZM9 19C10.1 19 11 18.1 11 17C11 15.9 10.1 15 9 15C7.9 15 7 15.9 7 17C7 18.1 7.9 19 9 19Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={active ? "currentColor" : "none"}
      opacity={active ? "0.2" : "1"}
    />
  </svg>
);

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { getCartCount, toggleCart } = useCart();
  const cartCount = getCartCount();
  const [showCategories, setShowCategories] = useState(false);

  const navItems = [
    {
      name: 'Início',
      href: '/',
      icon: HomeIcon,
      active: pathname === '/'
    },
    {
      name: 'Loja',
      href: '/loja',
      icon: ShopIcon,
      active: pathname === '/loja'
    },
    {
      name: 'Categorias',
      href: '#',
      icon: CategoriesIcon,
      active: pathname.startsWith('/categoria') || pathname === '/categorias',
      isCategories: true
    },
    {
      name: 'Buscar',
      href: '/buscar',
      icon: SearchIcon,
      active: pathname === '/buscar'
    },
    {
      name: 'Carrinho',
      href: '#',
      icon: CartIcon,
      active: false,
      isCart: true
    }
  ];

  return (
    <>
      {/* Categories Modal */}
      {showCategories && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowCategories(false)}
          />
          <div className="fixed bottom-16 left-4 right-4 bg-white rounded-t-2xl shadow-2xl z-50 max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Categorias</h3>
                <button
                  onClick={() => setShowCategories(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categoria/${category.slug}`}
                    onClick={() => setShowCategories(false)}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <h4 className="font-semibold text-sm mb-1">{category.name}</h4>
                    <p className="text-xs text-gray-600">{category.count} produtos</p>
                  </Link>
                ))}
              </div>

              <Link
                href="/categorias"
                onClick={() => setShowCategories(false)}
                className="block mt-4 p-3 bg-primary text-white text-center rounded-lg font-medium"
              >
                Ver Todas as Categorias
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;

            if (item.isCart) {
              return (
                <button
                  key={item.name}
                  onClick={toggleCart}
                  className="flex flex-col items-center justify-center space-y-1 py-2 text-gray-600 hover:text-primary transition-colors relative active:bg-gray-50"
                >
                  <div className="relative">
                    <Icon active={false} />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-sm">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium">{item.name}</span>
                </button>
              );
            }

            if (item.isCategories) {
              return (
                <button
                  key={item.name}
                  onClick={() => setShowCategories(true)}
                  className={`flex flex-col items-center justify-center space-y-1 py-2 transition-colors active:bg-gray-50 ${
                    item.active
                      ? 'text-primary'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  <Icon active={item.active} />
                  <span className="text-xs font-medium">{item.name}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center space-y-1 py-2 transition-colors active:bg-gray-50 ${
                  item.active
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                <Icon active={item.active} />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
