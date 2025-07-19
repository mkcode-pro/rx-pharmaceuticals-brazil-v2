import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';


import { Calendar, User, ArrowRight } from 'lucide-react';
import { blogPosts } from '@/data/products';

export default function BlogPage() {
  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white border-b">
          <div className="container-custom py-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Blog Rx Pharmaceuticals</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conteúdos exclusivos sobre performance, suplementação e estilo de vida saudável
            </p>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="container-custom py-12">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2 bg-gray-200 min-h-[300px]">
                  {/* Placeholder for blog image */}
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span>Imagem do Blog</span>
                  </div>
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-xs">
                      Destaque
                    </span>
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                      {featuredPost.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">{featuredPost.title}</h2>
                  <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{new Date(featuredPost.publishedAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={16} />
                      <span>{featuredPost.author}</span>
                    </div>
                  </div>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-lg"
                  >
                    Ler Artigo
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Recent Posts */}
        <section className="container-custom pb-12">
          <h2 className="text-2xl font-bold mb-8">Artigos Recentes</h2>

          {otherPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-gray-200 h-48 flex items-center justify-center text-gray-400">
                    <span>Imagem do Blog</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(post.publishedAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{post.author}</span>
                      </div>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
                    >
                      Ler mais
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Mais artigos em breve...</p>
            </div>
          )}
        </section>

        {/* Categories */}
        <section className="bg-white py-12">
          <div className="container-custom">
            <h2 className="text-2xl font-bold text-center mb-8">Categorias</h2>
            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {['Dicas', 'Educação', 'Nutrição', 'Treinamento'].map((category) => (
                <div
                  key={category}
                  className="text-center p-6 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all cursor-pointer"
                >
                  <h3 className="font-semibold mb-2">{category}</h3>
                  <p className="text-sm text-gray-600">
                    {blogPosts.filter(post => post.category === category).length} artigos
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Subscription */}
        <section className="bg-primary text-white py-12">
          <div className="container-custom text-center">
            <h2 className="text-2xl font-bold mb-4">Fique por dentro</h2>
            <p className="mb-8 max-w-2xl mx-auto opacity-90">
              Receba nossos artigos mais recentes e dicas exclusivas diretamente no seu e-mail
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="btn-cart px-6 py-3 rounded-lg whitespace-nowrap">
                  Assinar Newsletter
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media */}
        <section className="bg-gray-100 py-12">
          <div className="container-custom text-center">
            <h2 className="text-2xl font-bold mb-4">Siga nas Redes Sociais</h2>
            <p className="text-gray-600 mb-8">
              Acompanhe nossos conteúdos diários e novidades
            </p>
            <div className="flex justify-center gap-6">
              <a
                href="https://instagram.com/rxpharmaceuticals"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                Instagram
              </a>
              <a
                href="https://t.me/rxpharmaceuticals"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                Telegram
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />


    </>
  );
}
