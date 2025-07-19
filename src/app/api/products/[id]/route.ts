import { NextRequest, NextResponse } from 'next/server';
import { productService } from '@/services/firebase-services';

// GET /api/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // First try to get by ID
    let product = await productService.getById(id);

    // If not found by ID, try to find by slug
    if (!product) {
      const allProducts = await productService.getAll();
      product = allProducts.find(p => p.slug === id) || null;
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    // Get related products from Firebase
    const allProducts = await productService.getAll();
    const relatedProducts = allProducts
      .filter(p =>
        p.id !== product!.id &&
        (p.category === product!.category ||
         (p.tags && product!.tags && p.tags.some(tag => product!.tags!.includes(tag))))
      )
      .slice(0, 4);

    return NextResponse.json({
      product,
      relatedProducts
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produto' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product (for admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // TODO: Add authentication check for admin
    // TODO: Add validation

    await productService.update(id, body);

    return NextResponse.json(
      { message: 'Produto atualizado com sucesso' }
    );
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar produto' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product (for admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // TODO: Add authentication check for admin

    await productService.delete(id);

    return NextResponse.json(
      { message: 'Produto excluído com sucesso' }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir produto' },
      { status: 500 }
    );
  }
}
