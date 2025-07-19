'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/store/cart-context';
import { categories } from '@/data/products';

// SVG Icons
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 17.9 19 19 19C20.1 19 21 18.1 21 17C21 15.9 20.1 15 19 15C17.9 15 17 15.9 17 17ZM9 19C10.1 19 11 18.1 11 17C11 15.9 10.1 15 9 15C7.9 15 7 15.9 7 17C7 18.1 7.9 19 9 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LogOutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const { getCartCount, toggleCart } = useCart();
  const cartCount = getCartCount();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock login state

  const navigation = [
    { name: 'Início', href: '/' },
    { name: 'Loja', href: '/loja' },
    { name: 'Sobre Nós', href: '/sobre' },
    { name: 'Perguntas Frequentes', href: '/faq' },
    { name: 'Blog', href: '/blog' },
    { name: 'Portal Afiliados', href: '/afiliados' },
  ];

  return (
    <>
      {/* Top Bar - Hidden on mobile */}
      <div className="bg-[hsl(var(--rx-dark))] text-white py-2 hidden md:block">
        <div className="container-custom flex justify-center items-center text-sm">
          <a href="mailto:contato@rxpharmaceuticals.com.br" className="hover:underline">
            contato@rxpharmaceuticals.com.br
          </a>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white sticky top-0 z-50 shadow-md">
        <div className="container-custom">
          {/* Mobile Header */}
          <div className="flex md:hidden items-center justify-between h-14 px-4">
            {/* Mobile Menu Button */}
            <button
              className="p-2 -ml-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>

            {/* Mobile Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.webp"
                alt="Rx Pharmaceuticals"
                width={120}
                height={32}
                className="h-8 w-auto"
              />
            </Link>

            {/* Mobile Account/Login */}
            <Link href="/minha-conta" className="p-2 -mr-2">
                <UserIcon />
            </Link>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.webp"
                alt="Rx Pharmaceuticals Brazil"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Right Icons */}
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:text-primary transition-colors">
                <SearchIcon />
              </button>
              <Link href="/minha-conta" className="p-2 hover:text-primary transition-colors">
                <UserIcon />
              </Link>
              <button
                className="p-2 hover:text-primary transition-colors relative"
                onClick={toggleCart}
              >
                <CartIcon />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Category Bar - Desktop only */}
          <div className="border-t hidden md:block">
            <div className="flex items-center h-12">
              <button
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white hover:bg-primary/90 transition-colors"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              >
                <MenuIcon />
                <span className="font-medium">Categorias</span>
                <ChevronDownIcon />
              </button>

              <div className="hidden lg:flex items-center space-x-6 ml-6">
                <Link href="/injetaveis" className="text-sm hover:text-primary transition-colors">
                  Injetáveis
                </Link>
                <Link href="/orais" className="text-sm hover:text-primary transition-colors">
                  Orais
                </Link>
                <Link href="/loja?categoria=combos" className="text-sm hover:text-primary transition-colors">
                  Combos
                </Link>
                <Link href="/loja?categoria=tpc" className="text-sm hover:text-primary transition-colors">
                  TPC
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-40">
            <nav className="px-4 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-3 px-4 text-base font-medium hover:bg-gray-50 hover:text-primary transition-colors rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Categories */}
              <div className="border-t pt-4 mt-4">
                <h3 className="px-4 py-2 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Categorias
                </h3>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/loja?categoria=${category.slug}`}
                    className="block py-3 px-4 text-base hover:bg-gray-50 hover:text-primary transition-colors rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                    <span className="text-xs text-gray-500 ml-2">({category.count})</span>
                  </Link>
                ))}
              </div>

              {/* Mobile Account Actions */}
              <div className="border-t pt-4 mt-4 space-y-1">
                {isLoggedIn ? (
                  <button
                    onClick={() => { setIsLoggedIn(false); setIsMenuOpen(false); }}
                    className="flex items-center w-full py-3 px-4 text-base text-red-600 hover:bg-red-50 transition-colors rounded-lg"
                  >
                    <LogOutIcon />
                    <span className="ml-3">Sair</span>
                  </button>
                ) : (
                  <Link
                    href="/minha-conta"
                    className="flex items-center py-3 px-4 text-base hover:bg-gray-50 hover:text-primary transition-colors rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserIcon />
                    <span className="ml-3">Entrar / Minha Conta</span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}

        {/* Category Dropdown - Desktop */}
        {isCategoryOpen && (
          <div className="hidden md:block absolute top-full left-0 right-0 bg-white shadow-lg z-40">
            <div className="container-custom py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/loja?categoria=${category.slug}`}
                  className="block py-2 text-sm hover:text-primary transition-colors"
                  onClick={() => setIsCategoryOpen(false)}
                >
                  {category.name}
                  <span className="text-xs text-muted-foreground ml-2">({category.count})</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
