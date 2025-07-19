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
import { ArrowLeft, ArrowRight, User, Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { state } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    cpf: '',
  });

  // Check authentication on mount
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/minha-conta?message=login-required&returnUrl=/checkout');
    }
  }, [authLoading, isAuthenticated, router]);

  // Pre-fill form with user data when available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  // Empty cart check
  useEffect(() => {
    if (!authLoading && state.items.length === 0) {
      router.push('/carrinho');
    }
  }, [authLoading, state.items.length, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) errors.email = 'E-mail é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'E-mail inválido';
    if (!formData.phone.trim()) errors.phone = 'Telefone é obrigatório';
    if (!formData.cpf.trim()) errors.cpf = 'CPF é obrigatório';
    else if (formData.cpf.replace(/\D/g, '').length !== 11) errors.cpf = 'CPF inválido';

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
      // Save personal data to sessionStorage
      if (typeof window !== 'undefined') {
        const checkoutData = JSON.parse(sessionStorage.getItem('checkout-data') || '{}');
        checkoutData.personal = formData;
        sessionStorage.setItem('checkout-data', JSON.stringify(checkoutData));
      }

      // Navigate to next step
      router.push('/checkout/entrega');
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
            <Link href="/carrinho" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4 text-sm md:text-base">
              <ArrowLeft size={20} />
              Voltar ao Carrinho
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold">Identificação</h1>
          </div>

          {/* Steps Component */}
          <div className="mb-6 md:mb-8">
            <CheckoutSteps currentStep={1} />
          </div>

          {/* Form */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-semibold mb-6">Dados Pessoais</h2>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary transition-colors ${
                      validationErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Digite seu nome completo"
                  />
                  {validationErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary transition-colors ${
                      validationErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="seu@email.com"
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone/WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary transition-colors ${
                      validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="(11) 99999-9999"
                  />
                  {validationErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                  )}
                </div>

                {/* CPF */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CPF *
                  </label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary transition-colors ${
                      validationErrors.cpf ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="000.000.000-00"
                  />
                  {validationErrors.cpf && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.cpf}</p>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-8 pt-6 border-t flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary px-8 py-3 rounded-lg font-medium flex items-center gap-2"
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
