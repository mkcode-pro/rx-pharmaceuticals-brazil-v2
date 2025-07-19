import { NextRequest, NextResponse } from 'next/server';
import { categories } from '@/data/products';

// GET /api/categories - List all categories
export async function GET() {
  try {
    return NextResponse.json({
      categories
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create new category (for admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Add authentication check for admin
    // TODO: Add validation
    // TODO: Save to database

    return NextResponse.json(
      { message: 'Categoria criada com sucesso', category: body },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar categoria' },
      { status: 500 }
    );
  }
}
