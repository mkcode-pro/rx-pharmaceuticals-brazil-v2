import { NextRequest, NextResponse } from 'next/server';
import { orderService } from '@/services/firebase-services';
import { Order } from '@/types';

// GET /api/orders - List user orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userEmail = searchParams.get('userEmail');

    // Get all orders
    let orders = await orderService.getAll() as Order[];

    // Filter by user if specified
    if (userId) {
      orders = orders.filter(order => order.userId === userId);
    } else if (userEmail) {
      orders = orders.filter(order => order.userEmail === userEmail);
    }

    // Sort by creation date (newest first)
    orders.sort((a, b) => {
      const dateA = a.createdAt?.seconds || 0;
      const dateB = b.createdAt?.seconds || 0;
      return dateB - dateA;
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pedidos' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Create order in Firebase
    const orderId = await orderService.create(body);

    return NextResponse.json(
      { message: 'Pedido criado com sucesso', id: orderId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Erro ao criar pedido' },
      { status: 500 }
    );
  }
}
