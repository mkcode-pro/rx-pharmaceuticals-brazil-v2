'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Eye, BarChart3 } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/store/cart-context';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleAddToCart = () => {
    addToCart(product);
    // Redirect to cart page instead of opening modal
    router.push('/carrinho');
  };

  return (
    <div className="product-card group">
      {/* Discount Badge */}
      {product.discount && (
        <div className="badge-discount bg-primary">
          -{product.discount}%
        </div>
      )}

      {/* Special Badges */}
      {product.tags?.includes('Combo') && (
        <div className="absolute top-2 right-2 z-10 px-2 py-1 text-xs font-bold text-white bg-[hsl(var(--rx-gold))]">
          COMBO
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.image || '/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
        />

        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300">
          <div className="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
              <Heart size={18} />
            </button>
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
              <Eye size={18} />
            </button>
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
              <BarChart3 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-2">
          {product.tags?.slice(0, 2).map((tag, index) => (
            <span key={index} className="text-xs text-muted-foreground">
              {tag}{index < 1 && product.tags && product.tags.length > 1 && ','}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-sm mb-3">
          <Link href={`/produto/${product.slug}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </h3>

        {/* Price */}
        <div className="mb-3">
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through mr-2">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="btn-cart w-full py-2 px-4 rounded flex items-center justify-center gap-2 transition-all"
        >
          <ShoppingCart size={18} />
          <span>ADICIONAR AO CARRINHO</span>
        </button>
      </div>
    </div>
  );
}
