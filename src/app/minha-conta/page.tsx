'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import MobileBottomNav from '@/components/layout/mobile-bottom-nav';
import { useAuth } from '@/store/auth-context';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle, Phone } from 'lucide-react';

function MinhaContaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login, register, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    // Check if redirected from checkout
    const redirectMessage = searchParams.get('message');
    if (redirectMessage === 'login-required') {
      setMessage('Faça login para finalizar sua compra');
      setActiveTab('login');
    }

    // If already logged in, redirect to account dashboard
    if (user && !loading) {
      // Could redirect to dashboard or stay on account page
    }
  }, [user, loading, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      // LOGIN DE TESTE - sem validação para demonstração
      if (loginForm.email && loginForm.password) {
        // Simula login bem-sucedido com qualquer credencial
        await login(loginForm.email, loginForm.password);
        setMessage('Login realizado com sucesso!');

        // Redirect to checkout if came from there
        const returnUrl = searchParams.get('returnUrl');
        if (returnUrl) {
          router.push(returnUrl);
        } else {
          // Stay on account page or redirect to dashboard
        }
      } else {
        setError('Preencha email e senha');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');

    // REGISTRO DE TESTE - validações mínimas para demonstração
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      setError('Preencha nome, email e senha');
      setIsSubmitting(false);
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('As senhas não coincidem');
      setIsSubmitting(false);
      return;
    }

    try {
      await register(
        registerForm.name,
        registerForm.email,
        registerForm.password,
        registerForm.phone
      );
      setMessage('Conta criada com sucesso!');

      // Redirect to checkout if came from there
      const returnUrl = searchParams.get('returnUrl');
      if (returnUrl) {
        router.push(returnUrl);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // TODO: Implement Google OAuth
      console.log('Google login clicked - implement OAuth');
      setMessage('Login com Google será implementado em breve');
    } catch (error) {
      setError('Erro ao fazer login com Google');
    }
  };

  // If user is already logged in, show account dashboard
  if (user && !loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-8 pb-20 md:pb-8">
          <div className="container-custom px-4">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Minha Conta</h1>
                    <p className="text-gray-600">Bem-vindo, {user.name}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="text-red-600 hover:text-red-700 font-medium px-4 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                  >
                    Sair
                  </button>
                </div>
              </div>

              {/* Account Sections */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Profile Info */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User size={20} className="text-primary" />
                    Dados Pessoais
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Nome</label>
                      <p className="font-medium">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">E-mail</label>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    {user.phone && (
                      <div>
                        <label className="text-sm text-gray-600">Telefone</label>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                    )}
                  </div>
                  <button className="mt-4 text-primary hover:text-primary/80 font-medium">
                    Editar Dados
                  </button>
                </div>

                {/* Orders */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-lg font-semibold mb-4">Meus Pedidos</h2>
                  <p className="text-gray-600 text-sm mb-4">
                    Acompanhe o status dos seus pedidos
                  </p>
                  <Link
                    href="/meus-pedidos"
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Ver Todos os Pedidos →
                  </Link>
                </div>

                {/* Support */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-lg font-semibold mb-4">Suporte</h2>
                  <p className="text-gray-600 text-sm mb-4">
                    Precisa de ajuda? Entre em contato
                  </p>
                  <a
                    href="mailto:contato@rxpharmaceuticals.com.br"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    E-mail Suporte →
                  </a>
                </div>
              </div>
            </div>
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
      <main className="min-h-screen bg-gray-50 py-8 pb-20 md:pb-8">
        <div className="container-custom px-4">
          <div className="max-w-md mx-auto">
            {/* Back to Store */}
            <div className="mb-6">
              <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
                <ArrowLeft size={20} />
                Voltar à Loja
              </Link>
            </div>

            {/* Messages */}
            {message && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                <CheckCircle size={20} className="text-green-600" />
                <span className="text-green-800">{message}</span>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <span className="text-red-800">{error}</span>
              </div>
            )}

            {/* Auth Forms */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {activeTab === 'login' ? (
                // LOGIN FORM
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesse sua Conta</h1>
                    <p className="text-gray-600">Faça login para prosseguir com suas compras</p>

                    {/* Login de Teste */}
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800 font-medium">🧪 Login de Teste</p>
                      <p className="text-xs text-blue-600">Use qualquer email e senha para testar</p>
                      <p className="text-xs text-blue-600">Ex: test@test.com / 123456</p>
                    </div>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-mail:
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={loginForm.email}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                          placeholder="user@imperio.com"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Senha:
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={loginForm.password}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors pr-12"
                          placeholder="••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#C23616] text-white py-3 rounded-xl font-bold hover:bg-[#A5301A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Entrando...' : 'Entrar'}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="my-8 relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">OU</span>
                    </div>
                  </div>

                  {/* Google Login */}
                  <div className="space-y-4">
                    <p className="text-center text-gray-600 text-sm">Use sua Conta Google</p>
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="w-full bg-[#4285F4] text-white py-3 rounded-xl font-bold hover:bg-[#357AE8] transition-colors flex items-center justify-center gap-3"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Continuar com Google
                    </button>
                  </div>

                  {/* Switch to Register */}
                  <div className="mt-8 flex gap-3 justify-center">
                    <button
                      onClick={() => setActiveTab('register')}
                      className="bg-[#1E3A8A] text-white px-6 py-2 rounded-xl font-medium hover:bg-[#1E40AF] transition-colors"
                    >
                      Criar Conta
                    </button>
                    <Link
                      href="/"
                      className="text-gray-600 hover:text-gray-800 px-6 py-2 font-medium"
                    >
                      Voltar à Loja
                    </Link>
                  </div>
                </div>
              ) : (
                // REGISTER FORM
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Criar Conta</h1>
                    <p className="text-gray-600">Preencha os dados para criar sua conta</p>

                    {/* Cadastro de Teste */}
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800 font-medium">🧪 Cadastro de Teste</p>
                      <p className="text-xs text-green-600">Use dados fictícios para testar</p>
                    </div>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo:
                      </label>
                      <input
                        type="text"
                        required
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        placeholder="Ex: João da Silva"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-mail:
                      </label>
                      <input
                        type="email"
                        required
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        placeholder="user@imperio.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone/WhatsApp (opcional):
                      </label>
                      <input
                        type="tel"
                        value={registerForm.phone}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        placeholder="(11) 99999-9999"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Senha:
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors pr-12"
                          placeholder="••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Senha:
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={registerForm.confirmPassword}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors pr-12"
                          placeholder="••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#C23616] text-white py-3 rounded-xl font-bold hover:bg-[#A5301A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Criando conta...' : 'Cadastrar'}
                    </button>
                  </form>

                  {/* Switch to Login */}
                  <div className="mt-8 flex gap-3 justify-center">
                    <button
                      onClick={() => setActiveTab('login')}
                      className="bg-[#1E3A8A] text-white px-6 py-2 rounded-xl font-medium hover:bg-[#1E40AF] transition-colors"
                    >
                      Já tenho conta (Login)
                    </button>
                    <Link
                      href="/"
                      className="text-gray-600 hover:text-gray-800 px-6 py-2 font-medium"
                    >
                      Voltar à Loja
                    </Link>
                  </div>

                  {/* Terms */}
                  <div className="mt-6 text-xs text-gray-600 text-center">
                    Ao criar uma conta, você concorda com nossos{' '}
                    <a href="#" className="text-primary hover:underline">Termos de Uso</a>{' '}
                    e{' '}
                    <a href="#" className="text-primary hover:underline">Política de Privacidade</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

export default function MinhaContaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <MinhaContaContent />
    </Suspense>
  );
}
