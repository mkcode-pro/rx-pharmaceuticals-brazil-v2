import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, MessageCircle } from 'lucide-react';

export default function Footer() {
  const footerLinks = {
    roupas: [
      { name: 'Seleção Rx Pharmaceuticals', href: '/categoria/selecao' },
      { name: 'Camisetas', href: '/categoria/camisetas' },
      { name: 'Moletom', href: '/categoria/moletom' },
    ],
    objetivos: [
      { name: 'Perda de Gordura', href: '/categoria/perda-de-gordura' },
      { name: 'Ganho de Massa Magra', href: '/categoria/ganho-de-massa-magra' },
      { name: 'Ganho de Força', href: '/categoria/ganho-de-forca' },
    ],
    links: [
      { name: 'Combos', href: '/categoria/combos' },
      { name: 'TPC', href: '/categoria/tpc' },
    ],
  };

  return (
    <footer className="bg-[hsl(var(--rx-dark))] text-white">
      {/* Social Media Section */}
      <div className="bg-black/50 py-8">
        <div className="container-custom text-center">
          <p className="mb-4">Siga nossas redes sociais para mais conteúdos e novidades</p>
          <div className="flex justify-center space-x-4">
            <a
              href="https://instagram.com/rxpharmaceuticals"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <Instagram size={24} />
            </a>
            <a
              href="https://t.me/rxpharmaceuticals"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <MessageCircle size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Info */}
          <div className="col-span-1 md:col-span-1">
            <Image
              src="/images/logo.webp"
              alt="Rx Pharmaceuticals Brazil"
              width={150}
              height={40}
              className="mb-4"
            />
            <p className="text-sm text-gray-400">
              Alta Performance em evidência. Evolua com inteligência e consistência.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Roupas</h3>
            <ul className="space-y-2">
              {footerLinks.roupas.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Objetivos</h3>
            <ul className="space-y-2">
              {footerLinks.objetivos.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              {footerLinks.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              Copyright © 2011 - 2025 | Rx Pharmaceuticals Brazil
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                href="/suporte"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm"
              >
                SUPORTE AO CLIENTE
              </Link>

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
