import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/services/firebase-services';

// GET /api/products - List all products with filtering
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const sort = searchParams.get('sort') || 'name';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  try {
    // Get all products from Firebase
    let products = await productService.getAll();

    // Filter by category
    if (category) {
      products = products.filter(
        product => product.category === category
      );
    }

    // Filter by search term
    if (search) {
      const searchTerm = search.toLowerCase();
      products = products.filter(
        product =>
          product.name.toLowerCase().includes(searchTerm) ||
          (product.description && product.description.toLowerCase().includes(searchTerm)) ||
          (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
      );
    }

    // Filter by price range
    if (minPrice) {
      products = products.filter(
        product => product.price >= parseFloat(minPrice)
      );
    }
    if (maxPrice) {
      products = products.filter(
        product => product.price <= parseFloat(maxPrice)
      );
    }

    // Sort products
    products.sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
        default: // name
          return a.name.localeCompare(b.name);
      }
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total: products.length,
        totalPages: Math.ceil(products.length / limit),
        hasNext: endIndex < products.length,
        hasPrev: startIndex > 0
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product (for admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Add authentication check for admin
    // TODO: Add validation

    // Create product in Firebase
    const productId = await productService.create(body);

    return NextResponse.json(
      { message: 'Produto criado com sucesso', id: productId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Erro ao criar produto' },
      { status: 500 }
    );
  }
}
