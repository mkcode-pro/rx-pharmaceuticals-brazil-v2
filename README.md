# Rx Pharmaceuticals Brazil - E-commerce Completo

## 📋 Visão Geral
E-commerce completo para venda de produtos farmacêuticos esportivos, desenvolvido com Next.js 15, TypeScript, Tailwind CSS e shadcn/ui. O projeto inclui sistema de carrinho, páginas de produtos, checkout, sistema de afiliados e interface mobile-first.

## 🏗️ Estrutura do Projeto

```
rx-pharmaceuticals-brazil/
├── .same/                          # Arquivos de organização do projeto
│   └── todos.md                    # Lista de tarefas e progresso
├── public/                         # Arquivos estáticos
│   └── images/                     # Imagens do projeto
│       ├── logo.webp              # Logo principal
│       ├── logo-small.png         # Logo pequeno para favicons
│       ├── vial.webp              # Imagem para produtos injetáveis
│       └── oral.webp              # Imagem para produtos orais
├── src/                           # Código fonte principal
│   ├── app/                       # App Router do Next.js 15
│   │   ├── (pages)/              # Páginas principais
│   │   │   ├── page.tsx          # Homepage (/)
│   │   │   ├── loja/             # Página da loja (/loja)
│   │   │   │   └── page.tsx
│   │   │   ├── sobre/            # Página sobre (/sobre)
│   │   │   │   └── page.tsx
│   │   │   ├── faq/              # FAQ (/faq)
│   │   │   │   └── page.tsx
│   │   │   ├── blog/             # Blog (/blog)
│   │   │   │   └── page.tsx
│   │   │   ├── afiliados/        # Portal de afiliados (/afiliados)
│   │   │   │   └── page.tsx
│   │   │   ├── login-afiliados/  # Login de afiliados (/login-afiliados)
│   │   │   │   └── page.tsx
│   │   │   ├── minha-conta/      # Conta do usuário (/minha-conta)
│   │   │   │   └── page.tsx
│   │   │   ├── carrinho/         # Página do carrinho (/carrinho)
│   │   │   │   └── page.tsx
│   │   │   ├── checkout/         # Finalização de compra (/checkout)
│   │   │   │   └── page.tsx
│   │   │   ├── buscar/           # Página de busca (/buscar)
│   │   │   │   └── page.tsx
│   │   │   └── categorias/       # Página de categorias (/categorias)
│   │   │       └── page.tsx
│   │   ├── categoria/            # Páginas dinâmicas de categoria
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # /categoria/[slug]
│   │   ├── produto/              # Páginas dinâmicas de produto
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # /produto/[slug]
│   │   ├── api/                  # API Routes
│   │   │   ├── products/         # Endpoints de produtos
│   │   │   │   ├── route.ts      # GET/POST /api/products
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts  # GET/PUT/DELETE /api/products/[id]
│   │   │   └── categories/       # Endpoints de categorias
│   │   │       └── route.ts      # GET/POST /api/categories
│   │   ├── layout.tsx            # Layout raiz da aplicação
│   │   └── globals.css           # Estilos globais e variáveis CSS
│   ├── components/               # Componentes React
│   │   ├── cart/                 # Componentes do carrinho
│   │   │   ├── cart-drawer.tsx   # Drawer lateral do carrinho
│   │   │   └── add-to-cart-modal.tsx # Modal de produto adicionado
│   │   ├── layout/               # Componentes de layout
│   │   │   ├── header.tsx        # Cabeçalho principal
│   │   │   ├── footer.tsx        # Rodapé
│   │   │   └── mobile-bottom-nav.tsx # Navegação inferior mobile
│   │   ├── products/             # Componentes de produtos
│   │   │   └── product-card.tsx  # Card de produto
│   │   ├── sections/             # Seções da homepage
│   │   │   ├── hero.tsx          # Seção hero premium
│   │   │   ├── benefits.tsx      # Benefícios da empresa
│   │   │   ├── promo-banner.tsx  # Banner promocional
│   │   │   ├── featured-products.tsx # Produtos em destaque
│   │   │   ├── team.tsx          # Seção da equipe
│   │   │   ├── testimonials.tsx  # Depoimentos
│   │   │   ├── telegram-cta.tsx  # CTA do Telegram
│   │   │   ├── newsletter.tsx    # Newsletter
│   │   │   ├── categories.tsx    # Categorias
│   │   │   └── faq.tsx           # FAQ seção
│   │   └── ui/                   # Componentes shadcn/ui
│   │       ├── button.tsx        # Botão personalizado
│   │       ├── input.tsx         # Input personalizado
│   │       ├── card.tsx          # Card personalizado
│   │       └── ...               # Outros componentes UI
│   ├── data/                     # Dados mockados
│   │   └── products.ts           # Produtos, categorias, blog, FAQ
│   ├── store/                    # Gerenciamento de estado
│   │   └── cart-context.tsx      # Context do carrinho
│   └── types/                    # Definições TypeScript
│       └── index.ts              # Interfaces e tipos
├── eslint.config.mjs             # Configuração ESLint
├── next.config.js                # Configuração Next.js
├── package.json                  # Dependências e scripts
├── postcss.config.mjs            # Configuração PostCSS
├── tailwind.config.ts            # Configuração Tailwind CSS
├── tsconfig.json                 # Configuração TypeScript
└── README.md                     # Este arquivo
```

