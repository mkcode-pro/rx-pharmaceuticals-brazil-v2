import { Product } from '@/types';

// Produtos reduzidos - estrutura preparada para conexão com banco de dados
export const products: Product[] = [
  // INJETÁVEIS - 3 produtos representativos
  {
    id: '1',
    name: 'Enantato de Testosterona 300mg 10ml',
    slug: 'enantato-testosterona-300mg',
    description: 'Ganho de Força, Ganho de Massa Magra, Injetáveis, Perda de Gordura',
    price: 195.00,
    originalPrice: 205.00,
    image: '/images/vial.webp',
    category: 'injetaveis',
    tags: ['Ganho de Força', 'Ganho de Massa Magra', 'Perda de Gordura'],
    rating: 5.0,
    reviewCount: 124,
    inStock: true,
    discount: 5,
    type: 'injectable'
  },
  {
    id: '2',
    name: 'Acetato de Trembolona 100mg 10ml',
    slug: 'acetato-trembolona-100mg',
    description: 'Injetáveis para definição e massa magra',
    price: 180.00,
    originalPrice: 200.00,
    image: '/images/vial.webp',
    category: 'injetaveis',
    tags: ['Ganho de Massa Magra', 'Definição'],
    rating: 5.0,
    reviewCount: 89,
    inStock: true,
    discount: 10,
    type: 'injectable'
  },
  {
    id: '3',
    name: 'Durateston (Sustanon) 250mg 10ml',
    slug: 'durateston-sustanon-250mg',
    description: 'Injetáveis para ganho de força e massa',
    price: 195.00,
    originalPrice: 205.00,
    image: '/images/vial.webp',
    category: 'injetaveis',
    tags: ['Ganho de Força', 'Ganho de Massa Magra'],
    rating: 4.85,
    reviewCount: 156,
    inStock: true,
    discount: 5,
    type: 'injectable'
  },

  // ORAIS - 3 produtos representativos
  {
    id: '4',
    name: 'Oxandrolona 20mg (100 caps)',
    slug: 'oxandrolona-20mg',
    description: 'Orais para força e definição muscular',
    price: 280.00,
    originalPrice: undefined,
    image: '/images/oral.webp',
    category: 'orais',
    tags: ['Ganho de Força', 'Perda de Gordura'],
    rating: 4.9,
    reviewCount: 203,
    inStock: true,
    type: 'oral'
  },
  {
    id: '5',
    name: 'Dianabol 20mg (100 caps)',
    slug: 'dianabol-20mg',
    description: 'Orais para ganho rápido de massa muscular',
    price: 150.00,
    originalPrice: undefined,
    image: '/images/oral.webp',
    category: 'orais',
    tags: ['Ganho de Massa Magra', 'Ganho de Força'],
    rating: 4.8,
    reviewCount: 178,
    inStock: true,
    type: 'oral'
  },
  {
    id: '6',
    name: 'Stanozolol 20mg (100 caps)',
    slug: 'stanozolol-20mg',
    description: 'Orais para definição e vascularização',
    price: 160.00,
    originalPrice: undefined,
    image: '/images/oral.webp',
    category: 'orais',
    tags: ['Perda de Gordura', 'Definição'],
    rating: 4.85,
    reviewCount: 145,
    inStock: true,
    type: 'oral'
  },

  // TPC - 2 produtos representativos
  {
    id: '7',
    name: 'Clomifeno 50mg (30 caps)',
    slug: 'clomifeno-50mg',
    description: 'TPC para proteção e recuperação hormonal',
    price: 120.00,
    originalPrice: undefined,
    image: '/images/oral.webp',
    category: 'tpc',
    tags: ['TPC', 'Recuperação Hormonal'],
    rating: 4.9,
    reviewCount: 87,
    inStock: true,
    type: 'oral'
  },
  {
    id: '8',
    name: 'Tamoxifeno 20mg (30 caps)',
    slug: 'tamoxifeno-20mg',
    description: 'TPC para proteção contra efeitos colaterais',
    price: 90.00,
    originalPrice: undefined,
    image: '/images/oral.webp',
    category: 'tpc',
    tags: ['TPC', 'Proteção'],
    rating: 4.8,
    reviewCount: 65,
    inStock: true,
    type: 'oral'
  },

  // PERDA DE GORDURA - 2 produtos representativos
  {
    id: '9',
    name: 'Clembuterol 40mcg (100 caps)',
    slug: 'clembuterol-40mcg',
    description: 'Termogênico potente para perda de gordura',
    price: 140.00,
    originalPrice: undefined,
    image: '/images/oral.webp',
    category: 'perda-de-gordura',
    tags: ['Perda de Gordura', 'Termogênico'],
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    type: 'oral'
  },
  {
    id: '10',
    name: 'T3 25mcg (100 caps)',
    slug: 't3-25mcg',
    description: 'Acelerador metabólico para queima de gordura',
    price: 160.00,
    originalPrice: undefined,
    image: '/images/oral.webp',
    category: 'perda-de-gordura',
    tags: ['Perda de Gordura', 'Metabolismo'],
    rating: 4.8,
    reviewCount: 98,
    inStock: true,
    type: 'oral'
  },

  // COMBOS - 2 produtos representativos
  {
    id: '11',
    name: 'Combo Bronze (6 Produtos)',
    slug: 'combo-bronze',
    description: 'Combo ideal para iniciantes',
    price: 797.00,
    originalPrice: undefined,
    image: '/images/vial.webp',
    category: 'combos',
    tags: ['Combo', 'Iniciante'],
    rating: 4.9,
    reviewCount: 112,
    inStock: true,
    type: 'injectable'
  },
  {
    id: '12',
    name: 'Combo Diamante (16 Produtos + 4 Produtos de Brinde)',
    slug: 'combo-diamante',
    description: 'Para resultados extraordinários',
    price: 2187.00,
    originalPrice: undefined,
    image: '/images/vial.webp',
    category: 'combos',
    tags: ['Combo', 'Premium'],
    rating: 5.0,
    reviewCount: 34,
    inStock: true,
    type: 'injectable'
  }
];

