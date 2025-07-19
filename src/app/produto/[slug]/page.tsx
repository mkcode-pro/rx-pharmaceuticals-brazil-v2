'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

import MobileBottomNav from '@/components/layout/mobile-bottom-nav';
import ProductCard from '@/components/products/product-card';
import { useCart } from '@/store/cart-context';
import { Product } from '@/types';
import {
  ShoppingCart, Shield, Truck, CreditCard, Package,
  ChevronLeft, ChevronRight, Plus, Minus,
  Heart, Share2, BarChart3
} from 'lucide-react';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const resolvedParams = await params;
        const response = await fetch(`/api/products/${resolvedParams.slug}`);

        if (!response.ok) {
          notFound();
        }

        const data = await response.json();
        setProduct(data.product);
        setRelatedProducts(data.relatedProducts || []);
      } catch (error) {
        console.error('Error fetching product:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="container-custom">
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };



  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  // Mock images for gallery
  const images = [
    product.image,
    product.image, // Duplicate for demo
    product.image,
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container-custom py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-600 hover:text-primary">
                Início
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/loja" className="text-gray-600 hover:text-primary">
                Loja
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Section */}
        <section className="container-custom py-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Gallery */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-lg">
                  <Image
                    src={images[selectedImage] || '/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-contain p-8"
                  />
                  {product.discount && (
                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{product.discount}%
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-3 gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={img || '/placeholder.jpg'}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-6">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.name}</h1>



                {/* Price */}
                <div className="mb-6">
                  {product.originalPrice && (
                    <div className="text-lg text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </div>
                  )}
                  <div className="text-3xl font-bold text-primary mb-2">
                    {formatPrice(product.price)}
                  </div>
                  <div className="text-sm text-green-600">
                    Em até 12x de {formatPrice(product.price / 12)} sem juros
                  </div>
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2 mb-6">
                  <Package size={20} className="text-green-500" />
                  <span className="text-green-600 font-medium">Em estoque</span>
                </div>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Quantidade:</label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 hover:bg-gray-50"
                      >
                        <Minus size={20} />
                      </button>
                      <span className="px-6 py-3 font-medium min-w-[4rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-3 hover:bg-gray-50"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                  <button
                    onClick={handleAddToCart}
                    className="w-full btn-primary py-4 rounded-lg font-bold flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={20} />
                    ADICIONAR AO CARRINHO
                  </button>


                </div>

                {/* Quick Actions */}
                <div className="flex gap-4 mb-6">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-primary">
                    <Heart size={20} />
                    <span className="text-sm">Favoritar</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-primary">
                    <Share2 size={20} />
                    <span className="text-sm">Compartilhar</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-primary">
                    <BarChart3 size={20} />
                    <span className="text-sm">Comparar</span>
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                  <div className="text-center">
                    <Shield className="mx-auto mb-2 text-blue-500" size={24} />
                    <span className="text-xs text-gray-600">Compra Segura</span>
                  </div>
                  <div className="text-center">
                    <Truck className="mx-auto mb-2 text-green-500" size={24} />
                    <span className="text-xs text-gray-600">Frete Grátis*</span>
                  </div>
                  <div className="text-center">
                    <CreditCard className="mx-auto mb-2 text-purple-500" size={24} />
                    <span className="text-xs text-gray-600">12x Sem Juros</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-12">
            <div className="bg-white rounded-lg shadow-md">
              {/* Tab Headers */}
              <div className="border-b">
                <div className="flex flex-wrap">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`px-6 py-4 font-medium border-b-2 ${
                      activeTab === 'description'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Descrição
                  </button>
                  <button
                    onClick={() => setActiveTab('usage')}
                    className={`px-6 py-4 font-medium border-b-2 ${
                      activeTab === 'usage'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Como Usar
                  </button>
                  <button
                    onClick={() => setActiveTab('composition')}
                    className={`px-6 py-4 font-medium border-b-2 ${
                      activeTab === 'composition'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Composição
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`px-6 py-4 font-medium border-b-2 ${
                      activeTab === 'reviews'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Avaliações ({product.reviewCount})
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'description' && (
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-semibold mb-4">Sobre o Produto</h3>
                    <p className="text-gray-600 mb-4">
                      {product.description || 'Descrição detalhada do produto em breve.'}
                    </p>
                    <h4 className="font-semibold mb-2">Benefícios:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Produto original e autêntico</li>
                      <li>Qualidade farmacêutica garantida</li>
                      <li>Resultados comprovados</li>
                      <li>Entrega rápida e discreta</li>
                    </ul>
                  </div>
                )}

                {activeTab === 'usage' && (
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-semibold mb-4">Instruções de Uso</h3>
                    <p className="text-gray-600 mb-4">
                      Consulte sempre um médico ou profissional de saúde antes de usar este produto.
                    </p>
                    <ol className="list-decimal list-inside text-gray-600 space-y-2">
                      <li>Siga as orientações médicas</li>
                      <li>Respeite as dosagens recomendadas</li>
                      <li>Mantenha uma rotina consistente</li>
                      <li>Combine com dieta e exercícios adequados</li>
                    </ol>
                  </div>
                )}

                {activeTab === 'composition' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Informações Nutricionais</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-600">
                        Informações detalhadas sobre a composição serão adicionadas em breve.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Avaliações dos Clientes</h3>
                    <div className="text-center py-8 text-gray-500">
                      <p>Seja o primeiro a avaliar este produto!</p>
                      <button className="mt-4 btn-primary px-6 py-2 rounded-lg">
                        Escrever Avaliação
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Produtos Relacionados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />

      <MobileBottomNav />
    </>
  );
}