## 🎯 Funcionalidades Principais

### 🛒 E-commerce Core
- ✅ Catálogo de produtos com filtros e busca
- ✅ Sistema de carrinho com persistência localStorage
- ✅ Checkout multi-etapas completo
- ✅ Páginas dinâmicas de produtos e categorias
- ✅ Sistema de avaliações e reviews
- ✅ Gestão de quantidades e estoque

### 🎨 Interface & UX
- ✅ Design responsivo mobile-first
- ✅ Tema azul corporativo (#0A2558, #00BFFF)
- ✅ Navegação inferior mobile com modal de categorias
- ✅ Header otimizado para desktop e mobile
- ✅ Modal de confirmação "produto adicionado"
- ✅ Componentes shadcn/ui personalizados

### 📱 Mobile Experience
- ✅ Barra de navegação inferior fixa
- ✅ Modal interativo de categorias
- ✅ Header compacto e funcional
- ✅ Página de busca mobile-friendly
- ✅ Experiência touch-first

### 🏪 Páginas Especiais
- ✅ Portal de afiliados completo
- ✅ Sistema de login/cadastro de afiliados
- ✅ Dashboard de conta do usuário
- ✅ Blog com estrutura para CMS
- ✅ FAQ com busca e filtros
- ✅ Página sobre a empresa

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI personalizáveis
- **Lucide React** - Ícones SVG otimizados

### Gerenciamento de Estado
- **React Context** - Estado do carrinho
- **useState/useReducer** - Estado local dos componentes
- **localStorage** - Persistência do carrinho

### Desenvolvimento
- **Bun** - Runtime e gerenciador de pacotes
- **ESLint** - Linting de código
- **PostCSS** - Processamento CSS
- **TypeScript** - Compilação e verificação de tipos

## 🎨 Sistema de Design

### Cores Principais
```css
/* Cores corporativas */
--rx-blue: 208 100% 50%;           /* #0080FF - Azul principal */
--rx-blue-dark: 208 100% 40%;      /* #0066CC - Azul escuro */
--rx-dark: 19 20% 9%;              /* #1A1A1A - Preto técnico */
--rx-green: 131 67% 43%;           /* #2E8B57 - Verde para ações */
--rx-gold: 42 36% 60%;             /* #C4A653 - Dourado para combos */

/* Hero Section Premium */
background: linear-gradient(180deg, #101010 0%, #0A2558 100%);
accent-color: #00BFFF;             /* Ciano elétrico */
text-primary: #FFFFFF;             /* Branco puro */
text-secondary: #B0B0B0;           /* Cinza claro */
```

### Tipografia
- **Font Family**: Inter (Google Fonts)
- **Títulos**: Bold (700)
- **Corpo**: Regular (400)
- **Ações**: Bold (700)

### Componentes UI
- **Botões**: Rounded corners, hover effects
- **Cards**: Shadow-md, rounded-lg
- **Inputs**: Focus ring, border transitions
- **Modal**: Backdrop blur, smooth animations

## 🗺️ Mapa de Rotas

### Páginas Públicas
```
/ ........................... Homepage com seções completas
/loja ....................... Catálogo de produtos com filtros
/sobre ...................... Página institucional
/faq ........................ Perguntas frequentes
/blog ....................... Blog (estrutura para CMS)
/categorias ................. Overview de todas as categorias
/buscar ..................... Página de busca avançada
```

### Páginas Dinâmicas
```
/categoria/[slug] ........... Produtos por categoria
  ├── /categoria/injetaveis
  ├── /categoria/orais
  ├── /categoria/tpc
  ├── /categoria/combos
  └── /categoria/perda-de-gordura

/produto/[slug] ............. Detalhes do produto
  ├── /produto/enantato-testosterona-300mg
  ├── /produto/oxandrolona-20mg
  └── /produto/combo-bronze
```

### Área do Cliente
```
/minha-conta ................ Dashboard do usuário
/carrinho ................... Página do carrinho
/checkout ................... Finalização de compra
```

### Portal de Afiliados
```
/afiliados .................. Informações do programa
/login-afiliados ............ Login/cadastro de afiliados
```

### API Endpoints
```
GET    /api/products ......... Lista produtos com filtros
POST   /api/products ......... Cria produto (admin)
GET    /api/products/[id] .... Detalhes do produto
PUT    /api/products/[id] .... Atualiza produto (admin)
DELETE /api/products/[id] .... Remove produto (admin)
GET    /api/categories ....... Lista categorias
POST   /api/categories ....... Cria categoria (admin)
```

## 📊 Estrutura de Dados

### Produto
```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: ProductCategory;
  tags: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  discount?: number;
  type: 'injectable' | 'oral';
}
```

### Categorias
```typescript
type ProductCategory =
  | 'injetaveis'
  | 'orais'
  | 'tpc'
  | 'perda-de-gordura'
  | 'ganho-de-massa-magra'
  | 'ganho-de-forca'
  | 'combos';
```

### Carrinho
```typescript
interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isModalOpen: boolean;
  modalProduct: Product | null;
}
```

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
bun dev                # Inicia servidor de desenvolvimento
bun build              # Build de produção
bun start              # Inicia servidor de produção

# Qualidade de código
bun lint               # ESLint + TypeScript check
bun format             # Formatação com Biome
```

## 🔧 Configurações Importantes

### Next.js (next.config.js)
- App Router habilitado
- Turbopack para desenvolvimento
- Configuração de imagens otimizada
- Headers de segurança

### Tailwind CSS
- Configuração personalizada de cores
- Extensões para shadcn/ui
- Responsividade mobile-first
- Animações personalizadas

### TypeScript
- Strict mode habilitado
- Path mapping para imports
- Verificação de tipos rigorosa

## 📱 Responsividade

### Breakpoints
```css
sm: 640px   /* Móvel grande */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Desktop grande */
```

### Mobile-First Features
- Header compacto para mobile
- Navegação inferior com 5 ações principais
- Modal de categorias interativo
- Cards otimizados para touch
- Formulários mobile-friendly

## 🎯 Próximos Passos

### Backend Integration
- [ ] Conexão com banco de dados
- [ ] Sistema de autenticação
- [ ] Gateway de pagamento
- [ ] Admin panel para produtos
- [ ] Sistema de pedidos

### Funcionalidades Avançadas
- [ ] Sistema de favoritos/wishlist
- [ ] Notificações push
- [ ] Modo escuro/claro
- [ ] Busca em tempo real
- [ ] Filtros avançados

### Performance
- [ ] Otimização de imagens
- [ ] Lazy loading
- [ ] Service Workers
- [ ] Analytics integration

## 🏆 Status do Projeto

**Versão Atual:** 8.0
**Status:** ✅ Completo e funcional
**Deploy:** Netlify (Dynamic Site)

### Funcionalidades Completas
- ✅ E-commerce completo com carrinho
- ✅ Interface mobile-first responsiva
- ✅ Sistema de produtos e categorias
- ✅ Checkout multi-etapas
- ✅ Portal de afiliados
- ✅ Área do cliente
- ✅ Blog e FAQ estruturados
- ✅ API routes preparadas para backend

### Arquitetura
- ✅ Estrutura escalável e organizizada
- ✅ Componentes reutilizáveis
- ✅ Tipagem TypeScript completa
- ✅ Estado gerenciado com Context API
- ✅ Design system consistente

---

**Desenvolvido com ❤️ para alta performance e conversão**