// Categorias - estrutura preparada para banco de dados
export const categories = [
  { id: '1', name: 'TPC', slug: 'tpc', count: 2, description: 'Terapia Pós-Ciclo' },
  { id: '2', name: 'Perda de Gordura', slug: 'perda-de-gordura', count: 2, description: 'Produtos para definição e queima de gordura' },
  { id: '3', name: 'Orais', slug: 'orais', count: 3, description: 'Produtos orais para diversos objetivos' },
  { id: '4', name: 'Injetáveis', slug: 'injetaveis', count: 3, description: 'Produtos injetáveis de alta qualidade' },
  { id: '5', name: 'Ganho de Massa Magra', slug: 'ganho-de-massa-magra', count: 5, description: 'Para ganho de massa muscular' },
  { id: '6', name: 'Ganho de Força', slug: 'ganho-de-forca', count: 4, description: 'Para aumento de força e potência' },
  { id: '7', name: 'Combos', slug: 'combos', count: 2, description: 'Combos promocionais com vários produtos' }
];

// Blog posts - estrutura para CMS futuro
export const blogPosts = [
  {
    id: '1',
    title: 'Como escolher o melhor ciclo para seu objetivo',
    slug: 'como-escolher-melhor-ciclo',
    excerpt: 'Descubra qual ciclo é ideal para seus objetivos específicos...',
    content: 'Conteúdo completo do blog post...',
    image: '/images/blog-1.jpg',
    category: 'Dicas',
    publishedAt: '2024-12-01',
    author: 'Equipe Rx Pharmaceuticals'
  },
  {
    id: '2',
    title: 'TPC: A importância da Terapia Pós-Ciclo',
    slug: 'importancia-terapia-pos-ciclo',
    excerpt: 'Entenda por que a TPC é fundamental para sua saúde...',
    content: 'Conteúdo completo do blog post...',
    image: '/images/blog-2.jpg',
    category: 'Educação',
    publishedAt: '2024-11-28',
    author: 'Equipe Rx Pharmaceuticals'
  }
];

// FAQ data - estrutura para CMS futuro
export const faqData = [
  {
    id: '1',
    question: 'Políticas de entrega:',
    answer: `Achamos inadmissível esperar vários dias para receber o rastreio de um pedido feito.

É comum muitos vendedores demorarem dias para enviar os rastreios (quando enviam), tratando isso como se fosse algo normal.

Na Rx Pharmaceuticals o pedido é rastreado desde a postagem.

Você pode ver em tempo real onde a encomenda está sem precisar ficar consultando no site dos correios/transportadora, pois o código de rastreamento chega via whatsapp e, a cada local novo que a encomenda passa, você recebe uma mensagem nova.

Após a confirmação do pagamento, postamos nossos produtos em até 7 dias úteis. Para pedidos em atacado são em até 7 dias úteis.

Não cobramos seguro. Caso ocorra qualquer problema durante o processo de entrega, enviamos novamente o produto até chegar.`,
    category: 'Entrega'
  },
  {
    id: '2',
    question: 'Extravio e Apreensões:',
    answer: `Se sua mercadoria for extraviada ou apreendida, garantimos o reenvio de 100% da sua encomenda sem custo adicional.

Não trabalhamos com trocas e devoluções.

Antes de confirmar sua compra, é importante que leia atentamente a descrição do produto, verifique se é o que deseja antes de finalizar a compra e revise o endereço de entrega.`,
    category: 'Garantias'
  },
  {
    id: '3',
    question: 'Como funciona o pagamento?',
    answer: 'Aceitamos PIX, cartão de crédito e boleto bancário. O pagamento é 100% seguro e criptografado.',
    category: 'Pagamento'
  },
  {
    id: '4',
    question: 'Produtos são originais?',
    answer: 'Sim, todos os nossos produtos são originais e de procedência confiável. Trabalhamos apenas com fornecedores certificados.',
    category: 'Produtos'
  }
];
